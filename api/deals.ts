import type { VercelRequest, VercelResponse } from '@vercel/node';
import { db, initDb } from './_lib/turso';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  await initDb();

  if (req.method === 'GET') {
    try {
      const result = await db.execute('SELECT * FROM deals ORDER BY id DESC');
      return res.status(200).json(result.rows);
    } catch (error) {
      console.error('Error fetching deals:', error);
      return res.status(500).json({ error: 'Failed to fetch deals' });
    }
  }

  if (req.method === 'POST') {
    try {
      const deal = req.body;
      const result = await db.execute({
        sql: `
          INSERT INTO deals (title, brand, originalPrice, dealPrice, discount, rating, reviews, image, expiresIn, category, offerUrl)
          VALUES (:title, :brand, :originalPrice, :dealPrice, :discount, :rating, :reviews, :image, :expiresIn, :category, :offerUrl)
        `,
        args: deal
      });
      return res.status(200).json({ id: Number(result.lastInsertRowid), ...deal });
    } catch (error) {
      console.error('Error adding deal:', error);
      return res.status(500).json({ error: 'Failed to add deal' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
