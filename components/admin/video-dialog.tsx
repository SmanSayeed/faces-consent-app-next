import { ImageUpload } from "@/components/admin/image-upload"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { createClient } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

const videoSchema = z.object({
    title: z.string().optional(),
    video_url: z.string().url("Must be a valid URL"),
    thumbnail_url: z.string().url("Must be a valid URL").optional().or(z.literal("")),
    is_active: z.boolean().default(true),
})

interface VideoDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    videoToEdit?: any
    onSuccess: () => void
}

export function VideoDialog({ open, onOpenChange, videoToEdit, onSuccess }: VideoDialogProps) {
    const [loading, setLoading] = useState(false)
    const supabase = createClient()

    const form = useForm<z.infer<typeof videoSchema>>({
        resolver: zodResolver(videoSchema) as any,
        defaultValues: {
            title: "",
            video_url: "",
            thumbnail_url: "",
            is_active: true,
        },
    })

    useEffect(() => {
        if (videoToEdit) {
            form.reset({
                title: videoToEdit.title || "",
                video_url: videoToEdit.video_url || "",
                thumbnail_url: videoToEdit.thumbnail_url || "",
                is_active: videoToEdit.is_active ?? true,
            })
        } else {
            form.reset({
                title: "",
                video_url: "",
                thumbnail_url: "",
                is_active: true,
            })
        }
    }, [videoToEdit, form])

    const onSubmit = async (values: z.infer<typeof videoSchema>) => {
        setLoading(true)
        try {
            if (videoToEdit) {
                const { error } = await supabase
                    .from("app_videos")
                    .update(values)
                    .eq("id", videoToEdit.id)
                if (error) throw error
                toast.success("Video updated")
            } else {
                const { error } = await supabase
                    .from("app_videos")
                    .insert(values)
                if (error) throw error
                toast.success("Video created")
            }
            onSuccess()
            onOpenChange(false)
            form.reset()
        } catch (error) {
            console.error(error)
            toast.error("Something went wrong")
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle>{videoToEdit ? "Edit Video" : "Add Video"}</DialogTitle>
                    <DialogDescription>
                        Manage videos for the app homepage.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Title</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Video Title" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="video_url"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Video URL</FormLabel>
                                    <FormControl>
                                        <Input placeholder="https://..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />




                        <FormField
                            control={form.control}
                            name="thumbnail_url"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Thumbnail Image</FormLabel>
                                    <FormControl>
                                        <ImageUpload
                                            value={field.value ? [field.value] : []}
                                            onChange={(urls) => field.onChange(urls[0] || "")}
                                            onRemove={() => field.onChange("")}
                                            disabled={loading}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="is_active"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                    <div className="space-y-0.5">
                                        <FormLabel className="text-base">Active</FormLabel>
                                        <div className="text-sm text-muted-foreground">
                                            Show this video in the app slider?
                                        </div>
                                    </div>
                                    <FormControl>
                                        <Switch
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <DialogFooter>
                            <Button type="submit" disabled={loading}>
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {videoToEdit ? "Update" : "Add"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
