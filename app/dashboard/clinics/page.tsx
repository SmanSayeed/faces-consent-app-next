"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase"
import { ClinicTable } from "@/components/admin/clinic-table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { UserDialog } from "@/components/admin/user-dialog"
import { ClinicDialog } from "@/components/admin/clinic-dialog"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function ClinicsPage() {
    const [clinics, setClinics] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [userDialogOpen, setUserDialogOpen] = useState(false) // For creating user
    const [clinicDialogOpen, setClinicDialogOpen] = useState(false) // For editing clinic info
    const [selectedClinicUser, setSelectedClinicUser] = useState<any>(null)
    const supabase = createClient()

    const fetchClinics = async () => {
        try {
            // Fetch profiles that are marked as clinics
            // We join clinic_info to get details if they exist
            const { data: profiles, error } = await supabase
                .from("profiles")
                .select(`
                    *,
                    clinic_info (*)
                `)
                .eq('is_clinic', true)
                .order('created_at', { ascending: false })

            if (error) throw error

            // Transform to shape expected by table
            const formatted = profiles?.map(p => ({
                id: p.clinic_info?.[0]?.id || 'pending-' + p.id, // Fallback ID
                clinic_name: p.clinic_info?.[0]?.clinic_name || 'Unnamed Clinic',
                license_number: p.clinic_info?.[0]?.license_number,
                nid_number: p.clinic_info?.[0]?.nid_number,
                docs_url: p.clinic_info?.[0]?.docs_url,
                created_at: p.created_at,
                profile_id: p.id, // Profile ID for actions
                profiles: p // Embed profile data
            }))

            setClinics(formatted || [])
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
            const { verifyClinic } = await import("@/actions/admin-users")
            const res = await verifyClinic(profileId, status)
            if (!res.success) throw new Error(res.error)

            toast.success(status ? "Clinic verified" : "Verification revoked")
            fetchClinics()
        } catch (error: any) {
            console.error("Error verifying clinic:", error)
            toast.error(error.message || "Failed to update status")
        }
    }

    const handleDelete = async (profileId: string) => {
        if (!confirm("Are you sure you want to delete this clinic user?")) return
        try {
            const { deleteUser } = await import("@/actions/admin-users")
            const res = await deleteUser(profileId)
            if (!res.success) throw new Error(res.error)
            toast.success("Clinic user deleted")
            fetchClinics()
        } catch (error: any) {
            toast.error(error.message)
        }
    }

    const handleEdit = (clinic: any) => {
        // clinic is the table row object.
        // We pass the profile object (which includes clinic_info array)
        setSelectedClinicUser(clinic.profiles)
        setClinicDialogOpen(true)
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Clinic Verification</h1>
                    <p className="text-muted-foreground">
                        Review and verify clinic applications.
                    </p>
                </div>
                <Button onClick={() => { setSelectedClinicUser({ is_clinic: true }); setUserDialogOpen(true) }}>
                    <Plus className="mr-2 h-4 w-4" /> Add Clinic User
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Clinic Applications</CardTitle>
                    <CardDescription>
                        List of clinics waiting for verification or already verified.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <ClinicTable
                        clinics={clinics}
                        isLoading={loading}
                        onVerify={handleVerify}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />
                </CardContent>
            </Card>

            <UserDialog
                open={userDialogOpen}
                onOpenChange={(open) => { setUserDialogOpen(open); if (!open) fetchClinics() }}
                onSuccess={fetchClinics}
                user={selectedClinicUser?.is_clinic && !selectedClinicUser.id ? selectedClinicUser : undefined} // Only pass if creating new
            />

            <ClinicDialog
                open={clinicDialogOpen}
                onOpenChange={setClinicDialogOpen}
                onSuccess={fetchClinics}
                clinicUser={selectedClinicUser}
            />
        </div>
    )
}
