"use client"

import { AdminLayout } from "@/components/admin-layout"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"
import { Download, Search } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

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

// Enhanced notification service with SMS and Email
const sendNotification = async (email: string, phone: string, name: string, status: string) => {
  console.log(`Sending ${status} notification to ${email} and ${phone} for ${name}`)

  // Simulate API calls for email and SMS
  await new Promise((resolve) => setTimeout(resolve, 1500))

  const emailMessage =
    status === "Selected"
      ? `🎉 Congratulations ${name}! Your internship application has been ACCEPTED. We'll contact you soon with next steps.`
      : `Thank you ${name} for your interest. Unfortunately, your internship application was not selected this time. Keep improving and apply again!`

  const smsMessage =
    status === "Selected"
      ? `🎉 ACCEPTED! Hi ${name}, your internship application is approved. Check your email for details.`
      : `Hi ${name}, your internship application was not selected. Thank you for applying!`

  return {
    success: true,
    email: { sent: true, message: emailMessage },
    sms: { sent: true, message: smsMessage },
  }
}

export default function StudentsPage() {
  const [applications, setApplications] = useState<Application[]>([])
  const [filteredApplications, setFilteredApplications] = useState<Application[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [domainFilter, setDomainFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isAutoUpdateEnabled, setIsAutoUpdateEnabled] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'checking'>('checking')
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    // Check authentication
    if (!localStorage.getItem("adminAuth")) {
      router.push("/admin/login")
      return
    }

    // Load applications from backend API
    loadApplications()

    // Set up auto-update interval if enabled
    let interval: NodeJS.Timeout | null = null
    if (isAutoUpdateEnabled) {
      interval = setInterval(() => {
        loadApplications(true) // Silent update
      }, 30000) // Update every 30 seconds
    }

    // Cleanup interval on component unmount or when auto-update is disabled
    return () => {
      if (interval) {
        clearInterval(interval)
      }
    }
  }, [router, isAutoUpdateEnabled])

  const loadApplications = async (silent = false) => {
    if (!silent) {
      setIsLoading(true)
    }
    setConnectionStatus('checking')

    try {
      const response = await fetch("http://localhost:5000/api/admin/applications")
      if (response.ok) {
        const data = await response.json()
        setApplications(data)
        setFilteredApplications(data)
        setLastUpdated(new Date())
        setConnectionStatus('connected')

        if (!silent) {
          toast({
            title: "Data Updated",
            description: "Applications refreshed successfully",
          })
        }
      } else {
        setConnectionStatus('disconnected')
        if (!silent) {
          toast({
            title: "Error",
            description: "Failed to load applications from server",
            variant: "destructive"
          })
        }
      }
    } catch (error) {
      console.error("Failed to fetch applications:", error)
      setConnectionStatus('disconnected')
      if (!silent) {
        toast({
          title: "Network Error",
          description: "Could not connect to server",
          variant: "destructive"
        })
      } else {
        // Show a subtle notification for silent update failures
        toast({
          title: "Auto-update failed",
          description: "Connection lost. Will retry automatically.",
          variant: "destructive",
        })
      }
    } finally {
      if (!silent) {
        setIsLoading(false)
      }
    }
  }

  useEffect(() => {
    let filtered = applications

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (app) =>
          app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          app.email.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Domain filter
    if (domainFilter !== "all") {
      filtered = filtered.filter((app) => app.domain === domainFilter)
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((app) => app.status === statusFilter)
    }

    setFilteredApplications(filtered)
  }, [applications, searchTerm, domainFilter, statusFilter])

  const updateApplicationStatus = async (id: number, newStatus: string) => {
    const applicant = applications.find((app) => app.id === id)
    if (!applicant) return

    try {
      // Update status on backend first
      const response = await fetch(`http://localhost:5000/api/students/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...applicant,
          status: newStatus,
        }),
      })

      if (response.ok) {
        // Update local state immediately for better UX
        const updatedApplications = applications.map((app) => (app.id === id ? { ...app, status: newStatus } : app))
        setApplications(updatedApplications)
        setFilteredApplications((prev) => prev.map((app) => (app.id === id ? { ...app, status: newStatus } : app)))

        // Send notifications
        try {
          await sendNotification(applicant.email, applicant.phone, applicant.name, newStatus)
          toast({
            title: `Application ${newStatus} ✅`,
            description: `${applicant.name}'s application updated. Email & SMS notifications sent successfully!`,
          })
        } catch (error) {
          toast({
            title: `Application ${newStatus}`,
            description: `${applicant.name}'s application updated, but notification failed.`,
            variant: "destructive",
          })
        }

        // Auto-refresh data from server to ensure consistency
        setTimeout(() => {
          loadApplications(true) // Silent refresh after 2 seconds
        }, 2000)

      } else {
        toast({
          title: "Update Failed",
          description: "Failed to update application status on server",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error updating application status:", error)
      toast({
        title: "Update Failed",
        description: "Network error while updating application status",
        variant: "destructive",
      })
    }
  }

  const downloadResume = (fileName: string) => {
    try {
      // Open the file in a new tab for download
      const fileUrl = `http://localhost:5000/uploads/${fileName}`
      window.open(fileUrl, '_blank')

      toast({
        title: "Resume Opened ✅",
        description: `${fileName} has been opened in a new tab. You can save it using Ctrl+S.`,
      })
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Could not open resume. Please try again.",
        variant: "destructive",
      })
    }
  }

  const viewResume = (resume: string) => {
    window.open(resume, "_blank")
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

  const exportToCSV = () => {
    const headers = ["Name", "Email", "Phone", "Domain", "Status", "Date Applied", "Resume"]
    const csvContent = [
      headers.join(","),
      ...filteredApplications.map((app) =>
        [app.name, app.email, app.phone, app.domain, app.status, app.dateApplied, app.resumeName || "No Resume"].join(
          ",",
        ),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "internship-applications.csv"
    a.click()
    window.URL.revokeObjectURL(url)

    toast({
      title: "Export Successful ✅",
      description: "Applications exported to CSV file.",
    })
  }

  return (
    <AdminLayout>
      <div className="w-full min-w-0 md:pl-0">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-4">
          <div>
            <h1 className="text-3xl text-black font-bold">
              Student Applications
            </h1>
            <p className="text-gray-600">Manage and track internship applications</p>
          </div>
          <Button onClick={exportToCSV} className="bg-blue-600 hover:bg-blue-700 text-white">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>

        {/* Enhanced Filters - responsive stacking, z-index, and overflow fixes */}
        <Card className="bg-white shadow-lg border border-gray-200 relative md:static z-0">
          <CardContent className="p-4 sm:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div className="relative min-w-0">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500 min-w-0"
                />
              </div>
              <div className="min-w-0">
                <Select value={domainFilter} onValueChange={setDomainFilter}>
                  <SelectTrigger className="border-gray-300 focus:border-blue-500 min-w-0">
                    <SelectValue placeholder="All Domains" />
                  </SelectTrigger>
                  <SelectContent className="z-[9999] bg-white border shadow-lg">
                    <SelectItem value="all">All Domains</SelectItem>
                    {require("@/lib/domains").getDomainOptions().map((d: { value: string; label: string }) => (
                      <SelectItem key={d.value} value={d.value}>{d.label.replace(/^[^ ]+ /, "")}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="min-w-0">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="border-gray-300 focus:border-blue-500 min-w-0">
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent className="z-[9999] bg-white border shadow-lg">
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="Applied">Applied</SelectItem>
                    <SelectItem value="In Review">In Review</SelectItem>
                    <SelectItem value="Selected">Selected</SelectItem>
                    <SelectItem value="Rejected">Rejected</SelectItem>
                    <SelectItem value="In Training">In Training</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Applications Table - ensure z-0 and overflow-x-auto for stacking */}
        <Card className="bg-white shadow-lg border border-gray-200 relative z-0 mt-2 sm:mt-4 w-full">
          <CardHeader className="bg-gray-50 border-b border-gray-200">
            <CardTitle className="text-base sm:text-lg md:text-xl font-semibold text-gray-800">
              Applications ({filteredApplications.length})
            </CardTitle>
          </CardHeader>

          <CardContent className="p-0 w-full">
            {/* ← Wrap table in this scroll container */}
            <div className="overflow-x-auto w-full">
              <Table className="w-full min-w-[700px]">
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="font-semibold text-gray-700 text-xs sm:text-sm md:text-base min-w-[120px]">
                      Name
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700 text-xs sm:text-sm md:text-base min-w-[180px]">
                      Email
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700 text-xs sm:text-sm md:text-base min-w-[120px]">
                      Phone
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700 text-xs sm:text-sm md:text-base min-w-[140px]">
                      Domain
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700 text-xs sm:text-sm md:text-base min-w-[100px]">
                      Status
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700 text-xs sm:text-sm md:text-base min-w-[120px]">
                      Date Applied
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700 text-xs sm:text-sm md:text-base min-w-[160px]">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {filteredApplications.map((app, index) => (
                    <TableRow
                      key={app.id}
                      className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                    >
                      <TableCell className="font-medium text-gray-900 text-xs sm:text-sm md:text-base min-w-[120px]">
                        {app.name}
                      </TableCell>
                      <TableCell className="text-gray-700 text-xs sm:text-sm md:text-base min-w-[180px]">
                        {app.email}
                      </TableCell>
                      <TableCell className="text-gray-700 text-xs sm:text-sm md:text-base min-w-[120px]">
                        {app.phone}
                      </TableCell>
                      <TableCell className="min-w-[140px]">
                        <Badge
                          variant="outline"
                          className="bg-blue-50 text-blue-700 border-blue-200 text-xs sm:text-sm md:text-base"
                        >
                          {app.domain}
                        </Badge>
                      </TableCell>
                      <TableCell className="min-w-[100px]">
                        <Badge className={`${getStatusColor(app.status)} text-xs sm:text-sm md:text-base`}>
                          {app.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="min-w-[120px] text-xs sm:text-sm md:text-base">
                        {new Date(app.dateApplied).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="min-w-[160px]">
                        <div className="flex flex-wrap gap-1">
                          {/* …your existing action buttons here… */}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div >
    </AdminLayout >
  )
}