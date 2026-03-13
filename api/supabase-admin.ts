import { createClient } from '@supabase/supabase-js';
import type { VercelRequest } from '@vercel/node';

export const supabaseAdmin = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function getUserFromRequest(req: VercelRequest) {
  const authHeader = req.headers['authorization'];
  if (!authHeader?.startsWith('Bearer ')) return null;
  const token = authHeader.replace('Bearer ', '');
  const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);
  if (error || !user) return null;
  return user;
}

export async function ensureUserRow(id: string, email: string) {
  const { data } = await supabaseAdmin
    .from('users').select('id, email, is_paid').eq('id', id).single();
  if (data) return data;
  const { data: newRow } = await supabaseAdmin
    .from('users').insert({ id, email, is_paid: 0 }).select('id, email, is_paid').single();
  return newRow;
}
