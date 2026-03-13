import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getUserFromRequest, supabaseAdmin } from '../../_supabase';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const authUser = await getUserFromRequest(req);
  if (!authUser) return res.status(401).json({ error: 'Unauthorized' });

  const { data } = await supabaseAdmin
    .from('users')
    .select('google_email')
    .eq('id', authUser.id)
    .single();

  return res.json({ connected: !!data?.google_email, email: data?.google_email || null });
}
