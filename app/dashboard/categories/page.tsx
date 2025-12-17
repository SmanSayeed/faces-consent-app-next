"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase"
import { CategoryTable } from "@/components/admin/category-table"
import { CategoryDialog } from "@/components/admin/category-dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { toast } from "sonner"

export default function CategoriesPage() {
    const [categories, setCategories] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [dialogOpen, setDialogOpen] = useState(false)
    const [editingCategory, setEditingCategory] = useState<any>(null)
    const supabase = createClient()

    const fetchCategories = async () => {
        try {
            const { data, error } = await supabase
                .from("categories")
                .select("*")
                .order('id', { ascending: true })

            if (error) throw error
            setCategories(data || [])
        } catch (error) {
            console.error("Error fetching categories:", error)
            toast.error("Failed to fetch categories")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchCategories()
    }, [])

    const handleCreate = () => {
        setEditingCategory(null)
        setDialogOpen(true)
    }

    const handleEdit = (category: any) => {
        setEditingCategory(category)
        setDialogOpen(true)
    }

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this category?")) return
        try {
            const { error } = await supabase.from("categories").delete().eq("id", id)
            if (error) throw error
            toast.success("Category deleted")
            fetchCategories()
        } catch (error) {
            console.error("Error deleting category:", error)
            toast.error("Failed to delete category")
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Category Management</h1>
                    <p className="text-muted-foreground">
                        Manage treatments, training types, and clinic services.
                    </p>
                </div>
                <Button onClick={handleCreate}>
                    <Plus className="mr-2 h-4 w-4" /> Add Category
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>All Categories</CardTitle>
                    <CardDescription>
                        Categories displayed in the app.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <CategoryTable
                        categories={categories}
                        isLoading={loading}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />
                </CardContent>
            </Card>

            <CategoryDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                categoryToEdit={editingCategory}
                onSuccess={fetchCategories}
            />
        </div>
    )
}
