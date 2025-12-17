
import { notFound } from "next/navigation"
import Link from "next/link"
import { ChevronLeft, CheckCircle2 } from "lucide-react"
import { services } from "@/lib/data"

export default async function ServicePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const service = services.find((s) => s.id === id)

    if (!service) {
        notFound()
    }

    const Icon = service.icon

    return (
        <div className="min-h-screen bg-background pt-12 pb-20">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <Link
                    href="/#services"
                    className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors mb-8 group"
                >
                    <ChevronLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                    Back to Services
                </Link>

                {/* Header */}
                <div className="bg-card border border-border rounded-2xl p-8 md:p-12 mb-12">
                    <div
                        className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-8`}
                    >
                        <Icon className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">{service.title}</h1>
                    <p className="text-xl text-muted-foreground leading-relaxed">{service.fullDescription}</p>
                </div>

                {/* Features */}
                <div className="grid md:grid-cols-2 gap-8 mb-12">
                    <div className="bg-card/50 border border-border rounded-xl p-8">
                        <h3 className="text-2xl font-bold text-foreground mb-6">Key Features</h3>
                        <ul className="space-y-4">
                            {service.features.map((feature, index) => (
                                <li key={index} className="flex items-start gap-3">
                                    <CheckCircle2 className="w-6 h-6 text-primary shrink-0" />
                                    <span className="text-lg text-muted-foreground">{feature}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="bg-gradient-to-br from-primary/10 to-accent/10 border border-border rounded-xl p-8 flex flex-col justify-center items-center text-center">
                        <h3 className="text-2xl font-bold text-foreground mb-4">Ready to Start?</h3>
                        <p className="text-muted-foreground mb-8">Let's turn your idea into reality with our expert development team.</p>
                        <Link
                            href="/#contact"
                            className="px-8 py-3 rounded-lg font-bold bg-primary text-primary-foreground hover:opacity-90 transition-opacity w-full sm:w-auto"
                        >
                            Get a Quote
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
