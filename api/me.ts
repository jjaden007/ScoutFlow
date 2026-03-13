import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(process.env.VITE_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const token = req.headers['authorization']?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);
  if (error || !user) return res.status(401).json({ error: 'Unauthorized' });

  const { data } = await supabaseAdmin.from('users').select('id, email, is_paid').eq('id', user.id).single();
  if (data) return res.json(data);

  const { data: newRow } = await supabaseAdmin.from('users').insert({ id: user.id, email: user.email, is_paid: 0 }).select('id, email, is_paid').single();
  return res.json(newRow);
}
