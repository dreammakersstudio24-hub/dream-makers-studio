import { NextResponse } from "next/server";
import { createAdminClient } from "@/utils/supabase/server";
import Stripe from "stripe";
import fs from 'fs';
import path from 'path';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get("session_id");

  if (!sessionId) {
    return NextResponse.json({ error: "Missing session ID" }, { status: 400 });
  }

  try {
    // Fallback for local testing Mock
    if (sessionId === "mock_local_session") {
        console.warn("⚠️ Using mock local session ID. Proceeding to download.");
    } else {
        // 1. Verify the session with Stripe
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, { apiVersion: "2026-02-25.clover" });
        const session = await stripe.checkout.sessions.retrieve(sessionId);
        if (session.payment_status !== 'paid') throw new Error("Payment not verified");
    }

    // 2. We now serve the file directly from the public directory since the user put it there.
    // Ensure the file exists.
    const filePath = path.join(process.cwd(), 'public', 'Ebook', '50 Cinematic AI Prompts for Stunning Backyard & Garden Designs.pdf');
    if (!fs.existsSync(filePath)) {
      console.error("File not found at:", filePath);
      throw new Error("File not found on server");
    }

    // 3. Read file and send as downloadable stream
    const fileBuffer = fs.readFileSync(filePath);
    
    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="50 Cinematic AI Prompts for Stunning Backyard & Garden Designs.pdf"',
      },
    });

  } catch (err: any) {
    console.error("Download generation error", err);
    return NextResponse.json({ error: err.message || "Failed to generate download link" }, { status: 500 });
  }
}
