import type { VercelRequest, VercelResponse } from '@vercel/node';
import { db, initDb } from './_lib/turso.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await initDb();
    const deals = req.body;
    
    if (!Array.isArray(deals)) {
      return res.status(400).json({ error: 'Expected an array of deals' });
    }

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
      res.status(200).json({ message: `Successfully added ${deals.length} deals` });
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  } catch (error: any) {
    console.error('Error bulk adding deals:', error);
    res.status(500).json({ error: 'Failed to bulk add deals', details: error.message });
  }
}
