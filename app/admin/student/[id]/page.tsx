"use client"

import { AdminLayout } from "@/components/admin-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"

import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { getDomainOptions } from "@/lib/domains"
import {
  ArrowLeft,
  Briefcase,
  Calendar,
  Download,
  Eye,
  FileText,
  Mail,
  MessageSquare,
  Phone,
  Save, Sparkles, Trash2,
  User
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
    if (!editData) return;

    // // Custom domain logic
    // if (editData.domain === "Others" && customDomain.trim()) {
    //   addCustomDomain(customDomain.trim());
    //   setDomainOptions(getDomainOptions());
    //   editData.domain = customDomain.trim();
    // }

    setIsLoading(true);

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
      });

      if (response.ok) {
        const result = await response.json();
        setApplication(result.student);
        setEditData(result.student);
        setIsEditing(false);

        toast({
          title: "Application Updated ✅",
          description: "Student application has been updated successfully.",
        });
      } else {
        const error = await response.json();
        toast({
          title: "Update Failed",
          description: error.message || "Failed to update student data",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error updating student:", error);
      toast({
        title: "Update Failed",
        description: "Failed to connect to server",
        variant: "destructive",
      });
    }

    setIsLoading(false);
  }

  const updateStatus = async (newStatus: string) => {
    if (!application) return

    setIsLoading(true)

    try {
      const response = await fetch(`http://localhost:5000/api/students/${application?.id}`, {
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
          description: `${result.student.name}'s status updated. Email notification sent automatically!`,
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
        return "bg-blue-100 text-blue-800"
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
      `Are you sure you want to delete ${application?.name}'s application? This action cannot be undone.`
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
          description: `${application?.name}'s application has been deleted successfully.`,
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

  // Add this before your return statement
  const [domainOptions, setDomainOptions] = useState(getDomainOptions())
  const [customDomain, setCustomDomain] = useState("")

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
      <div className="space-y-6 p-4 lg:p-6 w-full min-w-0">
        <div className="flex flex-wrap items-center justify-between min-w-0 gap-2">
          <div className="bg-white border border-gray-300 rounded-lg px-4 py-2 shadow-sm min-w-0">
            <Link href="/admin/dashboard" className="flex items-center gap-2 text-purple-700 hover:text-purple-900 font-medium min-w-0">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Link>
          </div>
          <div className="flex gap-2 flex-wrap min-w-0">
            {isEditing ? (
              <>
                <Button
                  variant="outline"
                  onClick={() => setIsEditing(false)}
                  className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={isLoading}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Save className="h-4 w-4" />
                  {isLoading ? "Saving..." : "Save Changes"}
                </Button>
              </>
            ) : (
              <div className="flex gap-2">
                <Button onClick={() => setIsEditing(true)} className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50">
                  Edit Application
                </Button>
                <Button
                  onClick={deleteApplication}
                  variant="outline"
                  disabled={isLoading}
                  className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 min-w-0 overflow-x-auto z-10">
          {/* Main Information */}
          <div className="lg:col-span-2 min-w-0">
            <Card className="bg-white border-2 border-gray-300 shadow-sm min-w-0">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-gray-900 text-xl font-semibold">Application Information</CardTitle>
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {application.name.charAt(0).toUpperCase()}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Information Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 min-w-0 overflow-x-auto">
                  {/* Full Name Card */}
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <User className="h-5 w-5 text-gray-600" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-600 mb-1">Full Name</p>
                      {isEditing ? (
                        <Input
                          id="name"
                          value={editData?.name || ""}
                          onChange={(e) => setEditData((prev) => (prev ? { ...prev, name: e.target.value } : null))}
                          className="bg-white border-gray-300 text-gray-900"
                        />
                      ) : (
                        <p className="text-gray-900 font-semibold">{application.name}</p>
                      )}
                    </div>
                  </div>

                  {/* Email Address Card */}
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <Mail className="h-5 w-5 text-gray-600" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-600 mb-1">Email Address</p>
                      {isEditing ? (
                        <Input
                          id="email"
                          type="email"
                          value={editData?.email || ""}
                          onChange={(e) => setEditData((prev) => (prev ? { ...prev, email: e.target.value } : null))}
                          className="bg-white border-gray-300 text-gray-900"
                        />
                      ) : (
                        <p className="text-gray-900 font-semibold text-sm break-all">{application.email}</p>
                      )}
                    </div>
                  </div>

                  {/* Phone Number Card */}
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <Phone className="h-5 w-5 text-gray-600" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-600 mb-1">Phone Number</p>
                      {isEditing ? (
                        <Input
                          id="phone"
                          type="tel"
                          value={editData?.phone || ""}
                          onChange={(e) => setEditData((prev) => (prev ? { ...prev, phone: e.target.value } : null))}
                          maxLength={10}
                          className="bg-white border-gray-300 text-gray-900"
                        />
                      ) : (
                        <p className="text-gray-900 font-semibold">{application.phone}</p>
                      )}
                    </div>
                  </div>

                  {/* Domain Card */}
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <Briefcase className="h-5 w-5 text-gray-600" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-600 mb-1">Domain</p>
                      {isEditing ? (
                        <>
                          <Select
                            value={editData?.domain || ""}
                            onValueChange={(value) => {
                              setEditData((prev) => (prev ? { ...prev, domain: value } : null));
                              if (value !== "Others") setCustomDomain("");
                              setDomainOptions(getDomainOptions());
                            }}
                          >
                            <SelectTrigger className="bg-white border-gray-300 text-gray-900">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-white border-gray-300">
                              {domainOptions
                                .filter((domain: { value: string }) => domain.value !== "Database")
                                .map((domain: { value: string; label: string }) => (
                                  <SelectItem key={domain.value} value={domain.value}>
                                    {domain.label}
                                  </SelectItem>
                                ))}
                            </SelectContent>
                          </Select>
                          {editData?.domain === "Others" && (
                            <div className="mt-2">
                              <Label htmlFor="customDomain" className="text-gray-700 font-semibold flex items-center gap-2">
                                <Sparkles className="h-4 w-4 text-purple-600" />
                                Custom Domain *
                              </Label>
                              <Input
                                id="customDomain"
                                type="text"
                                placeholder="Enter custom domain"
                                value={customDomain}
                                onChange={(e) => setCustomDomain(e.target.value)}
                                required
                                className="bg-white border-gray-300 text-gray-900"
                              />
                            </div>
                          )}
                        </>
                      ) : (
                        <Badge variant="outline" className="text-blue-600 border-blue-300 bg-blue-50 hover:bg-blue-200">
                          {(() => {
                            if (application.domain === "Frontend") return "Frontend Developer";
                            if (application.domain === "Backend") return "Backend Developer";
                            if (application.domain === "Database") return "Database Management";
                            return application.domain;
                          })()}
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Date Applied Card */}
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200 md:col-span-2">
                    <Calendar className="h-5 w-5 text-gray-500" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-black-600 mb-1">Date Applied</p>
                      <p className="text-gray-900 font-semibold">
                        {new Date(application.dateApplied).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Resume/CV Card - Full Width Below Grid */}
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <FileText className="h-5 w-5 text-gray-600" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 mb-1">Resume/CV</p>
                    {application.resume ? (
                      <div className="space-y-2">
                        <p className="text-gray-900 font-semibold text-sm">
                          {application.resumeName || "Mohit_Resume4.pdf"}
                        </p>
                        <p className="text-gray-600 text-xs">
                          Uploaded on {new Date(application.dateApplied).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit'
                          })}
                        </p>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={viewResume}
                            className="bg-blue-500/10 border-blue-500/20 text-blue-600 hover:bg-blue-500/20 flex-1"
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            View
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={downloadResume}
                            className="bg-blue-500/10 border-blue-500/20 text-blue-600 hover:bg-blue-500/20 flex-1"
                          >
                            <Download className="h-3 w-3 mr-1" />
                            Download
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-purple-600 text-sm">No resume uploaded</p>
                    )}
                  </div>
                </div>


              </CardContent>
            </Card>
          </div>

          {/* Status and Actions */}
          <div className="space-y-6 min-w-0">
            {/* Application Status */}
            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-gray-900 text-lg font-semibold flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Application Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Status Display */}
                <div className="text-center py-4">
                  {isEditing ? (
                    <Select
                      value={editData?.status || ""}
                      onValueChange={(value) => setEditData((prev) => (prev ? { ...prev, status: value } : null))}
                    >
                      <SelectTrigger className="bg-white border-gray-300 text-gray-900">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-gray-300">
                        <SelectItem value="Applied">Applied</SelectItem>
                        <SelectItem value="In Review">In Review</SelectItem>
                        <SelectItem value="Selected">Selected</SelectItem>
                        <SelectItem value="Rejected">Rejected</SelectItem>
                        <SelectItem value="In Training">In Training</SelectItem>
                        <SelectItem value="Completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <div className="space-y-3">
                      <Badge className={`${getStatusColor(application.status)} text-lg px-4 py-2 font-semibold`}>
                        {application.status}
                      </Badge>

                      {/* Animated Emoji and Message for Selected */}
                      {application.status === "Selected" && (
                        <div className="space-y-2">
                          <div className="flex justify-center">
                            <div className="text-5xl animate-bounce" style={{ animationDuration: '1s' }}>
                              😊
                            </div>
                          </div>
                          <div className="text-center space-y-1">
                            <p className="text-sm text-gray-600">This applicant has been selected!</p>
                            <div className="flex items-center justify-center text-green-600">
                              <span className="text-sm font-medium">Congratulations!</span>
                            </div>
                            <p className="text-xs text-gray-500">This applicant has been selected!</p>
                          </div>
                        </div>
                      )}

                      {/* Animated Emoji and Message for Rejected */}
                      {application.status === "Rejected" && (
                        <div className="space-y-2">
                          <div className="flex justify-center">
                            <div className="text-5xl animate-bounce" style={{ animationDuration: '1s' }}>
                              😢
                            </div>
                          </div>
                          <div className="text-center space-y-1">
                            <p className="text-sm text-gray-600">This application was not successful</p>
                            <div className="flex items-center justify-center text-red-600">
                              <span className="text-sm font-medium">Better luck next time !!</span>
                            </div>
                            <p className="text-xs text-gray-500">Application has been rejected</p>
                          </div>
                        </div>
                      )}

                      {/* Animated Emoji and Message for Applied */}
                      {application.status === "Applied" && (
                        <div className="space-y-2">
                          <div className="flex justify-center">
                            <div className="text-5xl animate-pulse" style={{ animationDuration: '2s' }}>
                              📝
                            </div>
                          </div>
                          <div className="text-center space-y-1">
                            <p className="text-sm text-gray-600">Application has been submitted</p>
                            <div className="flex items-center justify-center text-blue-600">
                              <span className="text-sm font-medium">Waiting for review</span>
                            </div>
                            <p className="text-xs text-gray-500">Application is pending</p>
                          </div>
                        </div>
                      )}

                      {/* Animated Emoji for In Training */}
                      {application.status === "In Training" && (
                        <div className="space-y-2">
                          <div className="flex justify-center">
                            <div className="text-5xl animate-bounce" style={{ animationDuration: '1.5s' }}>
                              🎓
                            </div>
                          </div>
                          <div className="text-center space-y-1">
                            <p className="text-sm text-gray-600">Welcome to the team!</p>
                            <div className="flex items-center justify-center text-purple-600">
                              <span className="text-sm font-medium">Training has begun</span>
                            </div>
                            <p className="text-xs text-gray-500">Keep up the great work</p>
                          </div>
                        </div>
                      )}

                      {/* Animated Emoji for Completed */}
                      {application.status === "Completed" && (
                        <div className="space-y-2">
                          <div className="flex justify-center">
                            <div className="text-5xl animate-bounce" style={{ animationDuration: '1s' }}>
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

                      {/* Animated Emoji and Message for In Review */}
                      {application.status === "In Review" && (
                        <div className="space-y-2">
                          <div className="flex justify-center">
                            <div className="text-5xl animate-spin" style={{ animationDuration: '2s' }}>
                              ⏳
                            </div>
                          </div>
                          <div className="text-center space-y-1">
                            <p className="text-sm text-gray-600">Application is under review</p>
                            <div className="flex items-center justify-center text-yellow-600">
                              <span className="text-sm font-medium">Please wait for updates</span>
                            </div>
                            <p className="text-xs text-gray-500">Review in progress</p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Quick Actions */}
                {!isEditing && (application.status === "Applied" || application.status === "In Review") && (
                  <div className="space-y-2">
                    <Button
                      onClick={() => updateStatus("Selected")}
                      disabled={isLoading}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm"
                    >
                      {isLoading ? "Processing..." : "✓ Accept & Notify"}
                    </Button>
                    <Button
                      onClick={() => updateStatus("Rejected")}
                      disabled={isLoading}
                      variant="destructive"
                      className="w-full bg-red-600 hover:bg-red-700 text-white text-sm"
                    >
                      {isLoading ? "Processing..." : "✗ Reject & Notify"}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Contact Actions */}
            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-gray-900 text-lg font-semibold flex items-center gap-2">
                  <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                  Contact Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-1">
                <button
                  className="w-full flex items-center gap-3 p-3 text-left hover:bg-purple-200 rounded-lg transition-colors border-b border-gray-100 last:border-b-0"
                  onClick={() => window.open(`mailto:${application.email}`)}
                >
                  <Mail className="h-4 w-4 text-gray-600" />
                  <span className="text-gray-900 font-medium">Send Email</span>
                </button>
                <button
                  className="w-full flex items-center gap-3 p-3 text-left hover:bg-purple-200 rounded-lg transition-colors border-b border-gray-100 last:border-b-0"
                  onClick={() => window.open(`tel:${application.phone}`)}
                >
                  <Phone className="h-4 w-4 text-gray-600" />
                  <span className="text-gray-900 font-medium">Call Applicant</span>
                </button>
                <button
                  className="w-full flex items-center gap-3 p-3 text-left hover:bg-purple-200 rounded-lg transition-colors"
                  onClick={() => window.open(`sms:${application.phone}`)}
                >
                  <MessageSquare className="h-4 w-4 text-gray-600" />
                  <span className="text-gray-900 font-medium">Send SMS</span>
                </button>
              </CardContent>
            </Card>
          </div >
        </div >
      </div >
    </AdminLayout >
  )
}