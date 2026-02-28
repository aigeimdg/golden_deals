import express from 'express';
import { createServer as createViteServer } from 'vite';
import { createClient } from '@libsql/client';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const app = express();
const PORT = 3000;

// Request Logging Middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Middleware
app.use(express.json({ limit: '50mb' }));

// Handle CORS preflight just in case
app.options('/api/*', (req, res) => res.sendStatus(200));

// Database Setup
const db = createClient({
  url: process.env.TURSO_DATABASE_URL || 'file:deals.db',
  authToken: process.env.TURSO_AUTH_TOKEN,
});

async function initDb() {
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

initDb();

// API Routes

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Bulk add deals (Renamed from /api/deals/bulk)
app.post('/api/import-deals', async (req, res) => {
  try {
    const deals = req.body;
    console.log(`Processing bulk import for ${deals?.length} deals`);
    
    if (!Array.isArray(deals)) {
      console.error('Invalid input: expected array');
      return res.status(400).json({ error: 'Expected an array of deals' });
    }

    // Use transaction for bulk insert
    const transaction = await db.transaction('write');
    try {
      for (const deal of deals) {
        await transaction.execute({
          sql: `
            INSERT INTO deals (title, brand, originalPrice, dealPrice, discount, rating, reviews, image, expiresIn, category, offerUrl)
            VALUES (:title, :brand, :originalPrice, :dealPrice, :discount, :rating, :reviews, :image, :expiresIn, :category, :offerUrl)
          `,
          args: deal
        });
      }
      await transaction.commit();
      console.log(`Successfully inserted ${deals.length} deals`);
      res.json({ message: `Successfully added ${deals.length} deals` });
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  } catch (error: any) {
    console.error('Error bulk adding deals:', error);
    res.status(500).json({ error: 'Failed to bulk add deals', details: error.message });
  }
});

// Get all deals
app.get('/api/deals', async (req, res) => {
  try {
    const result = await db.execute('SELECT * FROM deals ORDER BY id DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching deals:', error);
    res.status(500).json({ error: 'Failed to fetch deals' });
  }
});

// Add a single deal
app.post('/api/deals', async (req, res) => {
  try {
    const deal = req.body;
    const result = await db.execute({
      sql: `
        INSERT INTO deals (title, brand, originalPrice, dealPrice, discount, rating, reviews, image, expiresIn, category, offerUrl)
        VALUES (:title, :brand, :originalPrice, :dealPrice, :discount, :rating, :reviews, :image, :expiresIn, :category, :offerUrl)
      `,
      args: deal
    });
    res.json({ id: Number(result.lastInsertRowid), ...deal });
  } catch (error) {
    console.error('Error adding deal:', error);
    res.status(500).json({ error: 'Failed to add deal' });
  }
});

// Update a deal
app.put('/api/deals/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deal = req.body;
    
    const keys = Object.keys(deal).filter(key => key !== 'id');
    if (keys.length === 0) return res.json({ message: 'No fields to update' });

    const setClause = keys.map(key => `${key} = :${key}`).join(', ');
    
    const result = await db.execute({
      sql: `UPDATE deals SET ${setClause} WHERE id = :id`,
      args: { ...deal, id }
    });
    
    if (result.rowsAffected > 0) {
      res.json({ message: 'Deal updated successfully' });
    } else {
      res.status(404).json({ error: 'Deal not found' });
    }
  } catch (error) {
    console.error('Error updating deal:', error);
    res.status(500).json({ error: 'Failed to update deal' });
  }
});

// Delete a deal
app.delete('/api/deals/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.execute({
      sql: 'DELETE FROM deals WHERE id = ?',
      args: [id]
    });
    
    if (result.rowsAffected > 0) {
      res.json({ message: 'Deal deleted successfully' });
    } else {
      res.status(404).json({ error: 'Deal not found' });
    }
  } catch (error) {
    console.error('Error deleting deal:', error);
    res.status(500).json({ error: 'Failed to delete deal' });
  }
});

// Catch-all for API routes not found
app.use('/api/*', (req, res) => {
  console.log(`API 404: ${req.method} ${req.url}`);
  res.status(404).json({ error: `API route not found: ${req.method} ${req.url}` });
});

// Vite middleware setup
async function startServer() {
  console.log('Server starting...');
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static('dist'));
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
