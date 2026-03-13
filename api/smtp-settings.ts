import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

const supabaseAdmin = createClient(process.env.VITE_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
const ENCRYPTION_KEY = (process.env.ENCRYPTION_KEY || 'scoutflow-encryption-key-32-char').padEnd(32).substring(0, 32);

function encrypt(text: string) {
  if (!text) return '';
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
  const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
  return iv.toString('hex') + ':' + encrypted.toString('hex');
}

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
  const token = req.headers['authorization']?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
  if (authError || !user) return res.status(401).json({ error: 'Unauthorized' });

  if (req.method === 'GET') {
    const { data } = await supabaseAdmin.from('user_smtp_settings').select('*').eq('user_id', user.id).single();
    if (!data) return res.json(null);
    return res.json({ ...data, pass: data.pass ? '********' : '' });
  }

  if (req.method === 'POST') {
    const { host, port, user: smtpUser, pass, from_email, secure } = req.body || {};
    let finalPass = encrypt(pass);
    if (pass === '********') {
      const { data: existing } = await supabaseAdmin.from('user_smtp_settings').select('pass').eq('user_id', user.id).single();
      finalPass = existing?.pass || '';
    }
    const { error } = await supabaseAdmin.from('user_smtp_settings').upsert(
      { user_id: user.id, host, port, user: smtpUser, pass: finalPass, from_email, secure: secure ? 1 : 0, updated_at: new Date().toISOString() },
      { onConflict: 'user_id' }
    );
    if (error) return res.status(500).json({ error: error.message });
    return res.json({ success: true });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
