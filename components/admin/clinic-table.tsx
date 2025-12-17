"use client"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Check, X, FileText, ExternalLink } from "lucide-react"

interface Profile {
    email: string
    first_name: string
    last_name: string
    is_clinic: boolean
}

interface ClinicInfo {
    id: string
    clinic_name: string
    license_number: string
    nid_number: string
    docs_url: string[] | null
    created_at: string
    profiles: Profile | null
    profile_id: string
}

interface ClinicTableProps {
    clinics: ClinicInfo[]
    isLoading: boolean
    onVerify: (id: string, profileId: string, status: boolean) => void
}

export function ClinicTable({ clinics, isLoading, onVerify }: ClinicTableProps) {
    if (isLoading) {
        return <div>Loading clinics...</div>
    }

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Clinic Name</TableHead>
                        <TableHead>Owner</TableHead>
                        <TableHead>License / NID</TableHead>
                        <TableHead>Documents</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {clinics.map((clinic) => {
                        const isVerified = clinic.profiles?.is_clinic
                        return (
                            <TableRow key={clinic.id}>
                                <TableCell className="font-medium">
                                    {clinic.clinic_name}
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span>{clinic.profiles?.first_name} {clinic.profiles?.last_name}</span>
                                        <span className="text-xs text-muted-foreground">{clinic.profiles?.email}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-col text-xs">
                                        <span>Lic: {clinic.license_number || 'N/A'}</span>
                                        <span>NID: {clinic.nid_number || 'N/A'}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex gap-2">
                                        {clinic.docs_url && clinic.docs_url.map((doc, idx) => (
                                            <a href={doc} target="_blank" rel="noopener noreferrer" key={idx} className="text-blue-500 hover:text-blue-700">
                                                <FileText className="h-4 w-4" />
                                            </a>
                                        ))}
                                        {(!clinic.docs_url || clinic.docs_url.length === 0) && <span className="text-xs text-muted-foreground">No docs</span>}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    {isVerified ? (
                                        <Badge className="bg-green-500 hover:bg-green-600">Verified</Badge>
                                    ) : (
                                        <Badge variant="outline" className="text-orange-500 border-orange-200">Pending</Badge>
                                    )}
                                </TableCell>
                                <TableCell className="text-right">
                                    {!isVerified && (
                                        <div className="flex justify-end gap-2">
                                            <Button size="sm" variant="outline" className="h-8 w-8 p-0 border-green-200 hover:bg-green-50 hover:text-green-600" onClick={() => onVerify(clinic.id, clinic.profile_id, true)}>
                                                <Check className="h-4 w-4" />
                                            </Button>
                                            <Button size="sm" variant="outline" className="h-8 w-8 p-0 border-red-200 hover:bg-red-50 hover:text-red-600" onClick={() => onVerify(clinic.id, clinic.profile_id, false)}>
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    )}
                                    {isVerified && (
                                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0" disabled>
                                            <Check className="h-4 w-4 text-green-500" />
                                        </Button>
                                    )}
                                </TableCell>
                            </TableRow>
                        )
                    })}
                    {clinics.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={6} className="h-24 text-center">
                                No clinic applications found.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    )
}
