import { createAdminClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = createAdminClient();
    
    // 1. Create User via Auth Admin (bypasses email confirmation)
    const { data: userData, error: userError } = await supabase.auth.admin.createUser({
      email: 'louktal@test.com',
      password: '1234',
      email_confirm: true
    });

    if (userError) {
      // If user already exists, we might just want to update their credits
      if (userError.message.includes('already registered')) {
        const { data: existingUser } = await supabase.from('users').select('id').eq('email', 'louktal@test.com').single();
        // This won't work easily if we don't have the ID, but auth.admin.listUsers could find it.
      } else {
        return NextResponse.json({ error: userError.message }, { status: 500 });
      }
    }

    const userId = userData.user?.id;
    if (!userId) {
       // Try to find if user already exists
       const { data: list } = await supabase.auth.admin.listUsers();
       const existing = list.users.find(u => u.email === 'louktal@test.com');
       if (existing) {
         await supabase.from('users_metadata').upsert({ id: existing.id, credits: 50 });
         return NextResponse.json({ message: 'Credits updated for existing louktal@test.com' });
       }
       return NextResponse.json({ error: 'User creation failed and user not found' }, { status: 500 });
    }

    // 2. Set Credits to 50
    const { error: metaError } = await supabase
      .from('users_metadata')
      .upsert({ id: userId, credits: 50 });

    if (metaError) return NextResponse.json({ error: metaError.message }, { status: 500 });

    return NextResponse.json({ message: 'Account created: louktal@test.com / 1234 with 50 credits' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
