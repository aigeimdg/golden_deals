import { createClient } from '@libsql/client';
import dotenv from 'dotenv';

dotenv.config();

const url = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

if (!url && process.env.NODE_ENV === 'production') {
  throw new Error('TURSO_DATABASE_URL is not defined. Please set it in your Vercel Environment Variables.');
}

export const db = createClient({
  url: url || 'file:deals.db',
  authToken: authToken,
});

export async function initDb() {
  try {
    // Only run table creation if we have a connection
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
    // In production, we want to know if this fails
    if (process.env.NODE_ENV === 'production') {
      console.error('Check your TURSO_DATABASE_URL and TURSO_AUTH_TOKEN');
    }
  }
}
