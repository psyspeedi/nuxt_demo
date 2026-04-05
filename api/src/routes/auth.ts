import { Router, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { db } from '../db/client'
import { requireAuth, AuthRequest } from '../middleware/auth'

const router = Router()

// POST /api/auth/login
router.post('/login', (req: Request, res: Response) => {
  const { email, password } = req.body ?? {}

  if (!email || !password) {
    res.status(400).json({ message: 'Email и пароль обязательны' })
    return
  }

  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email) as
    | { id: string; email: string; password: string; name: string; company: string; role: string }
    | undefined

  if (!user || user.password !== password) {
    res.status(401).json({ message: 'Неверный email или пароль' })
    return
  }

  const token = jwt.sign(
    { userId: user.id },
    process.env.JWT_SECRET!,
    { expiresIn: process.env.JWT_EXPIRES_IN ?? '7d' } as jwt.SignOptions
  )

  res.json({
    token,
    user: { id: user.id, email: user.email, name: user.name, company: user.company, role: user.role },
  })
})

// GET /api/auth/me
router.get('/me', requireAuth, (req: AuthRequest, res: Response) => {
  const user = db
    .prepare('SELECT id, email, name, company, role FROM users WHERE id = ?')
    .get(req.userId) as { id: string; email: string; name: string; company: string; role: string } | undefined

  if (!user) {
    res.status(404).json({ message: 'Пользователь не найден' })
    return
  }

  res.json(user)
})

export default router
