"use client"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Edit2, Trash2, List } from "lucide-react"
import Link from "next/link"

interface Category {
    id: number
    title: string
    type: string
    image_url: string | null
    is_active: boolean
}

interface CategoryTableProps {
    categories: Category[]
    isLoading: boolean
    onEdit: (category: Category) => void
    onDelete: (id: number) => void
}

export function CategoryTable({ categories, isLoading, onEdit, onDelete }: CategoryTableProps) {
    if (isLoading) {
        return <div>Loading categories...</div>
    }

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Image</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {categories.map((category) => (
                        <TableRow key={category.id}>
                            <TableCell>
                                {category.image_url ? (
                                    <img src={category.image_url} alt={category.title} className="w-10 h-10 rounded object-cover" />
                                ) : (
                                    <div className="w-10 h-10 rounded bg-gray-200" />
                                )}
                            </TableCell>
                            <TableCell className="font-medium">{category.title}</TableCell>
                            <TableCell>
                                <Badge variant="secondary" className="capitalize">{category.type.replace('_', ' ')}</Badge>
                            </TableCell>
                            <TableCell>
                                {category.is_active ? <Badge className="bg-green-500">Active</Badge> : <Badge variant="destructive">Inactive</Badge>}
                            </TableCell>
                            <TableCell className="text-right">
                                <Link href={`/dashboard/categories/${category.id}/items`}>
                                    <Button variant="ghost" className="h-8 w-8 p-0 mr-2" title="Manage Services">
                                        <List className="h-4 w-4" />
                                    </Button>
                                </Link>
                                <Button variant="ghost" className="h-8 w-8 p-0 mr-2" onClick={() => onEdit(category)}>
                                    <Edit2 className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50" onClick={() => onDelete(category.id)}>
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                    {categories.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={5} className="h-24 text-center">
                                No categories found.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    )
}
