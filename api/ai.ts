import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(process.env.VITE_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent`;

async function gemini(prompt: string, opts: { json?: boolean; schema?: object } = {}): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('GEMINI_API_KEY is not set');

  const body: any = {
    contents: [{ parts: [{ text: prompt }] }],
  };

  if (opts.json && opts.schema) {
    body.generationConfig = { responseMimeType: 'application/json', responseSchema: opts.schema };
  } else {
    body.tools = [{ googleSearch: {} }];
  }

  const res = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const data = await res.json() as any;
  if (!res.ok) throw new Error(data.error?.message || `Gemini error ${res.status}`);
  return data.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const token = req.headers['authorization']?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);
  if (error || !user) return res.status(401).json({ error: 'Unauthorized' });

  const { type, ...body } = req.body;

  try {
    if (type === 'search') {
      const { category, location } = body as any;
      if (!category || !location) return res.status(400).json({ error: 'category and location required' });

      const prompt = `Find 10 real local businesses in the category "${category}" located in "${location}". Return a JSON array where each object has: name (string), website (string or null), email (string or null), phone (string or null), rating (number or null), address (string or null). Only return the JSON array, no other text.`;

      const text = await gemini(prompt, {
        json: true,
        schema: {
          type: 'ARRAY',
          items: {
            type: 'OBJECT',
            properties: {
              name: { type: 'STRING' },
              website: { type: 'STRING' },
              email: { type: 'STRING' },
              phone: { type: 'STRING' },
              rating: { type: 'NUMBER' },
              address: { type: 'STRING' },
            },
            required: ['name'],
          },
        },
      });

      let businesses = [];
      try { businesses = JSON.parse(text); } catch { businesses = []; }
      const result = businesses.map((b: any, i: number) => ({
        ...b,
        id: `${String(b.name).replace(/\s+/g, '-').toLowerCase()}-${i}`,
        category,
        location,
      }));
      return res.json(result);
    }

    if (type === 'audit') {
      const { business } = body as any;
      if (!business) return res.status(400).json({ error: 'business required' });
      const prompt = business.website
        ? `Perform a digital audit for "${business.name}" (${business.website}). Analyze mobile responsiveness, speed, SEO, and online presence. Return a concise Markdown report with bullet points.`
        : `"${business.name}" has NO website. Explain why this hurts a ${business.category} in ${business.location} and what they're missing. Return a concise Markdown report.`;
      const report = await gemini(prompt);
      return res.json({ report });
    }

    if (type === 'outreach') {
      const { business, auditReport, userProfile } = body as any;
      if (!business || !auditReport) return res.status(400).json({ error: 'business and auditReport required' });
      const userCtx = userProfile
        ? `I am ${userProfile.full_name} from "${userProfile.business_name}" (${userProfile.business_website}). We do: ${userProfile.business_description}.`
        : 'The goal is to offer digital improvement services.';
      const prompt = `Based on this audit for "${business.name}":\n\n${auditReport}\n\n${userCtx}\n\nWrite a short, friendly cold outreach email. No placeholders. Just the message body.`;
      const outreach = await gemini(prompt);
      return res.json({ outreach });
    }

    if (type === 'action-plan') {
      const { business, auditReport, userProfile } = body as any;
      if (!business || !auditReport) return res.status(400).json({ error: 'business and auditReport required' });
      const prompt = `Based on this audit for "${business.name}":\n\n${auditReport}\n\nCreate a Strategic Action Plan for ${userProfile?.business_name || 'a digital agency'} to present to this client. Include: 1) Immediate Fixes, 2) Medium-term Growth, 3) Long-term Transformation. Use clean Markdown with headings and bullets.`;
      const plan = await gemini(prompt);
      return res.json({ plan });
    }

    return res.status(400).json({ error: 'Invalid type. Must be: search, audit, outreach, action-plan' });
  } catch (err: any) {
    console.error(`ai [${type}] error:`, err);
    return res.status(500).json({ error: err.message || 'AI request failed' });
  }
}
