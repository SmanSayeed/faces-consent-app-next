"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase"
import { ClinicTable } from "@/components/admin/clinic-table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"

export default function ClinicsPage() {
    const [clinics, setClinics] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const supabase = createClient()

    const fetchClinics = async () => {
        try {
            // Fetch clinic_info joined with profiles
            const { data, error } = await supabase
                .from("clinic_info")
                .select(`
                    *,
                    profiles (
                        email,
                        first_name,
                        last_name,
                        is_clinic
                    )
                `)
                .order('created_at', { ascending: false })

            if (error) throw error
            setClinics(data || [])
        } catch (error) {
            console.error("Error fetching clinics:", error)
            toast.error("Failed to fetch clinics")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchClinics()
    }, [])

    const handleVerify = async (id: string, profileId: string, status: boolean) => {
        try {
            if (status) {
                // Verify: Set is_clinic = true in profiles
                const { error } = await supabase
                    .from("profiles")
                    .update({ is_clinic: true })
                    .eq("id", profileId)

                if (error) throw error
                toast.success("Clinic verified successfully")
            } else {
                // Reject logic
                const { error } = await supabase
                    .from("profiles")
                    .update({ is_clinic: false })
                    .eq("id", profileId)

                if (error) throw error
                toast.info("Clinic marked as not verified")
            }
            fetchClinics() // Refresh list
        } catch (error) {
            console.error("Error verifying clinic:", error)
            toast.error("Failed to update status")
        }
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Clinic Verification</h1>
                <p className="text-muted-foreground">
                    Review and verify clinic applications.
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Clinic Applications</CardTitle>
                    <CardDescription>
                        List of clinics waiting for verification or already verified.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <ClinicTable clinics={clinics} isLoading={loading} onVerify={handleVerify} />
                </CardContent>
            </Card>
        </div>
    )
}
