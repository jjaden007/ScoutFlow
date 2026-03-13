import type { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';
import { supabaseAdmin } from '../_supabase';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2025-02-24.acacia' });

export const config = { api: { bodyParser: false } };

async function getRawBody(req: VercelRequest): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on('data', (c) => chunks.push(Buffer.from(c)));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const sig = req.headers['stripe-signature'] as string;
  const rawBody = await getRawBody(req);

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err: any) {
    console.error('Webhook signature error:', err.message);
    return res.status(400).json({ error: `Webhook error: ${err.message}` });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.userId || session.client_reference_id;
    if (userId) {
      await supabaseAdmin
        .from('users')
        .update({
          is_paid: 1,
          stripe_customer_id: session.customer as string,
          stripe_subscription_id: session.subscription as string,
        })
        .eq('id', userId);
      console.log(`User ${userId} marked as paid`);
    }
  }

  if (event.type === 'customer.subscription.deleted') {
    const sub = event.data.object as Stripe.Subscription;
    await supabaseAdmin
      .from('users')
      .update({ is_paid: 0 })
      .eq('stripe_customer_id', sub.customer as string);
  }

  return res.json({ received: true });
}
