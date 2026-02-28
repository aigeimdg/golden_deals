import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';
import { createClient } from '@libsql/client';

// Fallback API implementation for when server.ts is not running
const apiPlugin = () => {
  let db: any;
  try {
    // Note: In Vite config context, process.env might not be fully populated yet unless we load it manually,
    // but loadEnv handles it for the config object. Here we rely on the environment variables being present.
    // For local dev, we default to file:deals.db if not set.
    db = createClient({
      url: process.env.TURSO_DATABASE_URL || 'file:deals.db',
      authToken: process.env.TURSO_AUTH_TOKEN,
    });
    
    db.execute(`
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
    `).catch((e: any) => console.error('Vite DB Init Error:', e));
  } catch (e) {
    console.error('Vite DB Client Error:', e);
  }

  return {
    name: 'api-fallback',
    configureServer(server: any) {
      server.middlewares.use('/api', async (req: any, res: any, next: any) => {
        // Helper to send JSON
        const sendJson = (data: any) => {
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(data));
        };

        // Helper to read body
        const readBody = () => new Promise<any>((resolve, reject) => {
          let body = '';
          req.on('data', (chunk: any) => body += chunk);
          req.on('end', () => {
            try {
              resolve(JSON.parse(body));
            } catch (e) {
              reject(e);
            }
          });
        });

        try {
          // Health Check
          if (req.url === '/health') {
            return sendJson({ status: 'ok', source: 'vite-fallback-turso' });
          }

          // Get Deals
          if (req.method === 'GET' && req.url === '/deals') {
            const result = await db.execute('SELECT * FROM deals ORDER BY id DESC');
            return sendJson(result.rows);
          }

          // Import Deals
          if (req.method === 'POST' && req.url === '/import-deals') {
            const deals = await readBody();
            if (!Array.isArray(deals)) throw new Error('Expected array');
            
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
              return sendJson({ message: `Successfully added ${deals.length} deals` });
            } catch (error) {
              await transaction.rollback();
              throw error;
            }
          }

          // Add Deal
          if (req.method === 'POST' && req.url === '/deals') {
            const deal = await readBody();
            const result = await db.execute({
              sql: `
                INSERT INTO deals (title, brand, originalPrice, dealPrice, discount, rating, reviews, image, expiresIn, category, offerUrl)
                VALUES (:title, :brand, :originalPrice, :dealPrice, :discount, :rating, :reviews, :image, :expiresIn, :category, :offerUrl)
              `,
              args: deal
            });
            return sendJson({ id: Number(result.lastInsertRowid), ...deal });
          }

          // Delete Deal (Basic parsing for /deals/123)
          if (req.method === 'DELETE' && req.url.startsWith('/deals/')) {
            const id = req.url.split('/').pop();
            const result = await db.execute({
              sql: 'DELETE FROM deals WHERE id = ?',
              args: [id]
            });
            if (result.rowsAffected > 0) return sendJson({ message: 'Deleted' });
            res.statusCode = 404;
            return sendJson({ error: 'Not found' });
          }
          
          next();
        } catch (error: any) {
          console.error('API Fallback Error:', error);
          res.statusCode = 500;
          sendJson({ error: error.message });
        }
      });
    }
  };
};

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  // Ensure process.env has the loaded env vars for the apiPlugin to use
  process.env = { ...process.env, ...env };
  
  return {
    plugins: [react(), tailwindcss(), apiPlugin()],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâ€”file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
