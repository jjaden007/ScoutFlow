import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import { searchBusinesses } from '../src/services/geminiService';

const supabaseAdmin = createClient(process.env.VITE_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const token = req.headers['authorization']?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);
  if (error || !user) return res.status(401).json({ error: 'Unauthorized' });

  const { category, location } = req.body;
  if (!category || !location) return res.status(400).json({ error: 'category and location are required' });

  try {
    const businesses = await searchBusinesses(category, location);
    return res.json(businesses);
  } catch (err: any) {
    console.error('search-businesses error:', err);
    return res.status(500).json({ error: err.message || 'Search failed' });
  }
}
