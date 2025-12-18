'use client'

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase"
import { UserTable } from "@/components/admin/user-table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { UserDialog } from "@/components/admin/user-dialog"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export default function AdminsPage() {
    const [users, setUsers] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [dialogOpen, setDialogOpen] = useState(false)
    const [selectedUser, setSelectedUser] = useState<any>(null)
    const supabase = createClient()

    const fetchUsers = async () => {
        try {
            const { data, error } = await supabase
                .from("profiles")
                .select("*")
                .eq('is_admin', true) // Filter for Admins
                .order('created_at', { ascending: false })

            if (error) throw error
            setUsers(data || [])
        } catch (error) {
            toast.error("Failed to fetch admins")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchUsers()
    }, [])

    const handleEdit = (user: any) => {
        setSelectedUser(user)
        setDialogOpen(true)
    }

    const handleDelete = async (userId: string) => {
        // Prevent deleting self? The UI should probably handle this in layout logic or backend.
        // Backend `deleteUser` will just delete. 
        // We can add a check here if we have current user ID. 
        // For now, let's just confirm.
        if (!confirm("Are you sure you want to delete this admin?")) return

        try {
            const { deleteUser } = await import("@/actions/admin-users")
            const res = await deleteUser(userId)
            if (!res.success) throw new Error(res.error)
            toast.success("Admin deleted")
            fetchUsers()
        } catch (error: any) {
            toast.error(error.message)
        }
    }

    const handleDialogChange = (open: boolean) => {
        setDialogOpen(open)
        if (!open) setSelectedUser(null)
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Admin Management</h1>
                    <p className="text-muted-foreground">
                        Manage system administrators.
                    </p>
                </div>
                <Button onClick={() => { setSelectedUser({ is_admin: true }); setDialogOpen(true) }}>
                    <Plus className="mr-2 h-4 w-4" /> Add Admin
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Admins</CardTitle>
                    <CardDescription>
                        List of all administrators with access to this panel.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <UserTable
                        users={users} // Reusing UserTable is fine
                        isLoading={loading}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />
                </CardContent>
            </Card>

            <UserDialog
                open={dialogOpen}
                onOpenChange={handleDialogChange}
                onSuccess={fetchUsers}
                user={selectedUser}
            />
        </div>
    )
}
