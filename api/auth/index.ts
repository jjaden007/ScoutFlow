import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import { supabaseAdmin, getUserFromRequest, ensureUserRow } from '../_supabase';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const segments = (req.url || '').split('?')[0].split('/').filter(Boolean);
  const route = segments[segments.length - 1];

  if (route === 'me' && req.method === 'GET') {
    const authUser = await getUserFromRequest(req);
    if (!authUser) return res.status(401).json({ error: 'Unauthorized' });
    const user = await ensureUserRow(authUser.id, authUser.email!);
    return res.json(user);
  }

  if (route === 'signup' && req.method === 'POST') {
    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
    const { data, error } = await supabaseAdmin.auth.admin.createUser({ email, password, email_confirm: true });
    if (error) {
      if (error.message?.toLowerCase().includes('already')) return res.status(400).json({ error: 'Email already exists' });
      return res.status(400).json({ error: error.message });
    }
    await supabaseAdmin.from('users').upsert({ id: data.user.id, email: data.user.email, is_paid: 0 }, { onConflict: 'id' });
    return res.json({ user: { id: data.user.id, email: data.user.email, is_paid: 0 } });
  }

  if (route === 'login' && req.method === 'POST') {
    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
    const supabase = createClient(process.env.VITE_SUPABASE_URL!, process.env.VITE_SUPABASE_ANON_KEY!);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return res.status(401).json({ error: 'Invalid credentials' });
    const userRow = await ensureUserRow(data.user.id, data.user.email!);
    return res.json({ user: userRow, access_token: data.session.access_token });
  }

  if (route === 'logout' && req.method === 'POST') {
    return res.json({ success: true });
  }

  return res.status(404).json({ error: 'Route not found' });
}
