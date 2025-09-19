"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Eye, EyeOff, Lock, Mail, User } from "lucide-react"
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
          title: "Login Successful 🎉",
          description: `Welcome back, ${data.student.name}`,
        })
        router.push("/intern/dashboard")
      } else {
        toast({
          title: "Login Failed ❌",
          description: data.message || "Invalid credentials",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Server Error ❌",
        description: "Unable to connect to server",
        variant: "destructive",
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
          toast({ title: "OTP Sent! 📧", description: data.message })
          setForgotPasswordData((prev) => ({ ...prev, step: 2 }))
        } else {
          toast({ title: "Error", description: data.message || "Failed to send OTP", variant: "destructive" })
        }
      } catch (error) {
        toast({ title: "Server Error", description: "Unable to connect to server", variant: "destructive" })
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
          toast({ title: "OTP Verified! ✅", description: data.message })
          setForgotPasswordData((prev) => ({ ...prev, step: 3 }))
        } else {
          toast({ title: "Invalid OTP ❌", description: data.message || "Please enter the correct verification code.", variant: "destructive" })
        }
      } catch (error) {
        toast({ title: "Server Error", description: "Unable to connect to server", variant: "destructive" })
      }
    } else if (forgotPasswordData.step === 3) {
      // Reset password via backend
      const newPassword = (document.getElementById("newPassword") as HTMLInputElement)?.value
      const confirmNewPassword = (document.getElementById("confirmNewPassword") as HTMLInputElement)?.value
      if (!newPassword || !confirmNewPassword || newPassword !== confirmNewPassword) {
        toast({ title: "Password Mismatch", description: "Passwords do not match.", variant: "destructive" })
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
          toast({ title: "Password Reset Successful! ✅", description: data.message })
          setShowForgotPassword(false)
          setForgotPasswordData({ email: "", otp: "", step: 1 })
        } else {
          toast({ title: "Error", description: data.message || "Failed to reset password", variant: "destructive" })
        }
      } catch (error) {
        toast({ title: "Server Error", description: "Unable to connect to server", variant: "destructive" })
      }
    }

    setIsLoading(false)
  }

  if (showForgotPassword) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-100 via-indigo-50 to-purple-100 relative overflow-hidden">
        {/* Enhanced Header */}
        <header className="relative z-20 flex items-center justify-between p-4 md:p-6 bg-white/20 backdrop-blur-md border-b border-white/30">
          <button
            onClick={() => setShowForgotPassword(false)}
            className="inline-flex items-center gap-2 text-white bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 transition-all font-bold px-5 py-3 rounded-2xl shadow-lg hover:shadow-xl backdrop-blur-sm border border-white/30 transform hover:scale-105 duration-300 text-sm md:text-base"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Login
          </button>
        </header>

        {/* Enhanced Background Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -left-40 w-96 h-96 bg-gradient-to-br from-blue-300/20 to-indigo-300/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-gradient-to-br from-purple-300/20 to-pink-300/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-br from-indigo-200/15 to-purple-200/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }}></div>
        </div>

        <div className="relative z-10 container mx-auto px-4 py-8 flex items-center justify-center min-h-[calc(100vh-100px)]">
          <div className="max-w-md mx-auto w-full">
            <Card className="bg-white/50 backdrop-blur-3xl border border-white/40 shadow-3xl">
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-3xl font-extrabold bg-gradient-to-r from-blue-700 via-purple-600 to-indigo-800 bg-clip-text text-transparent mb-3">Reset Password</CardTitle>
                <p className="text-gray-700 text-lg">
                  {forgotPasswordData.step === 1 && "Enter your email or phone number"}
                  {forgotPasswordData.step === 2 && "Enter the verification code"}
                  {forgotPasswordData.step === 3 && "Create a new password"}
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleForgotPassword} className="space-y-8">
                  {forgotPasswordData.step === 1 && (
                    <div className="space-y-4">
                      <Label htmlFor="email" className="text-gray-800 font-bold flex items-center gap-3 text-lg">
                        <div className="bg-gradient-to-br from-blue-500 to-indigo-500 p-2 rounded-xl">
                          <Mail className="w-5 h-5 text-white" />
                        </div>
                        Email Address
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email address"
                        value={forgotPasswordData.email}
                        onChange={(e) => setForgotPasswordData((prev) => ({ ...prev, email: e.target.value }))}
                        required
                        className="bg-white/60 backdrop-blur-sm border-white/50 text-gray-800 placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500/30 h-11 rounded-xl transition-all duration-500 hover:shadow-lg shadow-md"
                      />
                    </div>
                  )}

                  {forgotPasswordData.step === 2 && (
                    <div className="space-y-4">
                      <Label htmlFor="otp" className="text-gray-800 font-bold flex items-center gap-3 text-lg">
                        <div className="bg-gradient-to-br from-indigo-500 to-purple-500 p-2 rounded-xl">
                          <Mail className="w-5 h-5 text-white" />
                        </div>
                        Verification Code
                      </Label>
                      <Input
                        id="otp"
                        type="text"
                        placeholder="Enter 6-digit code"
                        value={forgotPasswordData.otp}
                        onChange={(e) => setForgotPasswordData((prev) => ({ ...prev, otp: e.target.value }))}
                        required
                        className="bg-white/60 backdrop-blur-sm border-white/50 text-gray-800 placeholder:text-gray-500 focus:border-indigo-500 focus:ring-indigo-500/30 h-11 rounded-xl transition-all duration-500 hover:shadow-lg shadow-md"
                      />
                      <p className="text-gray-600">Check your email for the code.</p>
                    </div>
                  )}

                  {forgotPasswordData.step === 3 && (
                    <>
                      <div className="space-y-4">
                        <Label htmlFor="newPassword" className="text-gray-800 font-bold flex items-center gap-3 text-lg">
                          <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-2 rounded-xl">
                            <Lock className="w-5 h-5 text-white" />
                          </div>
                          New Password
                        </Label>
                        <Input
                          id="newPassword"
                          type="password"
                          placeholder="Enter new password"
                          required
                          className="bg-white/60 backdrop-blur-sm border-white/50 text-gray-800 placeholder:text-gray-500 focus:border-purple-500 focus:ring-purple-500/30 h-11 rounded-xl transition-all duration-500 hover:shadow-lg shadow-md"
                        />
                      </div>
                      <div className="space-y-4">
                        <Label
                          htmlFor="confirmNewPassword"
                          className="text-gray-800 font-bold flex items-center gap-3 text-lg"
                        >
                          <div className="bg-gradient-to-br from-pink-500 to-red-500 p-2 rounded-xl">
                            <Lock className="w-5 h-5 text-white" />
                          </div>
                          Confirm New Password
                        </Label>
                        <Input
                          id="confirmNewPassword"
                          type="password"
                          placeholder="Confirm new password"
                          required
                          className="bg-white/60 backdrop-blur-sm border-white/50 text-gray-800 placeholder:text-gray-500 focus:border-pink-500 focus:ring-pink-500/30 h-11 rounded-xl transition-all duration-500 hover:shadow-lg shadow-md"
                        />
                      </div>
                    </>
                  )}

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-800 text-white font-bold py-4 text-lg rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 group relative overflow-hidden transform hover:scale-105"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                    {isLoading
                      ? (
                        <div className="flex items-center gap-3">
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          Processing...
                        </div>
                      )
                      : forgotPasswordData.step === 1
                        ? "Send OTP"
                        : forgotPasswordData.step === 2
                          ? "Verify OTP"
                          : "Reset Password"}
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
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-indigo-50 to-purple-100 relative overflow-hidden">
      {/* Enhanced Header */}
      <header className="relative z-20 flex items-center justify-between p-4 md:p-6 bg-white/20 backdrop-blur-md border-b border-white/30">
        <Link
          href="/"
          className="flex items-center gap-2 text-white bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 transition-all font-bold px-5 py-3 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 duration-300 text-sm md:text-base"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Home
        </Link>

        <div className="flex items-center gap-3 md:gap-4">
          <Link href="/apply">
            <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold rounded-2xl px-5 py-3 text-sm md:text-base shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
              Register
            </Button>
          </Link>
        </div>
      </header>

      {/* Enhanced Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-gradient-to-br from-blue-300/20 to-indigo-300/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-gradient-to-br from-purple-300/20 to-pink-300/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-br from-indigo-200/15 to-purple-200/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }}></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 flex items-center justify-center min-h-[calc(100vh-100px)]">
        <div className="max-w-md mx-auto w-full">
          <div className="text-center mb-10 md:mb-12 animate-fade-in-up">
            <div className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 rounded-3xl mx-auto mb-6 md:mb-8 flex items-center justify-center shadow-2xl animate-float">
              <User className="w-10 h-10 md:w-12 md:h-12 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-blue-700 via-purple-600 to-indigo-800 bg-clip-text text-transparent mb-4">Welcome Back!</h1>
            <p className="text-lg md:text-xl text-gray-700 mb-8">
              Sign in to your intern dashboard
            </p>
          </div>

          <Card className="bg-white/50 backdrop-blur-3xl border border-white/40 shadow-3xl animate-fade-in-up animation-delay-200">
            <CardHeader className="text-center pb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-xl">
                <User className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-blue-700 via-purple-600 to-indigo-800 bg-clip-text text-transparent mb-3">Intern Login</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-8">
                <div className="space-y-4">
                  <Label htmlFor="emailOrPhone" className="text-gray-800 font-bold flex items-center gap-3 text-lg">
                    <div className="bg-gradient-to-br from-blue-500 to-indigo-500 p-2 rounded-xl">
                      <Mail className="w-5 h-5 text-white" />
                    </div>
                    Email or Phone Number *
                  </Label>
                  <Input
                    id="emailOrPhone"
                    type="text"
                    placeholder="Enter email or phone number"
                    value={credentials.emailOrPhone}
                    onChange={(e) => setCredentials((prev) => ({ ...prev, emailOrPhone: e.target.value }))}
                    required
                    className="bg-white/60 backdrop-blur-sm border-white/50 text-gray-800 placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500/30 h-11 rounded-xl transition-all duration-500 hover:shadow-lg shadow-md"
                  />
                </div>

                <div className="space-y-4">
                  <Label htmlFor="password" className="text-gray-800 font-bold flex items-center gap-3 text-lg">
                    <div className="bg-gradient-to-br from-indigo-500 to-purple-500 p-2 rounded-xl">
                      <Lock className="w-5 h-5 text-white" />
                    </div>
                    Password *
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

                <div className="text-right">
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(true)}
                    className="text-blue-600 hover:text-indigo-700 font-bold transition-colors underline"
                  >
                    Forgot Password?
                  </button>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-800 text-white font-bold py-4 text-lg rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 group relative overflow-hidden transform hover:scale-105"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                  {isLoading ? (
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Signing In...
                    </div>
                  ) : "Sign In"}
                </Button>

                <div className="text-center">
                  <p className="text-gray-700 text-base">
                    Don't have an account?{" "}
                    <Link href="/apply" className="text-blue-600 hover:text-indigo-700 font-bold transition-colors underline">
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