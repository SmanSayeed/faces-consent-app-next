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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

const marketingSchema = z.object({
    title: z.string().min(2, "Title is too short"),
    image_url: z.string().url("Must be a valid URL"),
    description: z.string().optional(),
    type: z.enum(["course", "clinic_ad", "product", "insurance", "finance"]),
    target_audience: z.enum(["user", "clinic", "all"]),
    is_featured: z.boolean().default(false),
})

interface MarketingDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    itemToEdit?: any
    onSuccess: () => void
}

export function MarketingDialog({ open, onOpenChange, itemToEdit, onSuccess }: MarketingDialogProps) {
    const [loading, setLoading] = useState(false)
    const supabase = createClient()

    const form = useForm<z.infer<typeof marketingSchema>>({
        resolver: zodResolver(marketingSchema) as any,
        defaultValues: {
            title: "",
            image_url: "",
            description: "",
            type: "product",
            target_audience: "all",
            is_featured: false,
        },
    })

    useEffect(() => {
        if (itemToEdit) {
            form.reset({
                title: itemToEdit.title,
                image_url: itemToEdit.image_url,
                description: itemToEdit.description || "",
                type: itemToEdit.type,
                target_audience: itemToEdit.target_audience,
                is_featured: itemToEdit.is_featured,
            })
        } else {
            form.reset({
                title: "",
                image_url: "",
                description: "",
                type: "product",
                target_audience: "all",
                is_featured: false,
            })
        }
    }, [itemToEdit, form])

    const onSubmit = async (values: z.infer<typeof marketingSchema>) => {
        setLoading(true)
        try {
            if (itemToEdit) {
                const { error } = await supabase
                    .from("marketing_items")
                    .update(values)
                    .eq("id", itemToEdit.id)
                if (error) throw error
                toast.success("Marketing item updated")
            } else {
                const { error } = await supabase
                    .from("marketing_items")
                    .insert(values)
                if (error) throw error
                toast.success("Marketing item created")
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
                    <DialogTitle>{itemToEdit ? "Edit Marketing Item" : "Create Marketing Item"}</DialogTitle>
                    <DialogDescription>
                        Manage ads, banners, and featured content.
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
                                        <Input placeholder="Ad Title" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />


                        <FormField
                            control={form.control}
                            name="image_url"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Marketing Image</FormLabel>
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
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="type"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Type</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select type" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="course">Course</SelectItem>
                                                <SelectItem value="clinic_ad">Clinic Ad</SelectItem>
                                                <SelectItem value="product">Product</SelectItem>
                                                <SelectItem value="insurance">Insurance</SelectItem>
                                                <SelectItem value="finance">Finance</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="target_audience"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Target Audience</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select audience" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="all">All</SelectItem>
                                                <SelectItem value="user">User Only</SelectItem>
                                                <SelectItem value="clinic">Clinic Only</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <FormField
                            control={form.control}
                            name="is_featured"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                    <div className="space-y-0.5">
                                        <FormLabel className="text-base">Featured</FormLabel>
                                        <div className="text-sm text-muted-foreground">
                                            Show in the main featured slider?
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
                                {itemToEdit ? "Update" : "Create"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
