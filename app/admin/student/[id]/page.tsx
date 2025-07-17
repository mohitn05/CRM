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
  Trash2,
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

    // Load specific application from API
    const fetchStudent = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/students/${params.id}`)
        if (response.ok) {
          const studentData = await response.json()
          setApplication(studentData)
          setEditData(studentData)
        } else {
          toast({
            title: "Error",
            description: "Failed to load student data",
            variant: "destructive",
          })
          router.push("/admin/students")
        }
      } catch (error) {
        console.error("Error fetching student:", error)
        toast({
          title: "Error",
          description: "Failed to connect to server",
          variant: "destructive",
        })
        router.push("/admin/students")
      }
    }

    fetchStudent()
  }, [router, params.id, toast])

  const handleSave = async () => {
    if (!editData) return

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
          status: editData.status,
        }),
      })

      if (response.ok) {
        const result = await response.json()
        setApplication(result.student)
        setEditData(result.student)
        setIsEditing(false)

        toast({
          title: "Application Updated ✅",
          description: "Student application has been updated successfully.",
        })
      } else {
        const error = await response.json()
        toast({
          title: "Update Failed",
          description: error.message || "Failed to update student data",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error updating student:", error)
      toast({
        title: "Update Failed",
        description: "Failed to connect to server",
        variant: "destructive",
      })
    }

    setIsLoading(false)
  }

  const updateStatus = async (newStatus: string) => {
    if (!application) return

    setIsLoading(true)

    try {
      const response = await fetch(`http://localhost:5000/api/students/${application.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: newStatus,
        }),
      })

      if (response.ok) {
        const result = await response.json()
        setApplication(result.student)
        setEditData(result.student)

        toast({
          title: `Application ${newStatus} ✅`,
          description: `${application.name}'s application updated. Email & SMS notifications sent!`,
        })
      } else {
        const error = await response.json()
        toast({
          title: "Status Update Failed",
          description: error.message || "Failed to update status",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error updating status:", error)
      toast({
        title: "Status Update Failed",
        description: "Failed to connect to server",
        variant: "destructive",
      })
    }

    setIsLoading(false)
  }

  const downloadResume = async () => {
    if (!application?.id || !application?.resumeName) {
      toast({
        title: "Download Failed",
        description: "No resume file available for this student.",
        variant: "destructive",
      })
      return
    }

    try {
      // Use the working student detail endpoint with download parameter
      const response = await fetch(`http://localhost:5000/api/students/${application.id}?download=resume`)

      if (!response.ok) {
        throw new Error('Resume not found')
      }

      // Check if response is a file or JSON
      const contentType = response.headers.get('Content-Type')
      if (contentType && (contentType.includes('application/pdf') || contentType.includes('application/octet-stream'))) {
        // It's a file - download it
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.href = url
        link.download = application.resumeName
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)

        toast({
          title: "Resume Downloaded ✅",
          description: `${application.resumeName} has been downloaded successfully.`,
        })
      } else {
        // It's JSON - fallback to opening in new tab
        const fileUrl = `http://localhost:5000/uploads/${application.resumeName}`
        window.open(fileUrl, '_blank')

        toast({
          title: "Resume Opened ✅",
          description: `${application.resumeName} has been opened in a new tab.`,
        })
      }
    } catch (error) {
      // Fallback: try to open the file directly
      try {
        const fileUrl = `http://localhost:5000/uploads/${application.resumeName}`
        window.open(fileUrl, '_blank')

        toast({
          title: "Resume Opened ✅",
          description: `${application.resumeName} has been opened in a new tab.`,
        })
      } catch (fallbackError) {
        toast({
          title: "Download Failed",
          description: "Could not download or open resume. Please try again.",
          variant: "destructive",
        })
      }
    }
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

  const deleteApplication = async () => {
    if (!application?.id) return

    const confirmed = window.confirm(
      `Are you sure you want to delete ${application.name}'s application? This action cannot be undone.`
    )

    if (!confirmed) return

    setIsLoading(true)

    try {
      const response = await fetch(`http://localhost:5000/api/students/${application.id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        toast({
          title: "Application Deleted ✅",
          description: `${application.name}'s application has been deleted successfully.`,
        })
        router.push('/admin/dashboard')
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
            <Link href="/admin/dashboard" className="flex items-center gap-2 text-purple-700 hover:text-black dark:text-purple-700 dark:hover:text-black">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-black">
                {application.name}
              </h1>
              {/* <p className="text-black">Application Details</p> */}
            </div>
          </div>
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <Button
                  variant="outline"
                  onClick={() => setIsEditing(false)}
                  className="bg-white/10 border-purple-500/20 text-black"
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
              <div className="flex gap-2">
                <Button onClick={() => setIsEditing(true)} className="bg-gradient-to-r from-blue-600 to-purple-600">
                  Edit Application
                </Button>
                <Button
                  onClick={deleteApplication}
                  variant="destructive"
                  disabled={isLoading}
                  className="bg-red-600 hover:bg-red-700"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Information */}
          <div className="lg:col-span-2">
            <Card className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-purple-500/20">
              <CardHeader>
                <CardTitle className="text-black">Application Information</CardTitle>
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
                        type="tel"
                        value={editData?.phone || ""}
                        onChange={(e) => setEditData((prev) => (prev ? { ...prev, phone: e.target.value } : null))}
                        maxLength={10}
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
                        <SelectTrigger className="bg-white/10 border-emerald-500/20 text-gray-800">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-grey-500">
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
                <CardTitle className="text-black">Application Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-zinc-700 dark:text-zinc-300">Current Status</Label>
                  {isEditing ? (
                    <Select
                      value={editData?.status || ""}
                      onValueChange={(value) => setEditData((prev) => (prev ? { ...prev, status: value } : null))}
                    >
                      <SelectTrigger className="bg-white/10 border-emerald-500/20 text-gray-800">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-grey-500">
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
                <CardTitle className="text-black">Contact Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start bg-white/10 border-purple-500/20 text-black hover:bg-purple-500/20"
                  onClick={() => window.open(`mailto:${application.email}`)}
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Send Email
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start bg-white/10 border-purple-500/20 text-black hover:bg-purple-500/20"
                  onClick={() => window.open(`tel:${application.phone}`)}
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Call Applicant
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start bg-white/10 border-purple-500/20 text-black hover:bg-purple-500/20"
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
