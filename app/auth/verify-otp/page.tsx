"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, CheckCircle, Mail, RefreshCw, Sparkles } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import React, { useState } from "react"

export default function OTPVerificationPage() {
    const searchParams = useSearchParams()
    const email = searchParams.get("email") || ""
    const purpose = searchParams.get("purpose") || "verification" // verification, password-reset, etc.

    const [otp, setOtp] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [isResending, setIsResending] = useState(false)
    const [timeLeft, setTimeLeft] = useState(300) // 5 minutes
    const { toast } = useToast()

    // Timer countdown
    React.useEffect(() => {
        if (timeLeft > 0) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
            return () => clearTimeout(timer)
        }
    }, [timeLeft])

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins}:${secs.toString().padStart(2, '0')}`
    }

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault()
        if (otp.length !== 6) {
            toast({
                title: "⚠️ Incomplete Code",
                description: "Please enter the complete 6-digit verification code.",
                variant: "warning" as any,
            })
            return
        }

        setIsLoading(true)

        try {
            const endpoint = purpose === "password-reset"
                ? "http://localhost:5000/api/password-reset/verify"
                : "http://localhost:5000/api/verify-email"

            const response = await fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, otp }),
            })

            const data = await response.json()

            if (response.ok) {
                toast({
                    title: "✅ Verification Successful!",
                    description: "✨ Your email has been verified successfully.",
                    variant: "success" as any,
                })

                // Redirect based on purpose
                setTimeout(() => {
                    if (purpose === "password-reset") {
                        window.location.href = `/auth/reset-password?email=${encodeURIComponent(email)}&otp=${otp}`
                    } else {
                        window.location.href = "/intern/dashboard"
                    }
                }, 1500)
            } else {
                toast({
                    title: "❌ Verification Failed",
                    description: data.message || "Invalid or expired verification code.",
                    variant: "destructive",
                })
            }
        } catch (error) {
            toast({
                title: "🚨 Connection Error",
                description: "Unable to verify code. Please check your connection.",
                variant: "warning" as any,
            })
        } finally {
            setIsLoading(false)
        }
    }

    const handleResendCode = async () => {
        setIsResending(true)

        try {
            const endpoint = purpose === "password-reset"
                ? "http://localhost:5000/api/password-reset/request"
                : "http://localhost:5000/api/resend-verification"

            const response = await fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            })

            const data = await response.json()

            if (response.ok) {
                toast({
                    title: "📧 Code Resent!",
                    description: "✨ A new verification code has been sent to your email.",
                    variant: "success" as any,
                })
                setTimeLeft(300) // Reset timer
                setOtp("") // Clear current OTP
            } else {
                toast({
                    title: "❌ Resend Failed",
                    description: data.message || "Failed to resend verification code.",
                    variant: "destructive",
                })
            }
        } catch (error) {
            toast({
                title: "🚨 Connection Error",
                description: "Unable to resend code. Please try again.",
                variant: "warning" as any,
            })
        } finally {
            setIsResending(false)
        }
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
                                <div className="w-12 h-12 bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600 rounded-2xl flex items-center justify-center shadow-xl transform hover:scale-110 transition-transform duration-300">
                                    <CheckCircle className="w-7 h-7 text-white" />
                                </div>
                                <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full animate-pulse"></div>
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-800 via-green-700 to-teal-700 bg-clip-text text-transparent">
                                    Email Verification
                                </h2>
                                <p className="text-sm text-gray-600 font-medium">Secure account verification system</p>
                            </div>
                        </div>
                        <Link href={purpose === "password-reset" ? "/auth/forgot-password" : "/intern/login"}>
                            <button className="group relative overflow-hidden bg-white/20 backdrop-blur-md hover:bg-white/30 text-gray-700 hover:text-blue-700 border border-white/40 hover:border-blue-400/60 rounded-2xl px-6 py-3 font-semibold shadow-lg hover:shadow-xl transition-all duration-500 transform hover:scale-105">
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/10 to-blue-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                                <div className="relative flex items-center gap-2">
                                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
                                    <span>Back</span>
                                </div>
                            </button>
                        </Link>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div className="relative z-20 flex flex-col items-center justify-center py-8 px-6">
                <div className="w-full max-w-md">
                    <div className="text-center mb-8">
                        <div className="relative mb-6">
                            <div className="w-20 h-20 bg-gradient-to-br from-green-500 via-emerald-500 to-teal-600 rounded-3xl flex items-center justify-center shadow-2xl mx-auto transform hover:scale-110 transition-transform duration-500 group">
                                <Mail className="h-10 w-10 text-white group-hover:rotate-12 transition-transform duration-500" />
                            </div>
                            <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center animate-pulse shadow-lg">
                                <Sparkles className="w-4 h-4 text-white" />
                            </div>
                        </div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-green-800 to-teal-800 bg-clip-text text-transparent mb-4">
                            Check Your Email
                        </h1>
                        <p className="text-gray-600 text-lg leading-relaxed">
                            We've sent a 6-digit verification code to
                        </p>
                        <p className="text-blue-600 font-semibold text-lg mt-1">
                            {email}
                        </p>
                    </div>

                    <Card className="bg-white/20 backdrop-blur-xl border border-white/30 shadow-2xl hover:shadow-3xl transition-all duration-500 rounded-3xl overflow-hidden">
                        <CardHeader className="text-center pb-6 bg-gradient-to-r from-white/10 via-white/5 to-white/10 border-b border-white/20">
                            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-gray-800 via-green-700 to-teal-700 bg-clip-text text-transparent mb-3 flex items-center justify-center gap-3">
                                <div className="p-2 bg-gradient-to-br from-green-500 to-teal-600 rounded-2xl shadow-lg">
                                    <CheckCircle className="w-6 h-6 text-white" />
                                </div>
                                Enter Verification Code
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-8">
                            <form onSubmit={handleVerify} className="space-y-8">
                                <div className="space-y-4">
                                    <div className="flex justify-center">
                                        <InputOTP
                                            maxLength={6}
                                            value={otp}
                                            onChange={(value) => setOtp(value)}
                                            className="gap-3"
                                        >
                                            <InputOTPGroup className="gap-3">
                                                <InputOTPSlot
                                                    index={0}
                                                    className="w-14 h-14 text-2xl font-bold bg-white/70 backdrop-blur-sm border-2 border-white/60 hover:border-green-400 focus:border-green-500 focus:ring-green-500/20 rounded-xl shadow-lg transition-all duration-300"
                                                />
                                                <InputOTPSlot
                                                    index={1}
                                                    className="w-14 h-14 text-2xl font-bold bg-white/70 backdrop-blur-sm border-2 border-white/60 hover:border-green-400 focus:border-green-500 focus:ring-green-500/20 rounded-xl shadow-lg transition-all duration-300"
                                                />
                                                <InputOTPSlot
                                                    index={2}
                                                    className="w-14 h-14 text-2xl font-bold bg-white/70 backdrop-blur-sm border-2 border-white/60 hover:border-green-400 focus:border-green-500 focus:ring-green-500/20 rounded-xl shadow-lg transition-all duration-300"
                                                />
                                                <InputOTPSlot
                                                    index={3}
                                                    className="w-14 h-14 text-2xl font-bold bg-white/70 backdrop-blur-sm border-2 border-white/60 hover:border-green-400 focus:border-green-500 focus:ring-green-500/20 rounded-xl shadow-lg transition-all duration-300"
                                                />
                                                <InputOTPSlot
                                                    index={4}
                                                    className="w-14 h-14 text-2xl font-bold bg-white/70 backdrop-blur-sm border-2 border-white/60 hover:border-green-400 focus:border-green-500 focus:ring-green-500/20 rounded-xl shadow-lg transition-all duration-300"
                                                />
                                                <InputOTPSlot
                                                    index={5}
                                                    className="w-14 h-14 text-2xl font-bold bg-white/70 backdrop-blur-sm border-2 border-white/60 hover:border-green-400 focus:border-green-500 focus:ring-green-500/20 rounded-xl shadow-lg transition-all duration-300"
                                                />
                                            </InputOTPGroup>
                                        </InputOTP>
                                    </div>

                                    <div className="text-center">
                                        <p className="text-gray-600 text-sm">
                                            Enter the 6-digit code sent to your email
                                        </p>
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    disabled={isLoading || otp.length !== 6}
                                    className="group relative overflow-hidden w-full bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 hover:from-green-700 hover:via-emerald-700 hover:to-teal-700 text-white font-bold py-5 text-xl rounded-3xl shadow-2xl hover:shadow-3xl hover:shadow-green-500/30 transition-all duration-700 transform hover:scale-105 border-2 border-white/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1200"></div>
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                    <div className="relative flex items-center justify-center gap-4">
                                        {isLoading ? (
                                            <>
                                                <div className="w-7 h-7 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                                                <span>Verifying...</span>
                                            </>
                                        ) : (
                                            <>
                                                <CheckCircle className="w-7 h-7 group-hover:scale-110 transition-transform duration-300" />
                                                <span>Verify Code</span>
                                                <Sparkles className="w-7 h-7 group-hover:rotate-180 transition-transform duration-700" />
                                            </>
                                        )}
                                    </div>
                                    <div className="absolute -inset-1 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 rounded-3xl blur opacity-20 group-hover:opacity-40 transition-opacity duration-500 -z-10"></div>
                                </Button>
                            </form>

                            {/* Timer and Resend */}
                            <div className="mt-8 text-center space-y-4">
                                {timeLeft > 0 ? (
                                    <p className="text-gray-600 text-sm">
                                        Code expires in{" "}
                                        <span className="font-bold text-blue-600">{formatTime(timeLeft)}</span>
                                    </p>
                                ) : (
                                    <p className="text-red-600 text-sm font-medium">
                                        ⏰ Verification code has expired
                                    </p>
                                )}

                                <div className="flex items-center justify-center gap-2">
                                    <span className="text-gray-600 text-sm">Didn't receive the code?</span>
                                    <button
                                        type="button"
                                        onClick={handleResendCode}
                                        disabled={isResending || timeLeft > 240} // Allow resend after 1 minute
                                        className="text-blue-600 hover:text-blue-700 font-semibold text-sm underline hover:no-underline transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:no-underline flex items-center gap-1"
                                    >
                                        {isResending && <RefreshCw className="w-3 h-3 animate-spin" />}
                                        Send again
                                    </button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}