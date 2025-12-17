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
import { MoreHorizontal } from "lucide-react"
import Link from "next/link"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface Item {
    id: number
    title: string
    description: string | null
    price: number | null
    image_url: string | null
    region_id: number | null
}

interface ItemTableProps {
    items: Item[]
    regions: any[]
    isLoading: boolean
    onEdit: (item: Item) => void
    onDelete: (id: number) => void
}

export function ItemTable({ items, regions, isLoading, onEdit, onDelete }: ItemTableProps) {
    if (isLoading) {
        return <div>Loading items...</div>
    }

    const getRegionName = (id: number | null) => {
        if (!id) return "All Regions"
        const region = regions.find(r => r.id === id)
        return region ? region.name : "Unknown"
    }

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Image</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Region</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {items.map((item) => (
                        <TableRow key={item.id}>
                            <TableCell>
                                {item.image_url ? (
                                    <img src={item.image_url} alt={item.title} className="w-10 h-10 rounded object-cover" />
                                ) : (
                                    <div className="w-10 h-10 rounded bg-gray-200" />
                                )}
                            </TableCell>
                            <TableCell className="font-medium">
                                <div className="flex flex-col">
                                    <span>{item.title}</span>
                                    <span className="text-xs text-muted-foreground truncate max-w-[200px]">{item.description}</span>
                                </div>
                            </TableCell>
                            <TableCell>
                                {item.price ? `£${item.price}` : '-'}
                            </TableCell>
                            <TableCell>
                                <Badge variant="outline">{getRegionName(item.region_id)}</Badge>
                            </TableCell>
                            <TableCell className="text-right">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                            <span className="sr-only">Open menu</span>
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                        <Link href={`/dashboard/categories/${item.category_id}/items/${item.id}`} passHref>
                                            <DropdownMenuItem asChild>
                                                <span>View details</span>
                                            </DropdownMenuItem>
                                        </Link>
                                        <DropdownMenuItem onClick={() => onEdit(item)}>
                                            Edit item
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem
                                            className="text-red-600"
                                            onClick={() => onDelete(item.id)}
                                        >
                                            Delete item
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))}
                    {items.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={5} className="h-24 text-center">
                                No items found for this category.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    )
}
