import { getTeamMembers } from "@/app/actions/team"
import Image from "next/image"
import { Linkedin, Twitter, Globe, Github, Dribbble } from "lucide-react"
import Link from "next/link"

export const revalidate = 0 // Dynamic

export default async function TeamPage() {
  const members = await getTeamMembers()

  const socialIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case "linkedin": return <Linkedin size={18} />
      case "twitter": return <Twitter size={18} />
      case "github": return <Github size={18} />
      case "dribbble": return <Dribbble size={18} />
      default: return <Globe size={18} />
    }
  }

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground">Our Team</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Meet the talented individuals driving our success and innovation.
          </p>
        </div>

        {/* Grid */}
        {members.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {members.map((member) => (
              <div key={member.id} className="group bg-card border border-border rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300">
                {/* Image Aspect Ratio Container */}
                <div className="aspect-[4/5] relative bg-muted overflow-hidden">
                  {member.image_url ? (
                    <Image
                      src={member.image_url}
                      alt={member.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-secondary/30 text-muted-foreground">
                      No Image
                    </div>
                  )}

                  {/* Overlay Socials (Visible on Hover or always on mobile? Let's do hover for desktop, always for touch? Simplest is bottom bar) */}
                </div>

                <div className="p-6">
                  <h3 className="font-bold text-xl text-foreground mb-1">{member.name}</h3>
                  <p className="text-primary font-medium mb-3 text-sm">{member.role}</p>
                  <p className="text-muted-foreground text-sm line-clamp-3 mb-4 h-[60px]">{member.bio}</p>

                  {/* Socials */}
                  {member.social_links && member.social_links.length > 0 && (
                    <div className="flex gap-3 mt-auto">
                      {member.social_links.map((link, i) => (
                        <a
                          key={i}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-primary transition-colors"
                        >
                          {socialIcon(link.platform)}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-muted/20 rounded-3xl">
            <p className="text-muted-foreground text-lg">Our team is growing! Check back soon.</p>
          </div>
        )}

        <div className="mt-20 text-center">
          <div className="inline-block p-1 rounded-full bg-secondary/50">
            <Link href="/#contact" className="px-8 py-3 rounded-full bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-all inline-block">
              Join Our Team
            </Link>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">We are always looking for new talent.</p>
        </div>

      </div>
    </div>
  )
}
