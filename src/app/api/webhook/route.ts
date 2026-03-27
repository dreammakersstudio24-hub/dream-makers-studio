import { NextResponse } from "next/server";
import { createAdminClient } from "@/utils/supabase/server";
import Stripe from "stripe";
import { Resend } from "resend";

export async function POST(req: Request) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2026-02-25.clover", // Matching type definition
  });
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;
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
      const supabaseAdmin = createAdminClient();
      
      // 1. Check if this is an AI Credits purchase
      if (session.metadata?.productType === 'ai_credits') {
        try {
           const userId = session.client_reference_id;
           if (!userId) {
              console.error("No client_reference_id found for AI Credits purchase:", session.id);
              break;
           }

           // Fetch current credits
           const { data: userMeta } = await supabaseAdmin
             .from('users_metadata')
             .select('credits')
             .eq('id', userId)
             .single();
           
           const currentCredits = userMeta?.credits || 0;
           const newCredits = currentCredits + Number(session.metadata.amount || 50);

           // Update or Insert credits
           const { error } = await supabaseAdmin
             .from('users_metadata')
             .upsert({ id: userId, credits: newCredits });

           if (error) console.error("Failed to add AI credits:", error);
           else console.log(`Successfully added ${session.metadata.amount} AI credits to user ${userId}`);
           
        } catch (dbError) {
           console.error("Database connection error in webhook for AI credits:", dbError);
        }
        break;
      }

      // Check if this is an e-book purchase or a contractor subscription
      if (session.metadata?.type !== 'contractor_subscription') {
        const customerEmail = session.customer_details?.email || "Unknown";
        const origin = process.env.NEXT_PUBLIC_SITE_URL || "https://dreammakersstudio.xyz";
        const downloadUrl = `${origin}/api/download?session_id=${session.id}`;

        try {
          // 1. Save customer record
          const { error } = await supabaseAdmin
            .from('customers')
            .insert({
              stripe_customer_id: session.customer as string || session.id,
              email: customerEmail,
              purchased_item: "the-ultimate-design-guide.pdf",
            });

          if (error) console.error("Failed to insert customer record:", error);
          else console.log(`E-Book Payment successful for session: ${session.id}`);
        } catch (dbError) {
          console.error("Database connection error in webhook:", dbError);
        }

        // 2. Send download email via Resend
        if (process.env.RESEND_API_KEY && customerEmail !== "Unknown") {
          try {
            const resend = new Resend(process.env.RESEND_API_KEY);
            await resend.emails.send({
              from: "Dream Makers Studio <noreply@dreammakersstudio.xyz>",
              to: customerEmail,
              subject: "Your E-Book Download is Ready 🌿",
              html: `
                <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 520px; margin: 0 auto; background: #fafaf9; padding: 40px 24px;">
                  
                  <!-- Header -->
                  <div style="text-align: center; margin-bottom: 32px;">
                    <p style="font-size: 11px; font-weight: 800; letter-spacing: 0.25em; text-transform: uppercase; color: #737373; margin: 0 0 12px 0;">Dream Makers Studio</p>
                    <h1 style="font-size: 28px; font-weight: 900; color: #171717; margin: 0; line-height: 1.2;">Your E-Book is Ready! 🌿</h1>
                  </div>

                  <!-- Card -->
                  <div style="background: #ffffff; border: 1px solid #e5e5e5; border-radius: 20px; padding: 32px; margin-bottom: 24px;">
                    <p style="color: #525252; font-size: 15px; line-height: 1.6; margin: 0 0 16px 0;">
                      Thank you for your purchase! Your copy of <strong style="color: #171717;">50 Cinematic AI Prompts for Stunning Backyard & Garden Designs</strong> is ready to download.
                    </p>
                    <p style="color: #525252; font-size: 14px; line-height: 1.6; margin: 0 0 28px 0;">
                      Click the button below to download your e-book. The link is unique to your purchase.
                    </p>

                    <!-- Download Button -->
                    <div style="text-align: center;">
                      <a href="${downloadUrl}" 
                         style="display: inline-block; background: #171717; color: #ffffff; text-decoration: none; font-size: 15px; font-weight: 700; padding: 16px 40px; border-radius: 14px; letter-spacing: -0.01em;">
                        ⬇ Download Your E-Book
                      </a>
                    </div>
                  </div>

                  <!-- Note -->
                  <div style="background: #f5f5f4; border-radius: 14px; padding: 16px 20px; margin-bottom: 24px;">
                    <p style="color: #737373; font-size: 12px; margin: 0; line-height: 1.6;">
                      💡 <strong style="color: #525252;">Tip:</strong> Save this email so you can re-download anytime. The link is tied to your Stripe payment and remains valid.
                    </p>
                  </div>

                  <!-- Footer -->
                  <p style="text-align: center; color: #a3a3a3; font-size: 11px; margin: 0;">
                    © 2026 Dream Makers Studio · <a href="https://dreammakersstudio.xyz" style="color: #737373; text-decoration: none;">dreammakersstudio.xyz</a>
                  </p>

                </div>
              `,
            });
            console.log(`Download email sent to: ${customerEmail}`);
          } catch (emailError) {
            console.error("Failed to send download email:", emailError);
            // Non-fatal: payment was still successful
          }
        } else {
          console.warn("Resend not configured or email unknown — skipping email send.");
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
        let userId = subscription.metadata?.userId;
        let subType = subscription.metadata?.type;
        
        if (!userId && subscription.customer) {
           const customer = await stripe.customers.retrieve(subscription.customer as string) as Stripe.Customer;
           userId = customer.metadata?.userId;
           // Fallback to customer metadata if subscription metadata doesn't have it
           if (!subType) subType = customer.metadata?.type;
        }

        if (userId) {
          const status = subscription.status; // 'active', 'past_due', 'canceled', etc.
          const isActive = status === 'active' || status === 'trialing';
          const supabaseAdmin = createAdminClient();
          
          if (subType === 'property_listing') {
             // Handle Property Subscription
             const { error } = await supabaseAdmin
              .from('properties')
              .update({
                stripe_subscription_id: subscription.id,
                stripe_customer_id: subscription.customer as string,
                subscription_status: status,
                is_active: isActive
              })
              .eq('user_id', userId)
              // We assume updating the most recent or all records if multiple. 
              // Better logic would link subscription.id precisely.
             
             if (error) console.error(`Failed to update property subscription:`, error);
             else console.log(`Property ${userId} subscription updated to: ${status}`);
             
          } else {
             // Default to Contractor Subscription (existing logic)
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
        let subType = subscription.metadata?.type;
        
        if (!userId && subscription.customer) {
           const customer = await stripe.customers.retrieve(subscription.customer as string) as Stripe.Customer;
           userId = customer.metadata?.userId;
           if (!subType) subType = customer.metadata?.type;
        }

        if (userId) {
          const supabaseAdmin = createAdminClient();
          
          if (subType === 'property_listing') {
             await supabaseAdmin
              .from('properties')
              .update({
                subscription_status: 'canceled',
                is_active: false
              })
              .eq('user_id', userId);
             console.log(`Property ${userId} subscription canceled.`);
          } else {
             await supabaseAdmin
              .from('contractors')
              .update({
                subscription_status: 'canceled',
                is_active: false
              })
              .eq('user_id', userId);
             console.log(`Contractor ${userId} subscription canceled.`);
          }
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
