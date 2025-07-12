"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Mail, Lock, Eye, EyeOff, User, Phone } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function InternLoginPage() {
  const [credentials, setCredentials] = useState({
    emailOrPhone: "",
    password: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [forgotPasswordData, setForgotPasswordData] = useState({
    emailOrPhone: "",
    otp: "",
    step: 1, // 1: enter email/phone, 2: enter OTP, 3: reset password
  })
  const { toast } = useToast()
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Check credentials against stored intern accounts
    const internAccounts = JSON.parse(localStorage.getItem("internAccounts") || "[]")
    const account = internAccounts.find(
      (acc: any) =>
        (acc.email === credentials.emailOrPhone || acc.phone === credentials.emailOrPhone) &&
        acc.password === credentials.password,
    )

    if (account) {
      localStorage.setItem("internAuth", JSON.stringify(account))
      toast({
        title: "Login Successful! 🎉",
        description: `Welcome back, ${account.name}!`,
      })
      router.push("/intern/dashboard")
    } else {
      toast({
        title: "Login Failed ❌",
        description: "Invalid email/phone or password. Please try again.",
        variant: "destructive",
      })
    }

    setIsLoading(false)
  }

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    if (forgotPasswordData.step === 1) {
      // Send OTP
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const isEmail = forgotPasswordData.emailOrPhone.includes("@")
      toast({
        title: "OTP Sent! 📱",
        description: `Verification code sent to your ${isEmail ? "email" : "phone number"}.`,
      })

      setForgotPasswordData((prev) => ({ ...prev, step: 2 }))
    } else if (forgotPasswordData.step === 2) {
      // Verify OTP (simulate)
      await new Promise((resolve) => setTimeout(resolve, 1000))

      if (forgotPasswordData.otp === "123456") {
        toast({
          title: "OTP Verified! ✅",
          description: "You can now reset your password.",
        })
        setForgotPasswordData((prev) => ({ ...prev, step: 3 }))
      } else {
        toast({
          title: "Invalid OTP ❌",
          description: "Please enter the correct verification code.",
          variant: "destructive",
        })
      }
    } else if (forgotPasswordData.step === 3) {
      // Reset password step
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Password Reset Successful! ✅",
        description: "Your password has been updated. You can now login.",
      })

      setShowForgotPassword(false)
      setForgotPasswordData({ emailOrPhone: "", otp: "", step: 1 })
    }

    setIsLoading(false)
  }

  if (showForgotPassword) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-mint-50 to-green-50 relative overflow-hidden">
        {/* Header */}
        <header className="relative z-20 flex items-center justify-between p-6 bg-white/10 backdrop-blur-md border-b border-white/20">
          <button
            onClick={() => setShowForgotPassword(false)}
            className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Login
          </button>
        </header>

        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -left-40 w-80 h-80 bg-emerald-200/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-green-200/15 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 container mx-auto px-4 py-8 flex items-center justify-center min-h-[calc(100vh-100px)]">
          <div className="max-w-md mx-auto w-full">
            <Card className="bg-white/20 backdrop-blur-md border border-white/30 shadow-xl">
              <CardHeader className="text-center pb-6">
                <CardTitle className="text-2xl font-bold text-gray-800">Reset Password</CardTitle>
                <p className="text-gray-600">
                  {forgotPasswordData.step === 1 && "Enter your email or phone number"}
                  {forgotPasswordData.step === 2 && "Enter the verification code"}
                  {forgotPasswordData.step === 3 && "Create a new password"}
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleForgotPassword} className="space-y-6">
                  {forgotPasswordData.step === 1 && (
                    <div className="space-y-2">
                      <Label htmlFor="emailOrPhone" className="flex items-center gap-2 text-gray-700 font-medium">
                        <Mail className="w-4 h-4" />
                        Email or Phone Number
                      </Label>
                      <Input
                        id="emailOrPhone"
                        type="text"
                        placeholder="Enter email or phone number"
                        value={forgotPasswordData.emailOrPhone}
                        onChange={(e) => setForgotPasswordData((prev) => ({ ...prev, emailOrPhone: e.target.value }))}
                        required
                        className="bg-white/50 backdrop-blur-sm border-white/40 focus:border-emerald-400 focus:ring-emerald-400/20 h-12"
                      />
                    </div>
                  )}

                  {forgotPasswordData.step === 2 && (
                    <div className="space-y-2">
                      <Label htmlFor="otp" className="flex items-center gap-2 text-gray-700 font-medium">
                        <Phone className="w-4 h-4" />
                        Verification Code
                      </Label>
                      <Input
                        id="otp"
                        type="text"
                        placeholder="Enter 6-digit code (123456)"
                        value={forgotPasswordData.otp}
                        onChange={(e) => setForgotPasswordData((prev) => ({ ...prev, otp: e.target.value }))}
                        required
                        className="bg-white/50 backdrop-blur-sm border-white/40 focus:border-emerald-400 focus:ring-emerald-400/20 h-12"
                      />
                      <p className="text-sm text-gray-600">Demo OTP: 123456</p>
                    </div>
                  )}

                  {forgotPasswordData.step === 3 && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="newPassword" className="flex items-center gap-2 text-gray-700 font-medium">
                          <Lock className="w-4 h-4" />
                          New Password
                        </Label>
                        <Input
                          id="newPassword"
                          type="password"
                          placeholder="Enter new password"
                          required
                          className="bg-white/50 backdrop-blur-sm border-white/40 focus:border-emerald-400 focus:ring-emerald-400/20 h-12"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label
                          htmlFor="confirmNewPassword"
                          className="flex items-center gap-2 text-gray-700 font-medium"
                        >
                          <Lock className="w-4 h-4" />
                          Confirm New Password
                        </Label>
                        <Input
                          id="confirmNewPassword"
                          type="password"
                          placeholder="Confirm new password"
                          required
                          className="bg-white/50 backdrop-blur-sm border-white/40 focus:border-emerald-400 focus:ring-emerald-400/20 h-12"
                        />
                      </div>
                    </>
                  )}

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-semibold py-3 h-12 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    {isLoading
                      ? "Processing..."
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
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-mint-50 to-green-50 relative overflow-hidden">
      {/* Header */}
      <header className="relative z-20 flex items-center justify-between p-6 bg-white/10 backdrop-blur-md border-b border-white/20">
        <Link
          href="/"
          className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <div className="flex items-center gap-4">
          <Link href="/apply">
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">Register</Button>
          </Link>
        </div>
      </header>

      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-emerald-200/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-green-200/15 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 flex items-center justify-center min-h-[calc(100vh-100px)]">
        <div className="max-w-md mx-auto w-full">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Welcome Back!</h1>
            <p className="text-gray-600 text-lg">Sign in to your intern dashboard</p>
          </div>

          <Card className="bg-white/20 backdrop-blur-md border border-white/30 shadow-xl">
            <CardHeader className="text-center pb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg">
                <User className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-800">Intern Login</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="emailOrPhone" className="flex items-center gap-2 text-gray-700 font-medium">
                    <Mail className="w-4 h-4" />
                    Email or Phone Number *
                  </Label>
                  <Input
                    id="emailOrPhone"
                    type="text"
                    placeholder="Enter email or phone number"
                    value={credentials.emailOrPhone}
                    onChange={(e) => setCredentials((prev) => ({ ...prev, emailOrPhone: e.target.value }))}
                    required
                    className="bg-white/50 backdrop-blur-sm border-white/40 focus:border-emerald-400 focus:ring-emerald-400/20 h-12"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="flex items-center gap-2 text-gray-700 font-medium">
                    <Lock className="w-4 h-4" />
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
                      className="bg-white/50 backdrop-blur-sm border-white/40 focus:border-emerald-400 focus:ring-emerald-400/20 h-12 pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <div className="text-right">
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(true)}
                    className="text-emerald-600 hover:text-emerald-700 text-sm font-medium"
                  >
                    Forgot Password?
                  </button>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-semibold py-3 h-12 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  {isLoading ? "Signing In..." : "Sign In"}
                </Button>

                <div className="text-center">
                  <p className="text-gray-600 text-sm">
                    Don't have an account?{" "}
                    <Link href="/apply" className="text-emerald-600 hover:text-emerald-700 font-medium">
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
