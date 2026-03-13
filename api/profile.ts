import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(process.env.VITE_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const token = req.headers['authorization']?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
  if (authError || !user) return res.status(401).json({ error: 'Unauthorized' });

  if (req.method === 'GET') {
    const { data } = await supabaseAdmin.from('user_profile').select('full_name, email, business_name, business_description, business_website').eq('user_id', user.id).single();
    return res.json(data || null);
  }

  if (req.method === 'POST') {
    const { full_name, email, business_name, business_description, business_website } = req.body || {};
    const { error } = await supabaseAdmin.from('user_profile').upsert(
      { user_id: user.id, full_name, email, business_name, business_description, business_website, updated_at: new Date().toISOString() },
      { onConflict: 'user_id' }
    );
    if (error) return res.status(500).json({ error: error.message });
    return res.json({ success: true });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
