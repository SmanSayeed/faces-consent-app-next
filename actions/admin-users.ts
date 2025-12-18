'use server'

import { createClient } from "@/lib/supabase"
import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"

// Helper to check admin session (since we are bypassing Auth for now as per previous checks in layout.tsx)
const checkAdmin = async () => {
    const cookieStore = await cookies()
    const hasSession = cookieStore.get('admin_session')
    if (!hasSession || hasSession.value !== 'true') {
        throw new Error("Unauthorized")
    }
}

export async function createUser(data: any) {
    await checkAdmin()

    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!serviceRoleKey) {
        console.error("Missing SUPABASE_SERVICE_ROLE_KEY")
        return { success: false, error: "Server configuration error: Missing Service Role Key" }
    }

    // Use admin client to create auth user
    const { createAdminClient } = await import("@/lib/supabase-admin")
    const supabaseAdmin = createAdminClient()
    // const supabase = createClient() // For other things if needed - removed as not used

    try {
        console.log("Attempting to create user:", data.email)

        // 1. Create Auth User
        const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
            email: data.email,
            password: data.password || '11112222',
            email_confirm: true,
            user_metadata: {
                first_name: data.first_name,
                last_name: data.last_name
            }
        })

        if (authError) {
            console.error("Auth creation failed:", authError)
            throw authError
        }
        if (!authUser.user) throw new Error("Failed to create auth user")

        console.log("Auth user created:", authUser.user.id)

        // 2. Create Profile
        // We ensure boolean flags are explicitly set
        const profileData = {
            id: authUser.user.id,
            email: data.email,
            first_name: data.first_name,
            last_name: data.last_name,
            is_clinic: data.is_clinic === true,
            act_as_clinic: data.is_clinic === true && data.act_as_clinic === true,
            is_admin: data.is_admin === true,
            status: data.status === true,
            image_url: data.image_url
        }

        const { error: profileError } = await supabaseAdmin
            .from("profiles")
            .insert(profileData)

        if (profileError) {
            console.error("Profile creation failed:", profileError)
            // Rollback auth user
            await supabaseAdmin.auth.admin.deleteUser(authUser.user.id)
            throw new Error(`Profile creation failed: ${profileError.message}`)
        }

        console.log("Profile created successfully")

        // 3. If Clinic, insert info
        if (data.is_clinic) {
            const { error: clinicError } = await supabaseAdmin
                .from("clinic_info")
                .insert({
                    profile_id: authUser.user.id,
                    clinic_name: data.clinic_name || 'New Clinic',
                    license_number: data.license_number,
                    nid_number: data.nid_number,
                    docs_url: data.docs_url || []
                })
            if (clinicError) console.error("Clinic info creation failed", clinicError)
        }

        revalidatePath('/dashboard/users')
        revalidatePath('/dashboard/clinics')
        revalidatePath('/dashboard/admins')
        return { success: true }
    } catch (e: any) {
        console.error("Create User Logic Error:", e)
        return { success: false, error: e.message || "Failed to create user" }
    }
}

export async function updateUser(id: string, data: any) {
    await checkAdmin()
    const supabase = createClient()

    const { error } = await supabase
        .from("profiles")
        .update({
            first_name: data.first_name,
            last_name: data.last_name,
            email: data.email, // Note: updating email in profile doesn't update auth
            is_clinic: data.is_clinic,
            act_as_clinic: data.act_as_clinic,
            image_url: data.image_url,
            is_admin: data.is_admin,
            status: data.status
        })
        .eq("id", id)

    if (error) return { success: false, error: error.message }

    // If clinic, update/insert clinic_info
    if (data.is_clinic) {
        // We need to upsert clinic_info. 
        // We know profile_id = id.
        const clinicData = {
            profile_id: id,
            clinic_name: data.clinic_name,
            license_number: data.license_number,
            nid_number: data.nid_number
        }

        // Check if exists first to decide update or insert? 
        // Or just upsert if we had ID? We don't have clinic_info ID passed easily.
        // But profile_id is unique enough for 1:1? Schema has PK id, and FK profile_id.
        // Let's use profile_id to find it. But we can't Upsert on non-constraint unless we add unique constraint on profile_id.
        // Assuming profile_id is unique in clinic_info (logic wise).

        // Let's try update first
        const { error: updateClinicError, data: updatedClinic } = await supabase
            .from("clinic_info")
            .update(clinicData)
            .eq("profile_id", id)
            .select()

        if (updateClinicError) {
            console.error("Clinic update error", updateClinicError)
            // Not fatal?
        }

        if (!updatedClinic || updatedClinic.length === 0) {
            // Insert if not updated
            await supabase.from("clinic_info").insert([clinicData])
        }
    }

    revalidatePath('/dashboard/users')
    revalidatePath('/dashboard/clinics')
    return { success: true }
}

