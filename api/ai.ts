import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import { searchBusinesses, auditWebsite, generateOutreach, generateActionPlan } from '../src/services/geminiService';

const supabaseAdmin = createClient(process.env.VITE_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const token = req.headers['authorization']?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);
  if (error || !user) return res.status(401).json({ error: 'Unauthorized' });

  const { type, ...body } = req.body;

  try {
    if (type === 'search') {
      const { category, location } = body;
      if (!category || !location) return res.status(400).json({ error: 'category and location are required' });
      const businesses = await searchBusinesses(category, location);
      return res.json(businesses);
    }

    if (type === 'audit') {
      const { business } = body;
      if (!business) return res.status(400).json({ error: 'business is required' });
      const report = await auditWebsite(business);
      return res.json({ report });
    }

    if (type === 'outreach') {
      const { business, auditReport, userProfile } = body;
      if (!business || !auditReport) return res.status(400).json({ error: 'business and auditReport are required' });
      const outreach = await generateOutreach(business, auditReport, userProfile);
      return res.json({ outreach });
    }

    if (type === 'action-plan') {
      const { business, auditReport, userProfile } = body;
      if (!business || !auditReport) return res.status(400).json({ error: 'business and auditReport are required' });
      const plan = await generateActionPlan(business, auditReport, userProfile);
      return res.json({ plan });
    }

    return res.status(400).json({ error: 'Invalid type. Must be: search, audit, outreach, action-plan' });
  } catch (err: any) {
    console.error(`ai [${type}] error:`, err);
    return res.status(500).json({ error: err.message || 'AI request failed' });
  }
}
