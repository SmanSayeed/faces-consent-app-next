"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase"
import { VideoTable } from "@/components/admin/video-table"
import { VideoDialog } from "@/components/admin/video-dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { toast } from "sonner"

export default function VideosPage() {
    const [videos, setVideos] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [dialogOpen, setDialogOpen] = useState(false)
    const [editingVideo, setEditingVideo] = useState<any>(null)
    const supabase = createClient()

    const fetchVideos = async () => {
        try {
            const { data, error } = await supabase
                .from("app_videos")
                .select("*")
                .order('created_at', { ascending: false })

            if (error) throw error
            setVideos(data || [])
        } catch (error) {
            console.error("Error fetching videos:", error)
            toast.error("Failed to fetch videos")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchVideos()
    }, [])

    const handleCreate = () => {
        setEditingVideo(null)
        setDialogOpen(true)
    }

    const handleEdit = (video: any) => {
        setEditingVideo(video)
        setDialogOpen(true)
    }

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this video?")) return
        try {
            const { error } = await supabase.from("app_videos").delete().eq("id", id)
            if (error) throw error
            toast.success("Video deleted")
            fetchVideos()
        } catch (error) {
            console.error("Error deleting video:", error)
            toast.error("Failed to delete video")
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">App Videos</h1>
                    <p className="text-muted-foreground">
                        Manage videos displayed on the homepage slider.
                    </p>
                </div>
                <Button onClick={handleCreate}>
                    <Plus className="mr-2 h-4 w-4" /> Add Video
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Video Library</CardTitle>
                </CardHeader>
                <CardContent>
                    <VideoTable
                        videos={videos}
                        isLoading={loading}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />
                </CardContent>
            </Card>

            <VideoDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                videoToEdit={editingVideo}
                onSuccess={fetchVideos}
            />
        </div>
    )
}
