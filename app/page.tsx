"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { checkAdminUser } from "@/app/actions/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // SIMPLE LOGIN BYPASS (Requested by User)
      // Since Supabase Auth is returning 500 (DB Schema Error), we verify against profiles directly using a server action (bypassing RLS).
      console.log("Attempting simple login...");

      // 1. Check Profile Exists & is Admin via Server Action
      const { success, isAdmin, error } = await checkAdminUser(email)

      if (!success) {
        console.error("Profile check error:", error);
        toast.error("Login failed", { description: error || "User not found." });
        setLoading(false);
        return;
      }

      if (!isAdmin) {
        toast.error("Access denied", { description: "Not an admin." });
        setLoading(false);
        return;
      }

      // 2. Simple Password Check (Hardcoded as requested)
      if (password !== '11112222') {
        toast.error("Login failed", { description: "Invalid password." });
        setLoading(false);
        return;
      }

      // 3. Set Fake Session (Cookie)
      document.cookie = "admin_session=true; path=/; max-age=86400"; // 1 day

      toast.success("Login successful");
      router.push("/dashboard");
      router.refresh();

    } catch (err) {
      console.error(err);
      toast.error("An unexpected error occurred");
      setLoading(false);
    }
  }

  return (
    <div className="flex h-screen w-full items-center justify-center bg-gray-100 dark:bg-zinc-950 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Admin Login</CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to access the dashboard
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </CardContent>
          <CardFooter className="mt-4">
            <Button className="w-full" type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
