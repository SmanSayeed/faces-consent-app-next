
"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { createClient } from "@/lib/supabase"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, MapPin, Tag, User, DollarSign, Calendar } from "lucide-react"
import Link from "next/link"
import Image from "next/image" // We might need to unoptimize if external
import { toast } from "sonner"

export default function ItemDetailsPage() {
    const params = useParams()
    // Resolving params properly
    const categoryId = Array.isArray(params.id) ? params.id[0] : params.id
    const itemId = Array.isArray(params.itemId) ? params.itemId[0] : params.itemId

    const [item, setItem] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [category, setCategory] = useState<any>(null)
    const [clinic, setClinic] = useState<any>(null)
    const [region, setRegion] = useState<any>(null)

    const supabase = createClient()

    useEffect(() => {
        async function fetchData() {
            if (!itemId) return

            try {
                // 1. Fetch Item
                const { data: itemData, error } = await supabase
                    .from('items')
                    .select('*')
                    .eq('id', itemId)
                    .single()

                if (error) throw error
                setItem(itemData)

                // 2. Fetch Dependent Data (Parallel)
                // We use Promise.allSettled to avoid failing everything if one lookup fails
                const [catRes, clinicRes, regionRes] = await Promise.allSettled([
                    supabase.from('categories').select('*').eq('id', itemData.category_id).single(),
                    itemData.owner_id ? supabase.from('profiles').select('*').eq('id', itemData.owner_id).single() : Promise.resolve({ data: null }),
                    itemData.region_id ? supabase.from('regions').select('*').eq('id', itemData.region_id).single() : Promise.resolve({ data: null })
                ])

                if (catRes.status === 'fulfilled') setCategory(catRes.value.data)
                if (clinicRes.status === 'fulfilled') setClinic(clinicRes.value.data)
                if (regionRes.status === 'fulfilled') setRegion(regionRes.value.data)

            } catch (err) {
                console.error(err)
                toast.error("Failed to load item details")
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [itemId])

    if (loading) return <div className="p-10">Loading Details...</div>
    if (!item) return <div className="p-10">Item not found.</div>

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <Link href={`/dashboard/categories/${categoryId}/items`}>
                <Button variant="ghost" className="pl-0 gap-2 mb-4">
                    <ArrowLeft className="w-4 h-4" /> Back to List
                </Button>
            </Link>

            {/* Header Section */}
            <div className="flex flex-col md:flex-row gap-6">
                {/* Image */}
                <div className="w-full md:w-1/3 aspect-square relative rounded-xl overflow-hidden border bg-muted">
                    {item.image_url ? (
                        <img
                            src={item.image_url}
                            alt={item.title}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="flex items-center justify-center h-full text-muted-foreground">No Image</div>
                    )}
                </div>

                {/* Main Info */}
                <div className="flex-1 space-y-4">
                    <div>
                        <Badge variant="outline" className="mb-2">{category?.title || "Unknown Category"}</Badge>
                        <h1 className="text-3xl font-bold">{item.title}</h1>
                        <div className="text-2xl font-semibold text-primary mt-2 flex items-center gap-1">
                            <DollarSign className="w-5 h-5" />
                            {item.price ? item.price : "Variable / Free"}
                        </div>
                    </div>

                    <p className="text-muted-foreground leading-relaxed">
                        {item.description || "No description provided for this service."}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                        <Card className="shadow-none border bg-muted/20">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                    <User className="w-4 h-4" /> Provider (Clinic)
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="font-semibold">{clinic?.first_name || "Platform Admin"} {clinic?.last_name}</div>
                                <div className="text-xs text-muted-foreground">{clinic ? "Verified Partner" : "System Default"}</div>
                            </CardContent>
                        </Card>

                        <Card className="shadow-none border bg-muted/20">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                    <MapPin className="w-4 h-4" /> Region / Location
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="font-semibold">{region?.name || "Global / Online"}</div>
                                <div className="text-xs text-muted-foreground">Service Area</div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Additional Meta Data */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">System Metadata</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex justify-between border-b pb-2">
                        <span>System ID:</span>
                        <span className="font-mono">{item.id}</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                        <span>Created At:</span>
                        <span>{new Date(item.created_at).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Status:</span>
                        <span className="text-green-600 font-medium">Active (Visible in App)</span>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
