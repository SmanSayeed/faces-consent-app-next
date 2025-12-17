"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Github, Linkedin, Twitter, Mail, Facebook, Instagram, Youtube, Globe } from "lucide-react"
import { createClient } from "@/lib/supabase"
import Image from "next/image"

// Icon mapping helper
const getIcon = (platform: string) => {
  const p = platform.toLowerCase()
  if (p.includes("github")) return Github
  if (p.includes("linkedin")) return Linkedin
  if (p.includes("twitter")) return Twitter
  if (p.includes("x")) return Twitter
  if (p.includes("facebook")) return Facebook
  if (p.includes("instagram")) return Instagram
  if (p.includes("youtube")) return Youtube
  if (p.includes("email")) return Mail
  return Globe
}

export default function Footer() {
  const currentYear = new Date().getFullYear()
  const [socials, setSocials] = useState<any[]>([])
  const [siteName, setSiteName] = useState("Aptic Studio")
  const [logoUrl, setLogoUrl] = useState("/my-logo.png")
  const supabase = createClient()

  useEffect(() => {
    async function fetchData() {
      const { data: socialData } = await supabase.from("social_links").select("*").eq("is_active", true)
      if (socialData) setSocials(socialData)

      const { data: settings } = await supabase.from("site_settings").select("site_name, logo_url").single()
      if (settings) {
        if (settings.site_name) setSiteName(settings.site_name)
        if (settings.logo_url) setLogoUrl(settings.logo_url)
      }
    }
    fetchData()
  }, [])

  return (
    <footer className="bg-[var(--footer-bg)] text-[var(--footer-text)] border-t border-border py-12 mt-20 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              {/* Fallback to text if logoUrl is broken or empty, but keeping Image for now since it was there */}
              <Image
                src={logoUrl}
                alt={`${siteName} Logo`}
                width={40}
                height={40}
                className="rounded-lg object-cover"
              />
              <span className="font-bold text-inherit text-xl">{siteName}</span>
            </div>
            <p className="text-inherit/70 text-sm max-w-xs">
              Building beautiful and functional digital experiences.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-inherit mb-4">Quick Links</h3>
            <nav className="flex flex-col gap-2">
              <Link href="/" className="text-inherit/70 hover:text-primary transition-colors">
                Home
              </Link>
              <Link href="/projects" className="text-inherit/70 hover:text-primary transition-colors">
                Projects
              </Link>
              <Link href="/team" className="text-inherit/70 hover:text-primary transition-colors">
                Team
              </Link>
              <Link href="/#about" className="text-inherit/70 hover:text-primary transition-colors">
                About
              </Link>
            </nav>
          </div>

          {/* Social */}
          <div>
            <h3 className="font-semibold text-inherit mb-4">Connect</h3>
            <div className="flex gap-4">
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg bg-background/10 hover:bg-primary text-inherit hover:text-white flex items-center justify-center transition-all">
                <Linkedin size={20} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg bg-background/10 hover:bg-primary text-inherit hover:text-white flex items-center justify-center transition-all">
                <Instagram size={20} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg bg-background/10 hover:bg-primary text-inherit hover:text-white flex items-center justify-center transition-all">
                <Twitter size={20} />
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border/20 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-inherit/70 text-sm">&copy; {currentYear} {siteName}. All rights reserved.</p>
          <div className="flex gap-6 text-sm text-inherit/70">
            <a href="#" className="hover:text-primary transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-primary transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
