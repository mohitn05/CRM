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
  Bell,
  FileText,
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

export default function InternDashboard() {
  const [internData, setInternData] = useState<InternAccount | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState<InternAccount | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    // Check authentication
    const authData = localStorage.getItem("internAuth")
    if (!authData) {
      router.push("/intern/login")
      return
    }

    const account = JSON.parse(authData)
    setInternData(account)
    setEditData(account)

    // Get updated status from applications
    const applications = JSON.parse(localStorage.getItem("applications") || "[]")
    const currentApp = applications.find((app: any) => app.id === account.applicationId)
    if (currentApp && currentApp.status !== account.status) {
      const updatedAccount = { ...account, status: currentApp.status }
      setInternData(updatedAccount)
      setEditData(updatedAccount)
      localStorage.setItem("internAuth", JSON.stringify(updatedAccount))
    }
  }, [router])

  const handleSave = async () => {
    if (!editData || !internData) return

    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Update intern account - KEEP THE SAME STATUS
    const internAccounts = JSON.parse(localStorage.getItem("internAccounts") || "[]")
    const updatedAccounts = internAccounts.map((acc: InternAccount) =>
      acc.id === editData.id ? { ...editData, status: internData.status } : acc,
    )
    localStorage.setItem("internAccounts", JSON.stringify(updatedAccounts))

    // Update application data - KEEP THE SAME STATUS
    const applications = JSON.parse(localStorage.getItem("applications") || "[]")
    const updatedApplications = applications.map((app: any) =>
      app.id === internData.applicationId
        ? {
            ...app,
            name: editData.name,
            email: editData.email,
            phone: editData.phone,
            domain: editData.domain,
            // Keep the original status - don't change to "Under Review"
            status: internData.status,
          }
        : app,
    )
    localStorage.setItem("applications", JSON.stringify(updatedApplications))

    // Update local state - KEEP THE SAME STATUS
    const updatedInternData = { ...editData, status: internData.status }
    setInternData(updatedInternData)
    setEditData(updatedInternData)
    localStorage.setItem("internAuth", JSON.stringify(updatedInternData))

    setIsEditing(false)
    setIsLoading(false)

    toast({
      title: "Profile Updated! ✅",
      description: "Your information has been updated successfully.",
    })
  }

  const handleLogout = () => {
    localStorage.removeItem("internAuth")
    toast({
      title: "Logged Out Successfully ✅",
      description: "Thank you for using our platform!",
    })
    router.push("/")
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
      case "Applied":
        return <Clock className="w-4 h-4" />
      case "Under Review":
      case "In Review":
        return <Clock className="w-4 h-4" />
      case "Selected":
        return <CheckCircle className="w-4 h-4" />
      case "Rejected":
        return <XCircle className="w-4 h-4" />
      case "In Training":
        return <FileText className="w-4 h-4" />
      case "Completed":
        return <CheckCircle className="w-4 h-4" />
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
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-mint-50 to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-mint-50 to-green-50">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-md border-b border-white/20 p-6">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Welcome, {internData.name}!</h1>
              <p className="text-gray-600">Intern Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="text-sm text-gray-600">Notifications</span>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="bg-red-50 border-red-200 text-red-700 hover:bg-red-100"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Information */}
          <div className="lg:col-span-2">
            <Card className="bg-white/20 backdrop-blur-md border border-white/30 shadow-xl">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-gray-800 flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Profile Information
                  </CardTitle>
                  {!isEditing ? (
                    <Button
                      onClick={() => setIsEditing(true)}
                      variant="outline"
                      className="bg-white/20 border-white/30 text-gray-700 hover:bg-white/30"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button
                        onClick={() => {
                          setIsEditing(false)
                          setEditData(internData) // Reset to original data
                        }}
                        variant="outline"
                        className="bg-white/20 border-white/30 text-gray-700 hover:bg-white/30"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                      </Button>
                      <Button
                        onClick={handleSave}
                        disabled={isLoading}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        {isLoading ? "Saving..." : "Save"}
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2 text-gray-700 font-medium">
                      <User className="w-4 h-4" />
                      Full Name
                    </Label>
                    {isEditing ? (
                      <Input
                        value={editData?.name || ""}
                        onChange={(e) => setEditData((prev) => (prev ? { ...prev, name: e.target.value } : null))}
                        className="bg-white/50 backdrop-blur-sm border-white/40"
                      />
                    ) : (
                      <p className="text-gray-800 font-medium bg-white/30 p-3 rounded-lg">{internData.name}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center gap-2 text-gray-700 font-medium">
                      <Mail className="w-4 h-4" />
                      Email Address
                    </Label>
                    {isEditing ? (
                      <Input
                        type="email"
                        value={editData?.email || ""}
                        onChange={(e) => setEditData((prev) => (prev ? { ...prev, email: e.target.value } : null))}
                        className="bg-white/50 backdrop-blur-sm border-white/40"
                      />
                    ) : (
                      <p className="text-gray-800 font-medium bg-white/30 p-3 rounded-lg">{internData.email}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center gap-2 text-gray-700 font-medium">
                      <Phone className="w-4 h-4" />
                      Phone Number
                    </Label>
                    {isEditing ? (
                      <Input
                        value={editData?.phone || ""}
                        onChange={(e) => setEditData((prev) => (prev ? { ...prev, phone: e.target.value } : null))}
                        className="bg-white/50 backdrop-blur-sm border-white/40"
                      />
                    ) : (
                      <p className="text-gray-800 font-medium bg-white/30 p-3 rounded-lg">{internData.phone}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center gap-2 text-gray-700 font-medium">
                      <Building2 className="w-4 h-4" />
                      Domain
                    </Label>
                    {isEditing ? (
                      <Select
                        value={editData?.domain || ""}
                        onValueChange={(value) => setEditData((prev) => (prev ? { ...prev, domain: value } : null))}
                      >
                        <SelectTrigger className="bg-white/50 backdrop-blur-sm border-white/40">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Frontend">Frontend Development</SelectItem>
                          <SelectItem value="Backend">Backend Development</SelectItem>
                          <SelectItem value="Database">Database Management</SelectItem>
                          <SelectItem value="Others">Others</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <Badge className="bg-emerald-100 text-emerald-800 text-base px-4 py-2">{internData.domain}</Badge>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-gray-700 font-medium">
                    <Calendar className="w-4 h-4" />
                    Registration Date
                  </Label>
                  <p className="text-gray-800 font-medium bg-white/30 p-3 rounded-lg">
                    {new Date(internData.dateRegistered).toLocaleDateString()}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Status and Progress */}
          <div className="space-y-6">
            <Card className="bg-white/20 backdrop-blur-md border border-white/30 shadow-xl">
              <CardHeader>
                <CardTitle className="text-gray-800 flex items-center gap-2">
                  {getStatusIcon(internData.status)}
                  Application Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <Badge className={`${getStatusColor(internData.status)} text-lg px-4 py-2 mb-4`}>
                    {internData.status}
                  </Badge>
                  <p className="text-gray-700 text-sm leading-relaxed">{getStatusMessage(internData.status)}</p>
                </div>

                {(internData.status === "Under Review" || internData.status === "In Review") && (
                  <div className="bg-yellow-50/50 border border-yellow-200/50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="w-4 h-4 text-yellow-600" />
                      <span className="font-medium text-yellow-800">Review in Progress</span>
                    </div>
                    <p className="text-yellow-700 text-sm">
                      Our team is currently reviewing your application. You'll receive an update within 48 hours.
                    </p>
                  </div>
                )}

                {internData.status === "Selected" && (
                  <div className="bg-green-50/50 border border-green-200/50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="font-medium text-green-800">Congratulations!</span>
                    </div>
                    <p className="text-green-700 text-sm">
                      You've been selected! Check your email for onboarding instructions and next steps.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="bg-white/20 backdrop-blur-md border border-white/30 shadow-xl">
              <CardHeader>
                <CardTitle className="text-gray-800">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start bg-white/20 border-white/30 text-gray-700 hover:bg-white/30"
                  onClick={() => window.open(`mailto:contact@internshipcrm.com`)}
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Contact Support
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start bg-white/20 border-white/30 text-gray-700 hover:bg-white/30"
                  onClick={() => window.open(`tel:+15551234567`)}
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Call Support
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
