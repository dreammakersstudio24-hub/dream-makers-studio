import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createServerSupabaseClient } from '@/utils/supabase/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-02-25.clover',
});

export async function POST(request: Request) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    // 1. Ensure user is logged in (Authentication required for contractors)
    if (!user) {
      return NextResponse.json({ error: 'You must be logged in to subscribe.' }, { status: 401 });
    }

    const { origin } = new URL(request.url);

    // 2. Create Stripe Checkout Session for Subscription
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: process.env.STRIPE_CONTRACTOR_PRICE_ID, // Ensure this is set in .env
          quantity: 1,
        },
      ],
      mode: 'subscription', // Note this is 'subscription' not 'payment'
      success_url: `${origin}/contractors/register?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/contractors/join`,
      customer_email: user.email, // Auto-fill their email
      metadata: {
        userId: user.id, // Store user UUID to tie it back in webhook
        type: 'contractor_subscription',
      },
    });

    if (!session.url) {
      throw new Error('Failed to create Stripe session URL');
    }

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
