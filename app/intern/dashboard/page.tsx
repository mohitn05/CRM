"use client"

import { NotificationBell } from "@/components/notification-bell"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { getDomainOptions } from "@/lib/domains"
import {
  Building2,
  Calendar,
  CheckCircle,
  Clock,
  Edit,
  FileText,
  LogOut,
  Mail,
  Phone,
  Save,
  Sparkles,
  Trash2,
  User,
  X,
  XCircle
} from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

interface InternAccount {
  id: number
  name: string
  email: string
  phone: string
  domain: string
  applicationId: number
  status: string
  dateRegistered: string
  resume?: {
    name: string
    size?: number
  } | null
}

const domainDisplayNames: { [key: string]: string } = {
  "Frontend Developer": "Frontend Developer",
  "Backend Developer": "Backend Developer",
  "Database Management": "Database Management",
  Others: "Others"
}

// Helper to normalize domain names
const normalizeDomain = (domain: string) => {
  // Trim whitespace and convert to consistent case for comparison
  const trimmedDomain = domain.trim();

  // Handle case-insensitive matching
  const lowerDomain = trimmedDomain.toLowerCase();

  if (lowerDomain === "frontend" || lowerDomain === "frontend developer") return "Frontend Developer";
  if (lowerDomain === "backend" || lowerDomain === "backend developer") return "Backend Developer";
  if (lowerDomain === "database" || lowerDomain === "database management") return "Database Management";
  if (lowerDomain === "web developer") return "Web Developer";
  if (lowerDomain === "android developer") return "Android Developer";
  if (lowerDomain === "full stack developer") return "Full Stack Developer";
  if (lowerDomain === "ui/ux designer" || lowerDomain === "uiux designer") return "UI/UX Designer";
  if (lowerDomain === "digital marketing") return "Digital Marketing";
  return domain;
};

