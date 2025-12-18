import { ImageUpload } from "@/components/admin/image-upload"

import { useState } from "react"
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
    DialogTrigger,
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
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

const itemSchema = z.object({
    title: z.string().min(2, "Title must be at least 2 characters"),
    description: z.string().optional(),
    price: z.coerce.number().min(0, "Price must be positive").optional(),
    image_url: z.string().url("Must be a valid URL").optional().or(z.literal("")),
    region_id: z.string().optional(), // We'll convert "all" to null
})

interface ItemDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    itemToEdit?: any
    categoryId: number
    regions: any[]
    onSuccess: () => void
}

export function ItemDialog({ open, onOpenChange, itemToEdit, categoryId, regions, onSuccess }: ItemDialogProps) {
    const [loading, setLoading] = useState(false)
    const supabase = createClient()

    const form = useForm<z.infer<typeof itemSchema>>({
        resolver: zodResolver(itemSchema) as any,
        defaultValues: {
            title: itemToEdit?.title || "",
            description: itemToEdit?.description || "",
            price: itemToEdit?.price || 0,
            image_url: itemToEdit?.image_url || "",
            region_id: itemToEdit?.region_id ? String(itemToEdit.region_id) : "all",
        },
    })

    const onSubmit = async (values: z.infer<typeof itemSchema>) => {
        setLoading(true)
        try {
            const payload: any = {
                category_id: categoryId,
                title: values.title,
                description: values.description,
                price: values.price,
                image_url: values.image_url,
                region_id: values.region_id === "all" ? null : parseInt(values.region_id || "0")
            }

            if (itemToEdit) {
                const { error } = await supabase
                    .from("items")
                    .update(payload)
                    .eq("id", itemToEdit.id)
                if (error) throw error
                toast.success("Item updated")
            } else {
                const { error } = await supabase
                    .from("items")
                    .insert(payload)
                if (error) throw error
                toast.success("Item created")
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
                    <DialogTitle>{itemToEdit ? "Edit Item" : "Add Item"}</DialogTitle>
                    <DialogDescription>
                        {itemToEdit ? "Update item details." : "Add a new service/item to this category."}
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
                                        <Input placeholder="Service Name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Details..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="price"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Price (£)</FormLabel>
                                        <FormControl>
                                            <Input type="number" step="0.01" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="region_id"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Region</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select region" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="all">All Regions</SelectItem>
                                                {regions.map(r => (
                                                    <SelectItem key={r.id} value={String(r.id)}>{r.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>


                        <FormField
                            control={form.control}
                            name="image_url"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Item Image</FormLabel>
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
