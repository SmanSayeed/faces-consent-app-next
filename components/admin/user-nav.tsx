"use client"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { User, Settings, LogOut } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase"

export function UserNav() {
    const router = useRouter()
    const [initials, setInitials] = useState("AD")
    const [email, setEmail] = useState("admin@faces.com")
    const supabase = createClient()

    useEffect(() => {
        async function getUser() {
            const { data: { session } } = await supabase.auth.getSession()
            const userEmail = session?.user?.email || "admin@faces.com"
            setEmail(userEmail)

            // Try to fetch profile for name
            const { data: profile } = await supabase.from('profiles').select('first_name, last_name').eq('email', userEmail).single()

            if (profile?.first_name) {
                setInitials(`${profile.first_name[0]}${profile.last_name?.[0] || ''}`.toUpperCase())
            } else {
                setInitials(userEmail.substring(0, 2).toUpperCase())
            }
        }
        getUser()
    }, [])

    const handleLogout = () => {
        // Clear Cookies
        document.cookie = "admin_session=; path=/; max-age=0";
        document.cookie = "admin-secret-access=; path=/; max-age=0";
        router.push("/")
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-9 w-9 border border-border">
                        <AvatarImage src="/professional-headshot.png" alt="@admin" />
                        <AvatarFallback className="bg-primary/10 text-primary font-bold">{initials}</AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">Administrator</p>
                        <p className="text-xs leading-none text-muted-foreground">
                            {email}
                        </p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <Link href="/dashboard/profile">
                        <DropdownMenuItem className="cursor-pointer">
                            <User className="mr-2 h-4 w-4" />
                            <span>Profile</span>
                            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                        </DropdownMenuItem>
                    </Link>
                    <Link href="/dashboard/settings">
                        <DropdownMenuItem className="cursor-pointer">
                            <Settings className="mr-2 h-4 w-4" />
                            <span>Settings</span>
                            <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                        </DropdownMenuItem>
                    </Link>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600 cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                    <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
