'use server'

import { createAdminClient } from "@/lib/supabase-admin"

export async function checkAdminUser(email: string) {
    const supabase = createAdminClient()

    try {
        const { data: profile, error } = await supabase
            .from('profiles')
            .select('is_admin')
            .eq('email', email)
            .single()

        if (error) {
            // PGRST116 is "The result contains 0 rows"
            if (error.code === 'PGRST116') {
                return { success: false, error: "User not found" }
            }
            console.error("Admin check error:", error)
            return { success: false, error: error.message }
        }

        if (!profile) {
            return { success: false, error: "User not found" }
        }

        return { success: true, isAdmin: profile.is_admin }
    } catch (error) {
        console.error("Unexpected error in checkAdminUser:", error)
        return { success: false, error: "Unexpected error" }
    }
}
