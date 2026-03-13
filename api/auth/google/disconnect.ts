import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getUserFromRequest, supabaseAdmin } from '../../_supabase';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const authUser = await getUserFromRequest(req);
  if (!authUser) return res.status(401).json({ error: 'Unauthorized' });

  await supabaseAdmin
    .from('users')
    .update({
      google_access_token: null,
      google_refresh_token: null,
      google_token_expiry: null,
      google_email: null,
    })
    .eq('id', authUser.id);

  return res.json({ success: true });
}
