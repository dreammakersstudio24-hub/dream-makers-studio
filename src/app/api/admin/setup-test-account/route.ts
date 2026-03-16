import { createAdminClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = createAdminClient();
    
    // 1. Identify User (Check if exists)
    const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
    if (listError) throw listError;
    
    const existingUser = users.find(u => u.email === 'louktal@test.com');
    let userId;

    if (existingUser) {
      // 2a. Update Existing User
      userId = existingUser.id;
      const { error: updateError } = await supabase.auth.admin.updateUserById(userId, {
        password: '123456',
        email_confirm: true
      });
      if (updateError) throw updateError;
    } else {
      // 2b. Create New User
      const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
        email: 'louktal@test.com',
        password: '123456',
        email_confirm: true
      });
      if (createError) throw createError;
      userId = newUser.user.id;
    }

    // 3. Set Credits to 50
    const { error: metaError } = await supabase
      .from('users_metadata')
      .upsert({ id: userId, credits: 50 });

    if (metaError) return NextResponse.json({ error: metaError.message }, { status: 500 });

    return NextResponse.json({ message: 'Account created: louktal@test.com / 1234 with 50 credits' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
