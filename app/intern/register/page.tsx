"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Upload, User, Mail, Phone, Building2, Lock, Eye, EyeOff, CheckCircle, Sparkles } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function InternRegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    domain: "",
    password: "",
    confirmPassword: "",
    resume: null as File | null,
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

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
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Save application to localStorage
    const applications = JSON.parse(localStorage.getItem("applications") || "[]")
    const internAccounts = JSON.parse(localStorage.getItem("internAccounts") || "[]")

    const newApplication = {
      id: Date.now(),
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      domain: formData.domain,
      resumeName: formData.resume?.name,
      status: "Applied",
      dateApplied: new Date().toISOString().split("T")[0],
    }

    const newAccount = {
      id: Date.now(),
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
      domain: formData.domain,
      applicationId: newApplication.id,
      status: "Applied",
      dateRegistered: new Date().toISOString(),
    }

    applications.push(newApplication)
    internAccounts.push(newAccount)

    localStorage.setItem("applications", JSON.stringify(applications))
    localStorage.setItem("internAccounts", JSON.stringify(internAccounts))

    setIsLoading(false)
    setShowSuccess(true)
  }

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-white relative overflow-hidden flex items-center justify-center p-4">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 right-20 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center animate-pulse">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div className="absolute -top-40 -left-40 w-80 h-80 bg-emerald-100/50 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-green-100/50 rounded-full blur-3xl"></div>
        </div>

        <Card className="relative z-10 w-full max-w-md bg-white/20 backdrop-blur-xl border border-gray-200/50 shadow-2xl">
          <CardContent className="p-8 text-center">
            {/* Success Icon */}
            <div className="relative mb-8">
              <div className="w-20 h-20 bg-emerald-500 rounded-full mx-auto flex items-center justify-center shadow-2xl">
                <CheckCircle className="w-12 h-12 text-white" />
              </div>
            </div>

            {/* Success Message */}
            <h2 className="text-3xl font-bold text-black mb-4">Application Submitted!</h2>

            <div className="mb-6">
              <p className="text-black text-lg mb-2">
                🎉 Congratulations! Your application has been successfully submitted.
              </p>
              <p className="text-gray-700 text-base">We'll review it and get back to you within 48 hours.</p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                onClick={() => router.push("/")}
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 h-12 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Back to Home
              </Button>
              <Button
                onClick={() => router.push("/intern/login")}
                variant="outline"
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white border-emerald-500 hover:border-emerald-600 font-semibold py-3 h-12 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Login to Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
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
          <Link href="/intern/login">
            <Button variant="outline" className="bg-white/20 border-white/30 text-gray-700 hover:bg-white/30">
              Login
            </Button>
          </Link>
        </div>
      </header>

      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-emerald-200/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-green-200/15 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Join Our Internship Program</h1>
            <p className="text-gray-600 text-lg">Create your account and start your career journey</p>
          </div>

          <Card className="bg-white/20 backdrop-blur-md border border-white/30 shadow-xl">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-2xl font-bold text-gray-800">Register for Internship</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="flex items-center gap-2 text-gray-700 font-medium">
                      <User className="w-4 h-4" />
                      Full Name *
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                      required
                      className="bg-white/50 backdrop-blur-sm border-white/40 focus:border-emerald-400 focus:ring-emerald-400/20 h-12"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center gap-2 text-gray-700 font-medium">
                      <Mail className="w-4 h-4" />
                      Email Address *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                      required
                      className="bg-white/50 backdrop-blur-sm border-white/40 focus:border-emerald-400 focus:ring-emerald-400/20 h-12"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="flex items-center gap-2 text-gray-700 font-medium">
                      <Phone className="w-4 h-4" />
                      Phone Number *
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="Enter your phone number"
                      value={formData.phone}
                      onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                      required
                      className="bg-white/50 backdrop-blur-sm border-white/40 focus:border-emerald-400 focus:ring-emerald-400/20 h-12"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center gap-2 text-gray-700 font-medium">
                      <Building2 className="w-4 h-4" />
                      Domain *
                    </Label>
                    <Select
                      value={formData.domain}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, domain: value }))}
                      required
                    >
                      <SelectTrigger className="bg-white/50 backdrop-blur-sm border-white/40 focus:border-emerald-400 focus:ring-emerald-400/20 h-12">
                        <SelectValue placeholder="Select your domain" />
                      </SelectTrigger>
                      <SelectContent className="bg-white/95 backdrop-blur-md border-white/40">
                        <SelectItem value="Frontend">🎨 Frontend Development</SelectItem>
                        <SelectItem value="Backend">⚙️ Backend Development</SelectItem>
                        <SelectItem value="Database">🗄️ Database Management</SelectItem>
                        <SelectItem value="Others">🚀 Others</SelectItem>
                      </SelectContent>
                    </Select>
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
                        placeholder="Create a password"
                        value={formData.password}
                        onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
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

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="flex items-center gap-2 text-gray-700 font-medium">
                      <Lock className="w-4 h-4" />
                      Confirm Password *
                    </Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm your password"
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                        required
                        className="bg-white/50 backdrop-blur-sm border-white/40 focus:border-emerald-400 focus:ring-emerald-400/20 h-12 pr-12"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800"
                      >
                        {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-gray-700 font-medium">
                    <Upload className="w-4 h-4" />
                    Resume/CV (Optional)
                  </Label>
                  <Input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => setFormData((prev) => ({ ...prev, resume: e.target.files?.[0] || null }))}
                    className="bg-white/50 backdrop-blur-sm border-white/40 focus:border-emerald-400 focus:ring-emerald-400/20 h-12 file:bg-emerald-500 file:text-white file:border-0 file:rounded-lg file:px-4 file:py-2 file:mr-4"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-semibold py-3 h-12 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  {isLoading ? "Creating Account..." : "Register & Apply"}
                </Button>

                <div className="text-center">
                  <p className="text-gray-600 text-sm">
                    Already have an account?{" "}
                    <Link href="/intern/login" className="text-emerald-600 hover:text-emerald-700 font-medium">
                      Login here
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
