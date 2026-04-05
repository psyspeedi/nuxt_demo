import { Router, Response } from 'express'
import { v4 as uuidv4 } from 'uuid'
import { db } from '../db/client'
import { requireAuth, AuthRequest } from '../middleware/auth'
import { STATUS_TRANSITIONS, OrderStatus, CartItem, Order, OrderItem, OrderStatusHistory } from '../types'

const router = Router()

// ─── Helpers ─────────────────────────────────────────────────────────────────

interface OrderRow {
  id: string
  number: string
  created_at: string
  updated_at: string
  status: string
  total_amount: number
  address: string
  comment: string | null
  user_id: string
}

interface ItemRow {
  product_id: string
  product_name: string
  sku: string
  quantity: number
  price_at_order: number
  unit: string
}

interface HistoryRow {
  status: string
  timestamp: string
  comment: string | null
}

function assembleOrder(row: OrderRow): Order {
  const items = db.prepare('SELECT * FROM order_items WHERE order_id = ?').all(row.id) as ItemRow[]
  const history = db
    .prepare('SELECT * FROM order_status_history WHERE order_id = ? ORDER BY timestamp ASC')
    .all(row.id) as HistoryRow[]

  return {
    id:          row.id,
    number:      row.number,
    createdAt:   row.created_at,
    updatedAt:   row.updated_at,
    status:      row.status as OrderStatus,
    totalAmount: row.total_amount,
    address:     row.address,
    comment:     row.comment ?? undefined,
    items:       items.map((it): OrderItem => ({
      productId:    it.product_id,
      productName:  it.product_name,
      sku:          it.sku,
      quantity:     it.quantity,
      priceAtOrder: it.price_at_order,
      unit:         it.unit,
    })),
    statusHistory: history.map((h): OrderStatusHistory => ({
      status:    h.status as OrderStatus,
      timestamp: h.timestamp,
      comment:   h.comment ?? undefined,
    })),
  }
}

// ─── GET /api/orders ──────────────────────────────────────────────────────────

router.get('/', requireAuth, (req: AuthRequest, res: Response) => {
  const { status, dateFrom, dateTo } = req.query
  const page   = Math.max(1, parseInt(req.query.page as string) || 1)
  const limit  = Math.max(1, parseInt(req.query.limit as string) || 10)
  const offset = (page - 1) * limit

  const conditions: string[] = ['user_id = ?']
  const params: (string | number)[] = [req.userId!]

  if (status) {
    conditions.push('status = ?')
    params.push(status as string)
  }
  if (dateFrom) {
    conditions.push('created_at >= ?')
    params.push(dateFrom as string)
  }
  if (dateTo) {
    conditions.push('created_at <= ?')
    params.push(`${dateTo as string}T23:59:59.999Z`)
  }

  const where = `WHERE ${conditions.join(' AND ')}`

  const { count } = db.prepare(`SELECT COUNT(*) as count FROM orders ${where}`).get(...params) as { count: number }
  const rows = db
    .prepare(`SELECT * FROM orders ${where} ORDER BY created_at DESC LIMIT ? OFFSET ?`)
    .all(...params, limit, offset) as OrderRow[]

  res.json({
    items:      rows.map(assembleOrder),
    total:      count,
    page,
    totalPages: Math.ceil(count / limit),
  })
})

// ─── POST /api/orders ─────────────────────────────────────────────────────────

