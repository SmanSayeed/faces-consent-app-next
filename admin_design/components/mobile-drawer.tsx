"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { X, Monitor, Smartphone, Palette, Folder, Star, ChevronDown } from "lucide-react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

interface MobileDrawerProps {
  isOpen: boolean
  onClose: () => void
}

export default function MobileDrawer({ isOpen, onClose }: MobileDrawerProps) {
  const pathname = usePathname()

  const getLink = (href: string) => {
    if (href.startsWith("#") && pathname !== "/") {
      return `/${href}`
    }
    return href
  }

  return (
    <>
      {/* Backdrop */}
      {isOpen && <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={onClose} />}

      {/* Drawer */}
      <div
        className={`fixed left-0 top-0 h-full w-80 bg-background border-r border-border z-50 transform transition-transform duration-300 md:hidden overflow-y-auto ${isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <div className="p-6 flex flex-col gap-6">
          {/* Close Button */}
          <button onClick={onClose} className="self-end p-2 hover:bg-muted rounded-lg">
            <X size={24} className="text-foreground" />
          </button>

          {/* Navigation Items */}
          <nav className="flex flex-col gap-2">
            <Link
              href={getLink("#home")}
              className="text-lg font-semibold text-foreground hover:text-primary transition-colors px-4 py-3 rounded-lg hover:bg-muted"
              onClick={onClose}
            >
              Home
            </Link>

            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="services" className="border-none">
                <AccordionTrigger className="text-lg font-semibold text-foreground hover:text-primary px-4 py-3 hover:no-underline hover:bg-muted rounded-lg">
                  Services
                </AccordionTrigger>
                <AccordionContent className="pb-2 pt-1 px-4">
                  <div className="flex flex-col gap-2 pl-4 border-l border-border ml-2">
                    <Link href={getLink("#services")} onClick={onClose} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted group">
                      <div className="p-1.5 bg-blue-500/10 rounded-md text-blue-500">
                        <Monitor size={16} />
                      </div>
                      <span className="font-medium text-foreground group-hover:text-primary">Web Development</span>
                    </Link>
                    <Link href={getLink("#services")} onClick={onClose} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted group">
                      <div className="p-1.5 bg-purple-500/10 rounded-md text-purple-500">
                        <Smartphone size={16} />
                      </div>
                      <span className="font-medium text-foreground group-hover:text-primary">App Development</span>
                    </Link>
                    <Link href={getLink("#services")} onClick={onClose} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted group">
                      <div className="p-1.5 bg-pink-500/10 rounded-md text-pink-500">
                        <Palette size={16} />
                      </div>
                      <span className="font-medium text-foreground group-hover:text-primary">UI/UX Design</span>
                    </Link>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="projects" className="border-none">
                <AccordionTrigger className="text-lg font-semibold text-foreground hover:text-primary px-4 py-3 hover:no-underline hover:bg-muted rounded-lg">
                  Projects
                </AccordionTrigger>
                <AccordionContent className="pb-2 pt-1 px-4">
                  <div className="flex flex-col gap-2 pl-4 border-l border-border ml-2">
                    <Link href={getLink("#projects")} onClick={onClose} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted group">
                      <div className="p-1.5 bg-orange-500/10 rounded-md text-orange-500">
                        <Folder size={16} />
                      </div>
                      <span className="font-medium text-foreground group-hover:text-primary">All Projects</span>
                    </Link>
                    <Link href={getLink("#projects")} onClick={onClose} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted group">
                      <div className="p-1.5 bg-green-500/10 rounded-md text-green-500">
                        <Star size={16} />
                      </div>
                      <span className="font-medium text-foreground group-hover:text-primary">Featured</span>
                    </Link>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <Link
              href="/team"
              className="text-lg font-semibold text-foreground hover:text-primary transition-colors px-4 py-3 rounded-lg hover:bg-muted"
              onClick={onClose}
            >
              Team
            </Link>

            <Link href={getLink("#contact")} className="button-primary mt-4 text-center mx-4" onClick={onClose}>
              Contact Me
            </Link>
          </nav>
        </div>
      </div>
    </>
  )
}
