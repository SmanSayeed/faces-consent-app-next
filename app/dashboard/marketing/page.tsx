"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase"
import { MarketingTable } from "@/components/admin/marketing-table"
import { MarketingDialog } from "@/components/admin/marketing-dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { toast } from "sonner"

export default function MarketingPage() {
    const [items, setItems] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [dialogOpen, setDialogOpen] = useState(false)
    const [editingItem, setEditingItem] = useState<any>(null)
    const supabase = createClient()

    const fetchItems = async () => {
        try {
            const { data, error } = await supabase
                .from("marketing_items")
                .select("*")
                .order('created_at', { ascending: false })

            if (error) throw error
            setItems(data || [])
        } catch (error) {
            console.error("Error fetching items:", error)
            toast.error("Failed to fetch marketing items")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchItems()
    }, [])

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
            const { error } = await supabase.from("marketing_items").delete().eq("id", id)
            if (error) throw error
            toast.success("Item deleted")
            fetchItems()
        } catch (error) {
            console.error("Error deleting item:", error)
            toast.error("Failed to delete item")
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Marketing</h1>
                    <p className="text-muted-foreground">
                        Manage featured items and banner ads.
                    </p>
                </div>
                <Button onClick={handleCreate}>
                    <Plus className="mr-2 h-4 w-4" /> Add Item
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Marketing Items</CardTitle>
                </CardHeader>
                <CardContent>
                    <MarketingTable
                        items={items}
                        isLoading={loading}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />
                </CardContent>
            </Card>

            <MarketingDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                itemToEdit={editingItem}
                onSuccess={fetchItems}
            />
        </div>
    )
}
