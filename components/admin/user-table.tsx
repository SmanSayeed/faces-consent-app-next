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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface User {
    id: string
    email: string
    first_name: string
    last_name: string
    image_url?: string
    is_clinic: boolean
    active_as_clinic: boolean
    created_at: string
    // Added for location support
    location?: {
        current_lat: number
        current_long: number
    }
}

interface UserTableProps {
    users: User[]
    isLoading: boolean
    onEdit: (user: User) => void
    onDelete: (id: string) => void
}

export function UserTable({ users, isLoading, onEdit, onDelete }: UserTableProps) {
    if (isLoading) {
        return <div>Loading users...</div>
    }

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Joined</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {users.map((user) => (
                        <TableRow key={user.id}>
                            <TableCell className="font-medium">
                                <div className="flex items-center gap-2">
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src={user.image_url} alt={user.first_name} />
                                        <AvatarFallback>{user.first_name?.[0]}{user.last_name?.[0]}</AvatarFallback>
                                    </Avatar>
                                    <span>{user.first_name} {user.last_name}</span>
                                </div>
                            </TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>
                                {user.is_clinic ? (
                                    <Badge variant="default">Clinic</Badge>
                                ) : (
                                    <Badge variant="secondary">User</Badge>
                                )}
                            </TableCell>
                            <TableCell>
                                {user.location ? (
                                    <a
                                        href={`https://www.google.com/maps/search/?api=1&query=${user.location.current_lat},${user.location.current_long}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:underline text-sm flex items-center gap-1"
                                    >
                                        View Map
                                    </a>
                                ) : (
                                    <span className="text-muted-foreground text-sm">N/A</span>
                                )}
                            </TableCell>
                            <TableCell>
                                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Active</Badge>
                            </TableCell>
                            <TableCell>
                                {new Date(user.created_at).toLocaleDateString()}
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
                                        <DropdownMenuItem
                                            onClick={() => navigator.clipboard.writeText(user.id)}
                                        >
                                            Copy User ID
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem onClick={() => onEdit(user)}>Edit User</DropdownMenuItem>
                                        <DropdownMenuItem
                                            className="text-red-600"
                                            onClick={() => onDelete(user.id)}
                                        >
                                            Ban / Delete User
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))}
                    {users.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={7} className="h-24 text-center">
                                No users found.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    )
}
