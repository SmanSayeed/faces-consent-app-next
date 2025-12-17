const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Env Vars (NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY)');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

async function recreateAdmin() {
    const email = 'a@a.com';
    const password = '11112222';

    console.log(`Re-creating user ${email}...`);

    // 1. Check if exists and Delete
    const { data: listData, error: listError } = await supabase.auth.admin.listUsers();
    if (listError) {
        console.error("❌ Failed to list users:", listError.message);
        return;
    }

    const existing = listData.users.find(u => u.email === email);
    if (existing) {
        console.log(`Found existing user ${existing.id}. Deleting...`);
        const { error: delError } = await supabase.auth.admin.deleteUser(existing.id);
        if (delError) {
            console.error("❌ Failed to delete user:", delError.message);
            return;
        }
        console.log("✅ User deleted.");
    } else {
        console.log("User does not exist, proceeding to create.");
    }

    // 2. Create User via API (Correct Hashing)
    const { data: createData, error: createError } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { first_name: 'Admin', last_name: 'User' }
    });

    if (createError) {
        console.error("❌ Failed to create user:", createError.message);
        return;
    }

    const userId = createData.user.id;
    console.log(`✅ User created! ID: ${userId}`);

    // 3. Ensure Profile is Admin
    // (The User creation might trigger a profile creation if you have triggers, 
    // but we enforce the values here).
    const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
            id: userId,
            email: email,
            first_name: 'Admin',
            last_name: 'User',
            is_admin: true,
            is_clinic: false
        })
        .select();

    if (profileError) {
        console.error("❌ Failed to upsert profile:", profileError.message);
    } else {
        console.log("✅ Profile updated to Admin.");
    }
}

recreateAdmin();
