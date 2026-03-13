import type { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';
import { getUserFromRequest } from '../../lib/supabase-admin';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2026-02-25.clover' });
const APP_URL = process.env.VITE_APP_URL || 'https://www.scoutflow.xyz';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  if (!process.env.STRIPE_SECRET_KEY) {
    return res.status(400).json({ error: 'Stripe is not configured' });
  }

  const authUser = await getUserFromRequest(req);
  if (!authUser) return res.status(401).json({ error: 'Unauthorized — please log in first' });

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      customer_email: authUser.email,
      client_reference_id: authUser.id,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'ScoutFlow Pro Membership',
              description: 'Full access to AI Prospector, Digital Audits, and Outreach tools.',
            },
            unit_amount: 2000,
            recurring: { interval: 'month' },
          },
          quantity: 1,
        },
      ],
      success_url: `${APP_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${APP_URL}/pricing`,
      metadata: { userId: authUser.id },
    });

    return res.json({ url: session.url });
  } catch (err: any) {
    console.error('Stripe error:', err);
    return res.status(500).json({ error: err.message || 'Failed to create checkout session' });
  }
}
