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
  Edit,
  Eye,
  FileText,
  Mail,
  Phone,
  Save,
  Trash2,
  TrendingUp,
  User,
  X
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

export default function StudentDetailPage() {
  const [application, setApplication] = useState<Application | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState<Application | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [pendingStatusUpdate, setPendingStatusUpdate] = useState<{
    status: string
    message: string
  } | null>(null)
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
          // Normalize domain name
          const normalizedStudentData = {
            ...studentData,
            domain: normalizeDomain(studentData.domain)
          };
          setApplication(normalizedStudentData)
          setEditData(normalizedStudentData)
        } else {
          toast({
            title: "⚠️ Load Error",
            description: "❌ Failed to load student data. Please try refreshing the page.",
            variant: "destructive",
          })
          router.push("/admin/students")
        }
      } catch (error) {
        console.error("Error fetching student:", error)
        toast({
          title: "🌐 Connection Error",
          description: "⚠️ Failed to connect to server. Please check your internet connection.",
          variant: "warning" as any,
        })
        router.push("/admin/students")
      }
    }

    fetchStudent()
  }, [router, params.id, toast])

  const handleSave = async () => {
    if (!editData) return;

    // Check if status has changed
    const statusChanged = editData.status !== application?.status;

    if (statusChanged) {
      // Show confirmation dialog for status change
      let message = "";
      switch (editData.status) {
        case "Selected":
          message = `Send acceptance email to ${editData.name}?`;
          break;
        case "Rejected":
          message = `Send rejection email to ${editData.name}?`;
          break;
        case "In Training":
          message = `Send training start notification to ${editData.name}?`;
          break;
        case "Completed":
          message = `Send completion congratulations email to ${editData.name}?`;
          break;
        case "In Review":
          message = `Send review notification email to ${editData.name}?`;
          break;
        default:
          message = `Send status update email to ${editData.name}?`;
      }

      // Store the edit data for later use and show confirmation
      setPendingStatusUpdate({ status: editData.status, message });
      setShowConfirmDialog(true);
      return; // Don't save yet, wait for confirmation
    }

    // If no status change, save normally without email confirmation
    await saveChanges();
  };

  const saveChanges = async () => {
    if (!editData) return;

    setIsLoading(true);

    try {
      // Always normalize domain before saving
      const normalizedDomain = normalizeDomain(editData.domain);
      const response = await fetch(`http://localhost:5000/api/students/${editData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: editData.name,
          email: editData.email,
          phone: editData.phone,
          domain: normalizedDomain,
          status: editData.status,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        // Normalize domain in local state as well
        const normalizedStudent = {
          ...result.student,
          domain: normalizeDomain(result.student.domain)
        };
        setApplication(normalizedStudent);
        setEditData(normalizedStudent);
        setIsEditing(false);

        toast({
          title: "✅ Application Updated Successfully!",
          description: "🎉 Student application has been updated and saved to the database.",
          variant: "success" as any,
        });
      } else {
        const error = await response.json();
        toast({
          title: "❌ Update Failed",
          description: "⚠️ " + (error.message || "Failed to update student data. Please try again."),
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error updating student:", error);
      toast({
        title: "🌐 Update Failed",
        description: "⚠️ Failed to connect to server. Please check your connection and try again.",
        variant: "warning" as any,
      });
    }

    setIsLoading(false);
  };

  const updateStatus = async (newStatus: string) => {
    if (!application) return

    // Prepare confirmation message based on status
    let message = ""
    switch (newStatus) {
      case "Selected":
        message = `Send acceptance email to ${application.name}?`
        break
      case "Rejected":
        message = `Send rejection email to ${application.name}?`
        break
      case "In Training":
        message = `Send training start notification to ${application.name}?`
        break
      case "Completed":
        message = `Send completion congratulations email to ${application.name}?`
        break
      default:
        message = `Send status update email to ${application.name}?`
    }

    // Show confirmation dialog
    setPendingStatusUpdate({ status: newStatus, message })
    setShowConfirmDialog(true)
  }

  const confirmStatusUpdate = async () => {
    if (!application || !pendingStatusUpdate) return

    setIsLoading(true)
    setShowConfirmDialog(false)

    try {
      // Check if we're in edit mode or direct status update mode
      if (isEditing && editData) {
        // Always normalize domain before saving
        const normalizedDomain = normalizeDomain(editData.domain);
        // We're in edit mode - save all changes including status
        const response = await fetch(`http://localhost:5000/api/students/${editData.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: editData.name,
            email: editData.email,
            phone: editData.phone,
            domain: normalizedDomain,
            status: pendingStatusUpdate.status,
          }),
        })

        if (response.ok) {
          const result = await response.json()
          // Normalize domain in local state as well
          const normalizedStudent = {
            ...result.student,
            domain: normalizeDomain(result.student.domain)
          };
          setApplication(normalizedStudent)
          setEditData(normalizedStudent)
          setIsEditing(false) // Exit edit mode

          toast({
            title: `🎯 Application ${normalizedStudent.name} Updated!`,
            description: `✨ ${normalizedStudent.name}'s application updated and email notification sent successfully!`,
            variant: "success" as any,
          })
        } else {
          const error = await response.json()
          toast({
            title: "❌ Update Failed",
            description: "⚠️ " + (error.message || "Failed to update application. Please try again."),
            variant: "destructive",
          })
        }
      } else {
        // Direct status update mode (not in edit mode)
        const response = await fetch(`http://localhost:5000/api/students/${application?.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            status: pendingStatusUpdate.status,
          }),
        })

        if (response.ok) {
          const result = await response.json()
          // Normalize domain in local state as well
          const normalizedStudent = {
            ...result.student,
            domain: normalizeDomain(result.student.domain)
          };
          setApplication(normalizedStudent)
          setEditData(normalizedStudent)

          toast({
            title: `🎉 Status Updated to ${normalizedStudent.status}!`,
            description: `✅ ${normalizedStudent.name}'s status updated successfully. Email and notification sent!`,
            variant: "success" as any,
          })
        } else {
          const error = await response.json()
          toast({
            title: "❌ Status Update Failed",
            description: "⚠️ " + (error.message || "Failed to update status. Please try again."),
            variant: "destructive",
          })
        }
      }
    } catch (error) {
      console.error("Error updating status:", error)
      toast({
        title: "🌐 Connection Error",
        description: "⚠️ Failed to connect to server. Please check your internet connection and try again.",
        variant: "warning" as any,
      })
    }

    setIsLoading(false)
    setPendingStatusUpdate(null)
  }

  const cancelStatusUpdate = () => {
    setShowConfirmDialog(false)
    setPendingStatusUpdate(null)

    // If we're in edit mode and user cancels, revert the status back to original
    if (isEditing && application && editData) {
      setEditData({
        ...editData,
        status: application.status // Revert status to original
      })
    }
  }

  const downloadResume = async () => {
    if (!application?.id || !application?.resumeName) {
      toast({
        title: "❌ Download Failed",
        description: "⚠️ No resume file available for this student or file not found.",
        variant: "warning" as any,
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
          title: "📄 Resume Downloaded Successfully!",
          description: `✅ ${application.resumeName} has been downloaded to your computer.`,
          variant: "success" as any,
        })
      } else {
        // It's JSON - fallback to opening in new tab
        const fileUrl = `http://localhost:5000/uploads/${application.resumeName}`
        window.open(fileUrl, '_blank')

        toast({
          title: "👀 Resume Opened in Fallback Mode!",
          description: `✅ ${application.resumeName} has been opened in a new browser tab.`,
          variant: "info" as any,
        })
      }
    } catch (error) {
      // Fallback: try to open the file directly
      try {
        const fileUrl = `http://localhost:5000/uploads/${application.resumeName}`
        window.open(fileUrl, '_blank')

        toast({
          title: "👀 Resume Opened Successfully!",
          description: `✅ ${application.resumeName} has been opened in a new browser tab.`,
          variant: "info" as any,
        })
      } catch (fallbackError) {
        toast({
          title: "❌ Download Failed",
          description: "⚠️ Could not download or open resume. Please check if the file exists and try again.",
          variant: "destructive",
        })
      }
    }
  }

  const viewResume = () => {
    try {
      // Check if resume data is available
      if (!application?.resumeName) {
        toast({
          title: "👀 Resume Not Available",
          description: "⚠️ No resume file was uploaded for this application.",
          variant: "warning" as any,
        })
        return
      }

      // Open the file in a new tab for viewing using the filename
      const fileUrl = `http://localhost:5000/uploads/${application.resumeName}`
      window.open(fileUrl, "_blank")

      toast({
        title: "👀 Resume Opened!",
        description: "📄 Resume opened in new tab for viewing.",
        variant: "info" as any,
      })
    } catch (error) {
      toast({
        title: "❌ View Failed",
        description: "⚠️ Could not open resume. Please check if the file exists and try again.",
        variant: "destructive",
      })
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Applied":
        return "bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 text-white"
      case "In Review":
      case "Under Review":
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
          title: "🗑️ Application Deleted Successfully!",
          description: `✅ ${application?.name}'s application has been permanently deleted from the system.`,
          variant: "success" as any,
        })
        router.push('/admin/dashboard')
      } else {
        throw new Error('Failed to delete application')
      }
    } catch (error) {
      console.error("Error deleting application:", error)
      toast({
        title: "❌ Delete Failed",
        description: "⚠️ Failed to delete application. Please check your connection and try again.",
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
      <div className="space-y-8 p-4 md:p-6 w-full min-w-0">
        {/* Enhanced Professional Header Section */}
        <div className="bg-gradient-to-r from-slate-50 to-purple-50 rounded-2xl shadow-lg border border-gray-200 p-6 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-full -translate-y-4 translate-x-4"></div>

          <div className="relative z-10">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-xl">
                  {application.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <Link href="/admin/dashboard" className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium mb-2 transition-colors">
                    <ArrowLeft className="h-4 w-4" />
                    Back to Dashboard
                  </Link>
                  <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-gray-900 via-purple-800 to-blue-800 bg-clip-text text-transparent">
                    {application.name}'s Application
                  </h1>
                  <p className="text-gray-600 font-medium">
                    Application ID: #{application.id} • {application.domain}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                {isEditing ? (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => setIsEditing(false)}
                      className="border-gray-300 text-gray-700 hover:bg-gray-50 transition-all duration-200"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSave}
                      disabled={isLoading}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      {isLoading ? "Saving..." : "Save Changes"}
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      onClick={() => setIsEditing(true)}
                      variant="outline"
                      className="border-purple-300 text-purple-600 hover:bg-purple-50 transition-all duration-200 hover:scale-105"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Application
                    </Button>
                    <Button
                      onClick={deleteApplication}
                      variant="outline"
                      disabled={isLoading}
                      className="border-red-300 text-red-600 hover:bg-red-50 transition-all duration-200 hover:scale-105"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Enhanced Main Information */}
          <div className="lg:col-span-2">
            <Card className="bg-white border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300">
              <CardHeader className="bg-gradient-to-r from-gray-50 to-purple-50 border-b border-gray-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg">
                      <User className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-xl font-bold text-gray-900">Application Information</CardTitle>
                      <p className="text-sm text-gray-600 mt-1">Personal details and application data</p>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                    {application.name.charAt(0).toUpperCase()}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-8 p-6">
                {/* Personal Information Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Full Name */}
                  <div className="space-y-3">
                    <Label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                      <div className="p-1 bg-blue-100 rounded">
                        <User className="h-4 w-4 text-blue-600" />
                      </div>
                      Full Name
                    </Label>
                    {isEditing ? (
                      <Input
                        value={editData?.name || ""}
                        onChange={(e) => setEditData((prev) => (prev ? { ...prev, name: e.target.value } : null))}
                        className="border-gray-300 focus:border-purple-500 focus:ring-purple-500 bg-white font-medium"
                      />
                    ) : (
                      <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <p className="text-gray-900 font-semibold text-lg">{application.name}</p>
                      </div>
                    )}
                  </div>

                  {/* Email */}
                  <div className="space-y-3">
                    <Label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                      <div className="p-1 bg-green-100 rounded">
                        <Mail className="h-4 w-4 text-green-600" />
                      </div>
                      Email Address
                    </Label>
                    {isEditing ? (
                      <Input
                        type="email"
                        value={editData?.email || ""}
                        onChange={(e) => setEditData((prev) => (prev ? { ...prev, email: e.target.value } : null))}
                        className="border-gray-300 focus:border-purple-500 focus:ring-purple-500 bg-white font-medium"
                      />
                    ) : (
                      <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <p className="text-gray-900 font-semibold">{application.email}</p>
                      </div>
                    )}
                  </div>

                  {/* Phone */}
                  <div className="space-y-3">
                    <Label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                      <div className="p-1 bg-yellow-100 rounded">
                        <Phone className="h-4 w-4 text-yellow-600" />
                      </div>
                      Phone Number
                    </Label>
                    {isEditing ? (
                      <Input
                        type="tel"
                        value={editData?.phone || ""}
                        onChange={(e) => setEditData((prev) => (prev ? { ...prev, phone: e.target.value } : null))}
                        className="border-gray-300 focus:border-purple-500 focus:ring-purple-500 bg-white font-medium"
                      />
                    ) : (
                      <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <p className="text-gray-900 font-semibold">{application.phone}</p>
                      </div>
                    )}
                  </div>

                  {/* Domain */}
                  <div className="space-y-3">
                    <Label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                      <div className="p-1 bg-purple-100 rounded">
                        <Briefcase className="h-4 w-4 text-purple-600" />
                      </div>
                      Domain
                    </Label>
                    {isEditing ? (
                      <Select
                        value={editData?.domain || ""}
                        onValueChange={(value) => setEditData((prev) => (prev ? { ...prev, domain: value } : null))}
                      >
                        <SelectTrigger className="bg-white border-gray-300 focus:border-purple-500 font-medium">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-white border border-gray-200 shadow-lg">
                          {domainOptions.map((domain: { value: string; label: string }) => (
                            <SelectItem key={domain.value} value={domain.value}>
                              {domain.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <Badge variant="outline" className="text-purple-700 border-purple-300 bg-purple-100 font-semibold text-sm px-3 py-1">
                          {application.domain}
                        </Badge>
                      </div>
                    )}
                  </div>
                </div>

                {/* Enhanced Date Applied - Fixed hydration issue */}
                <div className="space-y-3">
                  <Label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                    <div className="p-1 bg-indigo-100 rounded">
                      <Calendar className="h-4 w-4 text-indigo-600" />
                    </div>
                    Date Applied
                  </Label>
                  <div className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-200">
                    <p className="text-gray-900 font-bold text-lg">
                      {/* Fixed date formatting to prevent hydration mismatch */}
                      {new Date(application.dateApplied).toLocaleDateString('en-CA')} {/* YYYY-MM-DD format */}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      {Math.floor((Date.now() - new Date(application.dateApplied).getTime()) / (1000 * 60 * 60 * 24))} days ago
                    </p>
                  </div>
                </div>

                {/* Enhanced Resume Section */}
                <div className="space-y-3">
                  <Label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                    <div className="p-1 bg-orange-100 rounded">
                      <FileText className="h-4 w-4 text-orange-600" />
                    </div>
                    Resume/CV
                  </Label>
                  {application.resume ? (
                    <div className="p-6 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl border border-orange-200">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                          <FileText className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-gray-900 text-lg">
                            {application.resumeName || "Resume.pdf"}
                          </p>
                          <p className="text-sm text-gray-600">
                            {/* Fixed date formatting */}
                            Uploaded on {new Date(application.dateApplied).toLocaleDateString('en-CA')}
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-3">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={viewResume}
                            className="border-blue-300 text-blue-600 hover:bg-blue-50 transition-all duration-200 hover:scale-105 font-semibold"
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={downloadResume}
                            className="border-green-300 text-green-600 hover:bg-green-50 transition-all duration-200 hover:scale-105 font-semibold"
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-6 bg-gray-50 rounded-xl border border-gray-200 text-center">
                      <div className="w-12 h-12 bg-gray-200 rounded-xl flex items-center justify-center mx-auto mb-3">
                        <FileText className="h-6 w-6 text-gray-400" />
                      </div>
                      <p className="text-gray-500 font-medium">No resume uploaded</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Enhanced Status and Actions Sidebar */}
          <div className="space-y-8">
            {/* Application Status */}
            <Card className="bg-white border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300">
              <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-bold text-gray-900">Application Status</CardTitle>
                    <p className="text-sm text-gray-600 mt-1">Current status and actions</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6 p-6">
                <div className="text-center">
                  {isEditing ? (
                    <Select
                      value={editData?.status || ""}
                      onValueChange={(value) => setEditData((prev) => (prev ? { ...prev, status: value } : null))}
                    >
                      <SelectTrigger className="bg-white border-gray-300 focus:border-blue-500">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white border border-gray-200 shadow-lg">
                        <SelectItem value="Applied">Applied</SelectItem>
                        <SelectItem value="In Review">In Review</SelectItem>
                        <SelectItem value="Selected">Selected</SelectItem>
                        <SelectItem value="Rejected">Rejected</SelectItem>
                        <SelectItem value="In Training">In Training</SelectItem>
                        <SelectItem value="Completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <div className="space-y-4">
                      <Badge className={`${getStatusColor(application.status)} text-lg px-4 py-2 font-semibold`}>
                        {application.status}
                      </Badge>

                      {/* Status Messages */}
                      {application.status === "Applied" && (
                        <div className="text-center">
                          <div className="text-4xl mb-2">📝</div>
                          <p className="text-sm text-gray-600">Application submitted and waiting for review</p>
                        </div>
                      )}

                      {application.status === "Selected" && (
                        <div className="text-center">
                          <div className="text-4xl mb-2">🎉</div>
                          <p className="text-sm text-green-600 font-medium">Congratulations! Application accepted</p>
                        </div>
                      )}

                      {application.status === "Rejected" && (
                        <div className="text-center">
                          <div className="text-4xl mb-2">😔</div>
                          <p className="text-sm text-red-600 font-medium">Application not selected</p>
                        </div>
                      )}

                      {application.status === "In Training" && (
                        <div className="text-center">
                          <div className="text-4xl mb-2">🎓</div>
                          <p className="text-sm text-purple-600 font-medium">Training in progress</p>
                        </div>
                      )}

                      {application.status === "Completed" && (
                        <div className="text-center">
                          <div className="text-4xl mb-2">🏆</div>
                          <p className="text-sm text-green-600 font-medium">Successfully completed</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Enhanced Action Buttons */}
                {!isEditing && (
                  <div className="space-y-3">
                    {/* Applied Status - Show Accept and Reject */}
                    {application.status === "Applied" && (
                      <div className="space-y-3">
                        <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 text-center animate-pulse">
                          <div className="text-blue-600 font-bold text-lg mb-2 animate-bounce">📝 APPLIED</div>
                          <p className="text-blue-700 text-sm font-medium">Application waiting for review</p>
                        </div>
                        <Button
                          onClick={() => updateStatus("Selected")}
                          disabled={isLoading}
                          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold transition-all duration-300 hover:scale-105"
                        >
                          {isLoading ? "Processing..." : "✅ Accept"}
                        </Button>
                        <Button
                          onClick={() => updateStatus("Rejected")}
                          disabled={isLoading}
                          variant="destructive"
                          className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold transition-all duration-300 hover:scale-105"
                        >
                          {isLoading ? "Processing..." : "❌ Reject"}
                        </Button>
                      </div>
                    )}

                    {/* In Review Status - Show Accept and Reject */}
                    {application.status === "In Review" && (
                      <div className="space-y-3">
                        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4 text-center animate-pulse">
                          <div className="text-yellow-600 font-bold text-lg mb-2 animate-bounce">🔍 IN REVIEW</div>
                          <p className="text-yellow-700 text-sm font-medium">Application under review process</p>
                        </div>
                        <Button
                          onClick={() => updateStatus("Selected")}
                          disabled={isLoading}
                          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold transition-all duration-300 hover:scale-105"
                        >
                          {isLoading ? "Processing..." : "✅ Accept"}
                        </Button>
                        <Button
                          onClick={() => updateStatus("Rejected")}
                          disabled={isLoading}
                          variant="destructive"
                          className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold transition-all duration-300 hover:scale-105"
                        >
                          {isLoading ? "Processing..." : "❌ Reject"}
                        </Button>
                      </div>
                    )}

                    {/* Selected Status - Show Selected with animation + Start Training button */}
                    {application.status === "Selected" && (
                      <div className="space-y-3">
                        <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 text-center animate-pulse">
                          <div className="text-green-600 font-bold text-lg mb-2 animate-bounce">🎉 SELECTED!</div>
                          <p className="text-green-700 text-sm font-medium">Application has been accepted</p>
                        </div>
                        <Button
                          onClick={() => updateStatus("In Training")}
                          disabled={isLoading}
                          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold transition-all duration-300 hover:scale-105"
                        >
                          {isLoading ? "Processing..." : "🎓 Start Training"}
                        </Button>
                      </div>
                    )}

                    {/* Rejected Status - Show Rejected with animation */}
                    {application.status === "Rejected" && (
                      <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 text-center">
                        <div className="text-red-600 font-bold text-lg mb-2">❌ REJECTED</div>
                        <p className="text-red-700 text-sm font-medium">Application not selected</p>
                      </div>
                    )}

                    {/* In Training Status - Show Training with animation + Complete button */}
                    {application.status === "In Training" && (
                      <div className="space-y-3">
                        <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-4 text-center animate-pulse">
                          <div className="text-purple-600 font-bold text-lg mb-2 animate-bounce">🎓 IN TRAINING</div>
                          <p className="text-purple-700 text-sm font-medium">Currently undergoing training program</p>
                        </div>
                        <Button
                          onClick={() => updateStatus("Completed")}
                          disabled={isLoading}
                          className="w-full bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white font-semibold transition-all duration-300 hover:scale-105"
                        >
                          {isLoading ? "Processing..." : "🏆 Complete Training"}
                        </Button>
                      </div>
                    )}

                    {/* Completed Status - Show Completed with animation */}
                    {application.status === "Completed" && (
                      <div className="bg-gradient-to-r from-green-50 to-teal-50 border-2 border-green-200 rounded-lg p-4 text-center">
                        <div className="text-green-600 font-bold text-lg mb-2">🏆 COMPLETED!</div>
                        <p className="text-green-700 text-sm font-medium">Successfully finished training program</p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Communication History */}
            {/* Contact Section - Two Wide Cards */}
            <div className="grid grid-cols-1 gap-6">
              <Card className="bg-white border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-200">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg">
                      <Mail className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg font-bold text-gray-900">Email to Applicant</CardTitle>
                      <p className="text-sm text-gray-600 mt-1">Send an email directly to the applicant</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6 flex flex-col gap-2">
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-gray-700">Email:</span>
                    <a
                      href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(application.email)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-indigo-700 font-bold text-sm transition-colors"
                    >
                      {application.email}
                    </a>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-white border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300">
                <CardHeader className="bg-gradient-to-r from-green-50 to-green-100 border-b border-green-200">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg">
                      <Phone className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg font-bold text-gray-900">Call to Applicant</CardTitle>
                      <p className="text-sm text-gray-600 mt-1">Call the applicant directly</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6 flex flex-col gap-2">
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-gray-700">Phone:</span>
                    <a href={`tel:${application.phone}`} className="text-green-600 hover:text-emerald-700 font-bold text-sm transition-colors">{application.phone}</a>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Email Confirmation Dialog */}
        {showConfirmDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 animate-in zoom-in-95 duration-200">
              <div className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <Mail className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Send Email Notification</h3>
                      <p className="text-sm text-gray-500">Confirm email delivery</p>
                    </div>
                  </div>
                  <button
                    onClick={cancelStatusUpdate}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="mb-6">
                  <p className="text-gray-700 text-base leading-relaxed">
                    {pendingStatusUpdate?.message}
                  </p>
                  <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center gap-2 text-blue-700 text-sm">
                      <Mail className="h-4 w-4" />
                      <span>Email will be sent to: <strong>{application?.email}</strong></span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-end">
                  <Button
                    onClick={cancelStatusUpdate}
                    variant="outline"
                    className="px-6 py-2 border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={confirmStatusUpdate}
                    disabled={isLoading}
                    className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg transition-all duration-300 hover:scale-105"
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Sending...</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        <span>Send Email</span>
                      </div>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}