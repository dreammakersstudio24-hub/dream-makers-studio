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

  // Handle different event types
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      
      // Check if this is an e-book purchase or a contractor subscription
      if (session.metadata?.type !== 'contractor_subscription') {
        try {
          const supabaseAdmin = createAdminClient();
          const { error } = await supabaseAdmin
            .from('customers')
            .insert({
              stripe_customer_id: session.customer as string || session.id,
              email: session.customer_details?.email || "Unknown",
              purchased_item: "the-ultimate-design-guide.pdf", // Updated to match exact filename
            });

          if (error) console.error("Failed to insert customer record:", error);
          else console.log(`E-Book Payment successful for session: ${session.id}`);
        } catch (dbError) {
          console.error("Database connection error in webhook:", dbError);
        }
      } else {
        console.log(`Contractor checkout completed for session: ${session.id}`);
      }
      break;
    }

    case "customer.subscription.created":
    case "customer.subscription.updated": {
      const subscription = event.data.object as Stripe.Subscription;
      try {
        // We need the user ID which we stored in customer metadata during checkout
        let userId = subscription.metadata?.userId;
        
        if (!userId && subscription.customer) {
           const customer = await stripe.customers.retrieve(subscription.customer as string) as Stripe.Customer;
           userId = customer.metadata?.userId;
        }

        if (userId) {
          const status = subscription.status; // 'active', 'past_due', 'canceled', etc.
          const isActive = status === 'active' || status === 'trialing';
          
          const supabaseAdmin = createAdminClient();
          const { error } = await supabaseAdmin
            .from('contractors')
            .update({
              stripe_subscription_id: subscription.id,
              stripe_customer_id: subscription.customer as string,
              subscription_status: status,
              is_active: isActive
            })
            .eq('user_id', userId);

          if (error) console.error(`Failed to update contractor subscription:`, error);
          else console.log(`Contractor ${userId} subscription updated to: ${status}`);
        }
      } catch (err) {
        console.error("Error processing subscription update:", err);
      }
      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      try {
        let userId = subscription.metadata?.userId;
        if (!userId && subscription.customer) {
           const customer = await stripe.customers.retrieve(subscription.customer as string) as Stripe.Customer;
           userId = customer.metadata?.userId;
        }

        if (userId) {
          const supabaseAdmin = createAdminClient();
          await supabaseAdmin
            .from('contractors')
            .update({
              subscription_status: 'canceled',
              is_active: false
            })
            .eq('user_id', userId);
            
          console.log(`Contractor ${userId} subscription canceled.`);
        }
      } catch (err) {
        console.error("Error processing subscription deletion:", err);
      }
      break;
    }

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
