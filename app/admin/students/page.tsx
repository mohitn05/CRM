"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AdminLayout } from "@/components/admin-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"
import { Search, Filter, Eye, Download } from "lucide-react"

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
  }, [router])

  const loadApplications = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/admin/applications")
      if (response.ok) {
        const data = await response.json()
        setApplications(data)
        setFilteredApplications(data)
      } else {
        toast({
          title: "Error",
          description: "Failed to load applications from server",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error("Failed to fetch applications:", error)
      toast({
        title: "Network Error",
        description: "Could not connect to server",
        variant: "destructive"
      })
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

    // Update application status
    const updatedApplications = applications.map((app) => (app.id === id ? { ...app, status: newStatus } : app))
    setApplications(updatedApplications)
    setFilteredApplications((prev) => prev.map((app) => (app.id === id ? { ...app, status: newStatus } : app)))
    localStorage.setItem("applications", JSON.stringify(updatedApplications))

    // Send notifications
    try {
      const result = await sendNotification(applicant.email, applicant.phone, applicant.name, newStatus)

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
      <div className="space-y-6 p-4 lg:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl text-black ">
              Student Applications
            </h1>
            <p className="text-gray-600">Manage and track internship applications</p>
          </div>
          <Button
            onClick={exportToCSV}
            className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
        </div>

        {/* Filters */}
        <Card className="bg-white/30 backdrop-blur-md border border-emerald-500/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-800">
              <Filter className="h-5 w-5" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-600" />
                <Input
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/10 border-emerald-500/20 text-gray-800 placeholder:text-gray-800/50"
                />
              </div>

              <Select value={domainFilter} onValueChange={setDomainFilter}>
                <SelectTrigger className="bg-white/10 border-emerald-500/20 text-gray-800">
                  <SelectValue placeholder="Filter by domain" />
                </SelectTrigger>
                <SelectContent className="bg-white border-grey-500">
                  <SelectItem value="all">All Domains</SelectItem>
                  <SelectItem value="Frontend">Frontend</SelectItem>
                  <SelectItem value="Backend">Backend</SelectItem>
                  <SelectItem value="Database">Database</SelectItem>
                  <SelectItem value="Others">Others</SelectItem>
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="bg-white/10 border-emerald-500/20 text-gray-800">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent className="bg-white border-grey-500">
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
          </CardContent>
        </Card>

        {/* Applications Table */}
        <Card className="bg-white/30 backdrop-blur-md border border-emerald-500/20">
          <CardHeader>
            <CardTitle className="text-gray-800">Applications ({filteredApplications.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-emerald-500/20">
                    <TableHead className="text-gray-600">Name</TableHead>
                    <TableHead className="text-gray-600">Email</TableHead>
                    <TableHead className="text-gray-600">Phone</TableHead>
                    <TableHead className="text-gray-600">Domain</TableHead>
                    <TableHead className="text-gray-600">Status</TableHead>
                    <TableHead className="text-gray-600">Resume</TableHead>
                    <TableHead className="text-gray-600">Date Applied</TableHead>
                    <TableHead className="text-gray-600">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredApplications.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-gray-600">
                        No applications found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredApplications.map((app) => (
                      <TableRow key={app.id} className="border-emerald-500/20 hover:bg-white/5">
                        <TableCell className="font-medium text-gray-800">{app.name}</TableCell>
                        <TableCell className="text-gray-800">{app.email}</TableCell>
                        <TableCell className="text-gray-800">{app.phone}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-gray-600 border-emerald-500/20">
                            {app.domain}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(app.status)}>{app.status}</Badge>
                        </TableCell>
                        <TableCell>
                          {app.resume ? (
                            <div className="flex gap-1">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => viewResume(app.resume!)}
                                className="bg-blue-500/10 border-blue-500/20 text-blue-400 hover:bg-blue-500/20 p-1"
                                title="View Resume"
                              >
                                <Eye className="h-3 w-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => downloadResume(app.resumeName || "resume.pdf")}
                                className="bg-green-500/10 border-green-500/20 text-green-400 hover:bg-green-500/20 p-1"
                                title="Download Resume"
                              >
                                <Download className="h-3 w-3" />
                              </Button>
                            </div>
                          ) : (
                            <span className="text-gray-600 text-sm">No Resume</span>
                          )}
                        </TableCell>
                        <TableCell className="text-gray-800">{app.dateApplied}</TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            {(app.status === "Applied" || app.status === "In Review") && (
                              <>
                                <Button
                                  size="sm"
                                  onClick={() => updateApplicationStatus(app.id, "Selected")}
                                  className="bg-green-600 hover:bg-green-700 text-white text-xs px-2 py-1"
                                >
                                  ✓ Accept
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => updateApplicationStatus(app.id, "Rejected")}
                                  className="bg-red-600 hover:bg-red-700 text-xs px-2 py-1"
                                >
                                  ✗ Reject
                                </Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
