"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Mail, Phone, MapPin, Send, Loader2 } from "lucide-react"
import { createClient } from "@/lib/supabase"
import { toast } from "sonner"

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    projectType: "web-development",
    message: "",
  })
  const [loading, setLoading] = useState(false)
  const [contactSettings, setContactSettings] = useState({
    email: "hello@portfolio.com",
    whatsapp: "",
  })
  const supabase = createClient()

  useEffect(() => {
    async function fetchSettings() {
      const { data } = await supabase.from("site_settings").select("*").single()
      if (data) {
        setContactSettings({
          email: data.contact_email || "hello@portfolio.com",
          whatsapp: data.whatsapp_number || "",
        })
      }
    }
    fetchSettings()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error, status } = await supabase.from("contact_messages").insert({
        name: formData.name,
        email: formData.email,
        message: `${formData.message}\n\nPhone: ${formData.phone}\nProject Type: ${formData.projectType}`,
      })

      if (error) throw error

      // Check for success status (201 Created or 204 No Content)
      if (status !== 201 && status !== 204) {
        throw new Error("Failed to send message")
      }

      toast.success("Message sent successfully! I'll get back to you soon.")
      setFormData({ name: "", email: "", phone: "", projectType: "web-development", message: "" })
    } catch (error: any) {
      console.error("Submission error:", error)
      toast.error(error.message || "Failed to send message. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="contact" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">Get In Touch</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Have a project in mind? I'd love to hear about it. Let's connect and create something amazing together.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-16">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-1 flex flex-col gap-6"
          >
            {[
              { icon: Mail, title: "Email", value: contactSettings.email },
              { icon: Phone, title: "WhatsApp", value: contactSettings.whatsapp || "Not configured" },
              { icon: MapPin, title: "Location", value: "Remote / Worldwide" },
            ].map((item, index) => (
              <div key={index} className="flex gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <item.icon size={20} className="text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground font-medium">{item.title}</p>
                  <p className="text-foreground font-semibold break-all">{item.value}</p>
                </div>
              </div>
            ))}
          </motion.div>

          {/* Contact Form */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            onSubmit={handleSubmit}
            className="lg:col-span-2 space-y-4"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleChange}
                required
                className="px-4 py-3 rounded-lg bg-white dark:bg-secondary border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary transition-colors"
                disabled={loading}
              />
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={handleChange}
                required
                className="px-4 py-3 rounded-lg bg-white dark:bg-secondary border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary transition-colors"
                disabled={loading}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="tel"
                name="phone"
                placeholder="Your Phone"
                value={formData.phone}
                onChange={handleChange}
                className="px-4 py-3 rounded-lg bg-white dark:bg-secondary border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary transition-colors"
                disabled={loading}
              />
              <select
                name="projectType"
                value={formData.projectType}
                onChange={handleChange}
                className="px-4 py-3 rounded-lg bg-white dark:bg-secondary border border-border text-foreground focus:outline-none focus:border-primary transition-colors"
                disabled={loading}
              >
                <option value="web-development">Web Development</option>
                <option value="design">Design</option>
                <option value="consulting">Consulting</option>
                <option value="other">Other</option>
              </select>
            </div>

            <textarea
              name="message"
              placeholder="Your Message"
              value={formData.message}
              onChange={handleChange}
              required
              rows={5}
              className="w-full px-4 py-3 rounded-lg bg-white dark:bg-secondary border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary transition-colors resize-none"
              disabled={loading}
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full button-primary flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
              {loading ? "Sending..." : "Send Message"}
            </button>
          </motion.form>
        </div>
      </div>
    </section>
  )
}
