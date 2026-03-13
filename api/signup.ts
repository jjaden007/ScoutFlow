import type { VercelRequest, VercelResponse } from '@vercel/node';
import { supabaseAdmin } from './_supabase';
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { email, password } = req.body || {};
  const { data, error } = await supabaseAdmin.auth.admin.createUser({ email, password, email_confirm: true });
  if (error) {
    if (error.message?.toLowerCase().includes('already')) return res.status(400).json({ error: 'Email already exists' });
    return res.status(400).json({ error: error.message });
  }
  await supabaseAdmin.from('users').upsert({ id: data.user.id, email: data.user.email, is_paid: 0 }, { onConflict: 'id' });
  return res.json({ user: { id: data.user.id, email: data.user.email, is_paid: 0 } });
}
