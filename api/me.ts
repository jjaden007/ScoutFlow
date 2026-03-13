import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getUserFromRequest, ensureUserRow } from '../lib/supabase-admin';
export default async function handler(req: VercelRequest, res: VercelResponse) {
  const authUser = await getUserFromRequest(req);
  if (!authUser) return res.status(401).json({ error: 'Unauthorized' });
  const user = await ensureUserRow(authUser.id, authUser.email!);
  return res.json(user);
}
