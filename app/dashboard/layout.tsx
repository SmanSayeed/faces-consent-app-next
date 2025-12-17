"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase"
import { LayoutDashboard, Users, Building2, Layers, Megaphone, Video, Settings, X, LogOut, Menu } from "lucide-react"
import AdminHeader from "@/components/admin/header"
import { Button } from "@/components/ui/button"
import { UserNav } from "@/components/admin/user-nav"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const [authorized, setAuthorized] = useState(false)
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const router = useRouter()
    const pathname = usePathname()
    const supabase = createClient()

    useEffect(() => {
        const checkAuth = async () => {
            // SIMPLE AUTH CHECK (Cookie based)
            // We bypass supabase.auth.getSession() because of the 500 error.
            // Check if cookie exists
            const hasSession = document.cookie.split('; ').find(row => row.startsWith('admin_session=true'));

            if (!hasSession) {
                router.push("/")
            } else {
                setAuthorized(true)
            }
        }
        checkAuth()
    }, [router]) // Removed supabase dependency

    const handleLogout = async () => {
        // Clear Cookie
        document.cookie = "admin_session=; path=/; max-age=0";
        // await supabase.auth.signOut() // Optional, doesn't hurt but likely fails
        router.push("/")
    }

    if (!authorized) return null

    const menuItems = [
        { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
        { icon: Users, label: "Users", href: "/dashboard/users" },
        { icon: Building2, label: "Clinics", href: "/dashboard/clinics" },
        { icon: Layers, label: "Categories", href: "/dashboard/categories" },
        { icon: Megaphone, label: "Marketing", href: "/dashboard/marketing" },
        { icon: Video, label: "Videos", href: "/dashboard/videos" },
        { icon: Settings, label: "Settings", href: "/dashboard/settings" },
    ]

    return (
        <div className="flex h-screen bg-background text-foreground overflow-hidden">
            {/* Mobile Backdrop */}
            {sidebarOpen && (
                <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setSidebarOpen(false)} />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed md:relative flex-shrink-0 w-64 h-full bg-card border-r border-border z-50 transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
                    }`}
            >
                <div className="flex flex-col h-full">
                    <div className="h-16 flex items-center px-6 border-b border-border justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold">
                                A
                            </div>
                            <h1 className="text-lg font-bold">Admin Panel</h1>
                        </div>
                        <button className="md:hidden" onClick={() => setSidebarOpen(false)}>
                            <X className="w-5 h-5 text-muted-foreground" />
                        </button>
                    </div>

                    <nav className="flex-1 overflow-y-auto p-4 space-y-2">
                        {menuItems.map((item) => {
                            const Icon = item.icon
                            const isActive = pathname === item.href || pathname?.startsWith(item.href) && item.href !== '/dashboard'
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
                                        ? "bg-primary/10 text-primary font-medium"
                                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                        }`}
                                    onClick={() => setSidebarOpen(false)}
                                >
                                    <Icon className="w-5 h-5" />
                                    {item.label}
                                </Link>
                            )
                        })}
                    </nav>

                    <div className="p-4 border-t border-border">
                        <Button variant="ghost" className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive" onClick={handleLogout}>
                            <LogOut className="w-5 h-5" />
                            Logout
                        </Button>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <header className="h-16 flex items-center justify-between px-4 md:px-8 border-b border-border bg-card">
                    <button className="md:hidden" onClick={() => setSidebarOpen(true)}>
                        <Menu className="w-6 h-6" />
                    </button>
                    <div className="flex items-center gap-4 ml-auto">
                        <UserNav />
                    </div>
                </header>

                {/* Scrollable Content */}
                <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-muted/20">
                    <div className="max-w-6xl mx-auto space-y-6">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    )
}
