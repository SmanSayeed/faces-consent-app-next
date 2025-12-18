'use client'

import { useCallback, useState } from "react"
import { createClient } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { ImagePlus, Trash, Upload, FileText, File } from "lucide-react"
import { useDropzone } from "react-dropzone"
import { toast } from "sonner"
import Image from "next/image"

interface FileUploadProps {
    value: string[]
    onChange: (value: string[]) => void
    onRemove: (url: string) => void
    disabled?: boolean
    maxFiles?: number
    bucket?: string
}

export default function FileUpload({
    value,
    onChange,
    onRemove,
    disabled,
    maxFiles = 5,
    bucket = 'images'
}: FileUploadProps) {
    const [loading, setLoading] = useState(false)
    const supabase = createClient()

    // Ensure value is always an array
    const urls = Array.isArray(value) ? value : (value ? [value] : [])

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        if (acceptedFiles.length === 0) return

        if (urls.length + acceptedFiles.length > maxFiles) {
            toast.error(`You can only upload a maximum of ${maxFiles} files.`)
            return
        }

        setLoading(true)
        try {
            const newUrls: string[] = []

            for (const file of acceptedFiles) {
                const fileExt = file.name.split('.').pop()
                const fileName = `${Math.random()}.${fileExt}`
                const filePath = `${fileName}`

                const { error: uploadError } = await supabase.storage
                    .from(bucket)
                    .upload(filePath, file)

                if (uploadError) {
                    throw uploadError
                }

                const { data: { publicUrl } } = supabase.storage
                    .from(bucket)
                    .getPublicUrl(filePath)

                newUrls.push(publicUrl)
            }

            onChange([...urls, ...newUrls])
            toast.success("File(s) uploaded successfully")
        } catch (error: any) {
            console.error("Upload error:", error)
            toast.error("Failed to upload file")
        } finally {
            setLoading(false)
        }
    }, [supabase, urls, maxFiles, onChange, bucket])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/jpeg': [],
            'image/png': [],
            'image/webp': [],
            'image/jpg': [],
            'application/pdf': []
        },
        disabled: disabled || loading || urls.length >= maxFiles,
        maxFiles: maxFiles - urls.length
    })

    const isImage = (url: string) => {
        if (!url) return false
        const cleanUrl = url.split('?')[0].toLowerCase()
        return cleanUrl.match(/\.(jpeg|jpg|gif|png|webp|avif)$/) != null ||
            (url.includes('/storage/v1/object/public/images/') && !cleanUrl.endsWith('.pdf'))
    }

    return (
        <div>
            <div className="mb-4 flex items-center gap-4 flex-wrap">
                {urls.map((url) => (
                    <div key={url} className="relative w-[200px] h-[200px] rounded-md overflow-hidden border group bg-secondary/10 flex items-center justify-center">
                        <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                                type="button"
                                onClick={() => onRemove(url)}
                                variant="destructive"
                                size="sm"
                                disabled={disabled}
                            >
                                <Trash className="h-4 w-4" />
                            </Button>
                        </div>
                        {isImage(url) ? (
                            <Image
                                fill
                                className="object-cover"
                                alt="Uploaded file"
                                src={url}
                            />
                        ) : (
                            <div className="flex flex-col items-center p-2 text-center text-xs break-all">
                                <FileText className="h-10 w-10 mb-2 text-primary" />
                                <a href={url} target="_blank" rel="noopener noreferrer" className="hover:underline text-blue-500">
                                    View File
                                </a>
                            </div>
                        )}
                    </div>
                ))}
            </div>
            <div
                {...getRootProps()}
                className={`
                    border-2 border-dashed rounded-lg p-10 text-center cursor-pointer transition-colors
                    ${isDragActive ? "border-primary bg-secondary/50" : "border-muted-foreground/25 hover:border-primary/50"}
                    ${(disabled || loading || urls.length >= maxFiles) ? "opacity-50 cursor-not-allowed" : ""}
                `}
            >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                    {loading ? (
                        <div className="flex flex-col items-center gap-1">
                            <span className="animate-spin text-primary">
                                <Upload className="h-8 w-8" />
                            </span>
                            <p>Uploading...</p>
                        </div>
                    ) : (
                        <>
                            <Upload className="h-10 w-10 mb-2" />
                            <p className="text-sm font-medium">
                                {isDragActive ? "Drop the files here" : "Drag & drop files here, or click to select"}
                            </p>
                            <p className="text-xs">
                                Images or PDFs (Max {maxFiles} files)
                            </p>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}
