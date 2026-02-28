import { createClient } from '@libsql/client';
import dotenv from 'dotenv';

dotenv.config();

export const db = createClient({
  url: process.env.TURSO_DATABASE_URL || 'file:deals.db',
  authToken: process.env.TURSO_AUTH_TOKEN,
});

export async function initDb() {
  try {
    await db.execute(`
      CREATE TABLE IF NOT EXISTS deals (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT,
        brand TEXT,
        originalPrice REAL,
        dealPrice REAL,
        discount TEXT,
        rating REAL,
        reviews INTEGER,
        image TEXT,
        expiresIn TEXT,
        category TEXT,
        offerUrl TEXT
      )
    `);
    console.log('Database connected successfully');
  } catch (error) {
    console.error('Database initialization failed:', error);
  }
}
