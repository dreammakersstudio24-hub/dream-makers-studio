import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req: Request) {
  try {
    const origin = req.headers.get("origin") || "http://localhost:3000";

    // Fallback for local testing if Stripe isn't configured
    if (!process.env.STRIPE_SECRET_KEY) {
      console.warn("⚠️ STRIPE_SECRET_KEY is missing. Mocking successful checkout for local testing.");
      return NextResponse.json({ url: `${origin}/success?session_id=mock_local_session` });
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2026-02-25.clover", // Note: using a stable known version string
    });
    
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "The Ultimate Design Guide (E-Book)",
              description: "50+ Pages of actionable advice, vendor lists, and design checklists.",
            },
            unit_amount: 1299, // $12.99
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/ebook`,
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
