-- FIX FOR 500 ERROR: "Database error querying schema"
-- Cause: Your SQL installed pgcrypto in 'public', but the Auth User (service_role/supabase_auth_admin)
-- often does not have default permission to execute functions in 'public'.

-- 1. Grant Usage on Public Schema to System Roles
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role, supabase_auth_admin;

-- 2. Grant Execute on ALL Functions in Public (Crucial for pgcrypto functions like gen_salt)
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO postgres, anon, authenticated, service_role, supabase_auth_admin;

-- 3. Grant Access to Tables (Just to be safe for RLS)
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, anon, authenticated, service_role, supabase_auth_admin;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres, anon, authenticated, service_role, supabase_auth_admin;

-- 4. Ensure Auth Schema is Accessible
GRANT USAGE ON SCHEMA auth TO postgres, anon, authenticated, service_role, supabase_auth_admin;
GRANT SELECT ON ALL TABLES IN SCHEMA auth TO postgres, anon, authenticated, service_role, supabase_auth_admin;
