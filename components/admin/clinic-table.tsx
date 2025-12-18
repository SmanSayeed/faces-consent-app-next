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
import { Check, FileText } from "lucide-react"

interface Profile {
    email: string
    first_name: string
    last_name: string
    is_clinic: boolean
    status: boolean
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
    onEdit?: (clinic: any) => void
    onDelete?: (id: string) => void
}

import { MoreHorizontal } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function ClinicTable({ clinics, isLoading, onVerify, onEdit, onDelete }: ClinicTableProps) {
    const isImage = (url: string) => {
        if (!url) return false
        const cleanUrl = url.split('?')[0].toLowerCase()
        return cleanUrl.match(/\.(jpeg|jpg|gif|png|webp|avif)$/) != null ||
            url.includes('/storage/v1/object/public/images/')
    }

    const resolveDocUrl = (url: string) => {
        if (!url) return ""
        return url
    }

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
                        <TableHead>Clinic Status</TableHead>
                        <TableHead>Profile Status</TableHead>
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
                                    <div className="flex gap-2 items-center flex-wrap max-w-[150px]">
                                        {clinic.docs_url && clinic.docs_url.map((doc, idx) => {
                                            const resolvedUrl = resolveDocUrl(doc)
                                            return (
                                                <a
                                                    href={resolvedUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    key={idx}
                                                    className="group relative border rounded overflow-hidden hover:border-primary transition-colors"
                                                >
                                                    {isImage(resolvedUrl) ? (
                                                        <img src={resolvedUrl} alt="doc" className="w-8 h-8 object-cover" />
                                                    ) : (
                                                        <div className="w-8 h-8 flex items-center justify-center bg-secondary/10">
                                                            <FileText className="h-4 w-4 text-primary" />
                                                        </div>
                                                    )}
                                                </a>
                                            )
                                        })}
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
                                <TableCell>
                                    {clinic.profiles?.status ? (
                                        <Badge className="bg-green-500 hover:bg-green-600">Active</Badge>
                                    ) : (
                                        <Badge variant="destructive">Inactive</Badge>
                                    )}
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        {!isVerified && (
                                            <Button size="sm" variant="outline" className="h-8 w-8 p-0 border-green-200 hover:bg-green-50 hover:text-green-600" onClick={() => onVerify(clinic.id, clinic.profile_id, true)}>
                                                <Check className="h-4 w-4" />
                                            </Button>
                                        )}
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <span className="sr-only">Open menu</span>
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                <DropdownMenuItem
                                                    onClick={() => navigator.clipboard.writeText(clinic.profile_id)}
                                                >
                                                    Copy Owner ID
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                {onEdit && (
                                                    <DropdownMenuItem onClick={() => onEdit(clinic)}>Edit Clinic Info</DropdownMenuItem>
                                                )}
                                                {!isVerified && (
                                                    <DropdownMenuItem onClick={() => onVerify(clinic.id, clinic.profile_id, true)}>
                                                        Verify Clinic
                                                    </DropdownMenuItem>
                                                )}
                                                {isVerified && (
                                                    <DropdownMenuItem onClick={() => onVerify(clinic.id, clinic.profile_id, false)} className="text-orange-600">
                                                        Revoke Logic
                                                    </DropdownMenuItem>
                                                )}
                                                {onDelete && (
                                                    <DropdownMenuItem
                                                        className="text-red-600"
                                                        onClick={() => onDelete(clinic.profile_id)} // Delete User/Profile
                                                    >
                                                        Delete Clinic User
                                                    </DropdownMenuItem>
                                                )}
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )
                    })}
                    {clinics.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={7} className="h-24 text-center">
                                No clinic applications found.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div >
    )
}
