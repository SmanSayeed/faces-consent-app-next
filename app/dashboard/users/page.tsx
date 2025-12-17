"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase"
import { UserTable } from "@/components/admin/user-table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function UsersPage() {
    const [users, setUsers] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const supabase = createClient()

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const { data, error } = await supabase
                    .from("profiles")
                    .select("*")
                    .order('created_at', { ascending: false })

                if (error) throw error
                setUsers(data || [])
            } catch (error) {
                console.error("Error fetching users:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchUsers()
    }, [])

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
                <p className="text-muted-foreground">
                    Manage and view all registered users and clinics.
                </p>
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
        </div>
    )
}
