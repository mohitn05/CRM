"use client"

import { getDomainOptions } from "@/lib/domains"
import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
import { useState } from "react"

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
  const [formData, setFormData] = useState<FormDataType>({
    name: "",
    email: "",
    phone: "",
    domain: "",
    password: "",
    confirmPassword: "",
    resume: null,
  })
  const [domainOptions, setDomainOptions] = useState(getDomainOptions())
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Validate full name: only letters and spaces allowed
    if (!/^[A-Za-z ]+$/.test(formData.name.trim())) {
      toast({
        title: "Invalid Name",
        description: "Full name should only contain letters and spaces. No digits or special characters allowed.",
        variant: "destructive",
      })
      return
    }

    // Validate Phone number format : should be 10 digits
    if (!/^\d{10}$/.test(formData.phone)) {
      toast({
        title: "Invalid Phone Number",
        description: "Phone number must be 10 digits long.",
        variant: "destructive",
      })
      return
    }

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Password and confirm password do not match.",
        variant: "destructive",
      })
      return
    }

    // Validate password strength
    if (formData.password.length < 6) {
      toast({
        title: "Weak Password",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitted(true)
      setIsLoading(false)
      toast({
        title: "Success",
        description: "Your application has been submitted successfully!",
      })
    }, 1200)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
      ...(field === "domain" && value !== "Others" ? { customDomain: "" } : {})
    }))
    if (field === "domain" && value !== "Others") {
      setDomainOptions(getDomainOptions())
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please upload a file smaller than 5MB.",
          variant: "destructive",
        })
        return
      }
      setFormData((prev) => ({ ...prev, resume: file }))
    }
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-50 to-indigo-100 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Enhanced animated background */}
        <div className="absolute inset-0 opacity-30">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 25% 25%, rgba(99, 102, 241, 0.15) 0%, transparent 50%), 
                       radial-gradient(circle at 75% 75%, rgba(139, 92, 246, 0.15) 0%, transparent 50%)`,
            }}
          ></div>
        </div>

        {/* Floating decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full blur-2xl opacity-20 animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-40 h-40 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full blur-2xl opacity-20 animate-pulse" style={{ animationDelay: "1s" }}></div>
          <div className="absolute top-1/3 left-1/4 w-24 h-24 bg-gradient-to-br from-indigo-400 to-blue-500 rounded-full blur-2xl opacity-20 animate-pulse" style={{ animationDelay: "2s" }}></div>
        </div>

        <Card className="w-full max-w-lg bg-white/50 backdrop-blur-3xl border border-white/50 shadow-3xl animate-fade-in-up">
          <CardContent className="pt-10 md:pt-12 text-center relative">
            {/* Success animation */}
            <div className="relative mb-6 md:mb-8">
              <div className="w-24 h-24 bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 rounded-full mx-auto flex items-center justify-center shadow-2xl animate-bounce">
                <CheckCircle className="h-12 w-12 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center animate-pulse">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
            </div>

            <h2 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-blue-700 via-purple-600 to-indigo-800 bg-clip-text text-transparent mb-4">Application Submitted!</h2>
            <p className="text-gray-700 mb-6 md:mb-8 text-base md:text-lg leading-relaxed">
              🎉 Congratulations! Your application has been successfully submitted.
              <br />
              <span className="text-blue-600 font-semibold">We'll review it and get back to you within 48 hours.</span>
            </p>

            <div className="bg-gradient-to-br from-blue-50/50 via-purple-50/50 to-indigo-50/50 backdrop-blur-sm border border-white/30 rounded-3xl p-6 mb-6 md:mb-8 shadow-lg">
              <h3 className="text-gray-800 font-bold text-lg mb-3">What happens next?</h3>
              <div className="space-y-3 text-gray-700 text-sm">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full"></div>
                  <span>Application review (24-48 hours)</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full"></div>
                  <span>Technical assessment (if selected)</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-gradient-to-br from-indigo-400 to-blue-500 rounded-full"></div>
                  <span>Final interview & onboarding</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <Link href="/">
                <Button className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-800 text-white font-bold py-4 text-lg rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105">
                  Back to Home
                </Button>
              </Link>
              <Link href="/intern/login">
                <Button
                  variant="outline"
                  className="w-full bg-white/30 border-white/40 text-gray-800 hover:bg-white/50 font-bold py-4 text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500"
                >
                  Login to Dashboard
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-indigo-50 to-purple-100 relative overflow-hidden page-transition w-full min-w-0">
      {/* Enhanced Header with gradient */}
      <header className="relative z-20 flex items-center justify-between p-4 md:p-6 bg-white/20 backdrop-blur-md border-b border-white/30 flex-wrap min-w-0">
        <Link
          href="/"
          className="flex items-center gap-2 text-white bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 transition-all font-bold px-5 py-3 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 duration-300 text-sm md:text-base"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Home
        </Link>

        <div className="flex items-center gap-3 md:gap-4">
          <Link href="/intern/login">
            <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold rounded-2xl px-5 py-3 text-sm md:text-base shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
              Login
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

      <div className="relative z-10 container mx-auto max-w-4xl py-8 md:py-12 px-4 min-w-0 overflow-x-auto">
        {/* Enhanced Welcome Section */}
        <div className="text-center mb-12 md:mb-16 animate-fade-in-up">
          <div className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 rounded-3xl mx-auto mb-6 md:mb-8 flex items-center justify-center shadow-2xl animate-float">
            <GraduationCap className="w-10 h-10 md:w-12 md:h-12 text-white" />
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold bg-gradient-to-r from-blue-700 via-purple-600 to-indigo-800 bg-clip-text text-transparent mb-4">Ready to Start Your Journey?</h2>
          <p className="text-lg md:text-2xl text-gray-700 mb-8">
            Join our internship program and kickstart your career in technology
          </p>
        </div>

        {/* Enhanced Application Form */}
        <Card className="bg-white/50 backdrop-blur-3xl border border-white/40 shadow-3xl min-w-0 animate-fade-in-up">
          <CardHeader className="text-center pb-8">
            <CardTitle className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-blue-700 via-purple-600 to-indigo-800 bg-clip-text text-transparent mb-3">Join Our Internship Program</CardTitle>
            <CardDescription className="text-gray-700 text-lg md:text-xl">
              Create your account and start your career journey
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className={cn("space-y-8 md:space-y-10", isLoading && "opacity-50 pointer-events-none")}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6 min-w-0 overflow-x-auto">
                <div className="space-y-3">
                  <Label htmlFor="name" className="text-gray-800 font-bold flex items-center gap-2 text-base">
                    <div className="bg-gradient-to-br from-blue-500 to-indigo-500 p-1.5 rounded-lg">
                      <User className="h-4 w-4 text-white" />
                    </div>
                    Full Name *
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    required
                    className="bg-white/60 backdrop-blur-sm border-white/50 text-gray-800 placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500/30 h-11 rounded-xl transition-all duration-500 hover:shadow-md"
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="email" className="text-gray-800 font-bold flex items-center gap-2 text-base">
                    <div className="bg-gradient-to-br from-indigo-500 to-purple-500 p-1.5 rounded-lg">
                      <Mail className="h-4 w-4 text-white" />
                    </div>
                    Email Address *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    required
                    className="bg-white/60 backdrop-blur-sm border-white/50 text-gray-800 placeholder:text-gray-500 focus:border-indigo-500 focus:ring-indigo-500/30 h-11 rounded-xl transition-all duration-500 hover:shadow-md"
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="phone" className="text-gray-800 font-bold flex items-center gap-2 text-base">
                    <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-1.5 rounded-lg">
                      <Phone className="h-4 w-4 text-white" />
                    </div>
                    Phone Number *
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="Enter your phone number"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    maxLength={10}
                    required
                    className="bg-white/60 backdrop-blur-sm border-white/50 text-gray-800 placeholder:text-gray-500 focus:border-purple-500 focus:ring-purple-500/30 h-11 rounded-xl transition-all duration-500 hover:shadow-md"
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="domain" className="text-gray-800 font-bold flex items-center gap-2 text-base">
                    <div className="bg-gradient-to-br from-pink-500 to-orange-500 p-1.5 rounded-lg">
                      <Building2 className="h-4 w-4 text-white" />
                    </div>
                    Domain *
                  </Label>
                  <Select
                    value={formData.domain}
                    onValueChange={(value) => handleInputChange("domain", value)}
                    required
                  >
                    <SelectTrigger className="bg-white/60 border-white/50 text-gray-800 h-11 rounded-xl hover:shadow-md transition-all duration-500">
                      <SelectValue placeholder="Select your domain" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-white/30 backdrop-blur-2xl rounded-xl shadow-lg">
                      {domainOptions.map((d: { value: string; label: string }) => (
                        <SelectItem key={d.value} value={d.value} className="hover:bg-white/20 rounded-lg">{d.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="password" className="text-gray-800 font-bold flex items-center gap-2 text-base">
                    <div className="bg-gradient-to-br from-orange-500 to-red-500 p-1.5 rounded-lg">
                      <Lock className="h-4 w-4 text-white" />
                    </div>
                    Password *
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a password"
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      required
                      className="bg-white/60 backdrop-blur-sm border-white/50 text-gray-800 placeholder:text-gray-500 focus:border-orange-500 focus:ring-orange-500/30 h-11 rounded-xl pr-10 transition-all duration-500 hover:shadow-md"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800 transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="confirmPassword" className="text-gray-800 font-bold flex items-center gap-2 text-base">
                    <div className="bg-gradient-to-br from-red-500 to-pink-500 p-1.5 rounded-lg">
                      <Lock className="h-4 w-4 text-white" />
                    </div>
                    Confirm Password *
                  </Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                      required
                      className="bg-white/60 backdrop-blur-sm border-white/50 text-gray-800 placeholder:text-gray-500 focus:border-red-500 focus:ring-red-500/30 h-11 rounded-xl pr-10 transition-all duration-500 hover:shadow-md"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800 transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Enhanced Resume Upload */}
              <div className="space-y-3">
                <Label htmlFor="resume" className="text-gray-800 font-bold flex items-center gap-2 text-base">
                  <div className="bg-gradient-to-br from-cyan-500 to-blue-500 p-1.5 rounded-lg">
                    <FileText className="h-4 w-4 text-white" />
                  </div>
                  Resume/CV *
                </Label>
                <div className="relative">
                  <Input
                    id="resume"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                    required
                    className="bg-white/60 backdrop-blur-sm border-white/50 text-gray-800 file:bg-gradient-to-r file:from-blue-500 file:via-indigo-500 file:to-purple-600 file:text-white file:border-0 file:rounded file:px-2 file:py-1 file:mr-1.5 file:text-sm focus:border-cyan-500 focus:ring-cyan-500/30 h-11 rounded-xl transition-all duration-500 hover:shadow-md"
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <Upload className="h-4 w-4 text-cyan-600" />
                  </div>
                </div>
                {formData.resume && (
                  <div className="flex items-center gap-3 text-gray-800 font-medium text-base animate-fade-in">
                    <FileText className="h-5 w-5 text-cyan-600" />
                    <span className="truncate max-w-xs">{formData.resume.name}</span>
                    <span className="text-gray-600">({(formData.resume.size / 1024 / 1024).toFixed(2)} MB)</span>
                  </div>
                )}
                <p className="text-gray-600 text-sm">Accepted formats: PDF, DOC, DOCX (Max 5MB)</p>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-800 text-white font-bold py-4 text-xl rounded-3xl shadow-2xl hover:shadow-blue-500/30 transition-all duration-500 group relative overflow-hidden transform hover:scale-105"
                disabled={isLoading}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                {isLoading ? (
                  <div className="flex items-center gap-4">
                    <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Processing Application...
                  </div>
                ) : (
                  <div className="flex items-center gap-4">
                    Register & Apply
                    <Send className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </div>
                )}
              </Button>

              <div className="text-center">
                <p className="text-gray-700 text-base">
                  Already have an account?{" "}
                  <Link href="/intern/login" className="text-blue-600 hover:text-indigo-700 font-bold transition-colors underline">
                    Login here
                  </Link>
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}