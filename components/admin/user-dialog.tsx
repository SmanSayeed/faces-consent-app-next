"use client"

import { useState } from "react"
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
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

interface UserDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSuccess: () => void
}

export function UserDialog({ open, onOpenChange, onSuccess }: UserDialogProps) {
    const [loading, setLoading] = useState(false)
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("11112222") // Default for ease
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [isClinic, setIsClinic] = useState(false)

    const supabase = createClient()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            // 1. Create User in Auth (Simulated / or using Admin API if available)
            // Note: On client side without Service Role, we can't create users directly into Auth easily
            // UNLESS 'allow public signups' is on. 
            // However, Supabase Admin Client (Service Role) is needed for 'Create User without login'.

            // WORKAROUND FOR CLIENT DEMO: 
            // We'll call a server action or API route ideally, but user asked for "No complex changes".
            // We will attempt client-side signUp. This logs the CURRENT user out effectively in generic apps,
            // but we are in a 'Simple Login' mode (Cookie based) so Supabase session might not matter!

            // Actually, best way to 'Create User' from Admin panel without logging out is to use an API Route.
            // But let's try a direct INSERT to 'profiles' first? No, profiles reference auth.users.

            // To stick to "Simple" and "Simulated" for this specific user request who is bypassing auth:
            // We will try to rely on a backend script OR just show success if its a demo.
            // BUT user wants CRUD. 

            // REAL IMPLEMENTATION: We need an API route.
            // I'll create a simple API route for this.

            const response = await fetch('/api/admin/create-user', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password, firstName, lastName, isClinic })
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || "Failed to create user")
            }

            toast.success("User created successfully")
            onOpenChange(false)
            onSuccess()

            // Reset form
            setEmail("")
            setFirstName("")
            setLastName("")
            setIsClinic(false)

        } catch (error: any) {
            console.error(error)
            toast.error(error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Create New User</DialogTitle>
                    <DialogDescription>
                        Add a new user or clinic to the system.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="firstName">First Name</Label>
                            <Input
                                id="firstName"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="lastName">Last Name</Label>
                            <Input
                                id="lastName"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="isClinic"
                            checked={isClinic}
                            onCheckedChange={(checked) => setIsClinic(checked as boolean)}
                        />
                        <Label htmlFor="isClinic">Is variable Clinic?</Label>
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={loading}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Create User
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
