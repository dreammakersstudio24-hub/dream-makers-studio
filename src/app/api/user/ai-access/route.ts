import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/utils/supabase/server';

export async function GET() {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ authorized: false, reason: "NOT_LOGGED_IN" });
    }

    // Check users_metadata for credits
    const { data: metadata, error } = await supabase
      .from('users_metadata')
      .select('credits')
      .eq('id', user.id)
      .single();

    // If there is an error (e.g., row doesn't exist), we assume 0 credits
    const credits = metadata?.credits || 0;

    if (credits <= 0) {
      return NextResponse.json({ authorized: false, reason: "NO_CREDITS", credits });
    }

    return NextResponse.json({ authorized: true, credits });
  } catch (error) {
    console.error("AI Access check error:", error);
    return NextResponse.json({ authorized: false, reason: "ERROR" }, { status: 500 });
  }
}
