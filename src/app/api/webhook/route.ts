import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-02-25.clover", // Matching type definition
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  const payload = await req.text();
  const sig = req.headers.get("stripe-signature");

  let event: Stripe.Event;

  try {
    if (!sig) throw new Error("No signature");
    event = stripe.webhooks.constructEvent(payload, sig, endpointSecret);
  } catch (err: any) {
    console.error(`Webhook Error: ${err.message}`);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  // Handle the completed checkout session
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    
    // Here we would typically:
    // 1. Mark customer as paid in Supabase DB (using stripe_customer_id)
    // 2. Generate a signed URL for the E-book from Supabase Private Storage
    // 3. Email the customer their signed URL (via Resend/SendGrid)

    console.log(` Payment successful for session: ${session.id}`);
    console.log(`[SYSTEM] Payment processing completed for: ${session.customer_details?.email}`);
  }

  return NextResponse.json({ received: true });
}
