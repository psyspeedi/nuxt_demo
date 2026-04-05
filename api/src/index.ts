import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { initSchema } from './db/schema'
import { seedIfEmpty } from './db/seed'
import authRoutes from './routes/auth'
import productRoutes from './routes/products'
import orderRoutes from './routes/orders'

const app = express()

app.use(cors({ origin: process.env.CORS_ORIGIN ?? 'http://localhost:3000' }))
app.use(express.json())

initSchema()
seedIfEmpty()

app.use('/api/auth', authRoutes)
app.use('/api/products', productRoutes)
app.use('/api/orders', orderRoutes)

app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err)
  res.status(500).json({ message: 'Internal server error' })
})

const PORT = process.env.PORT ?? 3001
app.listen(PORT, () => console.log(`API server running on http://localhost:${PORT}`))
