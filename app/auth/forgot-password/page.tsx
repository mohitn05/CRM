"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, CheckCircle, Lock, Mail, Sparkles } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function ForgotPasswordPage() {
    const [step, setStep] = useState(1) // 1: email, 2: OTP, 3: reset password
    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState({
        email: "",
        otp: "",
        newPassword: "",
        confirmPassword: "",
    })
    const { toast } = useToast()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        if (step === 1) {
            // Send OTP
            try {
                const response = await fetch("http://localhost:5000/api/password-reset/request", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email: formData.email }),
                })
                const data = await response.json()

                if (response.ok) {
                    toast({
                        title: "📧 Verification Code Sent!",
                        description: "✨ Check your email for the 6-digit verification code.",
                        variant: "success" as any,
                    })
                    setStep(2)
                } else {
                    toast({
                        title: "❌ Failed to Send Code",
                        description: data.message || "Please check your email address and try again.",
                        variant: "destructive",
                    })
                }
            } catch (error) {
                toast({
                    title: "🚨 Connection Error",
                    description: "Unable to connect to server. Please try again.",
                    variant: "warning" as any,
                })
            }
        } else if (step === 2) {
            // Verify OTP
            try {
                const response = await fetch("http://localhost:5000/api/password-reset/verify", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email: formData.email, otp: formData.otp }),
                })
                const data = await response.json()

                if (response.ok) {
                    toast({
                        title: "✅ Code Verified!",
                        description: "✨ Now create your new password.",
                        variant: "success" as any,
                    })
                    setStep(3)
                } else {
                    toast({
                        title: "❌ Invalid Code",
                        description: data.message || "Please enter the correct verification code.",
                        variant: "destructive",
                    })
                }
            } catch (error) {
                toast({
                    title: "🔍 Verification Error",
                    description: "Unable to verify code. Please try again.",
                    variant: "warning" as any,
                })
            }
        } else if (step === 3) {
            // Reset password
            if (formData.newPassword !== formData.confirmPassword) {
                toast({
                    title: "🔓 Password Mismatch",
                    description: "Please ensure both password fields match.",
                    variant: "warning" as any,
                })
                setIsLoading(false)
                return
            }

            try {
                const response = await fetch("http://localhost:5000/api/password-reset/reset", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        email: formData.email,
                        otp: formData.otp,
                        new_password: formData.newPassword
                    }),
                })
                const data = await response.json()

                if (response.ok) {
                    toast({
                        title: "🎉 Password Reset Successful!",
                        description: "✅ You can now login with your new password.",
                        variant: "success" as any,
                    })
                    // Redirect to login after success
                    setTimeout(() => {
                        window.location.href = "/intern/login"
                    }, 2000)
                } else {
                    toast({
                        title: "❌ Reset Failed",
                        description: data.message || "Failed to reset password. Please try again.",
                        variant: "destructive",
                    })
                }
            } catch (error) {
                toast({
                    title: "🔄 Reset Error",
                    description: "Unable to reset password. Please try again.",
                    variant: "warning" as any,
                })
            }
        }

        setIsLoading(false)
    }

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
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-xl transform hover:scale-110 transition-transform duration-300">
                                    <Lock className="w-7 h-7 text-white" />
                                </div>
                                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-pulse"></div>
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-800 via-indigo-700 to-purple-700 bg-clip-text text-transparent">
                                    Password Recovery
                                </h2>
                                <p className="text-sm text-gray-600 font-medium">Secure account recovery system</p>
                            </div>
                        </div>
                        <Link href="/intern/login">
                            <button className="group relative overflow-hidden bg-white/20 backdrop-blur-md hover:bg-white/30 text-gray-700 hover:text-blue-700 border border-white/40 hover:border-blue-400/60 rounded-2xl px-6 py-3 font-semibold shadow-lg hover:shadow-xl transition-all duration-500 transform hover:scale-105">
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/10 to-blue-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                                <div className="relative flex items-center gap-2">
                                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
                                    <span>Back to Login</span>
                                </div>
                            </button>
                        </Link>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div className="relative z-20 flex flex-col items-center justify-center py-8 px-6">
                <div className="w-full max-w-md">
                    {/* Progress Indicator */}
                    <div className="flex items-center justify-center mb-8">
                        <div className="flex items-center space-x-4">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${step >= 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-500'
                                }`}>
                                1
                            </div>
                            <div className={`w-16 h-1 ${step >= 2 ? 'bg-blue-500' : 'bg-gray-200'}`}></div>
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${step >= 2 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-500'
                                }`}>
                                2
                            </div>
                            <div className={`w-16 h-1 ${step >= 3 ? 'bg-blue-500' : 'bg-gray-200'}`}></div>
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${step >= 3 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-500'
                                }`}>
                                3
                            </div>
                        </div>
                    </div>

                    <div className="text-center mb-6">
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-indigo-800 to-purple-800 bg-clip-text text-transparent mb-2">
                            {step === 1 && "Reset Your Password"}
                            {step === 2 && "Verify Your Email"}
                            {step === 3 && "Create New Password"}
                        </h1>
                        <p className="text-gray-600 text-base font-medium">
                            {step === 1 && "Enter your email address to receive a verification code"}
                            {step === 2 && "Enter the 6-digit code sent to your email"}
                            {step === 3 && "Choose a strong new password for your account"}
                        </p>
                    </div>

                    <Card className="bg-white/20 backdrop-blur-xl border border-white/30 shadow-2xl hover:shadow-3xl transition-all duration-500 rounded-3xl overflow-hidden">
                        <CardHeader className="text-center pb-4 bg-gradient-to-r from-white/10 via-white/5 to-white/10 border-b border-white/20">
                            <CardTitle className="text-xl font-bold bg-gradient-to-r from-gray-800 via-indigo-700 to-purple-700 bg-clip-text text-transparent flex items-center justify-center gap-3">
                                <div className="p-1.5 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg">
                                    {step === 1 && <Mail className="w-4 h-4 text-white" />}
                                    {step === 2 && <CheckCircle className="w-4 h-4 text-white" />}
                                    {step === 3 && <Lock className="w-4 h-4 text-white" />}
                                </div>
                                Step {step} of 3
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <form onSubmit={handleSubmit} className="space-y-5">
                                {step === 1 && (
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
                                            placeholder="Enter your registered email"
                                            value={formData.email}
                                            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                                            required
                                            className="bg-white/70 backdrop-blur-sm border-white/60 text-gray-800 placeholder:text-gray-500 focus:border-blue-400 focus:ring-blue-400/20 h-10 rounded-xl text-sm font-medium shadow-inner"
                                        />
                                    </div>
                                )}

                                {step === 2 && (
                                    <div className="space-y-2">
                                        <Label htmlFor="otp" className="flex items-center gap-2 text-gray-700 text-sm font-semibold">
                                            <div className="p-1 bg-gradient-to-r from-green-500 to-teal-600 rounded-lg text-white shadow-lg">
                                                <CheckCircle className="w-3 h-3" />
                                            </div>
                                            <span>Verification Code *</span>
                                        </Label>
                                        <Input
                                            id="otp"
                                            type="text"
                                            placeholder="Enter 6-digit code"
                                            value={formData.otp}
                                            onChange={(e) => setFormData(prev => ({ ...prev, otp: e.target.value }))}
                                            required
                                            maxLength={6}
                                            className="bg-white/70 backdrop-blur-sm border-white/60 text-gray-800 placeholder:text-gray-500 focus:border-green-400 focus:ring-green-400/20 h-10 rounded-xl text-sm font-medium shadow-inner text-center text-lg tracking-widest"
                                        />
                                        <p className="text-xs text-gray-600 text-center">
                                            Code sent to: <span className="font-medium">{formData.email}</span>
                                        </p>
                                    </div>
                                )}

                                {step === 3 && (
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
                                                value={formData.newPassword}
                                                onChange={(e) => setFormData(prev => ({ ...prev, newPassword: e.target.value }))}
                                                required
                                                className="bg-white/70 backdrop-blur-sm border-white/60 text-gray-800 placeholder:text-gray-500 focus:border-purple-400 focus:ring-purple-400/20 h-10 rounded-xl text-sm font-medium shadow-inner"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="confirmPassword" className="flex items-center gap-2 text-gray-700 text-sm font-semibold">
                                                <div className="p-1 bg-gradient-to-r from-pink-500 to-red-600 rounded-lg text-white shadow-lg">
                                                    <Lock className="w-3 h-3" />
                                                </div>
                                                <span>Confirm Password *</span>
                                            </Label>
                                            <Input
                                                id="confirmPassword"
                                                type="password"
                                                placeholder="Confirm new password"
                                                value={formData.confirmPassword}
                                                onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
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
                                                {step === 1 && "Send Verification Code"}
                                                {step === 2 && "Verify Code"}
                                                {step === 3 && "Reset Password"}
                                            </>
                                        )}
                                    </div>
                                    <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition-opacity duration-500 -z-10"></div>
                                </Button>
                            </form>

                            {step === 2 && (
                                <div className="text-center mt-4">
                                    <p className="text-gray-600 text-sm">
                                        Didn't receive the code?{" "}
                                        <button
                                            onClick={() => setStep(1)}
                                            className="text-blue-600 hover:text-blue-700 font-semibold underline hover:no-underline transition-all duration-300"
                                        >
                                            Send again
                                        </button>
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}