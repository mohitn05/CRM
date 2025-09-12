"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Building2, Eye, EyeOff, Lock, Shield, Sparkles, User } from "lucide-react"
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
        title: "🚀 Welcome Back, Admin!",
        description: "✨ Authentication successful! Redirecting to your powerful dashboard...",
        variant: "success" as any,
      })
      setTimeout(() => {
        router.push("/admin/dashboard")
      }, 1000)
    } else {
      toast({
        title: "🔐 Access Denied",
        description: "❌ Invalid credentials detected. Please verify your username and password.",
        variant: "destructive",
      })
    }

    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
      {/* Enhanced Geometric Wave Background SVG */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <svg
          className="absolute top-0 left-0 w-full h-full"
          viewBox="0 0 1200 800"
          preserveAspectRatio="none"
          fill="none"
        >
          <defs>
            <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.15" />
              <stop offset="50%" stopColor="#1d4ed8" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#1e40af" stopOpacity="0.05" />
            </linearGradient>
            <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.12" />
              <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#1d4ed8" stopOpacity="0.04" />
            </linearGradient>
            <linearGradient id="gradient3" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#93c5fd" stopOpacity="0.1" />
              <stop offset="50%" stopColor="#60a5fa" stopOpacity="0.06" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.03" />
            </linearGradient>
          </defs>
          <path d="M0,150 Q200,50 400,120 T800,100 Q1000,80 1200,140 L1200,0 L0,0 Z" fill="url(#gradient1)" />
          <path d="M0,250 Q300,150 600,220 T1200,200 L1200,0 L0,0 Z" fill="url(#gradient2)" opacity="0.8" />
          <path d="M0,600 Q400,500 800,580 T1200,560 L1200,800 L0,800 Z" fill="url(#gradient3)" opacity="0.7" />
        </svg>
      </div>

      {/* Floating geometric shapes */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-200/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-indigo-300/15 rounded-full blur-lg animate-bounce" style={{ animationDelay: "1s" }}></div>
        <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-blue-100/20 rounded-full blur-2xl animate-pulse" style={{ animationDelay: "2s" }}></div>
      </div>

      {/* Enhanced Professional Header */}
      <header className="relative z-30 bg-white/10 backdrop-blur-xl border-b border-white/20 shadow-lg">
        <div className="w-full px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl transform hover:scale-110 transition-transform duration-300">
                  <Building2 className="w-7 h-7 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-pulse"></div>
              </div>
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-800 via-blue-700 to-purple-700 bg-clip-text text-transparent">
                  Admin Portal
                </h2>
                <p className="text-sm text-gray-600 font-medium">Management Dashboard Access</p>
              </div>
            </div>
            <Link
              href="/"
              className="group relative overflow-hidden bg-white/20 backdrop-blur-md hover:bg-white/30 text-gray-700 hover:text-blue-700 border border-white/40 hover:border-blue-400/60 rounded-2xl px-6 py-3 font-semibold shadow-lg hover:shadow-xl transition-all duration-500 transform hover:scale-105"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/10 to-blue-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
              <div className="relative flex items-center gap-2">
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
                <span>Back to Home</span>
              </div>
            </Link>
          </div>
        </div>
      </header>

      {/* Enhanced Login Form */}
      <div className="relative z-20 flex flex-col items-center justify-center py-8 px-6">
        <div className="w-full max-w-md">
          <div className="text-center mb-6">
            <div className="relative mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl mx-auto transform hover:scale-110 transition-transform duration-500 group">
                <Building2 className="h-8 w-8 text-white group-hover:rotate-12 transition-transform duration-500" />
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center animate-pulse shadow-lg">
                <Shield className="w-3 h-3 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-2">
              Admin Access
            </h1>
            <p className="text-gray-600 text-base font-medium">
              Secure management dashboard login
            </p>
          </div>

          <Card className="bg-white/20 backdrop-blur-xl border border-white/30 shadow-2xl hover:shadow-3xl transition-all duration-500 rounded-3xl overflow-hidden">
            <CardHeader className="text-center pb-4 bg-gradient-to-r from-white/10 via-white/5 to-white/10 border-b border-white/20">
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-gray-800 via-blue-700 to-purple-700 bg-clip-text text-transparent mb-2 flex items-center justify-center gap-3">
                <div className="p-1.5 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                Secure Login
              </CardTitle>
              <CardDescription className="text-gray-600 text-base font-medium">
                Enter your admin credentials
              </CardDescription>
            </CardHeader>

            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="username" className="flex items-center gap-2 text-gray-700 text-sm font-semibold">
                    <div className="p-1 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg text-white shadow-lg">
                      <User className="w-3 h-3" />
                    </div>
                    <span>Username *</span>
                  </Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="Enter your username"
                    value={credentials.username}
                    onChange={(e) => setCredentials((prev) => ({ ...prev, username: e.target.value }))}
                    required
                    className="bg-white/70 backdrop-blur-sm border-white/60 text-gray-800 placeholder:text-gray-500 focus:border-blue-400 focus:ring-blue-400/20 h-10 rounded-xl text-sm font-medium shadow-inner"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="flex items-center gap-2 text-gray-700 text-sm font-semibold">
                    <div className="p-1 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg text-white shadow-lg">
                      <Lock className="w-3 h-3" />
                    </div>
                    <span>Password *</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={credentials.password}
                      onChange={(e) => setCredentials((prev) => ({ ...prev, password: e.target.value }))}
                      required
                      className="bg-white/70 backdrop-blur-sm border-white/60 text-gray-800 placeholder:text-gray-500 focus:border-purple-400 focus:ring-purple-400/20 h-10 rounded-xl text-sm font-medium shadow-inner pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800 transition-colors duration-300"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="group relative overflow-hidden w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white font-bold py-4 text-lg rounded-2xl shadow-xl hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-700 transform hover:scale-105 border-2 border-white/20"
                  disabled={isLoading}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1200"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative">
                    {isLoading ? (
                      <div className="flex items-center justify-center gap-3">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Authenticating...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-3">
                        <Building2 className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                        <span>Access Dashboard</span>
                        <Sparkles className="h-5 w-5 group-hover:rotate-180 transition-transform duration-700" />
                      </div>
                    )}
                  </div>
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition-opacity duration-500 -z-10"></div>
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}