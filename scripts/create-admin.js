const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

async function createAdmin() {
    const email = 'a@a.com';
    const password = '11112222';

    console.log(`Creating user ${email}...`);

    // 1. Create or Get User (Admin API)
    const { data: user, error: createError } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
    });

    let userId;

    if (createError) {
        if (createError.message.includes('already registered')) {
            console.log('User already exists. Fetching ID...');
            const { data: listData } = await supabase.auth.admin.listUsers();
            const existing = listData.users.find(u => u.email === email);
            if (existing) {
                userId = existing.id;
            } else {
                console.error("Could not find existing user.");
                return;
            }
        } else {
            console.error('Error creating user:', createError.message);
            return;
        }
    } else {
        userId = user.user.id;
        console.log('User created successfully.');
    }

    // 2. Update Profile to Admin
    console.log(`Making user ${userId} an admin...`);

    // Upsert profile
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
        console.error('Error updating profile:', profileError.message);
    } else {
        console.log(`Success! User ${email} is now an admin.`);
    }
}

createAdmin();
