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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 opacity-20">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 25% 25%, rgba(156, 146, 172, 0.1) 0%, transparent 50%), 
                       radial-gradient(circle at 75% 75%, rgba(156, 146, 172, 0.1) 0%, transparent 50%)`,
            }}
          ></div>
        </div>

        <Card className="w-full max-w-lg bg-white/30 backdrop-blur-2xl border border-white/30 shadow-2xl animate-fade-in-up">
          <CardContent className="pt-10 md:pt-12 text-center relative">
            {/* Success animation */}
            <div className="relative mb-6 md:mb-8">
              <div className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full mx-auto flex items-center justify-center shadow-2xl animate-bounce">
                <CheckCircle className="h-10 w-10 md:h-12 md:w-12 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 md:w-8 md:h-8 bg-yellow-400 rounded-full flex items-center justify-center animate-pulse">
                <Sparkles className="h-3 w-3 md:h-4 md:w-4 text-yellow-800" />
              </div>
            </div>

            <h2 className="text-2xl md:text-3xl font-black text-gray-800 mb-4">Application Submitted!</h2>
            <p className="text-gray-700 mb-6 md:mb-8 text-base md:text-lg leading-relaxed">
              🎉 Congratulations! Your application has been successfully submitted.
              <br />
              <span className="text-blue-600">We'll review it and get back to you within 48 hours.</span>
            </p>

            <div className="bg-white/20 backdrop-blur-sm border border-white/20 rounded-2xl p-5 md:p-6 mb-6 md:mb-8">
              <h3 className="text-gray-800 font-semibold mb-3">What happens next?</h3>
              <div className="space-y-2 text-gray-700 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span>Application review (24-48 hours)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span>Technical assessment (if selected)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  <span>Final interview & onboarding</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Link href="/">
                <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 md:py-4 text-base md:text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                  Back to Home
                </Button>
              </Link>
              <Link href="/intern/login">
                <Button
                  variant="outline"
                  className="w-full bg-white/20 border-white/30 text-gray-700 hover:bg-white/40 font-semibold py-3 md:py-4 text-base md:text-lg rounded-xl"
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden page-transition w-full min-w-0">
      {/* Header */}
      <header className="relative z-20 flex items-center justify-between p-4 md:p-6 bg-white/10 backdrop-blur-md border-b border-white/20 flex-wrap min-w-0">
        <Link
          href="/"
          className="flex items-center gap-2 text-white bg-blue-600 hover:bg-blue-700 transition-colors font-medium px-4 py-2 md:px-6 md:py-2.5 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 duration-300 text-sm md:text-base"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <div className="flex items-center gap-3 md:gap-4">
          <Link href="/intern/login">
            <Button variant="outline" className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-4 md:px-6 text-sm md:text-base shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
              Login
            </Button>
          </Link>
        </div>
      </header>

      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-blue-200/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-200/15 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 container mx-auto max-w-4xl py-6 md:py-8 px-4 min-w-0 overflow-x-auto">
        {/* Welcome Section */}
        <div className="text-center mb-10 md:mb-12 animate-fade-in-up">
          <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl mx-auto mb-5 md:mb-6 flex items-center justify-center shadow-xl animate-float">
            <GraduationCap className="w-8 h-8 md:w-10 md:h-10 text-white" />
          </div>
          <h2 className="text-2xl md:text-4xl font-bold text-gray-800 mb-3 md:mb-4">Ready to Start Your Journey?</h2>
          <p className="text-base md:text-xl text-gray-600 mb-6 md:mb-8">
            Join our internship program and kickstart your career in technology
          </p>
        </div>

        {/* Application Form */}
        <Card className="bg-white/40 backdrop-blur-2xl border border-white/30 shadow-2xl min-w-0 animate-fade-in-up">
          <CardHeader className="text-center pb-6 md:pb-8">
            <CardTitle className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Join Our Internship Program</CardTitle>
            <CardDescription className="text-gray-600 text-base md:text-lg">
              Create your account and start your career journey
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className={cn("space-y-6 md:space-y-8", isLoading && "opacity-50 pointer-events-none")}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 min-w-0 overflow-x-auto">
                <div className="space-y-3">
                  <Label htmlFor="name" className="text-gray-700 font-semibold flex items-center gap-2">
                    <User className="h-4 w-4 text-blue-600" />
                    Full Name *
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    required
                    className="bg-white/50 backdrop-blur-sm border-white/40 text-gray-800 placeholder:text-gray-500 focus:border-blue-400 focus:ring-blue-400/20 h-10 md:h-12 rounded-xl transition-all duration-300 hover:shadow-md"
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="email" className="text-gray-700 font-semibold flex items-center gap-2">
                    <Mail className="h-4 w-4 text-blue-600" />
                    Email Address *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    required
                    className="bg-white/50 backdrop-blur-sm border-white/40 text-gray-800 placeholder:text-gray-500 focus:border-blue-400 focus:ring-blue-400/20 h-10 md:h-12 rounded-xl transition-all duration-300 hover:shadow-md"
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="phone" className="text-gray-700 font-semibold flex items-center gap-2">
                    <Phone className="h-4 w-4 text-blue-600" />
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
                    className="bg-white/50 backdrop-blur-sm border-white/40 text-gray-800 placeholder:text-gray-500 focus:border-blue-400 focus:ring-blue-400/20 h-10 md:h-12 rounded-xl transition-all duration-300 hover:shadow-md"
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="domain" className="text-gray-700 font-semibold flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-orange-600" />
                    Domain *
                  </Label>
                  <Select
                    value={formData.domain}
                    onValueChange={(value) => handleInputChange("domain", value)}
                    required
                  >
                    <SelectTrigger className="bg-white/10 border-blue-500/20 text-gray-800 h-10 md:h-12 rounded-xl hover:shadow-md transition-all duration-300">
                      <SelectValue placeholder="Select your domain" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-grey-500">
                      {domainOptions.map((d: { value: string; label: string }) => (
                        <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                </div>

                <div className="space-y-3">
                  <Label htmlFor="password" className="text-gray-700 font-semibold flex items-center gap-2">
                    <Lock className="h-4 w-4 text-purple-600" />
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
                      className="bg-white/50 backdrop-blur-sm border-white/40 text-gray-800 placeholder:text-gray-500 focus:border-purple-400 focus:ring-purple-400/20 h-10 md:h-12 rounded-xl pr-10 md:pr-12 transition-all duration-300 hover:shadow-md"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800 transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4 md:h-5 md:w-5" /> : <Eye className="h-4 w-4 md:h-5 md:w-5" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="confirmPassword" className="text-gray-700 font-semibold flex items-center gap-2">
                    <Lock className="h-4 w-4 text-purple-600" />
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
                      className="bg-white/50 backdrop-blur-sm border-white/40 text-gray-800 placeholder:text-gray-500 focus:border-purple-400 focus:ring-purple-400/20 h-10 md:h-12 rounded-xl pr-10 md:pr-12 transition-all duration-300 hover:shadow-md"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800 transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4 md:h-5 md:w-5" /> : <Eye className="h-4 w-4 md:h-5 md:w-5" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Resume Upload */}
              <div className="space-y-3">
                <Label htmlFor="resume" className="text-gray-700 font-semibold flex items-center gap-2">
                  <FileText className="h-4 w-4 text-cyan-600" />
                  Resume/CV *
                </Label>
                <div className="relative">
                  <Input
                    id="resume"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                    required
                    className="bg-white/50 backdrop-blur-sm border-white/40 text-gray-800 file:bg-gradient-to-r file:from-blue-500 file:to-indigo-500 file:text-white file:border-0 file:rounded-lg file:px-3 file:py-2 md:file:px-4 md:file:py-2.5 file:mr-4 focus:border-indigo-400 focus:ring-indigo-400/20 h-10 md:h-12 rounded-xl transition-all duration-300 hover:shadow-md"
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <Upload className="h-4 w-4 md:h-5 md:w-5 text-cyan-600" />
                  </div>
                </div>
                {formData.resume && (
                  <div className="flex items-center gap-2 text-gray-700 text-sm animate-fade-in">
                    <FileText className="h-4 w-4 text-cyan-600" />
                    <span className="truncate max-w-xs">{formData.resume.name}</span>
                    <span className="text-gray-500">({(formData.resume.size / 1024 / 1024).toFixed(2)} MB)</span>
                  </div>
                )}
                <p className="text-gray-500 text-xs">Accepted formats: PDF, DOC, DOCX (Max 5MB)</p>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-3 md:py-4 text-base md:text-xl rounded-2xl shadow-2xl hover:shadow-blue-500/25 transition-all duration-500 group relative overflow-hidden transform hover:scale-105"
                disabled={isLoading}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                {isLoading ? (
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 md:w-6 md:h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Processing Application...
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    Register & Apply
                    <Send className="h-4 w-4 md:h-5 md:w-5 group-hover:translate-x-1 transition-transform" />
                  </div>
                )}
              </Button>

              <div className="text-center">
                <p className="text-gray-600 text-sm">
                  Already have an account?{" "}
                  <Link href="/intern/login" className="text-blue-600 hover:text-indigo-700 font-medium transition-colors">
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
