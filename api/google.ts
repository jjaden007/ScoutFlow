import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import { google } from 'googleapis';

const supabaseAdmin = createClient(process.env.VITE_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const token = req.headers['authorization']?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
  if (authError || !user) return res.status(401).json({ error: 'Unauthorized' });

  const segments = (req.url || '').split('?')[0].split('/').filter(Boolean);
  const route = segments[segments.length - 1];

  if (route === 'status' && req.method === 'GET') {
    const { data } = await supabaseAdmin.from('users').select('google_email').eq('id', user.id).single();
    return res.json({ connected: !!data?.google_email, email: data?.google_email || null });
  }

  if (route === 'url' && req.method === 'GET') {
    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET)
      return res.status(400).json({ error: 'Google OAuth not configured' });
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      `${process.env.VITE_APP_URL || 'https://www.scoutflow.xyz'}/api/auth/google/callback`
    );
    const url = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: ['https://www.googleapis.com/auth/userinfo.email', 'https://www.googleapis.com/auth/gmail.send'],
      prompt: 'consent',
      state: `connect:${user.id}`,
    });
    return res.json({ url });
  }

  if (route === 'disconnect' && req.method === 'POST') {
    await supabaseAdmin.from('users').update({ google_access_token: null, google_refresh_token: null, google_token_expiry: null, google_email: null }).eq('id', user.id);
    return res.json({ success: true });
  }

  return res.status(404).json({ error: 'Route not found' });
}
