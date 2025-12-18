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

import { Switch } from "@/components/ui/switch"

export function ClinicDialog({ open, onOpenChange, onSuccess, clinicUser }: ClinicDialogProps) {
    const [loading, setLoading] = useState(false)
    const [clinicName, setClinicName] = useState("")
    const [licenseNumber, setLicenseNumber] = useState("")
    const [nidNumber, setNidNumber] = useState("")
    const [docsUrl, setDocsUrl] = useState<string[]>([])
    const [status, setStatus] = useState(false)
    const [isClinic, setIsClinic] = useState(false)
    const [actAsClinic, setActAsClinic] = useState(false)
    const [activeAsClinic, setActiveAsClinic] = useState(false)

    useEffect(() => {
        if (clinicUser) {
            // clinicUser is the profile object
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
            setStatus(clinicUser.status || false)
            setIsClinic(clinicUser.is_clinic || false)
            setActAsClinic(clinicUser.act_as_clinic || false)
            setActiveAsClinic(clinicUser.active_as_clinic || false)
        } else {
            setClinicName("")
            setLicenseNumber("")
            setNidNumber("")
            setDocsUrl([])
            setStatus(false)
            setIsClinic(false)
            setActAsClinic(false)
            setActiveAsClinic(false)
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
                docs_url: docsUrl,
                status: status,
                is_clinic: isClinic,
                act_as_clinic: actAsClinic,
                active_as_clinic: activeAsClinic
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
                        <div className="flex flex-col gap-4 border p-4 rounded-md mb-4">
                            <Label className="mb-2 underline">Status & Visibility</Label>
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label htmlFor="status">Active Status</Label>
                                    <div className="text-xs text-muted-foreground">User can login if active</div>
                                </div>
                                <Switch
                                    id="status"
                                    checked={status}
                                    onCheckedChange={setStatus}
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label htmlFor="isClinic">Clinic Account</Label>
                                    <div className="text-xs text-muted-foreground">Is this user a clinic?</div>
                                </div>
                                <Switch
                                    id="isClinic"
                                    checked={isClinic}
                                    onCheckedChange={setIsClinic}
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label htmlFor="actAsClinic">Act As Clinic</Label>
                                    <div className="text-xs text-muted-foreground">Admin-forced clinic features</div>
                                </div>
                                <Switch
                                    id="actAsClinic"
                                    checked={actAsClinic}
                                    onCheckedChange={setActAsClinic}
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label htmlFor="activeAsClinic">Active As Clinic</Label>
                                    <div className="text-xs text-muted-foreground">User's current view preference</div>
                                </div>
                                <Switch
                                    id="activeAsClinic"
                                    checked={activeAsClinic}
                                    onCheckedChange={setActiveAsClinic}
                                />
                            </div>
                        </div>

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
