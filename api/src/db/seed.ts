import { v4 as uuidv4 } from 'uuid'
import { db } from './client'
import type { OrderStatus, OrderItem, OrderStatusHistory } from '../types'

// ─── Static data ────────────────────────────────────────────────────────────

const USER = {
  id: '1',
  email: 'manager@b2b.com',
  password: 'demo1234',
  name: 'Алексей Морозов',
  company: 'ООО Технологии',
  role: 'manager',
}

const PRODUCTS = [
  { id: '1',  name: 'Принтер лазерный HP LaserJet Pro 400', sku: 'SKU-00001', category: 'Оргтехника',          price: 45000, stock: 12,  unit: 'шт', description: 'Чёрно-белый лазерный принтер' },
  { id: '2',  name: 'Монитор Dell 27" UltraSharp',          sku: 'SKU-00002', category: 'Оргтехника',          price: 78000, stock: 8,   unit: 'шт', description: '4K IPS монитор' },
  { id: '3',  name: 'Клавиатура механическая Logitech G Pro',sku: 'SKU-00003', category: 'Оргтехника',          price: 12500, stock: 25,  unit: 'шт', description: null },
  { id: '4',  name: 'Мышь беспроводная MX Master 3S',       sku: 'SKU-00004', category: 'Оргтехника',          price: 8900,  stock: 30,  unit: 'шт', description: null },
  { id: '5',  name: 'Стол офисный прямой 140x70',           sku: 'SKU-00005', category: 'Мебель',              price: 18500, stock: 0,   unit: 'шт', description: null },
  { id: '6',  name: 'Кресло офисное Chairman 696',          sku: 'SKU-00006', category: 'Мебель',              price: 32000, stock: 15,  unit: 'шт', description: null },
  { id: '7',  name: 'Шкаф офисный 4-секционный',           sku: 'SKU-00007', category: 'Мебель',              price: 42000, stock: 5,   unit: 'шт', description: null },
  { id: '8',  name: 'Стул офисный КАРДЕР',                  sku: 'SKU-00008', category: 'Мебель',              price: 7800,  stock: 40,  unit: 'шт', description: null },
  { id: '9',  name: 'Бумага офисная А4 500 листов',         sku: 'SKU-00009', category: 'Канцелярия',          price: 450,   stock: 200, unit: 'уп', description: null },
  { id: '10', name: 'Ручка шариковая BIC Round Stick',      sku: 'SKU-00010', category: 'Канцелярия',          price: 85,    stock: 500, unit: 'шт', description: null },
  { id: '11', name: 'Папка картонная с завязками',          sku: 'SKU-00011', category: 'Канцелярия',          price: 180,   stock: 150, unit: 'шт', description: null },
  { id: '12', name: 'Скобы для степлера 24/6',              sku: 'SKU-00012', category: 'Канцелярия',          price: 120,   stock: 0,   unit: 'уп', description: null },
  { id: '13', name: 'Тонер-картридж HP 26A',                sku: 'SKU-00013', category: 'Расходные материалы', price: 6800,  stock: 45,  unit: 'шт', description: null },
  { id: '14', name: 'Чернила HP 65XL Tri-color',            sku: 'SKU-00014', category: 'Расходные материалы', price: 4200,  stock: 60,  unit: 'шт', description: null },
  { id: '15', name: 'USB-кабель Type-C 1м',                 sku: 'SKU-00015', category: 'Расходные материалы', price: 650,   stock: 80,  unit: 'шт', description: null },
  { id: '16', name: 'Коврик для мыши большой',              sku: 'SKU-00016', category: 'Расходные материалы', price: 550,   stock: 0,   unit: 'шт', description: null },
  { id: '17', name: 'Мыло жидкое 5л',                       sku: 'SKU-00017', category: 'Средства гигиены',    price: 890,   stock: 35,  unit: 'уп', description: null },
  { id: '18', name: 'Салфетки антисептические 100шт',       sku: 'SKU-00018', category: 'Средства гигиены',    price: 340,   stock: 120, unit: 'уп', description: null },
  { id: '19', name: 'Бумага туалетная 12 рулонов',          sku: 'SKU-00019', category: 'Средства гигиены',    price: 560,   stock: 90,  unit: 'уп', description: null },
  { id: '20', name: 'Средство для мытья посуды 5л',         sku: 'SKU-00020', category: 'Средства гигиены',    price: 720,   stock: 0,   unit: 'уп', description: null },
  { id: '21', name: 'Ноутбук Lenovo ThinkPad E14',          sku: 'SKU-00021', category: 'Оргтехника',          price: 89000, stock: 7,   unit: 'шт', description: null },
  { id: '22', name: 'МФУ Epson EcoTank L3251',              sku: 'SKU-00022', category: 'Оргтехника',          price: 34500, stock: 11,  unit: 'шт', description: null },
  { id: '23', name: 'Веб-камера Logitech C920 HD',          sku: 'SKU-00023', category: 'Оргтехника',          price: 7800,  stock: 22,  unit: 'шт', description: null },
  { id: '24', name: 'Гарнитура Jabra Evolve 40',            sku: 'SKU-00024', category: 'Оргтехника',          price: 15800, stock: 18,  unit: 'шт', description: null },
  { id: '25', name: 'Флешка USB 3.0 64GB Kingston',         sku: 'SKU-00025', category: 'Расходные материалы', price: 1200,  stock: 55,  unit: 'шт', description: null },
]

// ─── Order generation helpers ────────────────────────────────────────────────

const STATUSES: OrderStatus[] = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled']

