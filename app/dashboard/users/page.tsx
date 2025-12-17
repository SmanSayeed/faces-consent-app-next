"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase"
import { UserTable } from "@/components/admin/user-table"
import { UserDialog } from "@/components/admin/user-dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export default function UsersPage() {
    const [users, setUsers] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [dialogOpen, setDialogOpen] = useState(false)
    const supabase = createClient()

    const fetchUsers = async () => {
        try {
            // Fetch Profiles
            const { data: profiles, error } = await supabase
                .from("profiles")
                .select("*")
                .order('created_at', { ascending: false })

            if (error) throw error

            // Fetch Locations manually
            const { data: locations } = await supabase.from("users_location").select("*");

            // Merge
            const combined = profiles?.map(p => {
                const loc = locations?.find(l => l.user_id === p.id);
                return { ...p, location: loc };
            })

            setUsers(combined || [])
        } catch (error) {
            console.error("Error fetching users:", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchUsers()
    }, [])

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
                    <p className="text-muted-foreground">
                        Manage and view all registered users and clinics.
                    </p>
                </div>
                <Button onClick={() => setDialogOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" /> Create User
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>All Users</CardTitle>
                    <CardDescription>
                        A list of all users including their role and status.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <UserTable users={users} isLoading={loading} />
                </CardContent>
            </Card>

            <UserDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                onSuccess={fetchUsers}
            />
        </div>
    )
}
