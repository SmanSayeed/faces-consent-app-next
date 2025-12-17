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
import { Edit2, Trash2, Play } from "lucide-react"

interface Video {
    id: number
    title: string | null
    video_url: string
    thumbnail_url: string | null
    is_active: boolean
}

interface VideoTableProps {
    videos: Video[]
    isLoading: boolean
    onEdit: (video: Video) => void
    onDelete: (id: number) => void
}

export function VideoTable({ videos, isLoading, onEdit, onDelete }: VideoTableProps) {
    if (isLoading) {
        return <div>Loading videos...</div>
    }

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Thumbnail</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>URL</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {videos.map((video) => (
                        <TableRow key={video.id}>
                            <TableCell>
                                {video.thumbnail_url ? (
                                    <img src={video.thumbnail_url} alt={video.title || "Video"} className="w-16 h-10 rounded object-cover" />
                                ) : (
                                    <div className="w-16 h-10 rounded bg-gray-200 flex items-center justify-center">
                                        <Play className="h-4 w-4 text-gray-500" />
                                    </div>
                                )}
                            </TableCell>
                            <TableCell className="font-medium">{video.title || "Untitled"}</TableCell>
                            <TableCell className="max-w-[200px] truncate">
                                <a href={video.video_url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                                    {video.video_url}
                                </a>
                            </TableCell>
                            <TableCell>
                                {video.is_active ? <Badge className="bg-green-500">Active</Badge> : <Badge variant="destructive">Inactive</Badge>}
                            </TableCell>
                            <TableCell className="text-right">
                                <Button variant="ghost" className="h-8 w-8 p-0 mr-2" onClick={() => onEdit(video)}>
                                    <Edit2 className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50" onClick={() => onDelete(video.id)}>
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                    {videos.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={5} className="h-24 text-center">
                                No videos found.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    )
}
