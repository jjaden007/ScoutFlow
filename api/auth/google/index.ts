import type { VercelRequest, VercelResponse } from '@vercel/node';
import { google } from 'googleapis';
import { getUserFromRequest, supabaseAdmin } from '../../_supabase';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const segments = (req.url || '').split('?')[0].split('/').filter(Boolean);
  const route = segments[segments.length - 1];

  if (route === 'url' && req.method === 'GET') {
    const authUser = await getUserFromRequest(req);
    if (!authUser) return res.status(401).json({ error: 'Unauthorized' });
    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET)
      return res.status(400).json({ error: 'Google OAuth is not configured' });
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      `${process.env.VITE_APP_URL || 'https://www.scoutflow.xyz'}/api/auth/google/callback`
    );
    const url = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: ['https://www.googleapis.com/auth/userinfo.email', 'https://www.googleapis.com/auth/gmail.send'],
      prompt: 'consent',
      state: `connect:${authUser.id}`,
    });
    return res.json({ url });
  }

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

  if (route === 'callback' && req.method === 'GET') {
    const { code, state } = req.query as { code: string; state: string };
    const APP_URL = process.env.VITE_APP_URL || 'https://www.scoutflow.xyz';
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      `${APP_URL}/api/auth/google/callback`
    );
    try {
      const { tokens } = await oauth2Client.getToken(code);
      oauth2Client.setCredentials(tokens);
      const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
      const { data: googleUser } = await oauth2.userinfo.get();
      if (state?.startsWith('connect:')) {
        const userId = state.replace('connect:', '');
        await supabaseAdmin.from('users').update({
          google_access_token: tokens.access_token,
          google_refresh_token: tokens.refresh_token,
          google_token_expiry: tokens.expiry_date,
          google_email: googleUser.email,
        }).eq('id', userId);
        return res.send(`<html><body><script>window.opener?.postMessage({ type: 'GOOGLE_AUTH_SUCCESS' }, '*');window.close();</script><p>Connected! You can close this window.</p></body></html>`);
      }
      return res.redirect(`${APP_URL}/`);
    } catch (err: any) {
      console.error('Google callback error:', err);
      return res.status(500).send('Authentication failed');
    }
  }

  return res.status(404).json({ error: 'Route not found' });
}
