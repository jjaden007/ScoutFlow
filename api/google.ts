import type { VercelRequest, VercelResponse } from '@vercel/node';
import { google } from 'googleapis';
import { getUserFromRequest, supabaseAdmin } from './supabase-admin';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const segments = (req.url || '').split('?')[0].split('/').filter(Boolean);
  const route = segments[segments.length - 1];

  if (route === 'status' && req.method === 'GET') {
    const authUser = await getUserFromRequest(req);
    if (!authUser) return res.status(401).json({ error: 'Unauthorized' });
    const { data } = await supabaseAdmin.from('users').select('google_email').eq('id', authUser.id).single();
    return res.json({ connected: !!data?.google_email, email: data?.google_email || null });
  }

  if (route === 'disconnect' && req.method === 'POST') {
    const authUser = await getUserFromRequest(req);
    if (!authUser) return res.status(401).json({ error: 'Unauthorized' });
    await supabaseAdmin.from('users').update({ google_access_token: null, google_refresh_token: null, google_token_expiry: null, google_email: null }).eq('id', authUser.id);
    return res.json({ success: true });
  }

  return res.status(404).json({ error: 'Route not found' });
}