export async function deleteUser(id: string) {
    await checkAdmin()
    const { createAdminClient } = await import("@/lib/supabase-admin")
    const supabaseAdmin = createAdminClient()

    // Delete from Auth (References will cascade if DB configured, or we delete profile first)
    // Schema says: `profile_id uuid references public.profiles(id) on delete cascade` for clinic_info
    // But profiles -> auth.users. 
    // If we delete auth user, does profile delete? 
    // Usually yes if `references auth.users on delete cascade` is set.
    // Schema: `id uuid references auth.users not null primary key`. Default behavior is No Action usually unless specified.
    // Let's try deleting auth user. If that fails, we delete profile manual.

    const { error } = await supabaseAdmin.auth.admin.deleteUser(id)

    if (error) {
        // Fallback or specific handling
        console.error("Auth delete error", error)
        return { success: false, error: error.message }
    }

    revalidatePath('/dashboard/users')
    revalidatePath('/dashboard/clinics')
    revalidatePath('/dashboard/admins')
    return { success: true }
}

export async function verifyClinic(profileId: string, status: boolean) {
    await checkAdmin()
    const supabase = createClient()

    const { error } = await supabase
        .from("profiles")
        .update({ is_clinic: status })
        .eq("id", profileId)

    if (error) return { success: false, error: error.message }

    revalidatePath('/dashboard/users')
    revalidatePath('/dashboard/clinics')
    return { success: true }
}

export async function updateClinicInfo(profileId: string, data: any) {
    await checkAdmin()
    const supabase = createClient()

    const clinicData = {
        profile_id: profileId,
        clinic_name: data.clinic_name,
        license_number: data.license_number,
        nid_number: data.nid_number,
        docs_url: data.docs_url // string[]
    }

    // Upsert clinic_info
    const { data: existing } = await supabase.from('clinic_info').select('id').eq('profile_id', profileId).single()

    let error;
    if (existing) {
        const { error: err } = await supabase.from('clinic_info').update(clinicData).eq('profile_id', profileId)
        error = err
    } else {
        const { error: err } = await supabase.from('clinic_info').insert([clinicData])
        error = err
    }

    if (error) return { success: false, error: error.message }

    // Also update profile status and acts_as_clinic logic if passed
    if (data.status !== undefined || data.act_as_clinic !== undefined || data.is_clinic !== undefined || data.active_as_clinic !== undefined) {
        const profileUpdate: any = {}
        if (data.status !== undefined) profileUpdate.status = data.status
        if (data.act_as_clinic !== undefined) profileUpdate.act_as_clinic = data.act_as_clinic
        if (data.is_clinic !== undefined) profileUpdate.is_clinic = data.is_clinic
        if (data.active_as_clinic !== undefined) profileUpdate.active_as_clinic = data.active_as_clinic

        if (Object.keys(profileUpdate).length > 0) {
            const { error: profileError } = await supabase
                .from("profiles")
                .update(profileUpdate)
                .eq("id", profileId)

            if (profileError) console.error("Profile update from clinic edit failed", profileError)
        }
    }

    revalidatePath('/dashboard/users')
    revalidatePath('/dashboard/clinics')
    return { success: true }
}
