"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Eye, EyeOff, GraduationCap, Lock, Mail, Sparkles, User } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import type React from "react"
import { useState } from "react"

export default function InternLoginPage() {
  const [credentials, setCredentials] = useState({
    emailOrPhone: "",
    password: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [forgotPasswordData, setForgotPasswordData] = useState({
    email: "",
    otp: "",
    step: 1, // 1: enter email, 2: enter OTP, 3: reset password
  })
  const { toast } = useToast()
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Check credentials against stored intern accounts
    try {
      const response = await fetch("http://localhost:5000/api/intern/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          emailOrPhone: credentials.emailOrPhone,
          password: credentials.password,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        localStorage.setItem("internAuth", JSON.stringify({
          id: data.student.id,
          name: data.student.name,
          email: data.student.email,
          phone: data.student.phone,
          domain: data.student.domain,
          applicationId: data.student.id,
          status: data.student.status || "Applied",
          dateRegistered: data.student.dateRegistered || new Date().toISOString(),
        }))
        toast({
          title: `🎉 Welcome Back, ${data.student.name}!`,
          description: `✨ Successfully logged in! Taking you to your personalized dashboard...`,
          variant: "success" as any,
        })
        router.push("/intern/dashboard")
      } else {
        toast({
          title: "🚫 Login Failed",
          description: "❌ " + (data.message || "Invalid credentials. Please check your email/phone and password."),
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "😵 Server Connection Error",
        description: "⚠️ Unable to connect to server. Please check your internet connection and try again.",
        variant: "warning" as any,
      })
    } finally {
      setIsLoading(false)
    }
  }
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    if (forgotPasswordData.step === 1) {
      // Send OTP to email via backend
      try {
        const response = await fetch("http://localhost:5000/api/password-reset/request", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: forgotPasswordData.email })
        })
        const data = await response.json()
        if (response.ok) {
          toast({
            title: "📧 OTP Sent Successfully!",
            description: "✨ " + data.message + " Check your inbox and spam folder.",
            variant: "info" as any,
          })
          setForgotPasswordData((prev) => ({ ...prev, step: 2 }))
        } else {
          toast({
            title: "⚠️ OTP Send Failed",
            description: "❌ " + (data.message || "Failed to send OTP. Please try again."),
            variant: "destructive"
          })
        }
      } catch (error) {
        toast({
          title: "🚨 Connection Error",
          description: "⚠️ Unable to connect to server. Please check your connection.",
          variant: "warning" as any,
        })
      }
    } else if (forgotPasswordData.step === 2) {
      // Verify OTP via backend
      try {
        const response = await fetch("http://localhost:5000/api/password-reset/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: forgotPasswordData.email, otp: forgotPasswordData.otp })
        })
        const data = await response.json()
        if (response.ok) {
          toast({
            title: "✅ OTP Verified Successfully!",
            description: "✨ " + data.message + " Now create your new password.",
            variant: "success" as any,
          })
          setForgotPasswordData((prev) => ({ ...prev, step: 3 }))
        } else {
          toast({
            title: "❌ Invalid Verification Code",
            description: "⚠️ " + (data.message || "Please enter the correct 6-digit code from your email."),
            variant: "destructive"
          })
        }
      } catch (error) {
        toast({
          title: "🔍 Verification Error",
          description: "⚠️ Unable to verify code. Please check your connection and try again.",
          variant: "warning" as any,
        })
      }
    } else if (forgotPasswordData.step === 3) {
      // Reset password via backend
      const newPassword = (document.getElementById("newPassword") as HTMLInputElement)?.value
      const confirmNewPassword = (document.getElementById("confirmNewPassword") as HTMLInputElement)?.value
      if (!newPassword || !confirmNewPassword || newPassword !== confirmNewPassword) {
        toast({
          title: "🔓 Password Mismatch",
          description: "⚠️ Passwords do not match. Please ensure both fields are identical.",
          variant: "warning" as any,
        })
        setIsLoading(false)
        return
      }
      try {
        const response = await fetch("http://localhost:5000/api/password-reset/reset", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: forgotPasswordData.email, otp: forgotPasswordData.otp, new_password: newPassword })
        })
        const data = await response.json()
        if (response.ok) {
          toast({
            title: "🎉 Password Reset Successful!",
            description: "✅ " + data.message + " You can now login with your new password.",
            variant: "success" as any,
          })
          setShowForgotPassword(false)
          setForgotPasswordData({ email: "", otp: "", step: 1 })
        } else {
          toast({
            title: "❌ Password Reset Failed",
            description: "⚠️ " + (data.message || "Failed to reset password. Please try again."),
            variant: "destructive"
          })
        }
      } catch (error) {
        toast({
          title: "🔄 Reset Error",
          description: "⚠️ Unable to reset password. Please check your connection and try again.",
          variant: "warning" as any,
        })
      }
    }

    setIsLoading(false)
  }

  if (showForgotPassword) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
        {/* Enhanced Background */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <svg className="absolute top-0 left-0 w-full h-full" viewBox="0 0 1200 800" preserveAspectRatio="none" fill="none">
            <defs>
              <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.15" />
                <stop offset="50%" stopColor="#1d4ed8" stopOpacity="0.1" />
                <stop offset="100%" stopColor="#1e40af" stopOpacity="0.05" />
              </linearGradient>
            </defs>
            <path d="M0,150 Q200,50 400,120 T800,100 Q1000,80 1200,140 L1200,0 L0,0 Z" fill="url(#gradient1)" />
          </svg>
        </div>
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-32 h-32 bg-blue-200/10 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute bottom-32 right-20 w-40 h-40 bg-indigo-100/20 rounded-full blur-2xl animate-pulse" style={{ animationDelay: "2s" }}></div>
        </div>

        {/* Header */}
        <header className="relative z-30 bg-white/10 backdrop-blur-xl border-b border-white/20 shadow-lg">
          <div className="w-full px-6 py-4">
            <button
              onClick={() => setShowForgotPassword(false)}
              className="group relative overflow-hidden bg-white/20 backdrop-blur-md hover:bg-white/30 text-gray-700 hover:text-blue-700 border border-white/40 hover:border-blue-400/60 rounded-2xl px-6 py-3 font-semibold shadow-lg hover:shadow-xl transition-all duration-500 transform hover:scale-105"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/10 to-blue-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
              <div className="relative flex items-center gap-2">
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
                Back to Login
              </div>
            </button>
          </div>
        </header>

        <div className="relative z-20 flex flex-col items-center justify-center py-8 px-6">
          <div className="w-full max-w-md">
            <div className="text-center mb-6">
              <div className="relative mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-xl mx-auto transform hover:scale-110 transition-transform duration-500 group">
                  <Lock className="h-8 w-8 text-white group-hover:rotate-12 transition-transform duration-500" />
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center animate-pulse shadow-lg">
                  <Sparkles className="w-3 h-3 text-white" />
                </div>
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-indigo-800 to-purple-800 bg-clip-text text-transparent mb-2">
                Reset Password
              </h1>
              <p className="text-gray-600 text-base font-medium">
                {forgotPasswordData.step === 1 && "Enter your email address"}
                {forgotPasswordData.step === 2 && "Enter the verification code"}
                {forgotPasswordData.step === 3 && "Create a new password"}
              </p>
            </div>

            <Card className="bg-white/20 backdrop-blur-xl border border-white/30 shadow-2xl hover:shadow-3xl transition-all duration-500 rounded-3xl overflow-hidden">
              <CardHeader className="text-center pb-4 bg-gradient-to-r from-white/10 via-white/5 to-white/10 border-b border-white/20">
                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-gray-800 via-indigo-700 to-purple-700 bg-clip-text text-transparent mb-2 flex items-center justify-center gap-3">
                  <div className="p-1.5 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg">
                    <Lock className="w-5 h-5 text-white" />
                  </div>
                  Password Recovery
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={handleForgotPassword} className="space-y-5">
                  {forgotPasswordData.step === 1 && (
                    <div className="space-y-2">
                      <Label htmlFor="email" className="flex items-center gap-2 text-gray-700 text-sm font-semibold">
                        <div className="p-1 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg text-white shadow-lg">
                          <Mail className="w-3 h-3" />
                        </div>
                        <span>Email Address *</span>
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email address"
                        value={forgotPasswordData.email}
                        onChange={(e) => setForgotPasswordData((prev) => ({ ...prev, email: e.target.value }))}
                        required
                        className="bg-white/70 backdrop-blur-sm border-white/60 text-gray-800 placeholder:text-gray-500 focus:border-blue-400 focus:ring-blue-400/20 h-10 rounded-xl text-sm font-medium shadow-inner"
                      />
                    </div>
                  )}

                  {forgotPasswordData.step === 2 && (
                    <div className="space-y-2">
                      <Label htmlFor="otp" className="flex items-center gap-2 text-gray-700 text-sm font-semibold">
                        <div className="p-1 bg-gradient-to-r from-green-500 to-teal-600 rounded-lg text-white shadow-lg">
                          <Lock className="w-3 h-3" />
                        </div>
                        <span>Verification Code *</span>
                      </Label>
                      <Input
                        id="otp"
                        type="text"
                        placeholder="Enter 6-digit code"
                        value={forgotPasswordData.otp}
                        onChange={(e) => setForgotPasswordData((prev) => ({ ...prev, otp: e.target.value }))}
                        required
                        className="bg-white/70 backdrop-blur-sm border-white/60 text-gray-800 placeholder:text-gray-500 focus:border-green-400 focus:ring-green-400/20 h-10 rounded-xl text-sm font-medium shadow-inner"
                      />
                      <p className="text-xs text-gray-600">Check your email for the verification code.</p>
                    </div>
                  )}

                  {forgotPasswordData.step === 3 && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="newPassword" className="flex items-center gap-2 text-gray-700 text-sm font-semibold">
                          <div className="p-1 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg text-white shadow-lg">
                            <Lock className="w-3 h-3" />
                          </div>
                          <span>New Password *</span>
                        </Label>
                        <Input
                          id="newPassword"
                          type="password"
                          placeholder="Enter new password"
                          required
                          className="bg-white/70 backdrop-blur-sm border-white/60 text-gray-800 placeholder:text-gray-500 focus:border-purple-400 focus:ring-purple-400/20 h-10 rounded-xl text-sm font-medium shadow-inner"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirmNewPassword" className="flex items-center gap-2 text-gray-700 text-sm font-semibold">
                          <div className="p-1 bg-gradient-to-r from-pink-500 to-red-600 rounded-lg text-white shadow-lg">
                            <Lock className="w-3 h-3" />
                          </div>
                          <span>Confirm New Password *</span>
                        </Label>
                        <Input
                          id="confirmNewPassword"
                          type="password"
                          placeholder="Confirm new password"
                          required
                          className="bg-white/70 backdrop-blur-sm border-white/60 text-gray-800 placeholder:text-gray-500 focus:border-pink-400 focus:ring-pink-400/20 h-10 rounded-xl text-sm font-medium shadow-inner"
                        />
                      </div>
                    </>
                  )}

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="group relative overflow-hidden w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 text-white font-bold py-4 text-lg rounded-2xl shadow-xl hover:shadow-2xl hover:shadow-indigo-500/30 transition-all duration-700 transform hover:scale-105 border-2 border-white/20"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1200"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="relative flex items-center justify-center gap-3">
                      {isLoading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          Processing...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-5 h-5 group-hover:rotate-180 transition-transform duration-700" />
                          {forgotPasswordData.step === 1
                            ? "Send Verification Code"
                            : forgotPasswordData.step === 2
                              ? "Verify Code"
                              : "Reset Password"}
                        </>
                      )}
                    </div>
                    <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition-opacity duration-500 -z-10"></div>
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
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
                  <GraduationCap className="w-7 h-7 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-pulse"></div>
              </div>
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-800 via-blue-700 to-purple-700 bg-clip-text text-transparent">
                  InternPro CRM
                </h2>
                <p className="text-sm text-gray-600 font-medium">Student Dashboard Access</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/">
                <button className="group relative overflow-hidden bg-white/20 backdrop-blur-md hover:bg-white/30 text-gray-700 hover:text-blue-700 border border-white/40 hover:border-blue-400/60 rounded-2xl px-6 py-3 font-semibold shadow-lg hover:shadow-xl transition-all duration-500 transform hover:scale-105">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/10 to-blue-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                  <div className="relative flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
                    <span>Back to Home</span>
                  </div>
                </button>
              </Link>
              <Link href="/apply">
                <button className="group relative overflow-hidden bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-600 hover:via-teal-600 hover:to-cyan-600 text-white rounded-2xl px-6 py-3 font-semibold shadow-xl hover:shadow-2xl hover:shadow-emerald-500/30 transition-all duration-500 transform hover:scale-105">
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                  <div className="relative flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
                    Register
                  </div>
                </button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Enhanced Login Form */}
      <div className="relative z-20 flex flex-col items-center justify-center py-8 px-6">
        <div className="w-full max-w-md">
          <div className="text-center mb-6">
            <div className="relative mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl mx-auto transform hover:scale-110 transition-transform duration-500 group">
                <User className="h-8 w-8 text-white group-hover:rotate-12 transition-transform duration-500" />
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center animate-pulse shadow-lg">
                <Sparkles className="w-3 h-3 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-2">
              Welcome Back!
            </h1>
            <p className="text-gray-600 text-base font-medium">
              Sign in to your intern dashboard
            </p>
          </div>

          <Card className="bg-white/20 backdrop-blur-xl border border-white/30 shadow-2xl hover:shadow-3xl transition-all duration-500 rounded-3xl overflow-hidden">
            <CardHeader className="text-center pb-4 bg-gradient-to-r from-white/10 via-white/5 to-white/10 border-b border-white/20">
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-gray-800 via-blue-700 to-purple-700 bg-clip-text text-transparent mb-2 flex items-center justify-center gap-3">
                <div className="p-1.5 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
                  <User className="w-5 h-5 text-white" />
                </div>
                Intern Login
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleLogin} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="emailOrPhone" className="flex items-center gap-2 text-gray-700 text-sm font-semibold">
                    <div className="p-1 bg-gradient-to-r from-green-500 to-teal-600 rounded-lg text-white shadow-lg">
                      <Mail className="w-3 h-3" />
                    </div>
                    <span>Email or Phone Number *</span>
                  </Label>
                  <Input
                    id="emailOrPhone"
                    type="text"
                    placeholder="Enter email or phone number"
                    value={credentials.emailOrPhone}
                    onChange={(e) => setCredentials((prev) => ({ ...prev, emailOrPhone: e.target.value }))}
                    required
                    className="bg-white/70 backdrop-blur-sm border-white/60 text-gray-800 placeholder:text-gray-500 focus:border-green-400 focus:ring-green-400/20 h-10 rounded-xl text-sm font-medium shadow-inner"
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

                <div className="text-right">
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(true)}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium underline hover:no-underline transition-all duration-300"
                  >
                    Forgot Password?
                  </button>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="group relative overflow-hidden w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white font-bold py-4 text-lg rounded-2xl shadow-xl hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-700 transform hover:scale-105 border-2 border-white/20"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1200"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative flex items-center justify-center gap-3">
                    {isLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Signing In...
                      </>
                    ) : (
                      <>
                        <User className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                        Sign In
                        <Sparkles className="w-5 h-5 group-hover:rotate-180 transition-transform duration-700" />
                      </>
                    )}
                  </div>
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition-opacity duration-500 -z-10"></div>
                </Button>

                <div className="text-center mt-4">
                  <p className="text-gray-600 text-sm">
                    Don't have an account?{" "}
                    <Link href="/apply" className="text-blue-600 hover:text-blue-700 font-semibold underline hover:no-underline transition-all duration-300">
                      Register here
                    </Link>
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
