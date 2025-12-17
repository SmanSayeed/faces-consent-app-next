"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase"
import { ItemTable } from "@/components/admin/item-table"
import { ItemDialog } from "@/components/admin/item-dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, ArrowLeft } from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"

export default function ItemsPage() {
    const params = useParams()
    const router = useRouter()
    const categoryId = parseInt(Array.isArray(params.id) ? params.id[0] : params.id || "0")

    const [items, setItems] = useState<any[]>([])
    const [regions, setRegions] = useState<any[]>([])
    const [category, setCategory] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [dialogOpen, setDialogOpen] = useState(false)
    const [editingItem, setEditingItem] = useState<any>(null)
    const supabase = createClient()

    const fetchData = async () => {
        if (!categoryId) return
        try {
            // Fetch items
            const { data: itemsData, error: itemsError } = await supabase
                .from("items")
                .select("*")
                .eq("category_id", categoryId)
                .order('id', { ascending: true })
            if (itemsError) throw itemsError

            // Fetch category details
            const { data: catData, error: catError } = await supabase
                .from("categories")
                .select("*")
                .eq("id", categoryId)
                .single()
            if (catError) throw catError

            // Fetch regions
            const { data: regionsData, error: regionsError } = await supabase
                .from("regions")
                .select("*")
            if (regionsError) throw regionsError

            setItems(itemsData || [])
            setCategory(catData)
            setRegions(regionsData || [])
            setLoading(false)
        } catch (error) {
            console.error("Error fetching data:", error)
            toast.error("Failed to fetch data")
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [categoryId])

    const handleCreate = () => {
        setEditingItem(null)
        setDialogOpen(true)
    }

    const handleEdit = (item: any) => {
        setEditingItem(item)
        setDialogOpen(true)
    }

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this item?")) return
        try {
            const { error } = await supabase.from("items").delete().eq("id", id)
            if (error) throw error
            toast.success("Item deleted")
            fetchData()
        } catch (error) {
            console.error("Error deleting item:", error)
            toast.error("Failed to delete item")
        }
    }

    if (loading) return <div className="p-8">Loading...</div>

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/dashboard/categories">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div className="flex-1">
                    <h1 className="text-3xl font-bold tracking-tight">Services: {category?.title}</h1>
                    <p className="text-muted-foreground">
                        Manage items available under {category?.title}.
                    </p>
                </div>
                <Button onClick={handleCreate}>
                    <Plus className="mr-2 h-4 w-4" /> Add Item
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Items List</CardTitle>
                </CardHeader>
                <CardContent>
                    <ItemTable
                        items={items}
                        regions={regions}
                        isLoading={loading}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />
                </CardContent>
            </Card>

            <ItemDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                itemToEdit={editingItem}
                categoryId={categoryId}
                regions={regions}
                onSuccess={fetchData}
            />
        </div>
    )
}
