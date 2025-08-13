"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { NotificationBell } from "@/components/notification-bell"
import {
  User,
  Mail,
  Phone,
  Building2,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  Edit,
  Save,
  X,
  LogOut,
  FileText,
  Sparkles,
  Trash2,
} from "lucide-react"

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
  Frontend: "Frontend Development",
  Backend: "Backend Development",
  Database: "Database Management",
  Others: "Others",
  Technology: "Technology",
  Marketing: "Marketing",
  Design: "Design",
  Finance: "Finance",
  Operations: "Operations",
  HR: "Human Resources",
}

export default function InternDashboard() {
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
    if (!editData || !internData) return
    setIsLoading(true)

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
          // Don't send status - intern can't change their own status
        }),
      })

      if (response.ok) {
        const result = await response.json()
        const updatedInternData = {
          id: result.student.id,
          name: result.student.name,
          email: result.student.email,
          phone: result.student.phone,
          domain: result.student.domain,
          applicationId: result.student.id,
          status: result.student.status, // Keep the status from server
          dateRegistered: result.student.dateApplied
        }

        setInternData(updatedInternData)
        setEditData(updatedInternData)
        localStorage.setItem("internAuth", JSON.stringify(updatedInternData))

        setIsEditing(false)

        toast({
          title: "Profile Updated! ✅",
          description: "Your information has been updated successfully.",
        })
      } else {
        const error = await response.json()
        toast({
          title: "Update Failed",
          description: error.message || "Failed to update profile",
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
          <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-mint-50 to-green-50 p-8">
      {/* Header */}
      <header className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome, {internData.name}!</h1>
          <p className="text-gray-600">Interns Dashboard</p>
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

      {/* Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card className="lg:col-span-2 p-6 shadow-sm bg-white border border-gray-200">
          <CardHeader className="p-0 mb-6">
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
                <User className="w-6 h-6 text-gray-700" />
                Profile Information
              </CardTitle>
              {!isEditing ? (
                <Button onClick={() => setIsEditing(true)} className="btn btn-muted text-blue-600">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button onClick={() => { setIsEditing(false); setEditData(internData) }} className = "btn btn-outline">
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                  <Button onClick={handleSave} disabled={isLoading} className="btn btn-primary bg-emerald-600 hover:bg-emerald-700">
                    <Save className="w-4 h-4 mr-2" />
                    {isLoading ? "Saving..." : "Save"}
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { label: "Full Name", value: internData.name, icon: <User />, key: "name" },
                { label: "Email Address", value: internData.email, icon: <Mail />, key: "email" },
                { label: "Phone Number", value: internData.phone, icon: <Phone />, key: "phone" },
              ].map(({ label, value, icon, key }) => (
                <div key={key} className="bg-gray-100 p-5 rounded-lg border border-gray-200">
                  <Label className="flex items-center gap-2 text-gray-700 mb-2 text-base font-medium">{icon}<span>{label}</span></Label>
                  {isEditing ? (
                    <Input
                      type={key === "phone" ? "tel" : "text"}
                      value={(editData as any)[key]}
                      onChange={(e) => setEditData(prev => prev ? { ...prev, [key]: e.target.value } : null)}
                      maxLength={key === "phone" ? 10 : undefined}
                      className="text-base"
                    />
                  ) : (
                    <p className="text-gray-900 font-semibold text-base">{value}</p>
                  )}
                </div>
              ))}

              {/* Domain */}
              <div className="bg-gray-100 p-5 rounded-lg border border-gray-200">
                <Label className="flex items-center gap-2 text-gray-700 mb-2 text-base font-medium">
                  <Building2 className="w-4 h-4" /> Domain
                </Label>
                {isEditing ? (
                  <Select value={editData?.domain || ""} onValueChange={(v) => setEditData((p) => p ? { ...p, domain: v } : null)}>
                    <SelectTrigger className="text-base">
                      <SelectValue placeholder="Select Domain" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(domainDisplayNames).map((val) => (
                        <SelectItem key={val} value={val}>{domainDisplayNames[val]}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Badge className="text-base px-3 py-1">{domainDisplayNames[internData.domain] || internData.domain}</Badge>
                )}
              </div>

              {/* Registration Date */}
              <div className="bg-gray-100 p-5 rounded-lg border border-gray-200">
                <Label className="flex items-center gap-2 text-gray-700 mb-2 text-base font-medium">
                  <Calendar className="w-4 h-4" /> Registration Date
                </Label>
                <p className="text-gray-900 font-semibold text-base">
                  {internData.dateRegistered && !isNaN (new Date(internData.dateRegistered).getTime())
                  ? new Date(internData.dateRegistered).toLocaleDateString()
                  : "Not Available"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Right Column */}
        <div className="flex flex-col gap-6">
          {/* Status */}
          <Card className="p-6 shadow-sm bg-white border border-gray-200">
            <CardHeader className="p-0 mb-4">
              <CardTitle className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
                {getStatusIcon(internData.status)}
                Application Status
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 space-y-4">
              <div className="text-center">
                <Badge className={`${getStatusColor(internData.status)} text-lg px-4 py-2 mb-4`}>
                  {internData.status}
                </Badge>

                {/* Animated Emoji and Message for Applied */}
                {internData.status === "Applied" && (
                  <div className="space-y-2">
                    <div className="flex justify-center">
                      <div className="text-5xl animate-pulse" style={{animationDuration: '2s'}}>
                        📝
                      </div>
                    </div>
                    <div className="text-center space-y-1">
                      <p className="text-sm text-gray-600">Your application has been submitted</p>
                      <div className="flex items-center justify-center text-blue-600">
                        <span className="text-sm font-medium">Waiting for review</span>
                      </div>
                      <p className="text-xs text-gray-500">We'll update you soon</p>
                    </div>
                  </div>
                )}

                {/* Animated Emoji and Message for Selected */}
                {internData.status === "Selected" && (
                  <div className="space-y-2">
                    <div className="flex justify-center">
                      <div className="text-5xl animate-bounce" style={{animationDuration: '1s'}}>
                        😊
                      </div>
                    </div>
                    <div className="text-center space-y-1">
                      <p className="text-sm text-gray-600">You have been selected!</p>
                      <div className="flex items-center justify-center text-green-600">
                        <span className="text-sm font-medium">Congratulations!</span>
                      </div>
                      <p className="text-xs text-gray-500">Check your email for next steps</p>
                    </div>
                  </div>
                )}

                {/* Animated Emoji and Message for Rejected */}
                {internData.status === "Rejected" && (
                  <div className="space-y-2">
                    <div className="flex justify-center">
                      <div className="text-5xl animate-bounce" style={{animationDuration: '1s'}}>
                        😢
                      </div>
                    </div>
                    <div className="text-center space-y-1">
                      <p className="text-sm text-gray-600">Your application was not successful</p>
                      <div className="flex items-center justify-center text-red-600">
                        <span className="text-sm font-medium">Better luck next time!</span>
                      </div>
                      <p className="text-xs text-gray-500">Keep improving and apply again</p>
                    </div>
                  </div>
                )}

                {/* Message for In Review */}
                {(internData.status === "In Review" || internData.status === "Under Review") && (
                  <div className="space-y-2">
                    <div className="flex justify-center">
                      <div className="text-5xl animate-spin" style={{animationDuration: '2s'}}>
                        ⏳
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-blue-600">Your application is under review</p>
                      <div className="flex items-center justify-center text-blue-600">
                        <span className="text-sm font-medium">Please wait for updates</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Animated Emoji for In Training */}
                {internData.status === "In Training" && (
                  <div className="space-y-2">
                    <div className="flex justify-center">
                      <div className="text-5xl animate-bounce" style={{animationDuration: '1.5s'}}>
                        🎓
                      </div>
                    </div>
                    <div className="text-center space-y-1">
                      <p className="text-sm text-gray-600">Welcome to the team!</p>
                      <div className="flex items-center justify-center text-purple-600">
                        <span className="text-sm font-medium">Your training has begun</span>
                      </div>
                      <p className="text-xs text-gray-500">Keep up the great work</p>
                    </div>
                  </div>
                )}

                {/* Animated Emoji for Completed */}
                {internData.status === "Completed" && (
                  <div className="space-y-2">
                    <div className="flex justify-center">
                      <div className="text-5xl animate-bounce" style={{animationDuration: '1s'}}>
                        🏆
                      </div>
                    </div>
                    <div className="text-center space-y-1">
                      <p className="text-sm text-gray-600">Congratulations!</p>
                      <div className="flex items-center justify-center text-green-600">
                        <span className="text-sm font-medium">Internship completed successfully</span>
                      </div>
                      <p className="text-xs text-gray-500">Well done!</p>
                    </div>
                  </div>
                )}

                {/* Default message for other statuses */}
                {!["Applied", "Selected", "Rejected", "In Review", "Under Review", "In Training", "Completed"].includes(internData.status) && (
                  <p className="text-gray-600 text-sm leading-relaxed">{getStatusMessage(internData.status)}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="p-4 shadow-sm bg-white border border-gray-200">
            <CardHeader className="p-0 mb-3">
              <CardTitle className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-gray-700" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 space-y-2">
              <Card className="p-4 bg-gray-100 border border-gray-200 hover:bg-gray-200 transition-colors cursor-pointer">
                <div className="flex items-center gap-2" onClick={() => window.open("mailto:contact@internshipcrm.com")}>
                  <Mail className="w-5 h-5 text-blue-600" />
                  <span className="text-base font-medium text-gray-700">Contact Support</span>
                </div>
              </Card>
              
              <Card className="p-4 bg-gray-100 border border-gray-200 hover:bg-gray-200 transition-colors cursor-pointer">
                <div className="flex items-center gap-2" onClick={() => window.open("tel:+15551234567")}>
                  <Phone className="w-5 h-5 text-green-600" />
                  <span className="text-base font-medium text-gray-700">Call Support</span>
                </div>
              </Card>
              
              <Card className="p-4 bg-red-50 border border-red-200 hover:bg-red-100 transition-colors cursor-pointer">
                <div className="flex items-center gap-2" onClick={deleteApplication}>
                  <Trash2 className="w-5 h-5 text-red-600" />
                  <span className="text-base font-medium text-red-700">Delete Application</span>
                </div>
              </Card>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
