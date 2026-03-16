import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import { google } from 'googleapis';

const supabaseAdmin = createClient(process.env.VITE_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

const REDIRECT_URI = `${process.env.VITE_APP_URL || 'https://www.scoutflow.xyz'}/api/google`;

function makeOAuth2Client() {
  return new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    REDIRECT_URI
  );
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // OAuth callback from Google — has ?code=...&state=...
  if (req.query.code && req.query.state) {
    const code = req.query.code as string;
    const state = req.query.state as string;
    const userId = state.startsWith('connect:') ? state.slice(8) : null;
    if (!userId) return res.status(400).send('Invalid state');

    try {
      const oauth2Client = makeOAuth2Client();
      const { tokens } = await oauth2Client.getToken(code);
      oauth2Client.setCredentials(tokens);

      const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
      const { data: googleUser } = await oauth2.userinfo.get();

      await supabaseAdmin.from('users').update({
        google_access_token: tokens.access_token,
        google_refresh_token: tokens.refresh_token,
        google_token_expiry: tokens.expiry_date,
        google_email: googleUser.email,
      }).eq('id', userId);

      return res.redirect(`${process.env.VITE_APP_URL || 'https://www.scoutflow.xyz'}/dashboard/settings?google=connected`);
    } catch (err: any) {
      console.error('Google OAuth callback error:', err);
      return res.redirect(`${process.env.VITE_APP_URL || 'https://www.scoutflow.xyz'}/dashboard/settings?google=error`);
    }
  }

  // All other actions require auth
  const token = req.headers['authorization']?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
  if (authError || !user) return res.status(401).json({ error: 'Unauthorized' });

  const action = req.query.action as string;

  if (action === 'status' && req.method === 'GET') {
    const { data } = await supabaseAdmin.from('users').select('google_email').eq('id', user.id).single();
    return res.json({ connected: !!data?.google_email, email: data?.google_email || null });
  }

  if (action === 'url' && req.method === 'GET') {
    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET)
      return res.status(400).json({ error: 'Google OAuth not configured' });
    const url = makeOAuth2Client().generateAuthUrl({
      access_type: 'offline',
      scope: ['https://www.googleapis.com/auth/userinfo.email', 'https://www.googleapis.com/auth/gmail.send'],
      prompt: 'consent',
      state: `connect:${user.id}`,
    });
    return res.json({ url });
  }

  if (action === 'disconnect' && req.method === 'POST') {
    await supabaseAdmin.from('users').update({
      google_access_token: null,
      google_refresh_token: null,
      google_token_expiry: null,
      google_email: null,
    }).eq('id', user.id);
    return res.json({ success: true });
  }

  return res.status(404).json({ error: 'Unknown action' });
}
