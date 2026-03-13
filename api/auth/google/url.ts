import type { VercelRequest, VercelResponse } from '@vercel/node';
import { google } from 'googleapis';
import { getUserFromRequest } from '../../_supabase';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const authUser = await getUserFromRequest(req);
  if (!authUser) return res.status(401).json({ error: 'Unauthorized' });

  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    return res.status(400).json({ error: 'Google OAuth is not configured' });
  }

  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    `${process.env.VITE_APP_URL || 'https://www.scoutflow.xyz'}/api/auth/google/callback`
  );

  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: [
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/gmail.send',
    ],
    prompt: 'consent',
    state: `connect:${authUser.id}`,
  });

  return res.json({ url });
}
