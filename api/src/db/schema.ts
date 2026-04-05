import { db } from './client'

export function initSchema(): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id       TEXT PRIMARY KEY,
      email    TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      name     TEXT NOT NULL,
      company  TEXT NOT NULL,
      role     TEXT NOT NULL CHECK(role IN ('admin', 'manager', 'viewer'))
    );

    CREATE TABLE IF NOT EXISTS products (
      id          TEXT PRIMARY KEY,
      name        TEXT NOT NULL,
      sku         TEXT NOT NULL UNIQUE,
      category    TEXT NOT NULL,
      price       REAL NOT NULL,
      stock       INTEGER NOT NULL DEFAULT 0,
      unit        TEXT NOT NULL CHECK(unit IN ('шт', 'кг', 'л', 'уп')),
      description TEXT
    );

    CREATE TABLE IF NOT EXISTS orders (
      id           TEXT PRIMARY KEY,
      number       TEXT NOT NULL UNIQUE,
      created_at   TEXT NOT NULL,
      updated_at   TEXT NOT NULL,
      status       TEXT NOT NULL CHECK(status IN ('pending','confirmed','processing','shipped','delivered','cancelled')),
      total_amount REAL NOT NULL,
      address      TEXT NOT NULL,
      comment      TEXT,
      user_id      TEXT NOT NULL REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS order_items (
      id             TEXT PRIMARY KEY,
      order_id       TEXT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
      product_id     TEXT NOT NULL,
      product_name   TEXT NOT NULL,
      sku            TEXT NOT NULL,
      quantity       INTEGER NOT NULL,
      price_at_order REAL NOT NULL,
      unit           TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS order_status_history (
      id        TEXT PRIMARY KEY,
      order_id  TEXT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
      status    TEXT NOT NULL,
      timestamp TEXT NOT NULL,
      comment   TEXT
    );
  `)
}