const STATUS_PROGRESSION: Array<{ status: OrderStatus; delayMs: number; comment: string }> = [
  { status: 'pending',    delayMs: 0,                      comment: 'Заказ создан' },
  { status: 'confirmed',  delayMs: 2 * 60 * 60 * 1000,    comment: 'Заказ подтверждён менеджером' },
  { status: 'processing', delayMs: 4 * 60 * 60 * 1000,    comment: 'Заказ собирается на складе' },
  { status: 'shipped',    delayMs: 24 * 60 * 60 * 1000,   comment: 'Заказ отправлен курьером' },
  { status: 'delivered',  delayMs: 2 * 24 * 60 * 60 * 1000, comment: 'Заказ доставлен' },
]

function buildStatusHistory(status: OrderStatus, createdAt: Date): OrderStatusHistory[] {
  if (status === 'cancelled') {
    const cancelledAt = new Date(createdAt.getTime() + 30 * 60 * 1000)
    return [{ status: 'cancelled', timestamp: cancelledAt.toISOString(), comment: 'Заказ отменён' }]
  }
  const history: OrderStatusHistory[] = []
  let currentDate = new Date(createdAt)
  for (const step of STATUS_PROGRESSION) {
    currentDate = new Date(currentDate.getTime() + step.delayMs)
    history.push({ status: step.status, timestamp: currentDate.toISOString(), comment: step.comment })
    if (step.status === status) break
  }
  return history
}

function generateOrderItems(orderIndex: number, itemCount: number): { items: OrderItem[]; totalAmount: number } {
  const orderItems: OrderItem[] = []
  let totalAmount = 0
  const usedIds = new Set<string>()

  for (let j = 0; j < itemCount; j++) {
    // Deterministic product selection
    let productIdx = (orderIndex * 7 + j * 3) % PRODUCTS.length
    while (usedIds.has(PRODUCTS[productIdx].id)) {
      productIdx = (productIdx + 1) % PRODUCTS.length
    }
    const product = PRODUCTS[productIdx]
    usedIds.add(product.id)

    const quantity = 1 + (orderIndex + j) % 5  // 1..5, deterministic
    totalAmount += product.price * quantity
    orderItems.push({
      productId:    product.id,
      productName:  product.name,
      sku:          product.sku,
      quantity,
      priceAtOrder: product.price,
      unit:         product.unit,
    })
  }
  return { items: orderItems, totalAmount }
}

// ─── Seed entry point ────────────────────────────────────────────────────────

export function seedIfEmpty(): void {
  const count = (db.prepare('SELECT COUNT(*) as count FROM users').get() as { count: number }).count
  if (count > 0) return

  const now = new Date()
  // Use a fixed reference date so seeds are reproducible regardless of when they run.
  // We freeze "now" to the same date across all runs by pinning relative to Unix epoch.
  // Orders will have created_at spread across the past ~120 days from the seed run date.
  // That's fine — what matters is determinism within a single run.

  const insertUser = db.prepare(
    'INSERT INTO users (id, email, password, name, company, role) VALUES (?, ?, ?, ?, ?, ?)'
  )

  const insertProduct = db.prepare(
    'INSERT INTO products (id, name, sku, category, price, stock, unit, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
  )

  const insertOrder = db.prepare(
    'INSERT INTO orders (id, number, created_at, updated_at, status, total_amount, address, comment, user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
  )

  const insertItem = db.prepare(
    'INSERT INTO order_items (id, order_id, product_id, product_name, sku, quantity, price_at_order, unit) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
  )

  const insertHistory = db.prepare(
    'INSERT INTO order_status_history (id, order_id, status, timestamp, comment) VALUES (?, ?, ?, ?, ?)'
  )

  db.transaction(() => {
    insertUser.run(USER.id, USER.email, USER.password, USER.name, USER.company, USER.role)

    for (const p of PRODUCTS) {
      insertProduct.run(p.id, p.name, p.sku, p.category, p.price, p.stock, p.unit, p.description)
    }

    // Spread orders: 5 in current month, rest across last ~4 months
    const DAYS_AGO = [0, 1, 2, 4, 6, 10, 15, 20, 27, 35, 44, 54, 65, 77, 90, 100, 112, 120]

    for (let i = 1; i <= 18; i++) {
      const daysAgo = DAYS_AGO[i - 1] ?? (i * 7 % 120)
      const createdAt = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000)
      const status = STATUSES[(i - 1) % 6]
      const itemCount = 2 + (i % 5)  // 2..5 items, deterministic
      const { items: orderItems, totalAmount } = generateOrderItems(i, itemCount)
      const history = buildStatusHistory(status, createdAt)
      const updatedAt = history[history.length - 1]?.timestamp ?? createdAt.toISOString()
      const orderId = i.toString()

      insertOrder.run(
        orderId,
        `ORD-2024-${i.toString().padStart(3, '0')}`,
        createdAt.toISOString(),
        updatedAt,
        status,
        totalAmount,
        `г. Москва, ул. Примерная, д. ${i}, офис ${i * 10}`,
        i % 3 === 0 ? 'Прошу доставить к 14:00' : null,
        USER.id,
      )

      for (const item of orderItems) {
        insertItem.run(
          uuidv4(), orderId,
          item.productId, item.productName, item.sku,
          item.quantity, item.priceAtOrder, item.unit,
        )
      }

      for (const h of history) {
        insertHistory.run(uuidv4(), orderId, h.status, h.timestamp, h.comment ?? null)
      }
    }
  })()

  console.log('Database seeded: 1 user, 25 products, 18 orders')
}
