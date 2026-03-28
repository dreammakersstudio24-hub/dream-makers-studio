import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createServerSupabaseClient } from '@/utils/supabase/server';

// Valid pricing tiers
const TIERS: Record<string, { unitAmount: number; credits: number; name: string; description: string }> = {
  starter: {
    unitAmount: 1000, // $10.00
    credits: 15,
    name: "AI Studio Starter (15 Credits)",
    description: "Unlock 15 AI room & garden transformations.",
  },
  value: {
    unitAmount: 2000, // $20.00
    credits: 40,
    name: "AI Studio Value Pack (40 Credits)",
    description: "Best value — unlock 40 high-quality transformations.",
  },
};

export async function POST(req: Request) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Determine tier from request body
    let tier = TIERS.value; // Default to value pack
    try {
      const body = await req.json();
      if (body?.price === 10) tier = TIERS.starter;
      else if (body?.price === 20) tier = TIERS.value;
    } catch {
      // No body or invalid JSON — use default
    }

    const origin = req.headers.get("origin") || "https://dreammakersstudio.xyz";

    if (!process.env.STRIPE_SECRET_KEY) {
      console.warn("⚠️ STRIPE_SECRET_KEY is missing. Mocking success.");
      return NextResponse.json({ url: `${origin}/success?session_id=mock_local_session` });
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2026-02-25.clover",
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      client_reference_id: user.id,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: tier.name,
              description: tier.description,
            },
            unit_amount: tier.unitAmount,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${origin}/app/dashboard?payment=success`,
      cancel_url: `${origin}/app/dashboard?payment=cancelled`,
      metadata: {
        productType: 'ai_credits',
        amount: tier.credits,
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
