import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

// Service Role Client for Admin Operations
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { email, password, firstName, lastName, isClinic } = body

        // 1. Create Auth User
        const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
            email,
            password,
            email_confirm: true,
            user_metadata: { first_name: firstName, last_name: lastName }
        })

        if (authError) {
            return NextResponse.json({ error: authError.message }, { status: 400 })
        }

        const userId = authData.user.id

        // 2. Insert into Profiles (Explicitly, though Trigger might handle it, we safeguard)
        const { error: profileError } = await supabaseAdmin
            .from('profiles')
            .upsert({
                id: userId,
                email: email,
                first_name: firstName,
                last_name: lastName,
                is_clinic: isClinic,
                active_as_clinic: isClinic, // Default on if clinic
                is_admin: false
            })

        if (profileError) {
            // Rollback? No, simple error report logic
            console.error("Profile creation error", profileError)
            return NextResponse.json({ error: "User created but profile failed: " + profileError.message }, { status: 500 })
        }

        // 3. If Clinic, add Clinic Info stub
        if (isClinic) {
            await supabaseAdmin.from('clinic_info').insert({
                profile_id: userId,
                clinic_name: `${firstName}'s Clinic`,
                license_number: 'PENDING',
                nid_number: 'PENDING'
            })
        }

        return NextResponse.json({ success: true, userId })

    } catch (error: any) {
        console.error("API Error:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
