import type { VercelRequest, VercelResponse } from '@vercel/node';
import { google } from 'googleapis';
import { supabaseAdmin } from '../../_supabase';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

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
      await supabaseAdmin
        .from('users')
        .update({
          google_access_token: tokens.access_token,
          google_refresh_token: tokens.refresh_token,
          google_token_expiry: tokens.expiry_date,
          google_email: googleUser.email,
        })
        .eq('id', userId);

      return res.send(`
        <html><body><script>
          window.opener?.postMessage({ type: 'GOOGLE_AUTH_SUCCESS' }, '*');
          window.close();
        </script><p>Connected! You can close this window.</p></body></html>
      `);
    }

    return res.redirect(`${APP_URL}/`);
  } catch (err: any) {
    console.error('Google callback error:', err);
    return res.status(500).send('Authentication failed');
  }
}
