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
import { Edit2, Trash2, Star } from "lucide-react"

interface MarketingItem {
    id: number
    title: string
    type: string
    target_audience: string | null
    is_featured: boolean
    image_url: string
    start_date: string | null
    end_date: string | null
}

interface MarketingTableProps {
    items: MarketingItem[]
    isLoading: boolean
    onEdit: (item: MarketingItem) => void
    onDelete: (id: number) => void
}

export function MarketingTable({ items, isLoading, onEdit, onDelete }: MarketingTableProps) {
    if (isLoading) {
        return <div>Loading marketing items...</div>
    }

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Preview</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Target</TableHead>
                        <TableHead>Featured</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {items.map((item) => (
                        <TableRow key={item.id}>
                            <TableCell>
                                <img src={item.image_url} alt={item.title} className="w-16 h-10 rounded object-cover" />
                            </TableCell>
                            <TableCell className="font-medium">{item.title}</TableCell>
                            <TableCell className="capitalize">{item.type}</TableCell>
                            <TableCell className="capitalize">{item.target_audience || 'All'}</TableCell>
                            <TableCell>
                                {item.is_featured && <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />}
                            </TableCell>
                            <TableCell className="text-right">
                                <Button variant="ghost" className="h-8 w-8 p-0 mr-2" onClick={() => onEdit(item)}>
                                    <Edit2 className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50" onClick={() => onDelete(item.id)}>
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                    {items.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={6} className="h-24 text-center">
                                No items found.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    )
}
