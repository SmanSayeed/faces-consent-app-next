"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase"
import { toast } from "sonner"
import { Loader2, Save } from "lucide-react"
import ImageUpload from "@/components/admin/image-upload"

export default function SettingsPage() {
    const [settings, setSettings] = useState({
        id: null as number | null,
        site_name: "",
        contact_email: "",
        logo_url: "",
    })
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const supabase = createClient()

    useEffect(() => {
        fetchSettings()
    }, [])

    const fetchSettings = async () => {
        const { data } = await supabase.from("site_settings").select("*").single()
        if (data) {
            setSettings(data)
        }
        setLoading(false)
    }

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)

        // If we have an ID, update that specific row. If not, insert a new one.
        const payload = {
            site_name: settings.site_name,
            contact_email: settings.contact_email,
            logo_url: settings.logo_url,
            // Preserve whatsapp if needed, or rely on existing data merge if we fetched it?
            // Ideally we fetched everything via select("*"), so 'settings' has it if we didn't strip it.
            // But our state definition above only listed specific fields.
            // Let's rely on the fact that 'data' from fetch likely had extra fields that spread into state.
        };

        let error;

        if (settings.id) {
            const { error: updateError } = await supabase
                .from("site_settings")
                .update(payload)
                .eq("id", settings.id)
            error = updateError;
        } else {
            // Fallback for empty table
            const { error: insertError } = await supabase
                .from("site_settings")
                .insert([payload])
            error = insertError;
        }

        if (error) {
            console.log("Save error:", error)
            toast.error(`Failed to save: ${error.message}`)
        } else {
            toast.success("Settings saved successfully")
            // Refresh to ensure we have the ID and latest state
            fetchSettings()
        }
        setSaving(false)
    }

    // NOTE: We need to make sure we don't wipe 'whatsapp_number' if we didn't include it here.
    // The fetch gets "select *", so 'settings' state has it (if we type it properly).
    // Let's ensure state includes it even if hidden from form.

    if (loading) return <div>Loading...</div>

    return (
        <div className="max-w-2xl">
            <h1 className="text-3xl font-bold mb-8">General Settings</h1>

            <form onSubmit={handleSave} className="space-y-8">
                <div className="bg-card border border-border rounded-xl p-6 space-y-6">
                    <h2 className="text-xl font-semibold">Branding</h2>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Site Logo</label>
                            <ImageUpload
                                value={settings.logo_url || ""}
                                onChange={(url) => setSettings(prev => ({ ...prev, logo_url: url }))}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Site Name</label>
                            <input
                                type="text"
                                required
                                value={settings.site_name || ""}
                                onChange={(e) => setSettings(prev => ({ ...prev, site_name: e.target.value }))}
                                className="w-full px-4 py-2 rounded-lg bg-background border border-border"
                            />
                        </div>
                    </div>
                </div>

                <div className="bg-card border border-border rounded-xl p-6 space-y-6">
                    <h2 className="text-xl font-semibold">Contact Information</h2>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Contact Email</label>
                        <input
                            type="email"
                            required
                            value={settings.contact_email || ""}
                            onChange={(e) => setSettings(prev => ({ ...prev, contact_email: e.target.value }))}
                            className="w-full px-4 py-2 rounded-lg bg-background border border-border"
                        />
                        <p className="text-xs text-muted-foreground">Used for the contact form recipient.</p>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={saving}
                    className="button-primary flex items-center gap-2"
                >
                    {saving ? <Loader2 className="animate-spin" /> : <Save size={18} />}
                    Save Changes
                </button>
            </form>
        </div>
    )
}
