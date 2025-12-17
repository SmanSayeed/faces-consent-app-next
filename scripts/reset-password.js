const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
// Use SERVICE ROLE KEY to bypass RLS and act as admin
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Env Vars');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

async function resetPassword() {
    const email = 'a@a.com';
    const newPassword = 'password123'; // Simpler password to test

    console.log(`Attempting to reset password for ${email} via Admin API...`);

    // 1. Find User
    const { data: listData, error: listError } = await supabase.auth.admin.listUsers();
    if (listError) {
        console.error("❌ Failed to list users:", listError.message);
        return;
    }

    const user = listData.users.find(u => u.email === email);
    if (!user) {
        console.error("❌ User not found in Auth list.");
        return;
    }

    console.log(`Found User ID: ${user.id}`);

    // 2. Update Password
    const { data: updateData, error: updateError } = await supabase.auth.admin.updateUserById(
        user.id,
        { password: newPassword }
    );

    if (updateError) {
        console.error("❌ Failed to update password:", updateError.message);
        console.error("   Code:", updateError.status);
    } else {
        console.log("✅ Password updated successfully via Admin API.");
        console.log(`   New Password: ${newPassword}`);
        console.log("   Try logging in with this new password.");
    }
}

resetPassword();
