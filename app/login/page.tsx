"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { useAppStore } from "@/lib/store"
import { authService } from "@/lib/auth"
import { Github, Mail, AlertCircle, Loader2 } from "lucide-react"
import Link from "next/link"

export default function LoginPage() {
  const router = useRouter()
  const { login, isAuthenticated } = useAppStore()

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [socialLoading, setSocialLoading] = useState<"github" | "google" | null>(null)
  const [error, setError] = useState("")

  // Redirect if already authenticated
  if (isAuthenticated) {
    router.push("/")
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const userData = await authService.loginWithEmail(formData.email, formData.password)

      login({
        id: userData.id,
        username: userData.username,
        email: userData.email,
        avatar: userData.avatar,
        reputation: 1250,
        joinDate: "2023-01-15",
        badges: ["Contributor", "Helper"],
      })

      router.push("/")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDemoLogin = () => {
    setFormData({ email: "demo@example.com", password: "demo" })
  }

  const handleSocialLogin = async (provider: "github" | "google") => {
    setSocialLoading(provider)
    setError("")

    try {
      await authService[provider === "github" ? "loginWithGitHub" : "loginWithGoogle"]()
    } catch (err) {
      setError(`${provider} login failed. Please try again.`)
      setSocialLoading(null)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link href="/" className="flex items-center justify-center space-x-2 mb-6">
            <div className="flex items-center gap-2">
  <img
    src="data:image/jpeg;base64,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"
    alt="Odoo Logo"
    className="h-8 w-auto"
  />
  
</div>
            <span className="text-2xl font-bold text-gray-900">StackIt</span>
          </Link>
          <h2 className="text-2xl font-bold text-gray-900">Sign in to your account</h2>
          <p className="mt-2 text-sm text-gray-600">
            Or{" "}
            <Link href="/register" className="font-medium text-purple-600 hover:text-purple-500">
              create a new account
            </Link>
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Welcome back</CardTitle>
            <CardDescription>Sign in to ask questions, provide answers, and join the community.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Demo Login */}
            <Alert className="bg-purple-50 border-purple-200">
              <AlertCircle className="h-4 w-4 text-purple-600" />
              <AlertDescription className="text-purple-800">
                <strong>Demo:</strong> Use email: demo@example.com, password: demo
                <Button
                  variant="outline"
                  size="sm"
                  className="ml-2 h-6 text-xs bg-transparent"
                  onClick={handleDemoLogin}
                  disabled={isLoading}
                >
                  Fill Demo
                </Button>
              </AlertDescription>
            </Alert>

            {/* Social Login */}
            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full bg-transparent"
                type="button"
                onClick={() => handleSocialLogin("github")}
                disabled={isLoading || socialLoading !== null}
              >
                {socialLoading === "github" ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Github className="h-4 w-4 mr-2" />
                )}
                Continue with GitHub
              </Button>
              <Button
                variant="outline"
                className="w-full bg-transparent"
                type="button"
                onClick={() => handleSocialLogin("google")}
                disabled={isLoading || socialLoading !== null}
              >
                {socialLoading === "google" ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Mail className="h-4 w-4 mr-2" />
                )}
                Continue with Google
              </Button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">Or continue with email</span>
              </div>
            </div>

            {/* Email Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                  placeholder="Enter your email"
                  required
                  className="mt-1"
                  disabled={isLoading || socialLoading !== null}
                />
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link href="/forgot-password" className="text-sm text-purple-600 hover:text-purple-500">
                    Forgot password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                  placeholder="Enter your password"
                  required
                  className="mt-1"
                  disabled={isLoading || socialLoading !== null}
                />
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700"
                disabled={isLoading || socialLoading !== null}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign in"
                )}
              </Button>
            </form>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{" "}
                <Link href="/register" className="font-medium text-purple-600 hover:text-purple-500">
                  Sign up for free
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center">
          <p className="text-xs text-gray-500">
            By signing in, you agree to our{" "}
            <Link href="/terms" className="text-purple-600 hover:text-purple-500">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-purple-600 hover:text-purple-500">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
