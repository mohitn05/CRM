"use client"
"use client"

import { getDomainOptions } from "@/lib/domains"
import dynamic from "next/dynamic"
import type React from "react"

// Lazy load heavy components
const OptimizedCard = dynamic(() => import("@/components/ui/card").then(mod => ({ default: mod.Card })), {
  loading: () => <div className="animate-pulse bg-gray-200 rounded-3xl h-96"></div>
})
const OptimizedCardContent = dynamic(() => import("@/components/ui/card").then(mod => ({ default: mod.CardContent })), {
  loading: () => <div className="animate-pulse bg-gray-100 rounded-xl h-32"></div>
})
const OptimizedCardHeader = dynamic(() => import("@/components/ui/card").then(mod => ({ default: mod.CardHeader })), {
  loading: () => <div className="animate-pulse bg-gray-100 rounded-xl h-24"></div>
})

import { Button } from "@/components/ui/button"
import { CardDescription, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import {
  ArrowLeft,
  Building2,
  CheckCircle,
  Eye,
  EyeOff,
  FileText,
  GraduationCap,
  Lock,
  Mail,
  Phone,
  Send,
  Sparkles,
  Upload,
  User
} from "lucide-react"
import Link from "next/link"
import { Suspense, useCallback, useMemo, useState } from "react"

export default function ApplyPage() {
  type FormDataType = {
    name: string
    email: string
    phone: string
    domain: string
    password: string
    confirmPassword: string
    resume: File | null
  }
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    domain: "",
    password: "",
    confirmPassword: "",
    resume: null as File | null,
  })

  // Memoized domain options for better performance
  const domainOptions = useMemo(() => getDomainOptions(), [])
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  // Optimized input change handler with useCallback
  const handleInputChange = useCallback((field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
      ...(field === "domain" && value !== "Others" ? { customDomain: "" } : {})
    }))
  }, [])

  // Optimized file change handler
  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "📁 File Too Large",
          description: "⚠️ Please upload a file smaller than 5MB. Consider compressing your resume.",
          variant: "warning" as any,
        })
        return
      }
      setFormData((prev) => ({ ...prev, resume: file }))
    }
  }, [toast])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Optimized validation with early returns
    if (!/^[A-Za-z ]+$/.test(formData.name.trim())) {
      toast({
        title: "📝 Invalid Name Format",
        description: "⚠️ Full name should only contain letters and spaces. No digits or special characters allowed.",
        variant: "warning" as any,
      })
      return
    }

    if (!/^\d{10}$/.test(formData.phone)) {
      toast({
        title: "📱 Invalid Phone Number",
        description: "⚠️ Phone number must be exactly 10 digits long. Please enter a valid Indian mobile number.",
        variant: "warning" as any,
      })
      return
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "🔐 Password Mismatch",
        description: "⚠️ Password and confirm password do not match. Please ensure both fields are identical.",
        variant: "warning" as any,
      })
      return
    }

    if (formData.password.length < 6) {
      toast({
        title: "🔑 Weak Password",
        description: "⚠️ Password must be at least 6 characters long for security. Please choose a stronger password.",
        variant: "warning" as any,
      })
      return
    }

    setIsLoading(true)

    try {
      // Optimized FormData creation
      const formpayload = new FormData()
      Object.entries({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        domain: formData.domain,
        password: formData.password
      }).forEach(([key, value]) => formpayload.append(key, value))

      if (formData.resume) {
        formpayload.append("resume", formData.resume)
      }

      const response = await fetch("http://localhost:5000/api/apply", {
        method: "POST",
        body: formpayload,
      })

      if (response.ok) {
        setIsSubmitted(true)
        toast({
          title: "🎉 Application Submitted Successfully!",
          description: "✨ Your internship application has been received! We'll review it within 48 hours.",
          variant: "success" as any,
        })
      } else {
        const err = await response.json()
        toast({
          title: "🚨 Submission Failed",
          description: "❌ " + (err.message || err.error || "Something went wrong. Please try again."),
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "😵 Network Error",
        description: "⚠️ Could not connect to server. Please check your internet connection and try again.",
        variant: "warning" as any,
      })
    } finally {
      setIsLoading(false)
    }
  }



  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-6 relative overflow-hidden">
        {/* Enhanced Background Elements */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <svg
            className="absolute top-0 left-0 w-full h-full"
            viewBox="0 0 1200 800"
            preserveAspectRatio="none"
            fill="none"
          >
            <defs>
              <linearGradient id="successGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#22c55e" stopOpacity="0.15" />
                <stop offset="50%" stopColor="#16a34a" stopOpacity="0.1" />
                <stop offset="100%" stopColor="#15803d" stopOpacity="0.05" />
              </linearGradient>
              <linearGradient id="successGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.12" />
                <stop offset="50%" stopColor="#1d4ed8" stopOpacity="0.08" />
                <stop offset="100%" stopColor="#1e40af" stopOpacity="0.04" />
              </linearGradient>
            </defs>
            <path d="M0,150 Q200,50 400,120 T800,100 Q1000,80 1200,140 L1200,0 L0,0 Z" fill="url(#successGradient1)" />
            <path d="M0,600 Q400,500 800,580 T1200,560 L1200,800 L0,800 Z" fill="url(#successGradient2)" opacity="0.7" />
          </svg>
        </div>

        {/* Floating Success Elements */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-32 h-32 bg-green-200/10 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-blue-300/15 rounded-full blur-lg animate-bounce" style={{ animationDelay: "1s" }}></div>
          <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-emerald-100/20 rounded-full blur-2xl animate-pulse" style={{ animationDelay: "2s" }}></div>
        </div>

        <Suspense fallback={<div className="animate-pulse bg-gray-200 rounded-3xl h-96 w-full max-w-2xl"></div>}>
          <OptimizedCard className="w-full max-w-2xl bg-white/20 backdrop-blur-xl border border-white/30 shadow-2xl hover:shadow-3xl transition-all duration-500 rounded-3xl relative z-10">
            <OptimizedCardContent className="pt-12 text-center relative">
              {/* Enhanced Success Animation */}
              <div className="relative mb-8">
                <div className="w-32 h-32 bg-gradient-to-br from-green-400 via-emerald-500 to-green-600 rounded-full mx-auto flex items-center justify-center shadow-2xl animate-bounce">
                  <CheckCircle className="h-16 w-16 text-white" />
                </div>
                <div className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center animate-pulse shadow-lg">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <div className="absolute -bottom-2 -left-2 w-8 h-8 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full flex items-center justify-center animate-spin" style={{ animationDuration: '3s' }}>
                  <GraduationCap className="h-4 w-4 text-white" />
                </div>
              </div>

              <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-800 via-green-700 to-blue-700 bg-clip-text text-transparent mb-6">Application Submitted!</h2>
              <p className="text-gray-700 mb-8 text-xl leading-relaxed">
                🎉 Congratulations! Your application has been successfully submitted.
                <br />
                <span className="text-green-600 font-semibold">We'll review it and get back to you within 48 hours.</span>
              </p>

              <div className="bg-white/30 backdrop-blur-md border border-white/30 rounded-2xl p-8 mb-8 shadow-inner">
                <h3 className="text-gray-800 font-bold mb-6 text-xl flex items-center justify-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl text-white">
                    <FileText className="w-5 h-5" />
                  </div>
                  What happens next?
                </h3>
                <div className="space-y-4 text-gray-700">
                  <div className="flex items-center gap-4 p-4 bg-white/40 rounded-xl">
                    <div className="w-4 h-4 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full flex-shrink-0"></div>
                    <span className="font-medium">Application review (24-48 hours)</span>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-white/40 rounded-xl">
                    <div className="w-4 h-4 bg-gradient-to-r from-indigo-400 to-indigo-600 rounded-full flex-shrink-0"></div>
                    <span className="font-medium">Technical assessment (if selected)</span>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-white/40 rounded-xl">
                    <div className="w-4 h-4 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full flex-shrink-0"></div>
                    <span className="font-medium">Final interview & onboarding</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <Link href="/">
                  <Button className="group relative overflow-hidden w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white font-bold py-6 text-xl rounded-3xl shadow-2xl hover:shadow-3xl hover:shadow-blue-500/30 transition-all duration-700 transform hover:scale-105 border-2 border-white/20">
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1200"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="relative flex items-center justify-center gap-3">
                      <ArrowLeft className="w-6 h-6 group-hover:-translate-x-2 transition-transform duration-300" />
                      <span>Back to Home</span>
                      <Sparkles className="w-6 h-6 group-hover:rotate-180 transition-transform duration-700" />
                    </div>
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl blur opacity-20 group-hover:opacity-40 transition-opacity duration-500 -z-10"></div>
                  </Button>
                </Link>
                <Link href="/intern/login">
                  <Button
                    variant="outline"
                    className="group relative overflow-hidden w-full bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-600 hover:via-teal-600 hover:to-cyan-600 text-white border-0 font-bold py-6 text-xl rounded-3xl shadow-2xl hover:shadow-3xl hover:shadow-emerald-500/30 transition-all duration-700 transform hover:scale-105"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1200"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="relative flex items-center justify-center gap-3">
                      <User className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
                      <span>Login to Dashboard</span>
                      <GraduationCap className="w-6 h-6 group-hover:rotate-12 transition-transform duration-500" />
                    </div>
                    <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 rounded-3xl blur opacity-20 group-hover:opacity-40 transition-opacity duration-500 -z-10"></div>
                  </Button>
                </Link>
              </div>
            </OptimizedCardContent>
          </OptimizedCard>
        </Suspense>
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

          {/* Top flowing wave */}
          <path d="M0,150 Q200,50 400,120 T800,100 Q1000,80 1200,140 L1200,0 L0,0 Z" fill="url(#gradient1)" />

          {/* Second wave layer */}
          <path d="M0,250 Q300,150 600,220 T1200,200 L1200,0 L0,0 Z" fill="url(#gradient2)" opacity="0.8" />

          {/* Bottom flowing wave */}
          <path d="M0,600 Q400,500 800,580 T1200,560 L1200,800 L0,800 Z" fill="url(#gradient3)" opacity="0.7" />
        </svg>
      </div>

      {/* Floating geometric shapes */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {/* Floating circles with pulse */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-200/10 rounded-full blur-xl animate-pulse"></div>
        <div
          className="absolute top-40 right-20 w-24 h-24 bg-indigo-300/15 rounded-full blur-lg animate-bounce"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute bottom-32 left-1/4 w-40 h-40 bg-blue-100/20 rounded-full blur-2xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute bottom-20 right-1/3 w-28 h-28 bg-indigo-200/12 rounded-full blur-xl animate-bounce"
          style={{ animationDelay: "0.5s" }}
        ></div>
      </div>

      {/* Enhanced Professional Header */}
      <header className="relative z-30 bg-white/10 backdrop-blur-xl border-b border-white/20 shadow-lg">
        <div className="w-full px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Company Logo & Brand */}
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
                <p className="text-sm text-gray-600 font-medium">Professional Internship Management</p>
              </div>
            </div>

            {/* Navigation & Action Buttons */}
            <div className="flex items-center gap-3">
              <Link href="/">
                <Button
                  variant="outline"
                  className="group relative overflow-hidden bg-white/20 backdrop-blur-md hover:bg-white/30 text-gray-700 hover:text-blue-700 border border-white/40 hover:border-blue-400/60 rounded-2xl px-6 py-3 font-semibold shadow-lg hover:shadow-xl transition-all duration-500 transform hover:scale-105"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/10 to-blue-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                  <div className="relative flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
                    <span>Back to Home</span>
                  </div>
                </Button>
              </Link>
              <Link href="/intern/login">
                <Button className="group relative overflow-hidden bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-600 hover:via-teal-600 hover:to-cyan-600 text-white rounded-2xl px-8 py-3 font-bold shadow-xl hover:shadow-2xl hover:shadow-emerald-500/30 transition-all duration-500 transform hover:scale-105 border border-white/20">
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                  <div className="relative flex items-center gap-2">
                    <User className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                    <span>Login</span>
                  </div>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Enhanced Professional Hero Section */}
      <div className="relative z-20 flex flex-col items-center justify-center py-8 px-6 text-center">
        {/* Enhanced Main Heading with Professional Typography */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="relative mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl mx-auto transform hover:scale-110 transition-transform duration-500 group">
              <GraduationCap className="h-8 w-8 text-white group-hover:rotate-12 transition-transform duration-500" />
            </div>
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center animate-pulse shadow-lg">
              <Sparkles className="w-3 h-3 text-white" />
            </div>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-3 leading-tight tracking-tight">
            Ready to Launch
          </h1>
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4 leading-tight">
            Your Career Journey?
          </h1>
        </div>

        {/* Enhanced Value Proposition */}
        <div className="max-w-2xl mx-auto mb-6">
          <p className="text-base md:text-lg text-gray-700 leading-relaxed font-medium mb-3">
            Join our comprehensive internship program and kickstart your career in technology.
          </p>
          <p className="text-sm md:text-base text-gray-600 leading-relaxed font-light">
            Fill out the application below to take the first step towards your professional future.
          </p>
        </div>
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto py-8 px-6">
        {/* Enhanced Application Form */}
        <OptimizedCard className="bg-white/20 backdrop-blur-xl border border-white/30 shadow-2xl hover:shadow-3xl transition-all duration-500 rounded-3xl overflow-hidden w-full">
          <OptimizedCardHeader className="text-center pb-6 bg-gradient-to-r from-white/10 via-white/5 to-white/10 border-b border-white/20">
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-gray-800 via-blue-700 to-purple-700 bg-clip-text text-transparent mb-3 flex items-center justify-center gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              Join Our Internship Program
            </CardTitle>
            <CardDescription className="text-gray-600 text-lg font-medium">
              Create your account and start your career journey
            </CardDescription>
          </OptimizedCardHeader>
          <OptimizedCardContent className="p-6">
            <form onSubmit={handleSubmit} className={cn("space-y-6", isLoading && "opacity-50 pointer-events-none")}>
              <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-5">
                {/* Enhanced Full Name Field */}
                <div className="group relative bg-white/40 backdrop-blur-md border border-white/50 p-3 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-white/60">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
                  <Label htmlFor="name" className="flex items-center gap-2 text-gray-700 mb-2 text-sm font-semibold">
                    <div className="p-1 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg text-white shadow-lg">
                      <User className="w-3 h-3" />
                    </div>
                    <span>Full Name *</span>
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    required
                    className="bg-white/70 backdrop-blur-sm border-white/60 text-gray-800 placeholder:text-gray-500 focus:border-blue-400 focus:ring-blue-400/20 h-10 rounded-xl text-sm font-medium shadow-inner"
                  />
                </div>

                {/* Enhanced Email Field */}
                <div className="group relative bg-white/40 backdrop-blur-md border border-white/50 p-3 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-white/60">
                  <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-teal-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
                  <Label htmlFor="email" className="flex items-center gap-2 text-gray-700 mb-2 text-sm font-semibold">
                    <div className="p-1 bg-gradient-to-r from-green-500 to-teal-600 rounded-lg text-white shadow-lg">
                      <Mail className="w-3 h-3" />
                    </div>
                    <span>Email Address *</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    required
                    className="bg-white/70 backdrop-blur-sm border-white/60 text-gray-800 placeholder:text-gray-500 focus:border-green-400 focus:ring-green-400/20 h-10 rounded-xl text-sm font-medium shadow-inner"
                  />
                </div>

                {/* Enhanced Phone Field */}
                <div className="group relative bg-white/40 backdrop-blur-md border border-white/50 p-3 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-white/60">
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
                  <Label htmlFor="phone" className="flex items-center gap-2 text-gray-700 mb-2 text-sm font-semibold">
                    <div className="p-1 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg text-white shadow-lg">
                      <Phone className="w-3 h-3" />
                    </div>
                    <span>Phone Number *</span>
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="Enter your phone number"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    maxLength={10}
                    required
                    className="bg-white/70 backdrop-blur-sm border-white/60 text-gray-800 placeholder:text-gray-500 focus:border-orange-400 focus:ring-orange-400/20 h-10 rounded-xl text-sm font-medium shadow-inner"
                  />
                </div>

                {/* Enhanced Domain Field */}
                <div className="group relative bg-white/40 backdrop-blur-md border border-white/50 p-3 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-white/60">
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
                  <Label htmlFor="domain" className="flex items-center gap-2 text-gray-700 mb-2 text-sm font-semibold">
                    <div className="p-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg text-white shadow-lg">
                      <Building2 className="w-3 h-3" />
                    </div>
                    <span>Domain *</span>
                  </Label>
                  <Select
                    value={formData.domain}
                    onValueChange={(value) => handleInputChange("domain", value)}
                    required
                  >
                    <SelectTrigger className="bg-white/70 backdrop-blur-sm border-white/60 text-gray-800 h-10 rounded-xl text-sm font-medium shadow-inner">
                      <SelectValue placeholder="Select your domain" />
                    </SelectTrigger>
                    <SelectContent className="bg-white/95 backdrop-blur-xl border-white/60 rounded-2xl shadow-2xl">
                      {domainOptions.map((d: { value: string; label: string }) => (
                        <SelectItem key={d.value} value={d.value} className="bg-transparent text-gray-800 hover:bg-blue-50/80 rounded-xl m-1">{d.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Enhanced Password Field */}
                <div className="group relative bg-white/40 backdrop-blur-md border border-white/50 p-3 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-white/60">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
                  <Label htmlFor="password" className="flex items-center gap-2 text-gray-700 mb-2 text-sm font-semibold">
                    <div className="p-1 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg text-white shadow-lg">
                      <Lock className="w-3 h-3" />
                    </div>
                    <span>Password *</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a password"
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
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

                {/* Enhanced Confirm Password Field */}
                <div className="group relative bg-white/40 backdrop-blur-md border border-white/50 p-3 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-white/60">
                  <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 to-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
                  <Label htmlFor="confirmPassword" className="flex items-center gap-2 text-gray-700 mb-2 text-sm font-semibold">
                    <div className="p-1 bg-gradient-to-r from-pink-500 to-red-600 rounded-lg text-white shadow-lg">
                      <Lock className="w-3 h-3" />
                    </div>
                    <span>Confirm Password *</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                      required
                      className="bg-white/70 backdrop-blur-sm border-white/60 text-gray-800 placeholder:text-gray-500 focus:border-pink-400 focus:ring-pink-400/20 h-10 rounded-xl text-sm font-medium shadow-inner pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800 transition-colors duration-300"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Enhanced Resume Upload Section - Full Width */}
              <div className="group relative bg-white/40 backdrop-blur-md border border-white/50 p-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-white/60 col-span-full">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
                <Label htmlFor="resume" className="flex items-center gap-3 text-gray-700 mb-3 text-base font-semibold">
                  <div className="p-1.5 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl text-white shadow-lg">
                    <FileText className="w-4 h-4" />
                  </div>
                  <span>Resume/CV *</span>
                </Label>
                <div className="flex items-center gap-4">
                  <div className="flex-1 relative">
                    <Input
                      id="resume"
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileChange}
                      required
                      className="bg-white/70 backdrop-blur-sm border-white/60 text-gray-800 file:bg-gradient-to-r file:from-cyan-500 file:to-blue-600 file:text-white file:border-0 file:rounded-lg file:px-4 file:py-2 file:mr-3 file:font-semibold focus:border-cyan-400 focus:ring-cyan-400/20 h-11 rounded-xl text-sm shadow-inner"
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <Upload className="h-5 w-5 text-cyan-600" />
                    </div>
                  </div>
                  {formData.resume && (
                    <div className="flex items-center gap-2 px-3 py-2 bg-white/60 rounded-xl border border-white/60 min-w-fit">
                      <div className="p-1.5 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg">
                        <FileText className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <p className="text-gray-800 font-semibold text-sm">{formData.resume.name}</p>
                        <p className="text-gray-600 text-xs">({(formData.resume.size / 1024 / 1024).toFixed(2)} MB)</p>
                      </div>
                      <div className="p-1.5 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg">
                        <CheckCircle className="h-4 w-4 text-white" />
                      </div>
                    </div>
                  )}
                </div>
                <p className="text-gray-500 text-sm mt-2 text-center">Accepted formats: PDF, DOC, DOCX (Max 5MB)</p>
              </div>

              {/* Enhanced Submit Button */}
              <div className="pt-4 col-span-full">
                <Button
                  type="submit"
                  className="group relative overflow-hidden w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white font-bold py-5 text-lg rounded-3xl shadow-2xl hover:shadow-3xl hover:shadow-blue-500/30 transition-all duration-700 transform hover:scale-105 border-2 border-white/20"
                  disabled={isLoading}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1200"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative">
                    {isLoading ? (
                      <div className="flex items-center justify-center gap-3">
                        <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Processing Application...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-3">
                        <GraduationCap className="w-6 h-6 group-hover:rotate-12 transition-transform duration-500" />
                        <span>Register & Apply</span>
                        <Send className="w-6 h-6 group-hover:translate-x-2 group-hover:scale-110 transition-all duration-500" />
                      </div>
                    )}
                  </div>
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl blur opacity-20 group-hover:opacity-40 transition-opacity duration-500 -z-10"></div>
                </Button>

                <div className="text-center mt-5">
                  <p className="text-gray-600 text-base">
                    Already have an account?{" "}
                    <Link href="/intern/login" className="text-blue-600 hover:text-indigo-700 font-semibold underline hover:no-underline transition-all duration-300">
                      Login here
                    </Link>
                  </p>
                </div>
              </div>
            </form>
          </OptimizedCardContent>
        </OptimizedCard>

        {/* Admin Access
        <div className="text-center mt-8">
          <Link href="/admin/login" className="text-sm text-gray-500 hover:text-gray-700 transition-colors underline">
            Admin Access
          </Link>
        </div> */}
      </div>
      {/* <Button
      className="mt-6"
      variant="outline"
      onClick={() =>
        toast({
          title:"Toast Test",
          description: "If you see this, your toast is working",
        })
      }
      >
        Trigger Test Toast
      </Button> */}


    </div>
  )
}

