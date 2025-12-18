'use client'

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import FileUpload from "@/components/admin/file-upload"

interface ClinicDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSuccess: () => void
    clinicUser: any // The user profile object + clinic_info embedded
}

export function ClinicDialog({ open, onOpenChange, onSuccess, clinicUser }: ClinicDialogProps) {
    const [loading, setLoading] = useState(false)
    const [clinicName, setClinicName] = useState("")
    const [licenseNumber, setLicenseNumber] = useState("")
    const [nidNumber, setNidNumber] = useState("")
    const [docsUrl, setDocsUrl] = useState<string[]>([])

    useEffect(() => {
        if (clinicUser) {
            // clinicUser might be the 'profile' with 'clinic_info' array from the join in page.tsx
            // Or it might be the flat object if passed from table. 
            // In page.tsx: we pass `clinic.profiles` or similar.
            // Let's assume we pass the profile object which has `clinic_info` array.

            // Wait, looking at page.tsx: `setSelectedClinicUser(clinic.profiles)` (where profiles is the profile object).
            // But we also flattened it for the table.

            // Let's rely on what `clinic.profiles` has.
            // The fetch query was: `*, clinic_info (*)`
            // So `clinicUser` (profile) has `clinic_info: [...]`

            const info = clinicUser.clinic_info?.[0]
            if (info) {
                setClinicName(info.clinic_name || "")
                setLicenseNumber(info.license_number || "")
                setNidNumber(info.nid_number || "")
                setDocsUrl(info.docs_url || [])
            } else {
                setClinicName("")
                setLicenseNumber("")
                setNidNumber("")
                setDocsUrl([])
            }
        } else {
            setClinicName("")
            setLicenseNumber("")
            setNidNumber("")
            setDocsUrl([])
        }
    }, [clinicUser, open])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const data = {
                clinic_name: clinicName,
                license_number: licenseNumber,
                nid_number: nidNumber,
                docs_url: docsUrl
            }

            const { updateClinicInfo } = await import("@/actions/admin-users")
            const res = await updateClinicInfo(clinicUser.id, data) // clinicUser.id is profile id

            if (!res.success) {
                throw new Error(res.error)
            }

            toast.success("Clinic info updated")
            onSuccess()
            onOpenChange(false)
        } catch (error: any) {
            console.error(error)
            toast.error(error.message || "Failed to update clinic info")
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Update Clinic Profile</DialogTitle>
                    <DialogDescription>
                        Manage details and license documents for {clinicUser?.first_name} {clinicUser?.last_name}.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="clinicName">Clinic Name</Label>
                            <Input
                                id="clinicName"
                                value={clinicName}
                                onChange={(e) => setClinicName(e.target.value)}
                                placeholder="Super Skin Clinic"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="licenseNumber">License Number</Label>
                                <Input
                                    id="licenseNumber"
                                    value={licenseNumber}
                                    onChange={(e) => setLicenseNumber(e.target.value)}
                                    placeholder="LIC-12345"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="nidNumber">NID Number</Label>
                                <Input
                                    id="nidNumber"
                                    value={nidNumber}
                                    onChange={(e) => setNidNumber(e.target.value)}
                                    placeholder="NID-98765"
                                />
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label>License / Documents</Label>
                            <FileUpload
                                value={docsUrl}
                                onChange={setDocsUrl}
                                onRemove={(url) => setDocsUrl(prev => prev.filter(u => u !== url))}
                                maxFiles={5}
                            />
                            <p className="text-xs text-muted-foreground">Upload license copies, NID, or other verification documents (Images or PDF).</p>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={loading}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Save Clinic Info
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
