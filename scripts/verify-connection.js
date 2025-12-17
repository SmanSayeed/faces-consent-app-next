const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' });

async function verifyConnection() {
    console.log("Verifying Supabase Connection...");

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    // Optional: Test service role if available, but Anon is enough for public read
    // const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !key) {
        console.error("❌ Missing Environment Variables:");
        console.error(`   NEXT_PUBLIC_SUPABASE_URL: ${url ? 'OK' : 'MISSING'}`);
        console.error(`   NEXT_PUBLIC_SUPABASE_ANON_KEY: ${key ? 'OK' : 'MISSING'}`);
        return;
    }

    console.log(`URL: ${url}`);
    // console.log(`Key: ${key.substring(0, 10)}...`);

    const supabase = createClient(url, key);

    try {
        // Try to select from a table we know exists (e.g., regions or just auth check)
        // 'regions' is a public table in the schema
        const { data, error } = await supabase.from('regions').select('*').limit(1);

        if (error) {
            console.error("❌ Connection Failed:", error.message);
            if (error.code === 'PGRST116') console.error("   (Table might not exist or RLS issue)");
        } else {
            console.log("✅ Connection Successful!");
            console.log("   Data received:", data);
        }

    } catch (err) {
        console.error("❌ Unexpected Error:", err.message);
    }
}

verifyConnection();
