const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Env Vars');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testLogin() {
    const email = 'a@a.com';
    const password = '11112222';

    console.log(`Attempting login for ${email}...`);
    console.log(`URL: ${supabaseUrl}`);

    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
    });

    if (error) {
        console.error('❌ Login Failed:', error.message);
        if (error.status) console.error('   Status:', error.status);
        console.error('   Full Error:', JSON.stringify(error, null, 2));
    } else {
        console.log('✅ Login Successful!');
        console.log('User ID:', data.user.id);
        console.log('Session exists:', !!data.session);
    }
}

testLogin();
