import type { VercelRequest, VercelResponse } from '@vercel/node';
import { db, initDb } from '../_lib/turso.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { id } = req.query;
  
  if (!id || Array.isArray(id)) {
    return res.status(400).json({ error: 'Invalid ID' });
  }

  await initDb();

  if (req.method === 'PUT') {
    try {
      const deal = req.body;
      const keys = Object.keys(deal).filter(key => key !== 'id');
      
      if (keys.length === 0) {
        return res.status(400).json({ message: 'No fields to update' });
      }

      const setClause = keys.map(key => `${key} = :${key}`).join(', ');
      
      const result = await db.execute({
        sql: `UPDATE deals SET ${setClause} WHERE id = :id`,
        args: { ...deal, id: Number(id) }
      });
      
      if (result.rowsAffected > 0) {
        return res.status(200).json({ message: 'Deal updated successfully' });
      } else {
        return res.status(404).json({ error: 'Deal not found' });
      }
    } catch (error) {
      console.error('Error updating deal:', error);
      return res.status(500).json({ error: 'Failed to update deal' });
    }
  }

  if (req.method === 'DELETE') {
    try {
      console.log(`Attempting to delete deal with ID: ${id}`);
      const result = await db.execute({
        sql: 'DELETE FROM deals WHERE id = ?',
        args: [Number(id)]
      });
      console.log(`Delete result:`, result);
      
      if (result.rowsAffected > 0) {
        return res.status(200).json({ message: 'Deal deleted successfully' });
      } else {
        return res.status(404).json({ error: 'Deal not found' });
      }
    } catch (error) {
      console.error('Error deleting deal:', error);
      return res.status(500).json({ error: 'Failed to delete deal' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
