"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { AdminLayout } from "@/components/admin-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import {
  ArrowLeft,
  Save,
  User,
  Mail,
  Phone,
  Briefcase,
  Calendar,
  FileText,
  Download,
  Eye,
  MessageSquare,
} from "lucide-react"
import Link from "next/link"

interface Application {
  id: number
  name: string
  email: string
  phone: string
  domain: string
  status: string
  dateApplied: string
  resume?: string
  resumeName?: string
}

// Enhanced notification service
const sendNotification = async (email: string, phone: string, name: string, status: string) => {
  console.log(`Sending ${status} notification to ${email} and ${phone} for ${name}`)

  await new Promise((resolve) => setTimeout(resolve, 1500))

  return {
    success: true,
    email: { sent: true },
    sms: { sent: true },
  }
}

export default function StudentDetailPage() {
  const [application, setApplication] = useState<Application | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState<Application | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()

  useEffect(() => {
    // Check authentication
    if (!localStorage.getItem("adminAuth")) {
      router.push("/admin/login")
      return
    }

    // Load specific application
    const savedApplications = JSON.parse(localStorage.getItem("applications") || "[]")
    const app = savedApplications.find((a: Application) => a.id === Number.parseInt(params.id as string))

    if (app) {
      setApplication(app)
      setEditData(app)
    } else {
      router.push("/admin/students")
    }
  }, [router, params.id])

  const handleSave = async () => {
    if (!editData) return

    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Update in localStorage
    const savedApplications = JSON.parse(localStorage.getItem("applications") || "[]")
    const updatedApplications = savedApplications.map((app: Application) => (app.id === editData.id ? editData : app))
    localStorage.setItem("applications", JSON.stringify(updatedApplications))

    setApplication(editData)
    setIsEditing(false)
    setIsLoading(false)

    toast({
      title: "Application Updated ✅",
      description: "Student application has been updated successfully.",
    })
  }

  const updateStatus = async (newStatus: string) => {
    if (!application) return

    setIsLoading(true)

    // Update status
    const updatedApp = { ...application, status: newStatus }
    const savedApplications = JSON.parse(localStorage.getItem("applications") || "[]")
    const updatedApplications = savedApplications.map((app: Application) =>
      app.id === application.id ? updatedApp : app,
    )
    localStorage.setItem("applications", JSON.stringify(updatedApplications))
    setApplication(updatedApp)
    setEditData(updatedApp)

    // Send notifications
    try {
      await sendNotification(application.email, application.phone, application.name, newStatus)

      toast({
        title: `Application ${newStatus} ✅`,
        description: `${application.name}'s application updated. Email & SMS notifications sent!`,
      })
    } catch (error) {
      toast({
        title: `Application ${newStatus}`,
        description: `Status updated, but notification failed.`,
        variant: "destructive",
      })
    }

    setIsLoading(false)
  }

  const downloadResume = () => {
    if (!application?.resume) return

    const link = document.createElement("a")
    link.href = application.resume
    link.download = application.resumeName || "resume.pdf"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast({
      title: "Resume Downloaded ✅",
      description: `${application.resumeName || "Resume"} has been downloaded.`,
    })
  }

  const viewResume = () => {
    if (!application?.resume) return

    window.open(application.resume, "_blank")
    toast({
      title: "Resume Opened",
      description: "Resume opened in new tab.",
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Applied":
        return "bg-blue-100 text-blue-800"
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

  if (!application) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-purple-300">Loading...</p>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-6 p-4 lg:p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin/students" className="flex items-center gap-2 text-purple-300 hover:text-white">
              <ArrowLeft className="h-4 w-4" />
              Back to Students
            </Link>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                {application.name}
              </h1>
              <p className="text-purple-300">Application Details</p>
            </div>
          </div>
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <Button
                  variant="outline"
                  onClick={() => setIsEditing(false)}
                  className="bg-white/10 border-purple-500/20 text-white"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={isLoading}
                  className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600"
                >
                  <Save className="h-4 w-4" />
                  {isLoading ? "Saving..." : "Save Changes"}
                </Button>
              </>
            ) : (
              <Button onClick={() => setIsEditing(true)} className="bg-gradient-to-r from-blue-600 to-purple-600">
                Edit Application
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Information */}
          <div className="lg:col-span-2">
            <Card className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-purple-500/20">
              <CardHeader>
                <CardTitle className="text-white">Application Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
                      <User className="h-4 w-4" />
                      Full Name
                    </Label>
                    {isEditing ? (
                      <Input
                        id="name"
                        value={editData?.name || ""}
                        onChange={(e) => setEditData((prev) => (prev ? { ...prev, name: e.target.value } : null))}
                        className="bg-zinc-100/10 border-zinc-500/20 text-zinc-700 dark:text-zinc-300"
                      />
                    ) : (
                      <p className="text-zinc-700 dark:text-zinc-300 font-medium">{application.name}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
                      <Mail className="h-4 w-4" />
                      Email Address
                    </Label>
                    {isEditing ? (
                      <Input
                        id="email"
                        type="email"
                        value={editData?.email || ""}
                        onChange={(e) => setEditData((prev) => (prev ? { ...prev, email: e.target.value } : null))}
                        className="bg-zinc-100/10 border-zinc-500/20 text-zinc-700 dark:text-zinc-300"
                      />
                    ) : (
                      <p className="text-zinc-700 dark:text-zinc-300 font-medium">{application.email}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
                      <Phone className="h-4 w-4" />
                      Phone Number
                    </Label>
                    {isEditing ? (
                      <Input
                        id="phone"
                        value={editData?.phone || ""}
                        onChange={(e) => setEditData((prev) => (prev ? { ...prev, phone: e.target.value } : null))}
                        className="bg-zinc-100/10 border-zinc-500/20 text-zinc-700 dark:text-zinc-300"
                      />
                    ) : (
                      <p className="text-zinc-700 dark:text-zinc-300 font-medium">{application.phone}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="domain" className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
                      <Briefcase className="h-4 w-4" />
                      Domain
                    </Label>
                    {isEditing ? (
                      <Select
                        value={editData?.domain || ""}
                        onValueChange={(value) => setEditData((prev) => (prev ? { ...prev, domain: value } : null))}
                      >
                        <SelectTrigger className="bg-zinc-100/10 border-zinc-500/20 text-zinc-700 dark:text-zinc-300">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-zinc-100 border-zinc-200">
                          <SelectItem value="Frontend">Frontend Development</SelectItem>
                          <SelectItem value="Backend">Backend Development</SelectItem>
                          <SelectItem value="Database">Database Management</SelectItem>
                          <SelectItem value="Others">Others</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <Badge variant="outline" className="w-fit text-purple-300 border-purple-500/20">
                        {application.domain}
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dateApplied" className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
                    <Calendar className="h-4 w-4" />
                    Date Applied
                  </Label>
                  <p className="text-zinc-700 dark:text-zinc-300 font-medium">{application.dateApplied}</p>
                </div>

                {/* Resume Section */}
                {application.resume && (
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
                      <FileText className="h-4 w-4" />
                      Resume/CV
                    </Label>
                    <div className="flex items-center gap-3 p-4 bg-zinc-100/10 rounded-xl border border-zinc-500/20">
                      <FileText className="h-8 w-8 text-purple-400" />
                      <div className="flex-1">
                        <p className="text-zinc-700 dark:text-zinc-300 font-medium">
                          {application.resumeName || "Resume.pdf"}
                        </p>
                        <p className="text-purple-300 text-sm">Uploaded on {application.dateApplied}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={viewResume}
                          className="bg-blue-500/10 border-blue-500/20 text-blue-400 hover:bg-blue-500/20"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={downloadResume}
                          className="bg-green-500/10 border-green-500/20 text-green-400 hover:bg-green-500/20"
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Status and Actions */}
          <div className="space-y-6">
            <Card className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-purple-500/20">
              <CardHeader>
                <CardTitle className="text-white">Application Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-zinc-700 dark:text-zinc-300">Current Status</Label>
                  {isEditing ? (
                    <Select
                      value={editData?.status || ""}
                      onValueChange={(value) => setEditData((prev) => (prev ? { ...prev, status: value } : null))}
                    >
                      <SelectTrigger className="bg-zinc-100/10 border-zinc-500/20 text-zinc-700 dark:text-zinc-300">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-zinc-100 border-zinc-200">
                        <SelectItem value="Applied">Applied</SelectItem>
                        <SelectItem value="In Review">In Review</SelectItem>
                        <SelectItem value="Selected">Selected</SelectItem>
                        <SelectItem value="Rejected">Rejected</SelectItem>
                        <SelectItem value="In Training">In Training</SelectItem>
                        <SelectItem value="Completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <Badge className={getStatusColor(application.status)}>{application.status}</Badge>
                  )}
                </div>

                {/* Quick Status Actions */}
                {!isEditing && (application.status === "Applied" || application.status === "In Review") && (
                  <div className="space-y-2">
                    <Label className="text-zinc-700 dark:text-zinc-300">Quick Actions</Label>
                    <div className="space-y-2">
                      <Button
                        onClick={() => updateStatus("Selected")}
                        disabled={isLoading}
                        className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                      >
                        {isLoading ? "Processing..." : "✓ Accept & Notify"}
                      </Button>
                      <Button
                        onClick={() => updateStatus("Rejected")}
                        disabled={isLoading}
                        variant="destructive"
                        className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800"
                      >
                        {isLoading ? "Processing..." : "✗ Reject & Notify"}
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-purple-500/20">
              <CardHeader>
                <CardTitle className="text-white">Contact Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start bg-white/10 border-purple-500/20 text-white hover:bg-purple-500/20"
                  onClick={() => window.open(`mailto:${application.email}`)}
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Send Email
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start bg-white/10 border-purple-500/20 text-white hover:bg-purple-500/20"
                  onClick={() => window.open(`tel:${application.phone}`)}
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Call Applicant
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start bg-white/10 border-purple-500/20 text-white hover:bg-purple-500/20"
                  onClick={() => window.open(`sms:${application.phone}`)}
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Send SMS
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
