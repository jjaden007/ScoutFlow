import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import nodemailer from 'nodemailer';
import { google } from 'googleapis';
import crypto from 'crypto';

const supabaseAdmin = createClient(process.env.VITE_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
const ENCRYPTION_KEY = (process.env.ENCRYPTION_KEY || 'scoutflow-encryption-key-32-char').padEnd(32).substring(0, 32);

function decrypt(text: string) {
  if (!text) return '';
  try {
    const [ivHex, ...rest] = text.split(':');
    const iv = Buffer.from(ivHex, 'hex');
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
    const decrypted = Buffer.concat([decipher.update(Buffer.from(rest.join(':'), 'hex')), decipher.final()]);
    return decrypted.toString();
  } catch { return ''; }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const token = req.headers['authorization']?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
  if (authError || !user) return res.status(401).json({ error: 'Unauthorized' });

  const { to, subject, body } = req.body || {};
  if (!to || !subject || !body) return res.status(400).json({ error: 'to, subject, and body are required' });

  const { data: userData } = await supabaseAdmin.from('users').select('google_access_token, google_refresh_token, google_token_expiry').eq('id', user.id).single();

  if (userData?.google_access_token && userData?.google_refresh_token) {
    try {
      const auth = new google.auth.OAuth2(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET);
      auth.setCredentials({ access_token: userData.google_access_token, refresh_token: userData.google_refresh_token, expiry_date: userData.google_token_expiry });
      const gmail = google.gmail({ version: 'v1', auth });
      const utf8Subject = `=?utf-8?B?${Buffer.from(subject).toString('base64')}?=`;
      const message = [`To: ${to}`, 'Content-Type: text/plain; charset=utf-8', 'MIME-Version: 1.0', `Subject: ${utf8Subject}`, '', body].join('\n');
      const encodedMessage = Buffer.from(message).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
      await gmail.users.messages.send({ userId: 'me', requestBody: { raw: encodedMessage } });
      return res.json({ success: true, provider: 'gmail' });
    } catch (err) {
      console.error('Gmail error:', err);
    }
  }

  const { data: smtp } = await supabaseAdmin.from('user_smtp_settings').select('*').eq('user_id', user.id).single();
  if (smtp) {
    try {
      const transporter = nodemailer.createTransport({ host: smtp.host, port: smtp.port, secure: smtp.secure === 1, auth: { user: smtp.user, pass: decrypt(smtp.pass) } });
      await transporter.sendMail({ from: smtp.from_email || smtp.user, to, subject, text: body });
      return res.json({ success: true, provider: 'smtp' });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }

  return res.status(400).json({ error: 'No email provider configured.' });
}
