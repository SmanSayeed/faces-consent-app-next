"use client"

import { motion } from "framer-motion"
import { ChevronRight } from "lucide-react"
import Link from "next/link"
import { services } from "@/lib/data"

export default function ServicesSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.1 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  }

  return (
    <section id="services" className="relative py-20 bg-background overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">Our Services</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Comprehensive solutions for mobile and game development
          </p>
        </motion.div>

        {/* Services Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {services.map((service) => {
            const Icon = service.icon
            return (
              <motion.div key={service.id} variants={itemVariants}>
                <Link href={`/services/${service.id}`}>
                  <div className="group cursor-pointer h-full">
                    <div className="bg-card border border-border rounded-xl p-8 hover:border-primary transition-all duration-300 h-full hover:bg-muted hover:shadow-lg hover:shadow-primary/20">
                      {/* Icon Container */}
                      <div
                        className={`w-16 h-16 rounded-xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                      >
                        <Icon className="w-8 h-8 text-white" />
                      </div>

                      {/* Content */}
                      <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-[#c084fc] group-hover:to-[#ec4899] group-hover:bg-clip-text transition-all">
                        {service.title}
                      </h3>
                      <p className="text-muted-foreground text-sm leading-relaxed mb-6">{service.description}</p>

                      {/* Learn More Link */}
                      <div className="flex items-center gap-2 text-primary group-hover:text-accent transition-colors">
                        <span className="text-sm font-semibold">Learn More</span>
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
