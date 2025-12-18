"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase"
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
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import ImageUpload from "@/components/admin/image-upload"

interface UserDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSuccess: () => void
}

export function UserDialog({ open, onOpenChange, onSuccess, user }: UserDialogProps & { user?: any }) {
    const [loading, setLoading] = useState(false)
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("11112222")
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [isClinic, setIsClinic] = useState(false)
    const [isAdmin, setIsAdmin] = useState(false)
    const [imageUrl, setImageUrl] = useState("")
    const [status, setStatus] = useState(false)
    const [actAsClinic, setActAsClinic] = useState(false)

    // Populate form when user prop changes
    useEffect(() => {
        if (user) {
            setEmail(user.email || "")
            setFirstName(user.first_name || "")
            setLastName(user.last_name || "")
            setIsClinic(user.is_clinic || false)
            setIsAdmin(user.is_admin || false)
            setImageUrl(user.image_url || "")
            setStatus(user.status || false)
            setActAsClinic(user.act_as_clinic || false)
            setPassword("") // Don't show password
        } else {
            // Reset
            setEmail("")
            setPassword("11112222")
            setFirstName("")
            setLastName("")
            setIsClinic(false)
            setIsAdmin(false)
            setImageUrl("")
            setStatus(false)
            setActAsClinic(false)
        }
    }, [user, open])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const userData = {
                first_name: firstName,
                last_name: lastName,
                email,
                is_clinic: isClinic,
                is_admin: isAdmin,
                image_url: imageUrl,
                status: status,
                act_as_clinic: actAsClinic,
                password: password ? password : undefined,
            }

            if (user) {
                // Edit
                const { updateUser } = await import("@/actions/admin-users")
                await updateUser(user.id, userData)
            } else {
                // Create
                const { createUser } = await import("@/actions/admin-users")
                await createUser(userData)
            }
            onSuccess()
            onOpenChange(false)
        } catch (error) {
            console.error(error)
            toast.error("Failed to save user")
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px] max-h-[85vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{user ? "Edit User" : "Add User"}</DialogTitle>
                    <DialogDescription>
                        {user ? "Make changes to the user profile here." : "Add a new user to the system."}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label>Profile Image</Label>
                            <ImageUpload
                                value={imageUrl ? [imageUrl] : []}
                                onChange={(urls) => setImageUrl(urls[0] || "")}
                                onRemove={() => setImageUrl("")}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="firstName">First Name</Label>
                                <Input
                                    id="firstName"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    placeholder="John"
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="lastName">Last Name</Label>
                                <Input
                                    id="lastName"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    placeholder="Doe"
                                    required
                                />
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="john@example.com"
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="password">Password {user && "(Leave empty to keep current)"}</Label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required={!user}
                            />
                        </div>

                        <div className="flex flex-col gap-4 border p-4 rounded-md">
                            <Label className="mb-2 underline">Status & Roles</Label>

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
                                    <Label htmlFor="isAdmin">Admin Access</Label>
                                    <div className="text-xs text-muted-foreground">Grant admin dashboard access</div>
                                </div>
                                <Switch
                                    id="isAdmin"
                                    checked={isAdmin}
                                    onCheckedChange={setIsAdmin}
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label htmlFor="isClinic">Clinic Account</Label>
                                    <div className="text-xs text-muted-foreground">User is a clinic owner</div>
                                </div>
                                <Switch
                                    id="isClinic"
                                    checked={isClinic}
                                    onCheckedChange={setIsClinic}
                                />
                            </div>

                            {isClinic && (
                                <div className="flex items-center justify-between pl-4 border-l-2 border-primary/20">
                                    <div className="space-y-0.5">
                                        <Label htmlFor="actAsClinic">Act As Clinic</Label>
                                        <div className="text-xs text-muted-foreground">Toggle clinic features in app</div>
                                    </div>
                                    <Switch
                                        id="actAsClinic"
                                        checked={actAsClinic}
                                        onCheckedChange={setActAsClinic}
                                    />
                                </div>
                            )}
                        </div>

                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={loading}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {user ? "Save Changes" : "Create User"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
