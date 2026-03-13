import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(process.env.VITE_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

  const supabase = createClient(process.env.VITE_SUPABASE_URL!, process.env.VITE_SUPABASE_ANON_KEY!);
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return res.status(401).json({ error: 'Invalid credentials' });

  const { data: userRow } = await supabaseAdmin.from('users').select('id, email, is_paid').eq('id', data.user.id).single();
  if (userRow) return res.json({ user: userRow, access_token: data.session.access_token });

  const { data: newRow } = await supabaseAdmin.from('users').insert({ id: data.user.id, email: data.user.email, is_paid: 0 }).select('id, email, is_paid').single();
  return res.json({ user: newRow, access_token: data.session.access_token });
}