export default function InternDashboardPage() {
  const [domainOptions, setDomainOptions] = useState(getDomainOptions())
  const [internData, setInternData] = useState<InternAccount | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState<InternAccount | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const authData = localStorage.getItem("internAuth")
    if (!authData) {
      router.push("/intern/login")
      return
    }

    const account = JSON.parse(authData)

    // Fetch latest data from API to ensure we have current status
    const fetchLatestData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/students/${account.id}`)
        if (response.ok) {
          const latestData = await response.json()
          const updatedAccount = {
            id: latestData.id,
            name: latestData.name,
            email: latestData.email,
            phone: latestData.phone,
            domain: latestData.domain,
            applicationId: latestData.id,
            status: latestData.status,
            dateRegistered: latestData.dateApplied,
            resume: latestData.resumeName ? { name: latestData.resumeName, size: undefined } : null
          }
          setInternData(updatedAccount)
          setEditData(updatedAccount)
          // Update localStorage with latest data
          localStorage.setItem("internAuth", JSON.stringify(updatedAccount))
        } else {
          // If API fails, use stored data and show error message
          setInternData(account)
          setEditData(account)
          toast({
            title: "Data Fetch Warning",
            description: `Failed to fetch latest data from server (Status: ${response.status}). Displaying cached data.`,
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error("Error fetching latest data:", error)
        // If API fails, use stored data and show error message
        setInternData(account)
        setEditData(account)
        toast({
          title: "Network Error",
          description: "Failed to connect to server. Displaying cached data. Please check your connection.",
          variant: "destructive",
        })
      }
    }

    fetchLatestData()
  }, [router])

  const handleSave = async () => {
    if (!editData || !internData) return;

    // Check if the application is locked
    if (internData.status !== "Applied") {
      toast({
        title: "🚫 Save Unavailable",
        description: "You cannot save changes to your information right now. If you need to update your details, please contact support.",
        variant: "destructive"
      });
      return;
    }

    // Custom domain logic removed
    if (editData.domain === "Others") {
      editData.domain = "Others"; // Set to default or handle as needed
    }

    setIsLoading(true);

    // Detect changed fields
    const changedFields: string[] = [];
    if (editData.name !== internData.name) changedFields.push("name");
    if (editData.email !== internData.email) changedFields.push("email");
    if (editData.phone !== internData.phone) changedFields.push("phone");
    if (editData.domain !== internData.domain) changedFields.push("domain");

    try {
      // Prepare data for update
      const updateData: any = {
        name: editData.name,
        email: editData.email,
        phone: editData.phone,
        domain: editData.domain,
      };

      // Handle resume update if file is selected and user is in Applied status
      let resumeUpdated = false;
      if (editData.resume && internData.status === "Applied") {
        resumeUpdated = true;
      }

      const response = await fetch(`http://localhost:5000/api/students/${editData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });
      if (response.ok) {
        const result = await response.json();
        const updatedInternData = {
          id: result.student.id,
          name: result.student.name,
          email: result.student.email,
          phone: result.student.phone,
          domain: result.student.domain,
          applicationId: result.student.id,
          status: result.student.status,
          dateRegistered: result.student.dateApplied,
          resume: editData.resume || null
        };

        setInternData(updatedInternData);
        setEditData(updatedInternData);
        localStorage.setItem("internAuth", JSON.stringify(updatedInternData));

        setIsEditing(false)

        // Notify admin of changes
        if (changedFields.length > 0 || resumeUpdated) {
          try {
            let details = [];
            if (changedFields.includes("name")) {
              details.push(`Name changed to: ${editData.name}`);
            }
            if (changedFields.includes("email")) {
              details.push(`Email changed to: ${editData.email}`);
            }
            if (changedFields.includes("phone")) {
              details.push(`Phone changed to: ${editData.phone}`);
            }
            if (changedFields.includes("domain")) {
              details.push(`Domain changed from ${internData.domain} to ${editData.domain}`);
            }
            if (resumeUpdated) {
              details.push(`Resume updated`);
            }
            const notifyRes = await fetch("http://localhost:5000/api/admin/1/notifications", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                title: `Intern Profile Updated`,
                message: `Name: ${editData.name}\nEmail: ${editData.email}\n${details.join("\n")}`,
                type: "profile_edit"
              })
            });
            if (!notifyRes.ok) {
              toast({
                title: "Notification Failed",
                description: `Failed to notify admin. Server responded with status: ${notifyRes.status}`,
                variant: "destructive",
              });
            }
          } catch (err) {
            toast({
              title: "Notification Failed",
              description: "Failed to connect to server for admin notification. Please check your network connection.",
              variant: "destructive",
            });
          }
        }

        toast({
          title: "Profile Updated! ✅",
          description: "Your information has been updated successfully.",
        })
      } else {
        const error = await response.json()
        toast({
          title: "Update Failed",
          description: error.message || `Failed to update profile. Server responded with status: ${response.status}`,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error updating profile:", error)
      toast({
        title: "Update Failed",
        description: "Failed to connect to server",
        variant: "destructive",
      })
    }

    setIsLoading(false)
  }

  const handleLogout = () => {
    localStorage.removeItem("internAuth")
    toast({
      title: "Logged Out Successfully ✅",
      description: "Thank you for using our platform!",
    })
    router.push("/")
  }

  const deleteApplication = async () => {
    if (!internData?.id) return

    const confirmed = window.confirm(
      "Are you sure you want to delete your application? This action cannot be undone and you will lose all your data."
    )

    if (!confirmed) return

    setIsLoading(true)

    try {
      const response = await fetch(`http://localhost:5000/api/students/${internData.id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        // Notify admin of deletion
        try {
          const notifyRes = await fetch("http://localhost:5000/api/admin/1/notifications", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              title: `Intern Application Deleted`,
              message: `Name: ${internData.name}\nEmail: ${internData.email}\nApplication deleted by intern`,
              type: "profile_delete"
            })
          });
          if (!notifyRes.ok) {
            toast({
              title: "Notification Failed",
              description: `Failed to notify admin. Server responded with status: ${notifyRes.status}`,
              variant: "destructive",
            });
          }
        } catch (err) {
          toast({
            title: "Notification Failed",
            description: "Failed to connect to server for admin notification. Please check your network connection.",
            variant: "destructive",
          });
        }

        localStorage.removeItem("internAuth")
        toast({
          title: "Application Deleted ✅",
          description: "Your application has been deleted successfully.",
        })
        router.push("/")
      } else {
        const errorResponse = await response.json();
        throw new Error(errorResponse.message || `Failed to delete application. Server responded with status: ${response.status}`);
      }
    } catch (error: any) {
      console.error("Error deleting application:", error)
      toast({
        title: "Delete Failed",
        description: (error as Error).message || "Failed to delete application. Please check your network connection and try again.",
        variant: "destructive",
      })
    }

    setIsLoading(false)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Applied":
        return "bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 text-white"
      case "Under Review":
      case "In Review":
        return "bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-white"
      case "Selected":
        return "bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 text-white"
      case "Rejected":
        return "bg-gradient-to-r from-rose-500 via-pink-500 to-fuchsia-500 text-white"
      case "In Training":
        return "bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-500 text-white"
      case "Completed":
        return "bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 text-white"
      default:
        return "bg-gradient-to-r from-gray-500 via-slate-500 to-zinc-500 text-white"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Selected":
      case "Completed":
        return <CheckCircle className="w-6 h-6" />
      case "Rejected":
        return <XCircle className="w-6 h-6" />
      case "In Training":
        return <FileText className="w-6 h-6" />
      default:
        return <Clock className="w-6 h-6" />
    }
  }

  const getStatusMessage = (status: string) => {
    switch (status) {
      case "Applied":
        return "Your application has been submitted and is waiting for initial review."
      case "Under Review":
      case "In Review":
        return "Your application is currently being reviewed by our team. We'll update you within 48 hours."
      case "Selected":
        return "🎉 Congratulations! You have been selected for the internship program. Check your email for next steps."
      case "Rejected":
        return "Unfortunately, your application was not selected this time. Keep improving and apply again!"
      case "In Training":
        return "Welcome to the team! Your internship training has begun."
      case "Completed":
        return "Congratulations on completing your internship successfully!"
      default:
        return "Status update pending..."
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Check file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please upload a file smaller than 5MB.",
          variant: "destructive",
        })
        return
      }

      // Check file type
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "Invalid file type",
          description: "Please upload a PDF, DOC, or DOCX file.",
          variant: "destructive",
        })
        return
      }

      setEditData(prev => prev ? { ...prev, resume: { name: file.name, size: file.size } } : null)
    }
  }

  if (!internData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
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

        <div className="text-center relative z-10">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl mx-auto mb-6 flex items-center justify-center animate-pulse">
            <User className="w-8 h-8 text-white" />
          </div>
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg font-medium">Loading your dashboard...</p>
          <p className="text-gray-500 text-sm mt-2">Preparing your personalized experience</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 sm:p-6 md:p-8 relative overflow-hidden">
      {/* Enhanced Geometric Wave Background */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <svg
          className="absolute top-0 left-0 w-full h-full"
          viewBox="0 0 1200 800"
          preserveAspectRatio="none"
          fill="none"
        >
          <defs>
            <linearGradient id="dashboardGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.15" />
              <stop offset="50%" stopColor="#1d4ed8" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#1e40af" stopOpacity="0.05" />
            </linearGradient>

            <linearGradient id="dashboardGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.12" />
              <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#1d4ed8" stopOpacity="0.04" />
            </linearGradient>

            <linearGradient id="dashboardGradient3" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#93c5fd" stopOpacity="0.1" />
              <stop offset="50%" stopColor="#60a5fa" stopOpacity="0.06" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.03" />
            </linearGradient>

            {/* Additional gradients to match apply page */}
            <linearGradient id="dashboardGradient4" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.1" />
              <stop offset="50%" stopColor="#a855f7" stopOpacity="0.06" />
              <stop offset="100%" stopColor="#c084fc" stopOpacity="0.03" />
            </linearGradient>
          </defs>

          {/* Top flowing wave */}
          <path d="M0,150 Q200,50 400,120 T800,100 Q1000,80 1200,140 L1200,0 L0,0 Z" fill="url(#dashboardGradient1)" />

          {/* Second wave layer */}
          <path d="M0,250 Q300,150 600,220 T1200,200 L1200,0 L0,0 Z" fill="url(#dashboardGradient2)" opacity="0.8" />

          {/* Bottom flowing wave */}
          <path d="M0,600 Q400,500 800,580 T1200,560 L1200,800 L0,800 Z" fill="url(#dashboardGradient3)" opacity="0.7" />

          {/* Additional wave to match apply page */}
          <path d="M0,400 Q250,350 500,420 T1000,380 Q1100,370 1200,410 L1200,800 L0,800 Z" fill="url(#dashboardGradient4)" opacity="0.6" />
        </svg>
      </div>

      {/* Floating geometric shapes with enhanced animations */}
      <div className="absolute inset-0 z-0 overflow-hidden hidden md:block">
        {/* Floating circles with pulse and bounce */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-200/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-indigo-300/15 rounded-full blur-lg animate-bounce" style={{ animationDelay: "1s" }}></div>
        <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-blue-100/20 rounded-full blur-2xl animate-pulse" style={{ animationDelay: "2s" }}></div>
        <div className="absolute bottom-20 right-1/3 w-28 h-28 bg-indigo-200/12 rounded-full blur-xl animate-bounce" style={{ animationDelay: "0.5s" }}></div>
        {/* Extra animated circles for more randomness */}
        <div className="absolute top-10 right-1/4 w-16 h-16 bg-purple-200/20 rounded-full blur-2xl animate-pulse" style={{ animationDelay: "1.5s" }}></div>
        <div className="absolute bottom-10 left-1/5 w-24 h-24 bg-pink-200/20 rounded-full blur-2xl animate-bounce" style={{ animationDelay: "2.5s" }}></div>
        <div className="absolute top-1/2 left-1/2 w-20 h-20 bg-green-200/20 rounded-full blur-xl animate-pulse" style={{ animationDelay: "2.2s" }}></div>
        <div className="absolute top-1/3 right-1/5 w-28 h-28 bg-blue-300/20 rounded-full blur-2xl animate-bounce" style={{ animationDelay: "1.8s" }}></div>
        <div className="absolute bottom-1/4 right-1/6 w-14 h-14 bg-indigo-200/20 rounded-full blur-xl animate-pulse" style={{ animationDelay: "2.8s" }}></div>

        {/* Additional floating elements to match apply page */}
        <div className="absolute top-1/4 left-1/3 w-20 h-20 bg-gradient-to-br from-purple-300/20 to-pink-300/20 rounded-full blur-2xl animate-pulse" style={{ animationDelay: "0.8s" }}></div>
        <div className="absolute top-2/3 right-1/4 w-32 h-32 bg-gradient-to-br from-cyan-300/20 to-blue-300/20 rounded-full blur-2xl animate-bounce" style={{ animationDelay: "1.2s" }}></div>
        <div className="absolute bottom-1/3 left-1/5 w-24 h-24 bg-gradient-to-br from-amber-300/20 to-orange-300/20 rounded-full blur-2xl animate-pulse" style={{ animationDelay: "1.7s" }}></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 gap-4 bg-white/40 backdrop-blur-lg border border-white/50 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-500">
          <div className="relative">
            <div className="absolute -top-3 -left-3 w-24 h-24 rounded-full bg-gradient-to-br from-blue-400/20 to-purple-400/20 blur-xl"></div>
            <h1 className="text-3xl font-bold text-gray-900 bg-gradient-to-r from-blue-700 via-purple-600 to-indigo-800 bg-clip-text text-transparent relative z-10">Welcome, {internData.name}!</h1>
            <p className="text-gray-600 relative z-10">Intern Dashboard</p>
          </div>
          <div className="flex items-center space-x-4">
            <NotificationBell studentId={internData.id} />
            <Button
              onClick={handleLogout}
              className="group relative overflow-hidden bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-6 py-2.5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-red-400"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-red-400/20 to-red-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative flex items-center gap-2">
                <LogOut className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
                <span className="font-semibold">Logout</span>
              </div>
            </Button>
          </div>
        </header>

        {/* Grid Content - Optimized for better space utilization */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card - Now takes full width on mobile, 2/3 on large screens */}
          <div className="lg:col-span-2">
            <Card className="p-6 shadow-lg bg-white/50 backdrop-blur-3xl border border-white/50 rounded-2xl hover:shadow-2xl transition-all duration-500">
              <CardHeader className="p-0 mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative">
                  <div className="absolute -top-3 -left-3 w-32 h-32 rounded-full bg-gradient-to-br from-blue-400/10 to-indigo-400/10 blur-xl"></div>
                  <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-3 relative z-10">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center shadow-lg">
                      <User className="w-6 h-6 text-white" />
                    </div>
                    <span className="bg-gradient-to-r from-blue-700 via-purple-600 to-indigo-800 bg-clip-text text-transparent">Profile Information</span>
                  </CardTitle>
                  {!isEditing ? (
                    <Button
                      onClick={() => {
                        if (internData.status === "Applied") {
                          setIsEditing(true);
                        } else {
                          toast({
                            title: "🚫 Edit Unavailable",
                            description: "You cannot edit your information right now. If you need to update your details, please contact support.",
                            variant: "destructive"
                          });
                        }
                      }}
                      className={`bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl ${internData.status !== "Applied" ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Profile
                    </Button>
                  ) : (
                    <div className="flex gap-3">
                      <Button
                        onClick={() => {
                          setIsEditing(false);
                          setEditData(internData)
                        }}
                        className="bg-gray-200 hover:bg-gray-300 text-gray-800 hover:scale-105 transition-all duration-300 shadow-md"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                      </Button>
                      <Button
                        onClick={handleSave}
                        disabled={isLoading}
                        className={`bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl ${internData.status !== "Applied" ? "opacity-50 cursor-not-allowed" : ""}`}
                      >
                        <Save className="w-4 h-4 mr-2" />
                        {isLoading ? "Saving..." : "Save Changes"}
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>

              <CardContent className="p-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {[
                    { label: "Full Name", value: internData.name, icon: <User className="text-white" />, key: "name", color: "from-blue-500 to-indigo-500" },
                    { label: "Email Address", value: internData.email, icon: <Mail className="text-white" />, key: "email", color: "from-indigo-500 to-purple-500" },
                    { label: "Phone Number", value: internData.phone, icon: <Phone className="text-white" />, key: "phone", color: "from-purple-500 to-pink-500" },
                  ].map(({ label, value, icon, key, color }) => (
                    <div key={key} className="bg-white/40 backdrop-blur-lg p-5 rounded-2xl border border-white/50 hover:shadow-lg transition-all duration-300 group relative overflow-hidden hover:-translate-y-1">
                      <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${color}`}></div>
                      <div className="absolute -top-3 -right-3 w-24 h-24 rounded-full bg-gradient-to-br from-white/20 to-transparent opacity-30"></div>
                      <Label className="flex items-center gap-2 text-gray-700 mb-2 font-medium">
                        <div className={`bg-gradient-to-br ${color} p-1.5 rounded-lg shadow-md`}>
                          {icon}
                        </div>
                        <span>{label}</span>
                      </Label>
                      {isEditing ? (
                        <Input
                          type={key === "phone" ? "tel" : "text"}
                          value={(editData as any)[key]}
                          onChange={(e) => setEditData(prev => prev ? { ...prev, [key]: e.target.value } : null)}
                          maxLength={key === "phone" ? 10 : undefined}
                          className="border-2 border-blue-200 focus:border-blue-400 focus:ring-blue-300/30 rounded-xl bg-white/50 backdrop-blur-sm"
                          disabled={internData.status !== "Applied"}
                          onFocus={(e) => {
                            if (internData.status !== "Applied") {
                              toast({
                                title: "🚫 Edit Unavailable",
                                description: "You cannot edit your information right now. If you need to update your details, please contact support.",
                                variant: "destructive"
                              });
                            }
                          }}
                        />
                      ) : (
                        <p className="text-gray-900 font-semibold pl-1 relative z-10">{value}</p>
                      )}
                    </div>
                  ))}

                  {/* Domain */}
                  <div className="bg-white/40 backdrop-blur-lg p-5 rounded-2xl border border-white/50 hover:shadow-lg transition-all duration-300 group relative overflow-hidden hover:-translate-y-1">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 to-orange-500"></div>
                    <div className="absolute -top-3 -right-3 w-24 h-24 rounded-full bg-gradient-to-br from-white/20 to-transparent opacity-30"></div>
                    <Label className="flex items-center gap-2 text-gray-700 mb-2 font-medium">
                      <div className="bg-gradient-to-br from-amber-500 to-orange-500 p-1.5 rounded-lg shadow-md">
                        <Building2 className="w-4 h-4 text-white" />
                      </div>
                      <span>Domain</span>
                    </Label>
                    {isEditing ? (
                      <Select
                        value={editData?.domain || ""}
                        onValueChange={(value) => {
                          if (internData.status !== "Applied") {
                            toast({
                              title: "🚫 Edit Unavailable",
                              description: "You cannot edit your domain right now. If you need to change your domain, please contact support.",
                              variant: "destructive"
                            });
                            return;
                          }
                          setEditData((p) => p ? { ...p, domain: value } : null);
                          setDomainOptions(getDomainOptions());
                        }}
                        disabled={internData.status !== "Applied"}
                      >
                        <SelectTrigger className="bg-white/50 backdrop-blur-sm text-black border-2 border-blue-200 focus:border-blue-400 focus:ring-blue-300/30 rounded-xl">
                          <SelectValue placeholder="Select Domain" />
                        </SelectTrigger>
                        <SelectContent className="bg-white/80 backdrop-blur-lg text-black border-blue-200 rounded-xl border border-white/50 shadow-lg">
                          {domainOptions.map((d: { value: string; label: string }) => (
                            <SelectItem key={d.value} value={d.value} className="hover:bg-blue-50 rounded-lg">{d.label.replace(/^[^ ]+ /, "")}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <Badge className="text-base px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl shadow-md">
                        {normalizeDomain(editData?.domain || internData.domain)}
                      </Badge>
                    )}
                  </div>

                  {/* Resume Upload */}
                  <div className="bg-white/40 backdrop-blur-lg p-5 rounded-2xl border border-white/50 hover:shadow-lg transition-all duration-300 group relative overflow-hidden hover:-translate-y-1">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-teal-500"></div>
                    <div className="absolute -top-3 -right-3 w-24 h-24 rounded-full bg-gradient-to-br from-white/20 to-transparent opacity-30"></div>
                    <Label className="flex items-center gap-2 text-gray-700 mb-2 font-medium">
                      <div className="bg-gradient-to-br from-emerald-500 to-teal-500 p-1.5 rounded-lg shadow-md">
                        <FileText className="w-4 h-4 text-white" />
                      </div>
                      <span>Resume</span>
                    </Label>
                    {isEditing ? (
                      <div className="space-y-3">
                        <Input
                          type="file"
                          accept=".pdf,.doc,.docx"
                          onChange={handleFileChange}
                          className="border-2 border-blue-200 focus:border-blue-400 focus:ring-blue-300/30 rounded-xl file:bg-gradient-to-r file:from-emerald-500 file:to-teal-500 file:text-white file:border-0 file:rounded-md file:px-2 file:py-1 file:text-sm bg-white/50 backdrop-blur-sm"
                          disabled={internData.status !== "Applied"}
                        />
                        {editData?.resume && (
                          <div className="flex items-center gap-2 text-gray-700 text-sm">
                            <FileText className="h-4 w-4 text-emerald-500" />
                            <span className="truncate max-w-xs">{editData.resume.name}</span>
                            {editData.resume.size && (
                              <span className="text-gray-500">({(editData.resume.size / 1024 / 1024).toFixed(2)} MB)</span>
                            )}
                          </div>
                        )}
                        <p className="text-gray-500 text-xs">Accepted formats: PDF, DOC, DOCX (Max 5MB)</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {internData.resume ? (
                          <div className="flex items-center gap-2">
                            <FileText className="h-5 w-5 text-emerald-500" />
                            <span className="text-gray-900 font-semibold truncate">{internData.resume.name || "resume.pdf"}</span>
                          </div>
                        ) : (
                          <p className="text-gray-500">No resume uploaded</p>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-2 bg-gradient-to-r from-emerald-500/50 to-teal-500/50 hover:from-emerald-500/80 hover:to-teal-500/80 border border-emerald-200/50 text-emerald-700 hover:text-emerald-900"
                          onClick={() => {
                            if (internData.status === "Applied") {
                              setIsEditing(true);
                            } else {
                              toast({
                                title: "🚫 Edit Unavailable",
                                description: "You cannot edit your resume right now. If you need to update your resume, please contact support.",
                                variant: "destructive"
                              });
                            }
                          }}
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Update Resume
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Registration Date */}
                  <div className="bg-white/40 backdrop-blur-lg p-5 rounded-2xl border border-white/50 hover:shadow-lg transition-all duration-300 group relative overflow-hidden hover:-translate-y-1">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-blue-500"></div>
                    <div className="absolute -top-3 -right-3 w-24 h-24 rounded-full bg-gradient-to-br from-white/20 to-transparent opacity-30"></div>
                    <Label className="flex items-center gap-2 text-gray-700 mb-2 font-medium">
                      <div className="bg-gradient-to-br from-cyan-500 to-blue-500 p-1.5 rounded-lg shadow-md">
                        <Calendar className="w-4 h-4 text-white" />
                      </div>
                      <span>Registration Date</span>
                    </Label>
                    <p className="text-gray-900 font-semibold pl-1 relative z-10">
                      {internData.dateRegistered && !isNaN(new Date(internData.dateRegistered).getTime())
                        ? new Date(internData.dateRegistered).toLocaleDateString()
                        : "Not Available"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Status and Quick Actions cards */}
          <div className="flex flex-col gap-6">
            {/* Status Card - Made more compact */}
            <Card className="p-5 shadow-lg bg-white/50 backdrop-blur-3xl border border-white/50 rounded-2xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1">
              <CardHeader className="p-0 mb-4">
                <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-md">
                    {getStatusIcon(internData.status)}
                  </div>
                  <span className="bg-gradient-to-r from-blue-700 via-purple-600 to-indigo-800 bg-clip-text text-transparent">Application Status</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 space-y-4">
                <div className="text-center">
                  <Badge className={`${getStatusColor(internData.status)} text-lg px-4 py-2 mb-4 font-bold rounded-xl shadow-md`}>
                    {internData.status}
                  </Badge>

                  {/* Status Message - Made more compact */}
                  <div className="bg-white/40 backdrop-blur-lg rounded-xl p-4 mb-4 border border-white/50 shadow-sm">
                    <p className="text-gray-700 text-sm">
                      {getStatusMessage(internData.status)}
                    </p>
                  </div>

                  {/* Animated Status Visualization - Made smaller for better space utilization */}
                  <div className="flex justify-center">
                    {internData.status === "Applied" && (
                      <div className="text-3xl animate-pulse" style={{ animationDuration: '2s' }}>
                        📝
                      </div>
                    )}

                    {internData.status === "Selected" && (
                      <div className="text-3xl animate-bounce" style={{ animationDuration: '1s' }}>
                        😊
                      </div>
                    )}

                    {internData.status === "Rejected" && (
                      <div className="text-3xl animate-bounce" style={{ animationDuration: '1s' }}>
                        😢
                      </div>
                    )}

                    {(internData.status === "In Review" || internData.status === "Under Review") && (
                      <div className="text-3xl animate-spin" style={{ animationDuration: '2s' }}>
                        ⏳
                      </div>
                    )}

                    {internData.status === "In Training" && (
                      <div className="text-3xl animate-bounce" style={{ animationDuration: '1.5s' }}>
                        🎓
                      </div>
                    )}

                    {internData.status === "Completed" && (
                      <div className="text-3xl animate-bounce" style={{ animationDuration: '1s' }}>
                        🏆
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions Card - Made more compact */}
            <Card className="p-5 shadow-lg bg-white/50 backdrop-blur-3xl border border-white/50 rounded-2xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1">
              <CardHeader className="p-0 mb-3">
                <CardTitle className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <div className="relative">
                    <Sparkles className="w-4 h-4 text-gray-700" />
                    <div className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-ping"></div>
                  </div>
                  <span className="bg-gradient-to-r from-blue-700 via-purple-600 to-indigo-800 bg-clip-text text-transparent">Quick Actions</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 space-y-3">
                <Button
                  className="w-full justify-between bg-gradient-to-r from-blue-500/50 to-indigo-500/50 hover:from-blue-500/80 hover:to-indigo-500/80 text-gray-800 py-3 rounded-xl transition-all duration-300 border border-blue-200/50 shadow-sm hover:shadow-md group relative overflow-hidden text-sm"
                  onClick={() => window.open("https://mail.google.com/mail/u/0/#inbox?compose=DmwnWtDsVNbMNKTNwzTxmkpwGdhvfstmFcPTmJdfNPCsQjKpWZStJStKgcJrcFvsfVQcJBfwjhlq")}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400/10 to-indigo-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="flex items-center relative">
                    <div className="bg-gradient-to-br from-blue-500 to-indigo-500 p-1.5 rounded-md mr-2 group-hover:rotate-12 transition-transform duration-300 shadow-sm">
                      <Mail className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-medium">Contact Support</span>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center">
                    <span className="mr-1 text-xs">Reach out</span>
                    <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </div>
                </Button>

                <Button
                  className="w-full justify-between bg-gradient-to-r from-green-500/50 to-emerald-500/50 hover:from-green-500/80 hover:to-emerald-500/80 text-gray-800 py-3 rounded-xl transition-all duration-300 border border-green-200/50 shadow-sm hover:shadow-md group relative overflow-hidden text-sm"
                  onClick={() => window.open("tel:9359463350")}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-green-400/10 to-emerald-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="flex items-center relative">
                    <div className="bg-gradient-to-br from-green-500 to-emerald-500 p-1.5 rounded-md mr-2 group-hover:rotate-12 transition-transform duration-300 shadow-sm">
                      <Phone className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-medium">Call Support</span>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center">
                    <span className="mr-1 text-xs">Dial now</span>
                    <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </div>
                </Button>

                <Button
                  className="w-full justify-between bg-gradient-to-r from-red-500/50 to-rose-500/50 hover:from-red-500/80 hover:to-rose-500/80 text-gray-800 py-3 rounded-xl transition-all duration-300 border border-red-200/50 shadow-sm hover:shadow-md group relative overflow-hidden text-sm"
                  onClick={deleteApplication}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-red-400/10 to-rose-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="flex items-center relative">
                    <div className="bg-gradient-to-br from-red-500 to-rose-500 p-1.5 rounded-md mr-2 group-hover:rotate-12 transition-transform duration-300 shadow-sm">
                      <Trash2 className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-medium">Delete Application</span>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center">
                    <span className="mr-1 text-xs">Proceed</span>
                    <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </div>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}