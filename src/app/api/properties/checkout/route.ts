import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createServerSupabaseClient } from '@/utils/supabase/server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-02-25.clover',
})

export async function POST(req: Request) {
  try {
    const supabase = await createServerSupabaseClient()
    
    // 1. Check if user is logged in
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'You must be logged in to subscribe.' },
        { status: 401 }
      )
    }

    // 2. See if this user already has an active property subscription
    const { data: propertyRecord } = await supabase
      .from('properties')
      .select('stripe_customer_id, subscription_status')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .single()

    if (propertyRecord && propertyRecord.subscription_status === 'active') {
       return NextResponse.json(
        { error: 'You already have an active property listing subscription.' },
        { status: 400 }
      )
    }
    
    // We will let Stripe create a new Customer during Checkout, 
    // or you could look up an existing customer ID here if you prefer.
    const priceId = process.env.STRIPE_PROPERTY_PRICE_ID
    
    if (!priceId) {
      return NextResponse.json(
        { error: 'Subscription Price ID is not configured.' },
        { status: 500 }
      )
    }

    // 3. Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId, 
          quantity: 1,
        },
      ],
      mode: 'subscription', 
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/properties/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/properties/join`,
      customer_email: user.email, 
      client_reference_id: user.id, // Very important: links Stripe session back to our Supabase user
      metadata: {
        userId: user.id,
        type: 'property_listing' // custom identifier for webhook
      }
    })

    return NextResponse.json({ url: session.url })

  } catch (error: any) {
    console.error('Error creating checkout session:', error)
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    )
  }
}
