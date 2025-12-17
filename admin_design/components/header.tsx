"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, ChevronDown, Monitor, Smartphone, Palette, Code, Folder, Layers, Star } from "lucide-react"
import MobileDrawer from "./mobile-drawer"
import Image from "next/image"
import ThemeToggle from "./theme-toggle"
import { createClient } from "@/lib/supabase"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function Header() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [siteName, setSiteName] = useState("Aptic Studio")
  const [logoUrl, setLogoUrl] = useState("/my-logo.png")
  const pathname = usePathname()
  const supabase = createClient()

  useEffect(() => {
    async function fetchSettings() {
      const { data } = await supabase.from("site_settings").select("site_name, logo_url").single()
      if (data) {
        if (data.site_name) setSiteName(data.site_name)
        if (data.logo_url) setLogoUrl(data.logo_url)
      }
    }
    fetchSettings()
  }, [])

  const getLink = (href: string) => {
    if (href.startsWith("#") && pathname !== "/") {
      return `/${href}`
    }
    return href
  }

  // Helper to determine if a generic link is active is tricky with hash, so we'll just stick to simple hover styles
  const navContent = (
    <div className="hidden md:flex items-center gap-1">
      <Link href={getLink("#home")} className="px-4 py-2 rounded-lg text-foreground hover:bg-muted transition-colors font-medium">
        Home
      </Link>

      {/* Services Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center gap-1 px-4 py-2 rounded-lg text-foreground hover:bg-muted transition-colors font-medium focus:outline-none">
          Services <ChevronDown size={14} className="opacity-50" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-[300px] p-2">
          <DropdownMenuItem asChild>
            <Link href={getLink("#services")} className="flex items-start gap-3 p-3 cursor-pointer">
              <div className="p-2 bg-blue-500/10 rounded-md text-blue-500">
                <Monitor size={20} />
              </div>
              <div>
                <div className="font-semibold text-foreground">Web Development</div>
                <p className="text-xs text-muted-foreground mt-0.5">High-performance React & Next.js apps</p>
              </div>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={getLink("#services")} className="flex items-start gap-3 p-3 cursor-pointer">
              <div className="p-2 bg-purple-500/10 rounded-md text-purple-500">
                <Smartphone size={20} />
              </div>
              <div>
                <div className="font-semibold text-foreground">App Development</div>
                <p className="text-xs text-muted-foreground mt-0.5">iOS & Android solutions</p>
              </div>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={getLink("#services")} className="flex items-start gap-3 p-3 cursor-pointer">
              <div className="p-2 bg-pink-500/10 rounded-md text-pink-500">
                <Palette size={20} />
              </div>
              <div>
                <div className="font-semibold text-foreground">UI/UX Design</div>
                <p className="text-xs text-muted-foreground mt-0.5">Beautiful user interfaces</p>
              </div>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Projects Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center gap-1 px-4 py-2 rounded-lg text-foreground hover:bg-muted transition-colors font-medium focus:outline-none">
          Projects <ChevronDown size={14} className="opacity-50" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-[300px] p-2">
          <DropdownMenuItem asChild>
            <Link href={getLink("#projects")} className="flex items-start gap-3 p-3 cursor-pointer">
              <div className="p-2 bg-orange-500/10 rounded-md text-orange-500">
                <Folder size={20} />
              </div>
              <div>
                <div className="font-semibold text-foreground">All Projects</div>
                <p className="text-xs text-muted-foreground mt-0.5">View our complete portfolio</p>
              </div>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={getLink("#projects")} className="flex items-start gap-3 p-3 cursor-pointer">
              <div className="p-2 bg-green-500/10 rounded-md text-green-500">
                <Star size={20} />
              </div>
              <div>
                <div className="font-semibold text-foreground">Featured</div>
                <p className="text-xs text-muted-foreground mt-0.5">Our highlight styling</p>
              </div>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Link href="/team" className="px-4 py-2 rounded-lg text-foreground hover:bg-muted transition-colors font-medium">
        Team
      </Link>
    </div>
  )

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 glass-effect border-b border-border backdrop-blur-lg bg-background/80">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <Image
              src={logoUrl}
              alt={`${siteName} Logo`}
              width={40}
              height={40}
              className="rounded-lg group-hover:scale-110 transition-transform object-cover"
            />
            <span className="font-bold text-lg hidden sm:inline text-foreground">{siteName}</span>
          </Link>

          {/* Desktop Navigation */}
          {navContent}

          {/* Contact Button & Mobile Menu */}
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link
              href={getLink("#contact")}
              className="hidden md:inline-flex px-6 py-2 rounded-lg font-semibold bg-gradient-to-r from-[#c084fc] to-[#ec4899] text-white hover:shadow-lg hover:shadow-[#ec4899]/50 transition-all font-medium"
            >
              Contact Me
            </Link>
            <button
              aria-label="Toggle mobile menu"
              className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
              onClick={() => setIsDrawerOpen(true)}
            >
              <Menu size={24} className="text-foreground" />
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Drawer */}
      <MobileDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />

      {/* Spacer for fixed header */}
      <div className="h-20" />
    </>
  )
}
