import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getUserFromRequest, supabaseAdmin } from '../supabase-admin';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const authUser = await getUserFromRequest(req);
  if (!authUser) return res.status(401).json({ error: 'Unauthorized' });

  if (req.method === 'GET') {
    const { data, error } = await supabaseAdmin
      .from('leads')
      .select('*')
      .eq('user_id', authUser.id)
      .order('created_at', { ascending: false });
    if (error) return res.status(500).json({ error: error.message });
    return res.json(data || []);
  }

  if (req.method === 'POST') {
    const { id, name, category, location, website, email, phone, rating, address } = req.body || {};
    const { data, error } = await supabaseAdmin
      .from('leads')
      .insert({ id, user_id: authUser.id, name, category, location, website, email, phone, rating, address, status: 'new' })
      .select()
      .single();
    if (error) {
      if (error.code === '23505') return res.status(400).json({ error: 'Lead already exists' });
      return res.status(500).json({ error: error.message });
    }
    return res.status(201).json(data);
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
