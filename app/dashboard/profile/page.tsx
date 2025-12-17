
"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase"
import { toast } from "sonner"
import { Lock, User, ShieldCheck, Mail, MapPin, Building, Save, Loader2 } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"

export default function AdminProfilePage() {
    const [loading, setLoading] = useState(true)
    const [updating, setUpdating] = useState(false)
    const [user, setUser] = useState<any>(null)

    // Editable Fields
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")

    // Password Fields
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")

    const supabase = createClient()

    // 1. Fetch User Data
    useEffect(() => {
        async function getProfile() {
            // Get Session first
            const { data: { session } } = await supabase.auth.getSession()

            // Backup: If we have a cookie bypass (Simple Login), current user logic won't work standard way.
            // But lets try finding by email "a@a.com" explicitly if session is null,
            // assuming the dashboard layout confirmed us as admin.

            let email = session?.user.email ?? "a@a.com"; // Default for bypass

            const { data: profile } = await supabase
                .from('profiles')
                .select('*')
                .eq('email', email)
                .single()

            if (profile) {
                setUser(profile)
                setFirstName(profile.first_name || "")
                setLastName(profile.last_name || "")
            }
            setLoading(false)
        }
        getProfile()
    }, [])

    // 2. Update Profile Details
    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault()
        setUpdating(true)
        try {
            const { error } = await supabase
                .from('profiles')
                .update({ first_name: firstName, last_name: lastName })
                .eq('id', user.id)

            if (error) throw error
            toast.success("Profile updated successfully")
            // Update local state display
            setUser({ ...user, first_name: firstName, last_name: lastName })
        } catch (error: any) {
            toast.error(error.message)
        } finally {
            setUpdating(false)
        }
    }

    // 3. Update Password
    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault()
        if (password !== confirmPassword) {
            toast.error("Passwords do not match")
            return
        }
        setUpdating(true)
        const { error } = await supabase.auth.updateUser({ password: password })
        if (error) {
            toast.error(error.message)
        } else {
            toast.success("Password updated successfully")
            setPassword("")
            setConfirmPassword("")
        }
        setUpdating(false)
    }

    if (loading) return <div className="p-8"><Loader2 className="animate-spin h-8 w-8 text-primary" /></div>

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row gap-8 items-start md:items-center bg-card p-8 rounded-xl border shadow-sm">
                <div className="relative">
                    <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-4xl font-bold shadow-md">
                        {firstName?.[0] || user?.email?.[0] || "A"}
                    </div>
                    <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 rounded-full border-2 border-white"></div>
                </div>
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold tracking-tight">{firstName} {lastName}</h1>
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <Mail className="w-4 h-4" />
                        <span>{user?.email}</span>
                        <span className="text-gray-300">|</span>
                        <ShieldCheck className="w-4 h-4 text-blue-500" />
                        <span className="font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full text-xs">Super Admin</span>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="general" className="w-full">
                <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
                    <TabsTrigger value="general">General Information</TabsTrigger>
                    <TabsTrigger value="security">Security</TabsTrigger>
                </TabsList>

                {/* General Info Tab */}
                <TabsContent value="general">
                    <div className="bg-card border rounded-xl p-6 mt-4 shadow-sm max-w-2xl">
                        <div className="flex items-center gap-2 mb-6 text-lg font-semibold border-b pb-4">
                            <User className="w-5 h-5 text-primary" />
                            <h3>Personal Details</h3>
                        </div>

                        <form onSubmit={handleUpdateProfile} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">First Name</label>
                                    <input
                                        className="w-full px-3 py-2 border rounded-md bg-background"
                                        value={firstName}
                                        onChange={e => setFirstName(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Last Name</label>
                                    <input
                                        className="w-full px-3 py-2 border rounded-md bg-background"
                                        value={lastName}
                                        onChange={e => setLastName(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-muted-foreground">Email Address (Read Check)</label>
                                <div className="w-full px-3 py-2 border rounded-md bg-muted text-muted-foreground cursor-not-allowed flex items-center gap-2">
                                    <Lock className="w-3 h-3" /> {user?.email}
                                </div>
                            </div>

                            <div className="pt-4 flex justify-end">
                                <Button type="submit" disabled={updating}>
                                    {updating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                                    Save Changes
                                </Button>
                            </div>
                        </form>
                    </div>
                </TabsContent>

                {/* Security Tab (Existing Logic Refined) */}
                <TabsContent value="security">
                    <div className="bg-card border rounded-xl p-6 mt-4 shadow-sm max-w-2xl">
                        <div className="flex items-center gap-2 mb-6 text-lg font-semibold border-b pb-4">
                            <Lock className="w-5 h-5 text-primary" />
                            <h3>Password & Authentication</h3>
                        </div>
                        <form onSubmit={handleUpdatePassword} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">New Password</label>
                                <input
                                    type="password"
                                    className="w-full px-3 py-2 border rounded-md bg-background"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Confirm Password</label>
                                <input
                                    type="password"
                                    className="w-full px-3 py-2 border rounded-md bg-background"
                                    value={confirmPassword}
                                    onChange={e => setConfirmPassword(e.target.value)}
                                    placeholder="••••••••"
                                />
                            </div>
                            <div className="pt-4 flex justify-end">
                                <Button type="submit" variant="destructive" disabled={updating || !password}>
                                    Update Password
                                </Button>
                            </div>
                        </form>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}