router.post('/', requireAuth, (req: AuthRequest, res: Response) => {
  const { items, address, comment } = req.body ?? {}

  if (!Array.isArray(items) || items.length === 0) {
    res.status(400).json({ message: 'Список товаров обязателен' })
    return
  }
  if (!address?.trim()) {
    res.status(400).json({ message: 'Адрес доставки обязателен' })
    return
  }

  // Count existing orders for the number sequence
  const { count } = db.prepare('SELECT COUNT(*) as count FROM orders').get() as { count: number }
  const orderId = uuidv4()
  const number  = `ORD-${new Date().getFullYear()}-${(count + 1).toString().padStart(3, '0')}`
  const now     = new Date().toISOString()

  let totalAmount = 0
  const orderItems: Array<{
    productId: string; productName: string; sku: string
    quantity: number; priceAtOrder: number; unit: string
  }> = []

  for (const cartItem of items as CartItem[]) {
    const product = db
      .prepare('SELECT * FROM products WHERE id = ?')
      .get(cartItem.product.id) as { id: string; name: string; sku: string; price: number; unit: string } | undefined

    if (!product) {
      res.status(400).json({ message: `Продукт ${cartItem.product.id} не найден` })
      return
    }

    const qty = cartItem.quantity
    totalAmount += product.price * qty
    orderItems.push({
      productId:    product.id,
      productName:  product.name,
      sku:          product.sku,
      quantity:     qty,
      priceAtOrder: product.price,
      unit:         product.unit,
    })
  }

  const insertOrder   = db.prepare('INSERT INTO orders (id, number, created_at, updated_at, status, total_amount, address, comment, user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)')
  const insertItem    = db.prepare('INSERT INTO order_items (id, order_id, product_id, product_name, sku, quantity, price_at_order, unit) VALUES (?, ?, ?, ?, ?, ?, ?, ?)')
  const insertHistory = db.prepare('INSERT INTO order_status_history (id, order_id, status, timestamp, comment) VALUES (?, ?, ?, ?, ?)')

  db.transaction(() => {
    insertOrder.run(orderId, number, now, now, 'pending', totalAmount, address.trim(), comment?.trim() || null, req.userId!)
    for (const it of orderItems) {
      insertItem.run(uuidv4(), orderId, it.productId, it.productName, it.sku, it.quantity, it.priceAtOrder, it.unit)
    }
    insertHistory.run(uuidv4(), orderId, 'pending', now, 'Заказ создан')
  })()

  const row = db.prepare('SELECT * FROM orders WHERE id = ?').get(orderId) as OrderRow
  res.status(201).json(assembleOrder(row))
})

// ─── GET /api/orders/:id ──────────────────────────────────────────────────────

router.get('/:id', requireAuth, (req: AuthRequest, res: Response) => {
  const row = db
    .prepare('SELECT * FROM orders WHERE id = ? AND user_id = ?')
    .get(req.params.id, req.userId!) as OrderRow | undefined

  if (!row) {
    res.status(404).json({ message: 'Заказ не найден' })
    return
  }

  res.json(assembleOrder(row))
})

// ─── PATCH /api/orders/:id/status ─────────────────────────────────────────────

router.patch('/:id/status', requireAuth, (req: AuthRequest, res: Response) => {
  const { status, comment } = req.body ?? {}

  if (!status) {
    res.status(400).json({ message: 'Статус обязателен' })
    return
  }

  const row = db
    .prepare('SELECT * FROM orders WHERE id = ? AND user_id = ?')
    .get(req.params.id, req.userId!) as OrderRow | undefined

  if (!row) {
    res.status(404).json({ message: 'Заказ не найден' })
    return
  }

  const allowed = STATUS_TRANSITIONS[row.status as OrderStatus]
  if (!allowed.includes(status as OrderStatus)) {
    res.status(400).json({ message: 'Недопустимый переход статуса' })
    return
  }

  const now = new Date().toISOString()
  db.transaction(() => {
    db.prepare('UPDATE orders SET status = ?, updated_at = ? WHERE id = ?').run(status, now, row.id)
    db.prepare('INSERT INTO order_status_history (id, order_id, status, timestamp, comment) VALUES (?, ?, ?, ?, ?)').run(
      uuidv4(), row.id, status, now, comment?.trim() || null
    )
  })()

  const updated = db.prepare('SELECT * FROM orders WHERE id = ?').get(row.id) as OrderRow
  res.json(assembleOrder(updated))
})

export default router
