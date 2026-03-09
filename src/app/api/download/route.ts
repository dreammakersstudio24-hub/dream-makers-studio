import { NextResponse } from "next/server";
import { createAdminClient } from "@/utils/supabase/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2026-02-25.clover" });

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get("session_id");

  if (!sessionId) {
    return NextResponse.json({ error: "Missing session ID" }, { status: 400 });
  }

  try {
    // 1. Verify the session with Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (session.payment_status !== 'paid') throw new Error("Payment not verified");

    // 2. Generate signed URL from Supabase
    const supabaseAdmin = createAdminClient();
    const { data, error } = await supabaseAdmin.storage
      .from('secure-ebooks')
      .createSignedUrl('the-ultimate-design-guide.pdf', 3600); // 1 hour expiry

    if (error) throw error;
    if (!data?.signedUrl) throw new Error("Signed URL generation failed");
    
    return NextResponse.json({ url: data.signedUrl });
  } catch (err: any) {
    console.error("Download generation error", err);
    return NextResponse.json({ error: err.message || "Failed to generate download link" }, { status: 500 });
  }
}
