const fs = require('fs');
const path = require('path');

const envPath = path.resolve(__dirname, '..', '.env');
console.log('Env path:', envPath);

if (!fs.existsSync(envPath)) {
    console.error('File not found!');
    process.exit(1);
}

const buffer = fs.readFileSync(envPath);
console.log('Buffer hex start:', buffer.subarray(0, 10).toString('hex'));

// Try normal utf8 read
const content = fs.readFileSync(envPath, 'utf8');
console.log('Content length:', content.length);
// Print first few chars to see if there's invisible chars 
console.log('First 50 chars:', content.substring(0, 50).replace(/\n/g, '\\n'));

const lines = content.split(/\r?\n/); // Handle CRLF
console.log('Line count:', lines.length);

lines.forEach((line, idx) => {
    const trimmed = line.trim();
    if (!trimmed) return;
    if (trimmed.startsWith('#')) return;

    // Looser regex
    const match = trimmed.match(/^([^=]+)=(.*)$/);
    if (match) {
        console.log(`Line ${idx + 1}: Key found [${match[1].trim()}]`);
        // Set env
        let val = match[2].trim();
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
            val = val.slice(1, -1);
        }
        process.env[match[1].trim()] = val;
    } else {
        console.log(`Line ${idx + 1}: No match [${trimmed}]`);
    }
});

const { createClient } = require('@supabase/supabase-js');
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !key) {
    console.error('Missing vars!');
    console.log('NEXT_PUBLIC_SUPABASE_URL:', url ? 'FOUND' : 'MISSING');
    console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', key ? 'FOUND' : 'MISSING');
    process.exit(1);
}

const supabase = createClient(url, key);
console.log('Connecting to:', url);

supabase.from('regions').select('*', { count: 'exact', head: true })
    .then(({ count, error }) => {
        if (error) {
            console.error('DB Error:', error.message);
            // Check if it's a 404 or connection refused
            if (error.code) console.error('Code:', error.code);
            process.exit(1);
        }
        console.log('SUCCESS! Connection works.');
        console.log('Regions count:', count);
        process.exit(0);
    })
    .catch(err => {
        console.error('Fetch Error:', err);
        process.exit(1);
    });
