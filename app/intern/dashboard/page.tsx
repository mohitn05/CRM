"use client"
import { getDomainOptions } from "@/lib/domains"

import { NotificationBell } from "@/components/notification-bell"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
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
  XCircle,
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
}

const domainDisplayNames: { [key: string]: string } = {
  "Frontend Developer": "Frontend Developer",
  "Backend Developer": "Backend Developer",
  "Database Management": "Database Management",
  Others: "Others"
}

export default function InternDashboard() {
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
            dateRegistered: latestData.dateApplied
          }
          setInternData(updatedAccount)
          setEditData(updatedAccount)
          // Update localStorage with latest data
          localStorage.setItem("internAuth", JSON.stringify(updatedAccount))
        } else {
          // If API fails, use stored data
          setInternData(account)
          setEditData(account)
        }
      } catch (error) {
        console.error("Error fetching latest data:", error)
        // If API fails, use stored data
        setInternData(account)
        setEditData(account)
      }
    }

    fetchLatestData()
  }, [router])

  const handleSave = async () => {
    if (!editData || !internData) return;

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
      const response = await fetch(`http://localhost:5000/api/students/${editData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: editData.name,
          email: editData.email,
          phone: editData.phone,
          domain: editData.domain,
        }),
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
          dateRegistered: result.student.dateApplied
        };

        setInternData(updatedInternData);
        setEditData(updatedInternData);
        localStorage.setItem("internAuth", JSON.stringify(updatedInternData));

        setIsEditing(false)

        // Notify admin of changes
        if (changedFields.length > 0) {
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
                description: "Failed to notify admin. Server error.",
                variant: "destructive",
              });
            }
          } catch (err) {
            toast({
              title: "Notification Failed",
              description: "Failed to connect to server for admin notification.",
              variant: "destructive",
            });
          }
        }

        toast({
          title: "🎉 Profile Updated Successfully!",
          description: "✨ Your information has been updated and saved to your profile.",
          variant: "success" as any,
        })
      } else {
        const error = await response.json()
        toast({
          title: "❌ Update Failed",
          description: "⚠️ " + (error.message || "Failed to update profile. Please try again."),
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error updating profile:", error)
      toast({
        title: "🌐 Connection Error",
        description: "⚠️ Failed to connect to server. Please check your internet connection.",
        variant: "warning" as any,
      })
    }

    setIsLoading(false)
  }

  const handleLogout = () => {
    localStorage.removeItem("internAuth")
    toast({
      title: "👋 Logged Out Successfully!",
      description: "✨ Thank you for using our platform! Come back soon.",
      variant: "info" as any,
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
              description: "Failed to notify admin. Server error.",
              variant: "destructive",
            });
          }
        } catch (err) {
          toast({
            title: "Notification Failed",
            description: "Failed to connect to server for admin notification.",
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
        throw new Error('Failed to delete application')
      }
    } catch (error) {
      console.error("Error deleting application:", error)
      toast({
        title: "Delete Failed",
        description: "Failed to delete application. Please try again.",
        variant: "destructive",
      })
    }

    setIsLoading(false)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Applied":
        return "bg-blue-100 text-blue-800"
      case "Under Review":
      case "In Review":
        return "bg-yellow-100 text-yellow-800"
      case "Selected":
        return "bg-green-100 text-green-800"
      case "Rejected":
        return "bg-red-100 text-red-800"
      case "In Training":
        return "bg-purple-100 text-purple-800"
      case "Completed":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Selected":
      case "Completed":
        return <CheckCircle className="w-4 h-4" />
      case "Rejected":
        return <XCircle className="w-4 h-4" />
      case "In Training":
        return <FileText className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
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

  if (!internData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {/* Animated gradient waves */}
        <div className="absolute top-0 left-0 w-full h-full opacity-30">
          <div className="absolute -top-40 -left-40 w-96 h-96 bg-gradient-to-br from-blue-400/20 via-indigo-400/15 to-purple-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0s' }}></div>
          <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-gradient-to-tl from-purple-400/20 via-pink-400/15 to-blue-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-gradient-to-r from-indigo-300/15 to-blue-300/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        {/* Floating particles */}
        <div className="absolute inset-0">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-blue-400/30 rounded-full animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            ></div>
          ))}
        </div>
      </div>

      <div className="relative z-10 p-4 sm:p-6 md:p-8 w-full min-w-0">
        {/* Enhanced Header */}
        <header className="relative mb-8">
          <div className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-3xl p-8 shadow-2xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div className="flex items-center gap-6">
                {/* Profile Avatar */}
                <div className="relative">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500">
                    <User className="w-10 h-10 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-400 rounded-full border-2 border-white animate-pulse flex items-center justify-center">
                    <CheckCircle className="w-3 h-3 text-white" />
                  </div>
                </div>

                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 via-blue-700 to-purple-700 bg-clip-text text-transparent mb-2">
                    Welcome, {internData.name}! 👋
                  </h1>
                  <p className="text-lg text-gray-600 font-medium flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-yellow-500 animate-pulse" />
                    Your Personalized Intern Dashboard
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <NotificationBell studentId={internData.id} />
                <Button
                  onClick={handleLogout}
                  className="group relative overflow-hidden bg-gradient-to-r from-red-500 via-pink-500 to-red-600 hover:from-red-600 hover:via-pink-600 hover:to-red-700 text-white px-8 py-4 rounded-2xl shadow-2xl hover:shadow-3xl hover:shadow-red-500/30 transition-all duration-500 transform hover:scale-105 border-2 border-white/20"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                  <div className="relative flex items-center gap-3">
                    <LogOut className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                    <span className="font-bold text-lg">Logout</span>
                  </div>
                  <div className="absolute -inset-1 bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-500 -z-10"></div>
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Enhanced Grid Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 min-w-0">
          {/* Enhanced Profile Card */}
          <Card className="lg:col-span-2 relative overflow-hidden bg-white/30 backdrop-blur-xl border border-white/40 shadow-2xl hover:shadow-3xl transition-all duration-500 rounded-3xl group">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

            <CardHeader className="relative p-8 pb-6">
              <div className="flex items-center justify-between">
                <CardTitle className="text-3xl font-bold bg-gradient-to-r from-gray-800 via-blue-700 to-purple-700 bg-clip-text text-transparent flex items-center gap-3">
                  <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                    <User className="w-8 h-8 text-white" />
                  </div>
                  Profile Information
                </CardTitle>
                {!isEditing ? (
                  <Button
                    onClick={() => {
                      if (internData.status === "Applied") {
                        setIsEditing(true);
                      } else {
                        toast({
                          title: "🚫 Edit Unavailable",
                          description: "You cannot edit your information right now. If you need to update your details, please contact support or email us at mohitnarnaware.ams@gmail.com.",
                          variant: "destructive"
                        });
                      }
                    }}
                    className={`group relative overflow-hidden bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 hover:from-blue-600 hover:via-indigo-600 hover:to-purple-600 text-white px-6 py-3 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 ${internData.status !== "Applied" ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                    <div className="relative flex items-center gap-2">
                      <Edit className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                      <span className="font-semibold">Edit Profile</span>
                    </div>
                  </Button>
                ) : (
                  <div className="flex gap-3">
                    <Button
                      onClick={() => { setIsEditing(false); setEditData(internData) }}
                      className="group relative overflow-hidden bg-gradient-to-r from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600 text-white px-6 py-3 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                    >
                      <div className="relative flex items-center gap-2">
                        <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                        <span className="font-semibold">Cancel</span>
                      </div>
                    </Button>
                    <Button
                      onClick={handleSave}
                      disabled={isLoading || internData.status !== "Applied"}
                      className="group relative overflow-hidden bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-3 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                      <div className="relative flex items-center gap-2">
                        <Save className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                        <span className="font-semibold">{isLoading ? "Saving..." : "Save Changes"}</span>
                      </div>
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>

            <CardContent className="relative p-8 pt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                  { label: "Full Name", value: internData.name, icon: <User className="w-5 h-5" />, key: "name", gradient: "from-blue-500 to-purple-600" },
                  { label: "Email Address", value: internData.email, icon: <Mail className="w-5 h-5" />, key: "email", gradient: "from-green-500 to-teal-600" },
                  { label: "Phone Number", value: internData.phone, icon: <Phone className="w-5 h-5" />, key: "phone", gradient: "from-orange-500 to-red-600" },
                ].map(({ label, value, icon, key, gradient }) => (
                  <div key={key} className="group relative bg-white/40 backdrop-blur-md border border-white/50 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-white/60">
                    <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-2xl" style={{ background: `linear-gradient(135deg, var(--tw-gradient-stops))` }}></div>

                    <Label className={`flex items-center gap-3 text-gray-700 mb-4 text-lg font-semibold`}>
                      <div className={`p-2 bg-gradient-to-r ${gradient} rounded-xl text-white shadow-lg`}>
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
                        className="bg-white/70 backdrop-blur-sm border-white/60 text-gray-800 placeholder:text-gray-500 focus:border-blue-400 focus:ring-blue-400/20 h-14 rounded-xl text-lg font-medium shadow-inner"
                        disabled={internData.status !== "Applied"}
                      />
                    ) : (
                      <p className="text-gray-900 font-bold text-xl bg-white/30 p-4 rounded-xl backdrop-blur-sm border border-white/40">{value}</p>
                    )}
                  </div>
                ))}

                {/* Enhanced Domain */}
                <div className="group relative bg-white/40 backdrop-blur-md border border-white/50 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-white/60">
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>

                  <Label className="flex items-center gap-3 text-gray-700 mb-4 text-lg font-semibold">
                    <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl text-white shadow-lg">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <span>Domain</span>
                  </Label>

                  {isEditing ? (
                    <Select
                      value={editData?.domain || ""}
                      onValueChange={(value) => {
                        setEditData((p) => p ? { ...p, domain: value } : null);
                        setDomainOptions(getDomainOptions());
                      }}
                      disabled={internData.status !== "Applied"}
                    >
                      <SelectTrigger className="bg-white/70 backdrop-blur-sm border-white/60 text-gray-800 h-14 rounded-xl text-lg font-medium shadow-inner">
                        <SelectValue placeholder="Select Domain" />
                      </SelectTrigger>
                      <SelectContent className="bg-white/95 backdrop-blur-xl border-white/60 rounded-2xl shadow-2xl">
                        {domainOptions.map((d: { value: string; label: string }) => (
                          <SelectItem key={d.value} value={d.value} className="bg-transparent text-gray-800 hover:bg-blue-50/80 rounded-xl m-1">{d.value}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Badge className="text-lg px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold rounded-xl shadow-lg">
                      {editData?.domain || internData.domain}
                    </Badge>
                  )}
                </div>

                {/* Enhanced Registration Date */}
                <div className="group relative bg-white/40 backdrop-blur-md border border-white/50 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-white/60">
                  <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 to-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>

                  <Label className="flex items-center gap-3 text-gray-700 mb-4 text-lg font-semibold">
                    <div className="p-2 bg-gradient-to-r from-pink-500 to-red-600 rounded-xl text-white shadow-lg">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <span>Registration Date</span>
                  </Label>

                  <p className="text-gray-900 font-bold text-xl bg-white/30 p-4 rounded-xl backdrop-blur-sm border border-white/40">
                    {internData.dateRegistered && !isNaN(new Date(internData.dateRegistered).getTime())
                      ? new Date(internData.dateRegistered).toLocaleDateString()
                      : "Not Available"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Enhanced Right Column */}
          <div className="flex flex-col gap-8">
            {/* Enhanced Status Card */}
            <Card className="relative overflow-hidden bg-white/30 backdrop-blur-xl border border-white/40 shadow-2xl hover:shadow-3xl transition-all duration-500 rounded-3xl group">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              <CardHeader className="relative p-8 pb-6">
                <CardTitle className="text-3xl font-bold bg-gradient-to-r from-gray-800 via-blue-700 to-purple-700 bg-clip-text text-transparent flex items-center gap-3">
                  <div className={`p-3 bg-gradient-to-br ${getStatusIcon(internData.status) ? 'from-green-500 to-emerald-600' : 'from-blue-500 to-indigo-600'} rounded-2xl shadow-lg transform group-hover:scale-110 transition-transform duration-300`}>
                    {getStatusIcon(internData.status) || <Clock className="w-8 h-8 text-white" />}
                  </div>
                  Application Status
                </CardTitle>
              </CardHeader>

              <CardContent className="relative p-8 pt-4">
                <div className="text-center space-y-6">
                  <div className="relative">
                    <Badge className={`${getStatusColor(internData.status)} text-xl px-8 py-4 rounded-2xl font-bold shadow-lg transform hover:scale-105 transition-all duration-300`}>
                      {internData.status}
                    </Badge>
                  </div>

                  {/* Enhanced Animated Status Messages */}
                  {internData.status === "Applied" && (
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-3xl border border-blue-200/50 shadow-inner">
                      <div className="flex justify-center mb-6">
                        <div className="relative">
                          <div className="text-7xl animate-pulse" style={{ animationDuration: '2s' }}>
                            📝
                          </div>
                          <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 rounded-full animate-ping"></div>
                        </div>
                      </div>
                      <div className="text-center space-y-3">
                        <h3 className="text-xl font-bold text-gray-800">Application Submitted! 🚀</h3>
                        <p className="text-blue-700 font-medium">Your application is in the queue for review</p>
                        <div className="flex items-center justify-center gap-2 text-blue-600">
                          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          <span className="ml-2 font-semibold">Processing</span>
                        </div>
                        <p className="text-sm text-gray-600">We'll update you within 24-48 hours</p>
                      </div>
                    </div>
                  )}

                  {internData.status === "Selected" && (
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-8 rounded-3xl border border-green-200/50 shadow-inner">
                      <div className="flex justify-center mb-6">
                        <div className="relative">
                          <div className="text-7xl animate-bounce" style={{ animationDuration: '1s' }}>
                            🎉
                          </div>
                          <div className="absolute inset-0 animate-ping">
                            <div className="text-7xl opacity-30">✨</div>
                          </div>
                        </div>
                      </div>
                      <div className="text-center space-y-3">
                        <h3 className="text-xl font-bold text-gray-800">Congratulations! 👏</h3>
                        <p className="text-green-700 font-medium">You've been selected for the internship!</p>
                        <div className="bg-green-100 p-4 rounded-2xl">
                          <span className="text-green-800 font-semibold">Check your email for next steps</span>
                        </div>
                        <p className="text-sm text-gray-600">Welcome to the team!</p>
                      </div>
                    </div>
                  )}

                  {internData.status === "Rejected" && (
                    <div className="bg-gradient-to-br from-red-50 to-pink-50 p-8 rounded-3xl border border-red-200/50 shadow-inner">
                      <div className="flex justify-center mb-6">
                        <div className="text-7xl animate-bounce" style={{ animationDuration: '1.5s' }}>
                          💔
                        </div>
                      </div>
                      <div className="text-center space-y-3">
                        <h3 className="text-xl font-bold text-gray-800">Not This Time</h3>
                        <p className="text-red-700 font-medium">Your application wasn't successful</p>
                        <div className="bg-red-100 p-4 rounded-2xl">
                          <span className="text-red-800 font-semibold">Don't give up! Keep improving</span>
                        </div>
                        <p className="text-sm text-gray-600">Apply again when you're ready</p>
                      </div>
                    </div>
                  )}

                  {(internData.status === "In Review" || internData.status === "Under Review") && (
                    <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-8 rounded-3xl border border-yellow-200/50 shadow-inner">
                      <div className="flex justify-center mb-6">
                        <div className="relative">
                          <div className="text-7xl animate-spin" style={{ animationDuration: '3s' }}>
                            ⏳
                          </div>
                          <div className="absolute inset-0 animate-pulse">
                            <div className="text-7xl opacity-20">🔍</div>
                          </div>
                        </div>
                      </div>
                      <div className="text-center space-y-3">
                        <h3 className="text-xl font-bold text-gray-800">Under Review 🔎</h3>
                        <p className="text-yellow-700 font-medium">Our team is carefully reviewing your application</p>
                        <div className="bg-yellow-100 p-4 rounded-2xl">
                          <span className="text-yellow-800 font-semibold">Please be patient with us</span>
                        </div>
                        <p className="text-sm text-gray-600">Results coming soon!</p>
                      </div>
                    </div>
                  )}

                  {internData.status === "In Training" && (
                    <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-8 rounded-3xl border border-purple-200/50 shadow-inner">
                      <div className="flex justify-center mb-6">
                        <div className="relative">
                          <div className="text-7xl animate-bounce" style={{ animationDuration: '1.5s' }}>
                            🎓
                          </div>
                          <div className="absolute -top-4 -right-4 text-2xl animate-spin" style={{ animationDuration: '2s' }}>
                            ✨
                          </div>
                        </div>
                      </div>
                      <div className="text-center space-y-3">
                        <h3 className="text-xl font-bold text-gray-800">Training in Progress! 💪</h3>
                        <p className="text-purple-700 font-medium">Welcome to the team!</p>
                        <div className="bg-purple-100 p-4 rounded-2xl">
                          <span className="text-purple-800 font-semibold">Your learning journey has begun</span>
                        </div>
                        <p className="text-sm text-gray-600">Keep up the excellent work!</p>
                      </div>
                    </div>
                  )}

                  {internData.status === "Completed" && (
                    <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-8 rounded-3xl border border-indigo-200/50 shadow-inner">
                      <div className="flex justify-center mb-6">
                        <div className="relative">
                          <div className="text-7xl animate-bounce" style={{ animationDuration: '1s' }}>
                            🏆
                          </div>
                          <div className="absolute -inset-4 animate-pulse">
                            <div className="text-8xl opacity-20">🎆</div>
                          </div>
                        </div>
                      </div>
                      <div className="text-center space-y-3">
                        <h3 className="text-xl font-bold text-gray-800">Mission Accomplished! 🎆</h3>
                        <p className="text-indigo-700 font-medium">Internship completed successfully</p>
                        <div className="bg-indigo-100 p-4 rounded-2xl">
                          <span className="text-indigo-800 font-semibold">You're now part of our alumni network</span>
                        </div>
                        <p className="text-sm text-gray-600">Congratulations on this achievement!</p>
                      </div>
                    </div>
                  )}

                  {/* Default message for other statuses */}
                  {!["Applied", "Selected", "Rejected", "In Review", "Under Review", "In Training", "Completed"].includes(internData.status) && (
                    <div className="bg-gradient-to-br from-gray-50 to-slate-50 p-8 rounded-3xl border border-gray-200/50 shadow-inner">
                      <div className="text-center">
                        <p className="text-gray-600 text-lg leading-relaxed">{getStatusMessage(internData.status)}</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Enhanced Quick Actions */}
            <Card className="relative overflow-hidden bg-white/30 backdrop-blur-xl border border-white/40 shadow-2xl hover:shadow-3xl transition-all duration-500 rounded-3xl group">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              <CardHeader className="relative p-8 pb-6">
                <CardTitle className="text-3xl font-bold bg-gradient-to-r from-gray-800 via-emerald-700 to-blue-700 bg-clip-text text-transparent flex items-center gap-3">
                  <div className="p-3 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-2xl shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                    <Sparkles className="w-8 h-8 text-white animate-pulse" />
                  </div>
                  Quick Actions
                </CardTitle>
              </CardHeader>

              <CardContent className="relative p-8 pt-4 space-y-4">
                {/* Contact Support */}
                <div
                  className="group/item relative overflow-hidden bg-white/50 backdrop-blur-md border border-white/60 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-105 hover:bg-white/70"
                  onClick={() => window.open("https://mail.google.com/mail/u/0/#inbox?compose=DmwnWtDsVNbMNKTNwzTxmkpwGdhvfstmFcPTmJdfNPCsQjKpWZStJStKgcJrcFvsfVQcJBfwjhlq")}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-green-500/10 opacity-0 group-hover/item:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
                  <div className="relative flex items-center gap-4">
                    <div className="p-3 bg-gradient-to-r from-blue-500 to-green-600 rounded-xl text-white shadow-lg group-hover/item:scale-110 transition-transform duration-300">
                      <Mail className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-gray-800">Contact Support</h4>
                      <p className="text-sm text-gray-600">Get help via email</p>
                    </div>
                    <div className="ml-auto opacity-0 group-hover/item:opacity-100 transition-opacity duration-300">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    </div>
                  </div>
                </div>

                {/* Call Support */}
                <div
                  className="group/item relative overflow-hidden bg-white/50 backdrop-blur-md border border-white/60 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-105 hover:bg-white/70"
                  onClick={() => window.open("tel:9359463350")}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-blue-500/10 opacity-0 group-hover/item:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
                  <div className="relative flex items-center gap-4">
                    <div className="p-3 bg-gradient-to-r from-green-500 to-blue-600 rounded-xl text-white shadow-lg group-hover/item:scale-110 transition-transform duration-300">
                      <Phone className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-gray-800">Call Support</h4>
                      <p className="text-sm text-gray-600">+91 9359463350</p>
                    </div>
                    <div className="ml-auto opacity-0 group-hover/item:opacity-100 transition-opacity duration-300">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                    </div>
                  </div>
                </div>

                {/* Delete Application */}
                <div
                  className="group/item relative overflow-hidden bg-red-50/70 backdrop-blur-md border border-red-200/60 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-105 hover:bg-red-100/70"
                  onClick={deleteApplication}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-pink-500/10 opacity-0 group-hover/item:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
                  <div className="relative flex items-center gap-4">
                    <div className="p-3 bg-gradient-to-r from-red-500 to-pink-600 rounded-xl text-white shadow-lg group-hover/item:scale-110 transition-transform duration-300">
                      <Trash2 className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-red-800">Delete Application</h4>
                      <p className="text-sm text-red-600">Permanently remove</p>
                    </div>
                    <div className="ml-auto opacity-0 group-hover/item:opacity-100 transition-opacity duration-300">
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
