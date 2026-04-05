import { Router, Response } from 'express'
import { db } from '../db/client'
import { requireAuth, AuthRequest } from '../middleware/auth'

const router = Router()

// GET /api/products/categories  — must be before /:id if that existed
router.get('/categories', requireAuth, (_req: AuthRequest, res: Response) => {
  const rows = db.prepare('SELECT DISTINCT category FROM products ORDER BY category ASC').all() as { category: string }[]
  res.json({ categories: rows.map(r => r.category) })
})

// GET /api/products
router.get('/', requireAuth, (req: AuthRequest, res: Response) => {
  const { search, category, minPrice, maxPrice, inStock } = req.query
  const page  = Math.max(1, parseInt(req.query.page as string) || 1)
  const limit = Math.max(1, parseInt(req.query.limit as string) || 12)
  const offset = (page - 1) * limit

  const conditions: string[] = []
  const params: (string | number)[] = []

  if (search) {
    conditions.push('(LOWER(name) LIKE ? OR LOWER(sku) LIKE ?)')
    const s = `%${(search as string).toLowerCase()}%`
    params.push(s, s)
  }
  if (category) {
    conditions.push('category = ?')
    params.push(category as string)
  }
  if (minPrice) {
    conditions.push('price >= ?')
    params.push(Number(minPrice))
  }
  if (maxPrice) {
    conditions.push('price <= ?')
    params.push(Number(maxPrice))
  }
  if (inStock === 'true') {
    conditions.push('stock > 0')
  }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : ''

  const { count } = db.prepare(`SELECT COUNT(*) as count FROM products ${where}`).get(...params) as { count: number }
  const items = db.prepare(`SELECT * FROM products ${where} ORDER BY name ASC LIMIT ? OFFSET ?`).all(...params, limit, offset)

  res.json({ items, total: count, page, totalPages: Math.ceil(count / limit) })
})

export default router
