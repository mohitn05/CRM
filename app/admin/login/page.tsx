"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Shield, Lock, User, Eye, EyeOff, Building2 } from "lucide-react"
import Link from "next/link"

export default function AdminLoginPage() {
  const [credentials, setCredentials] = useState({ username: "", password: "" })
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate authentication with loading animation
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Simple authentication (in real app, this would be server-side)
    if (credentials.username === "admin" && credentials.password === "admin123") {
      localStorage.setItem("adminAuth", "true")
      toast({
        title: "🎉 Login Successful",
        description: "Welcome back! Redirecting to dashboard...",
      })
      setTimeout(() => {
        router.push("/admin/dashboard")
      }, 1000)
    } else {
      toast({
        title: "❌ Authentication Failed",
        description: "Invalid credentials. Please check your username and password.",
        variant: "destructive",
      })
    }

    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-mint-50 to-green-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-emerald-200/30 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-green-200/20 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-700 hover:text-gray-900 mb-8 transition-colors group"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>

        <Card className="bg-white/30 backdrop-blur-2xl border border-white/30 shadow-2xl">
          <CardHeader className="text-center pb-8">
            {/* Admin icon */}
            <div className="relative mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-green-600 rounded-3xl mx-auto flex items-center justify-center shadow-2xl">
                <Building2 className="h-10 w-10 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-400 rounded-full flex items-center justify-center animate-pulse">
                <Shield className="h-3 w-3 text-green-800" />
              </div>
            </div>

            <CardTitle className="text-3xl font-black text-gray-800 mb-2">Admin Portal</CardTitle>
            <CardDescription className="text-gray-600 text-lg">
              Secure access to internship management dashboard
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="username" className="text-gray-700 font-semibold flex items-center gap-2">
                  <User className="h-4 w-4 text-emerald-600" />
                  Username
                </Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  value={credentials.username}
                  onChange={(e) => setCredentials((prev) => ({ ...prev, username: e.target.value }))}
                  required
                  className="bg-white/50 backdrop-blur-sm border-white/40 text-gray-800 placeholder:text-gray-500 focus:border-emerald-400 focus:ring-emerald-400/20 h-12 rounded-xl"
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="password" className="text-gray-700 font-semibold flex items-center gap-2">
                  <Lock className="h-4 w-4 text-green-600" />
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={credentials.password}
                    onChange={(e) => setCredentials((prev) => ({ ...prev, password: e.target.value }))}
                    required
                    className="bg-white/50 backdrop-blur-sm border-white/40 text-gray-800 placeholder:text-gray-500 focus:border-green-400 focus:ring-green-400/20 h-12 rounded-xl pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-bold py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group relative overflow-hidden"
                disabled={isLoading}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                {isLoading ? (
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Authenticating...
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    Sign In to Dashboard
                    <Shield className="h-5 w-5 group-hover:scale-110 transition-transform" />
                  </div>
                )}
              </Button>
            </form>

            {/* Demo credentials with green styling */}
            {/* <div className="mt-8 p-6 bg-gradient-to-r from-emerald-500/10 to-green-500/10 backdrop-blur-sm border border-emerald-400/20 rounded-2xl">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-gray-800 font-semibold text-sm">Demo Access</span>
              </div>
              <div className="space-y-2 text-gray-700 text-sm">
                <div className="flex justify-between">
                  <span>Username:</span>
                  <code className="bg-white/30 px-2 py-1 rounded font-mono">admin</code>
                </div>
                <div className="flex justify-between">
                  <span>Password:</span>
                  <code className="bg-white/30 px-2 py-1 rounded font-mono">admin123</code>
                </div>
              </div>
            </div> */}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
