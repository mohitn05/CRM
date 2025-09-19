"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Eye, EyeOff, GraduationCap, Lock, Shield, User } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

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
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-indigo-50 to-purple-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Enhanced background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-gradient-to-br from-blue-300/20 to-indigo-300/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-gradient-to-br from-purple-300/20 to-pink-300/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-br from-indigo-200/15 to-purple-200/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }}></div>

        {/* Additional floating elements for more depth */}
        <div className="absolute top-20 right-1/4 w-16 h-16 bg-blue-200/20 rounded-full blur-2xl animate-pulse" style={{ animationDelay: "1.5s" }}></div>
        <div className="absolute bottom-20 left-1/5 w-24 h-24 bg-purple-200/20 rounded-full blur-2xl animate-bounce" style={{ animationDelay: "2.5s" }}></div>
        <div className="absolute top-1/3 left-1/3 w-20 h-20 bg-indigo-200/20 rounded-full blur-xl animate-pulse" style={{ animationDelay: "0.8s" }}></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-white bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 transition-all font-bold px-5 py-3 rounded-2xl shadow-lg hover:shadow-xl backdrop-blur-sm border border-white/30 transform hover:scale-105 duration-300 text-sm md:text-base"
          >
            <ArrowLeft className="h-5 w-5" />
            Back to Home
          </Link>
        </div>

        <Card className="bg-white/50 backdrop-blur-3xl border border-white/40 shadow-3xl hover:shadow-4xl transition-all duration-500">
          <CardHeader className="text-center pb-8">
            {/* Enhanced admin icon */}
            <div className="relative mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 rounded-3xl mx-auto flex items-center justify-center shadow-2xl animate-float hover:rotate-6 transition-all duration-500 transform hover:scale-110">
                <GraduationCap className="h-10 w-10 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center animate-pulse">
                <Shield className="h-3 w-3 text-white" />
              </div>
            </div>

            <CardTitle className="text-3xl font-extrabold bg-gradient-to-r from-blue-700 via-purple-600 to-indigo-800 bg-clip-text text-transparent mb-3">Admin Portal</CardTitle>
            <CardDescription className="text-gray-700 text-lg">
              Secure access to internship management dashboard
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-4">
                <Label htmlFor="username" className="text-gray-800 font-bold flex items-center gap-3 text-lg">
                  <div className="bg-gradient-to-br from-blue-500 to-indigo-500 p-2 rounded-xl shadow-md">
                    <User className="h-5 w-5 text-white" />
                  </div>
                  Username
                </Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  value={credentials.username}
                  onChange={(e) => setCredentials((prev) => ({ ...prev, username: e.target.value }))}
                  required
                  className="bg-white/60 backdrop-blur-sm border-white/50 text-gray-800 placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500/30 h-11 rounded-xl transition-all duration-500 hover:shadow-lg shadow-md"
                />
              </div>

              <div className="space-y-4">
                <Label htmlFor="password" className="text-gray-800 font-bold flex items-center gap-3 text-lg">
                  <div className="bg-gradient-to-br from-indigo-500 to-purple-500 p-2 rounded-xl shadow-md">
                    <Lock className="h-5 w-5 text-white" />
                  </div>
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
                    className="bg-white/60 backdrop-blur-sm border-white/50 text-gray-800 placeholder:text-gray-500 focus:border-indigo-500 focus:ring-indigo-500/30 h-11 rounded-xl pr-12 transition-all duration-500 hover:shadow-lg shadow-md"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-800 text-white font-bold py-4 text-lg rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 group relative overflow-hidden transform hover:scale-105"
                disabled={isLoading}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
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

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Forgot your credentials? Contact your system administrator.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}