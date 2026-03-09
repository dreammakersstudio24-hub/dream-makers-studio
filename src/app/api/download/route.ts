import { NextResponse } from "next/server";
// import { createClient } from "@supabase/supabase-js";
// import Stripe from "stripe";

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2026-02-25.clover" });
// const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get("session_id");

  if (!sessionId) {
    return NextResponse.json({ error: "Missing session ID" }, { status: 400 });
  }

  try {
    // 1. Verify the session with Stripe
    // const session = await stripe.checkout.sessions.retrieve(sessionId);
    // if (session.payment_status !== 'paid') throw new Error("Payment not verified");

    // 2. Generate signed URL from Supabase
    // const { data, error } = await supabase.storage
    //   .from('secure-ebooks')
    //   .createSignedUrl('the-ultimate-design-guide.pdf', 3600); // 1 hour expiry

    // if (error) throw error;
    
    // For now, return a placeholder URL until Supabase is connected
    const mockSignedUrl = "#mock-download-link"; 
    
    return NextResponse.json({ url: mockSignedUrl });
  } catch (err) {
    console.error("Download generation error", err);
    return NextResponse.json({ error: "Failed to generate download link" }, { status: 500 });
  }
}
