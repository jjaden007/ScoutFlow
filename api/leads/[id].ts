import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getUserFromRequest, supabaseAdmin } from '../../lib/supabase-admin';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const authUser = await getUserFromRequest(req);
  if (!authUser) return res.status(401).json({ error: 'Unauthorized' });

  const { id } = req.query;
  if (!id || typeof id !== 'string') return res.status(400).json({ error: 'Lead ID required' });

  if (req.method === 'PATCH') {
    const { name, website, email, location, status, audit_report, outreach_message, action_plan } = req.body || {};
    const updates: Record<string, any> = {};
    if (name !== undefined) updates.name = name;
    if (website !== undefined) updates.website = website;
    if (email !== undefined) updates.email = email;
    if (location !== undefined) updates.location = location;
    if (status !== undefined) updates.status = status;
    if (audit_report !== undefined) updates.audit_report = audit_report;
    if (outreach_message !== undefined) updates.outreach_message = outreach_message;
    if (action_plan !== undefined) updates.action_plan = action_plan;

    if (Object.keys(updates).length === 0) return res.status(400).json({ error: 'No updates provided' });

    const { error } = await supabaseAdmin
      .from('leads')
      .update(updates)
      .eq('id', id)
      .eq('user_id', authUser.id);
    if (error) return res.status(500).json({ error: error.message });
    return res.json({ success: true });
  }

  if (req.method === 'DELETE') {
    const { error } = await supabaseAdmin
      .from('leads')
      .delete()
      .eq('id', id)
      .eq('user_id', authUser.id);
    if (error) return res.status(500).json({ error: error.message });
    return res.json({ success: true });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
