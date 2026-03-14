import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/utils/supabase/server';
import { createAdminClient } from '@/utils/supabase/server';

export async function GET() {
  // Security check: Only allow this endpoint in development mode
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: "Endpoint not available in production" }, { status: 403 });
  }

  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "NOT_LOGGED_IN" }, { status: 401 });
    }

    const supabaseAdmin = createAdminClient();
    
    // Fetch current credits
    const { data: metadata, error: fetchError } = await supabaseAdmin
      .from('users_metadata')
      .select('credits')
      .eq('id', user.id)
      .single();

    const currentCredits = metadata?.credits || 0;
    const newCredits = currentCredits + 100;

    // Update credits using admin client (to bypass RLS if any)
    const { error: updateError } = await supabaseAdmin
      .from('users_metadata')
      .upsert({ id: user.id, credits: newCredits });

    if (updateError) {
      console.error("Failed to add test credits:", updateError);
      return NextResponse.json({ error: "DATABASE_ERROR" }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      message: `Added 100 test credits.`,
      previousCredits: currentCredits,
      newCredits: newCredits
    });
  } catch (error) {
    console.error("Test credits error:", error);
    return NextResponse.json({ error: "SERVER_ERROR" }, { status: 500 });
  }
}
