"use client"

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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

const categorySchema = z.object({
    title: z.string().min(2, "Title must be at least 2 characters"),
    type: z.enum(["treatment", "training", "clinic_service"]),
    image_url: z.string().url("Must be a valid URL").optional().or(z.literal("")),
})

interface CategoryDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    categoryToEdit?: any
    onSuccess: () => void
}

export function CategoryDialog({ open, onOpenChange, categoryToEdit, onSuccess }: CategoryDialogProps) {
    const [loading, setLoading] = useState(false)
    const supabase = createClient()

    const form = useForm<z.infer<typeof categorySchema>>({
        resolver: zodResolver(categorySchema),
        defaultValues: {
            title: categoryToEdit?.title || "",
            type: categoryToEdit?.type || "treatment",
            image_url: categoryToEdit?.image_url || "",
        },
    })

    const onSubmit = async (values: z.infer<typeof categorySchema>) => {
        setLoading(true)
        try {
            if (categoryToEdit) {
                const { error } = await supabase
                    .from("categories")
                    .update(values)
                    .eq("id", categoryToEdit.id)
                if (error) throw error
                toast.success("Category updated")
            } else {
                const { error } = await supabase
                    .from("categories")
                    .insert(values)
                if (error) throw error
                toast.success("Category created")
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
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{categoryToEdit ? "Edit Category" : "Add Category"}</DialogTitle>
                    <DialogDescription>
                        {categoryToEdit ? "Update existing category details." : "Create a new category for the platform."}
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
                                        <Input placeholder="e.g. Anti Wrinkle" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
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
                                            <SelectItem value="treatment">Treatment</SelectItem>
                                            <SelectItem value="training">Training</SelectItem>
                                            <SelectItem value="clinic_service">Clinic Service</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="image_url"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Image URL</FormLabel>
                                    <FormControl>
                                        <Input placeholder="https://..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter>
                            <Button type="submit" disabled={loading}>
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {categoryToEdit ? "Update" : "Create"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
