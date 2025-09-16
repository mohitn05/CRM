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
  Award,
  BookOpen,
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
  Target,
  Trash2,
  TrendingUp,
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

  // Educational content based on domain
  const getDomainLearningPath = (domain: string) => {
    switch (domain) {
      case "Frontend Developer":
        return [
          { skill: "HTML/CSS Fundamentals", progress: 100 },
          { skill: "JavaScript Basics", progress: 80 },
          { skill: "React Framework", progress: 60 },
          { skill: "State Management", progress: 40 }
        ];
      case "Backend Developer":
        return [
          { skill: "Server Fundamentals", progress: 100 },
          { skill: "Database Design", progress: 85 },
          { skill: "API Development", progress: 70 },
          { skill: "Authentication", progress: 50 }
        ];
      case "Database Management":
        return [
          { skill: "SQL Basics", progress: 100 },
          { skill: "Database Design", progress: 90 },
          { skill: "Performance Tuning", progress: 65 },
          { skill: "Backup Strategies", progress: 45 }
        ];
      default:
        return [
          { skill: "Core Concepts", progress: 100 },
          { skill: "Intermediate Skills", progress: 75 },
          { skill: "Advanced Topics", progress: 50 },
          { skill: "Specialization", progress: 25 }
        ];
    }
  };

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

  const learningPath = getDomainLearningPath(internData.domain);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 sm:p-6 md:p-8 w-full min-w-0">
      {/* Header */}
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 gap-4 flex-wrap min-w-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome, {internData.name}!</h1>
          <p className="text-gray-600">Intern Dashboard</p>
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 min-w-0">
        {/* Left Column - Profile and Status */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Card */}
          <Card className="p-6 shadow-sm bg-white border border-gray-200 min-w-0">
            <CardHeader className="p-0 mb-6">
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
                  <User className="w-6 h-6 text-gray-700" />
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
                    className={`btn btn-muted text-blue-600${internData.status !== "Applied" ? " opacity-50 cursor-not-allowed" : ""}`}
                    tabIndex={0}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button onClick={() => { setIsEditing(false); setEditData(internData) }} className="btn btn-outline">
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                    <Button onClick={handleSave} disabled={isLoading || internData.status !== "Applied"} className="btn btn-primary bg-blue-600 hover:bg-blue-700">
                      <Save className="w-4 h-4 mr-2" />
                      {isLoading ? "Saving..." : "Save"}
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>

            <CardContent className="p-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 min-w-0">
                {[
                  { label: "Full Name", value: internData.name, icon: <User />, key: "name" },
                  { label: "Email Address", value: internData.email, icon: <Mail />, key: "email" },
                  { label: "Phone Number", value: internData.phone, icon: <Phone />, key: "phone" },
                ].map(({ label, value, icon, key }) => (
                  <div key={key} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <Label className="flex items-center gap-2 text-gray-700 mb-2 text-base font-medium">{icon}<span>{label}</span></Label>
                    {isEditing ? (
                      <Input
                        type={key === "phone" ? "tel" : "text"}
                        value={(editData as any)[key]}
                        onChange={(e) => setEditData(prev => prev ? { ...prev, [key]: e.target.value } : null)}
                        maxLength={key === "phone" ? 10 : undefined}
                        className="text-base"
                        disabled={internData.status !== "Applied"}
                      />
                    ) : (
                      <p className="text-gray-900 font-semibold text-base">{value}</p>
                    )}
                  </div>
                ))}

                {/* Domain */}
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <Label className="flex items-center gap-2 text-gray-700 mb-2 text-base font-medium">
                    <Building2 className="w-4 h-4" /> Domain
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
                      <SelectTrigger className="bg-white text-black border-gray-300 text-base">
                        <SelectValue placeholder="Select Domain" />
                      </SelectTrigger>
                      <SelectContent className="bg-white text-black border-gray-300">
                        {domainOptions.map((d: { value: string; label: string }) => (
                          <SelectItem key={d.value} value={d.value} className="bg-white text-black hover:bg-gray-100">{d.label.replace(/^[^ ]+ /, "")}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Badge className="text-base px-3 py-1 bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
                      {(() => {
                        const domain = editData?.domain || internData.domain;
                        if (domain === "Frontend") return "Frontend Developer";
                        if (domain === "Backend") return "Backend Developer";
                        return domain;
                      })()}
                    </Badge>
                  )}
                </div>

                {/* Registration Date */}
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <Label className="flex items-center gap-2 text-gray-700 mb-2 text-base font-medium">
                    <Calendar className="w-4 h-4" /> Registration Date
                  </Label>
                  <p className="text-gray-900 font-semibold text-base">
                    {internData.dateRegistered && !isNaN(new Date(internData.dateRegistered).getTime())
                      ? new Date(internData.dateRegistered).toLocaleDateString()
                      : "Not Available"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Learning Path */}
          <Card className="p-6 shadow-sm bg-white border border-gray-200">
            <CardHeader className="p-0 mb-6">
              <CardTitle className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-gray-700" />
                Your Learning Path
              </CardTitle>
              <p className="text-gray-600 mt-2">Progress in your {internData.domain} specialization</p>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-6">
                {learningPath.map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-800">{item.skill}</span>
                      <span className="text-sm text-gray-600">{item.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-2.5 rounded-full"
                        style={{ width: `${item.progress}%` }}
                      ></div>
                    </div>
                  </div>
                ))}

                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mt-4">
                  <h3 className="font-semibold text-blue-800 flex items-center gap-2 mb-2">
                    <Target className="w-5 h-5" />
                    Next Steps
                  </h3>
                  <p className="text-blue-700 text-sm">
                    Complete your current module to unlock the next set of skills in your {internData.domain} journey.
                    Check your email for learning resources and assignments.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Status */}
          <Card className="p-6 shadow-sm bg-white border border-gray-200">
            <CardHeader className="p-0 mb-6">
              <CardTitle className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
                {getStatusIcon(internData.status)}
                Application Status
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 space-y-6">
              <div className="text-center">
                <Badge className={`${getStatusColor(internData.status)} text-lg px-4 py-2 mb-6`}>
                  {internData.status}
                </Badge>

                {/* Status Message */}
                <div className="bg-gray-50 rounded-xl p-4 mb-6">
                  <p className="text-gray-700">
                    {getStatusMessage(internData.status)}
                  </p>
                </div>

                {/* Animated Status Visualization */}
                {internData.status === "Applied" && (
                  <div className="space-y-4">
                    <div className="flex justify-center">
                      <div className="text-5xl animate-pulse" style={{ animationDuration: '2s' }}>
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

                {internData.status === "Selected" && (
                  <div className="space-y-4">
                    <div className="flex justify-center">
                      <div className="text-5xl animate-bounce" style={{ animationDuration: '1s' }}>
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

                {internData.status === "Rejected" && (
                  <div className="space-y-4">
                    <div className="flex justify-center">
                      <div className="text-5xl animate-bounce" style={{ animationDuration: '1s' }}>
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

                {(internData.status === "In Review" || internData.status === "Under Review") && (
                  <div className="space-y-4">
                    <div className="flex justify-center">
                      <div className="text-5xl animate-spin" style={{ animationDuration: '2s' }}>
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

                {internData.status === "In Training" && (
                  <div className="space-y-4">
                    <div className="flex justify-center">
                      <div className="text-5xl animate-bounce" style={{ animationDuration: '1.5s' }}>
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

                {internData.status === "Completed" && (
                  <div className="space-y-4">
                    <div className="flex justify-center">
                      <div className="text-5xl animate-bounce" style={{ animationDuration: '1s' }}>
                        🏆
                      </div>
                    </div>
                    <div className="text-center space-y-1">
                      <p className="text-sm text-gray-600">Congratulations!</p>
                      <div className="flex items-center justify-center text-blue-600">
                        <span className="text-sm font-medium">Internship completed successfully</span>
                      </div>
                      <p className="text-xs text-gray-500">Well done!</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Educational Progress Card */}
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-200">
                <h3 className="font-semibold text-gray-800 flex items-center gap-2 mb-3">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  Program Progress
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Modules Completed</span>
                    <span className="font-medium">3/12</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full" style={{ width: '25%' }}></div>
                  </div>
                  <div className="text-xs text-gray-500 mt-2">
                    Keep going! You're making great progress in your internship journey.
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="p-6 shadow-sm bg-white border border-gray-200">
            <CardHeader className="p-0 mb-4">
              <CardTitle className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-gray-700" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 space-y-3">
              <Card className="p-4 bg-gray-50 border border-gray-200 hover:bg-gray-100 transition-colors cursor-pointer">
                <div className="flex items-center gap-3" onClick={() => window.open("https://mail.google.com/mail/u/0/#inbox?compose=DmwnWtDsVNbMNKTNwzTxmkpwGdhvfstmFcPTmJdfNPCsQjKpWZStJStKgcJrcFvsfVQcJBfwjhlq")}>
                  <Mail className="w-5 h-5 text-blue-600" />
                  <div>
                    <div className="text-base font-medium text-gray-700">Contact Support</div>
                    <div className="text-xs text-gray-500">Get help with your application</div>
                  </div>
                </div>
              </Card>

              <Card className="p-4 bg-gray-50 border border-gray-200 hover:bg-gray-100 transition-colors cursor-pointer">
                <div className="flex items-center gap-3" onClick={() => window.open("tel:9359463350")}>
                  <Phone className="w-5 h-5 text-blue-600" />
                  <div>
                    <div className="text-base font-medium text-gray-700">Call Support</div>
                    <div className="text-xs text-gray-500">+91 9359463350</div>
                  </div>
                </div>
              </Card>

              <Card className="p-4 bg-red-50 border border-red-200 hover:bg-red-100 transition-colors cursor-pointer">
                <div className="flex items-center gap-3" onClick={deleteApplication}>
                  <Trash2 className="w-5 h-5 text-red-600" />
                  <div>
                    <div className="text-base font-medium text-red-700">Delete Application</div>
                    <div className="text-xs text-red-500">Permanently remove your application</div>
                  </div>
                </div>
              </Card>
            </CardContent>
          </Card>

          {/* Educational Resources */}
          <Card className="p-6 shadow-sm bg-white border border-gray-200">
            <CardHeader className="p-0 mb-4">
              <CardTitle className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <Award className="w-5 h-5 text-gray-700" />
                Learning Resources
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                  <BookOpen className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-gray-800">Internship Guide</h4>
                    <p className="text-xs text-gray-600">Tips for success in your program</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg border border-purple-100">
                  <Target className="w-5 h-5 text-purple-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-gray-800">Career Development</h4>
                    <p className="text-xs text-gray-600">Building your professional skills</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-100">
                  <Award className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-gray-800">Certification Path</h4>
                    <p className="text-xs text-gray-600">Earning your completion certificate</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}