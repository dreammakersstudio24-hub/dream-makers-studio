import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createServerSupabaseClient } from '@/utils/supabase/server';

export async function POST(req: Request) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const origin = req.headers.get("origin") || "https://dreammakersstudio.xyz";

    if (!process.env.STRIPE_SECRET_KEY) {
      console.warn("⚠️ STRIPE_SECRET_KEY is missing. Mocking success.");
      return NextResponse.json({ url: `${origin}/success?session_id=mock_local_session` });
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2026-02-25.clover",
    });
    
    // AI Designer Membership / Credit Pack ($9.99 for 50 Generations)
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      client_reference_id: user.id, // Keep track of the user filling the credits
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "AI Designer Pro Access (50 Credits)",
              description: "Instantly unlock 50 high-quality room transformations.",
            },
            unit_amount: 999, // $9.99
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${origin}/ai-redesign?payment=success`,
      cancel_url: `${origin}/ai-redesign`,
      metadata: {
        productType: 'ai_credits',
        amount: 50
      }
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error("Stripe error:", error);
    return NextResponse.json(
      { error: "Error creating checkout session" },
      { status: 500 }
    );
  }
}
