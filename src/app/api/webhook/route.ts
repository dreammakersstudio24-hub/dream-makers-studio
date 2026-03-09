import { NextResponse } from "next/server";
import { createAdminClient } from "@/utils/supabase/server";
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
    
    try {
      const supabaseAdmin = createAdminClient();
      
      const { error } = await supabaseAdmin
        .from('customers')
        .insert({
          stripe_customer_id: session.customer as string || session.id,
          email: session.customer_details?.email || "Unknown",
          purchased_item: "the-ultimate-design-guide",
        });

      if (error) {
        console.error("Failed to insert customer record:", error);
      } else {
        console.log(` Payment successful and customer recorded for session: ${session.id}`);
      }
    } catch (dbError) {
      console.error("Database connection error in webhook:", dbError);
    }

    console.log(`[SYSTEM] Payment processing completed for: ${session.customer_details?.email}`);
  }

  return NextResponse.json({ received: true });
}
