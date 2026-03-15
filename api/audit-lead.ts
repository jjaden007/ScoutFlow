import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import { auditWebsite } from '../src/services/geminiService';

const supabaseAdmin = createClient(process.env.VITE_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const token = req.headers['authorization']?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);
  if (error || !user) return res.status(401).json({ error: 'Unauthorized' });

  const { business } = req.body;
  if (!business) return res.status(400).json({ error: 'business is required' });

  try {
    const report = await auditWebsite(business);
    return res.json({ report });
  } catch (err: any) {
    console.error('audit-lead error:', err);
    return res.status(500).json({ error: err.message || 'Audit failed' });
  }
}
