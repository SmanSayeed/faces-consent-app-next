"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase"
import { Users, Building2, CheckCircle, Clock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        users: 0,
        clinics: 0,
        pendingClinics: 0,
        activeClinics: 0
    })
    const supabase = createClient()

    useEffect(() => {
        async function fetchStats() {
            // 1. Total Users
            const { count: userCount } = await supabase
                .from("profiles")
                .select("*", { count: "exact", head: true })

            // 2. Total Clinics
            const { count: clinicCount } = await supabase
                .from("profiles")
                .select("*", { count: "exact", head: true })
                .eq('is_clinic', true)

            // 3. Pending Clinics (assuming checking specific table or status in future)
            // For now, let's just use a placeholder query or count verified/unverified if we had a status field.
            // We can check 'clinic_info' table if needed.

            setStats({
                users: userCount || 0,
                clinics: clinicCount || 0,
                pendingClinics: 0, // Todo: implement verification logic
                activeClinics: clinicCount || 0
            })
        }
        fetchStats()
    }, [])

    const cards = [
        { label: "Total Users", value: stats.users, icon: Users, color: "text-blue-500" },
        { label: "Total Clinics", value: stats.clinics, icon: Building2, color: "text-purple-500" },
        { label: "Pending Verifications", value: stats.pendingClinics, icon: Clock, color: "text-orange-500" },
        { label: "Active Clinics", value: stats.activeClinics, icon: CheckCircle, color: "text-green-500" },
    ]

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-foreground">Dashboard Overview</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {cards.map((card) => {
                    const Icon = card.icon
                    return (
                        <Card key={card.label}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    {card.label}
                                </CardTitle>
                                <Icon className={`h-4 w-4 ${card.color}`} />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{card.value}</div>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Overview</CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                            Chart Component Placeholder
                        </div>
                    </CardContent>
                </Card>
                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Recent Signups</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                            Recent List Placeholder
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
