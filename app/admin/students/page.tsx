"use client"

import { AdminLayout } from "@/components/admin-layout"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"
import { ClipboardListIcon, Download, Search, TrendingUp, Users } from "lucide-react"
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
        console.log('Raw applications data:', data);
        // Normalize domain names
        const normalizedData = data.map((app: Application) => ({
          ...app,
          domain: normalizeDomain(app.domain)
        }));
        console.log('Normalized applications data:', normalizedData);
        console.log('Unique domains after normalization:', [...new Set(normalizedData.map((app: Application) => app.domain))]);
        setApplications(normalizedData)
        setFilteredApplications(normalizedData)
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
      const normalizedFilter = normalizeDomain(domainFilter);
      filtered = filtered.filter((app) => {
        const match = normalizeDomain(app.domain) === normalizedFilter;
        return match;
      });
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((app) => app.status === statusFilter)
    }

    console.log('Filtered applications count:', filtered.length);
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
      // Check if fileName is valid
      if (!fileName) {
        toast({
          title: "Download Failed",
          description: "No resume file available for this application.",
          variant: "destructive",
        })
        return
      }

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

  const viewResume = (fileName: string) => {
    try {
      // Check if fileName is valid
      if (!fileName) {
        toast({
          title: "View Failed",
          description: "No resume file available for this application.",
          variant: "destructive",
        })
        return
      }

      // Open the file in a new tab for viewing
      const fileUrl = `http://localhost:5000/uploads/${fileName}`
      window.open(fileUrl, '_blank')

      toast({
        title: "Resume Opened",
        description: "Resume opened in new tab.",
      })
    } catch (error) {
      toast({
        title: "View Failed",
        description: "Could not open resume. Please try again.",
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

  const exportToCSV = () => {
    const headers = ["Name", "Email", "Phone", "Domain", "Status", "Date Applied", "Resume"]
    const csvContent = [
      headers.join(","),
      ...filteredApplications.map((app) =>
        [
          app.name,
          app.email,
          app.phone,
          app.domain,
          app.status,
          new Date(app.dateApplied).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short'
          }),
          app.resumeName || "No Resume"
        ].join(
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
      <div className="p-6 space-y-6">
        {/* Enhanced Professional Header Section */}
        <div className="bg-gradient-to-r from-slate-50 to-purple-50 rounded-2xl shadow-lg border border-gray-200 p-8 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-full -translate-y-8 translate-x-8"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-indigo-500/10 to-cyan-500/10 rounded-full translate-y-4 -translate-x-4"></div>

          <div className="relative z-10">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 rounded-2xl flex items-center justify-center shadow-xl">
                  <Users className="h-10 w-10 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-purple-800 to-blue-800 bg-clip-text text-transparent mb-2">
                    Student Applications
                  </h1>
                  <p className="text-gray-600 text-lg font-medium">
                    Comprehensive internship application management & tracking
                  </p>
                  <div className="flex items-center gap-4 mt-3">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span>Live Updates</span>
                    </div>
                    <div className="text-sm text-gray-500">
                      {lastUpdated ? `Last updated: ${lastUpdated.toLocaleString()}` : 'Loading...'}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="flex gap-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                      {applications.length}
                    </div>
                    <div className="text-sm font-medium text-gray-600">Total Applications</div>
                    <div className="text-xs text-green-600 font-medium mt-1 flex items-center justify-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      Active tracking
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                      {filteredApplications.length}
                    </div>
                    <div className="text-sm font-medium text-gray-600">Filtered Results</div>
                    <div className="text-xs text-blue-600 font-medium mt-1 flex items-center justify-center gap-1">
                      <Search className="w-3 h-3" />
                      Current view
                    </div>
                  </div>
                </div>
                <Button
                  onClick={exportToCSV}
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 whitespace-nowrap"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export CSV
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Professional Filters Section */}
        <Card className="bg-white border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg">
                  <Search className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Filter & Search Applications</h3>
                  <p className="text-sm text-gray-600">Find specific applications using filters below</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 bg-blue-50 px-3 py-1.5 rounded-full border border-blue-200">
                  <div className={`w-2 h-2 rounded-full animate-pulse ${connectionStatus === 'connected' ? 'bg-green-400' :
                    connectionStatus === 'disconnected' ? 'bg-red-400' : 'bg-yellow-400'
                    }`}></div>
                  <span className="text-xs font-medium text-gray-700">
                    {connectionStatus === 'connected' ? 'Connected' :
                      connectionStatus === 'disconnected' ? 'Disconnected' : 'Checking...'}
                  </span>
                </div>
                <button
                  onClick={() => loadApplications()}
                  disabled={isLoading}
                  className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-50 whitespace-nowrap"
                >
                  {isLoading ? '🔄 Loading...' : '🔄 Refresh'}
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500 bg-white"
                />
              </div>
              <div>
                <Select value={domainFilter} onValueChange={setDomainFilter}>
                  <SelectTrigger className="border-gray-300 focus:border-blue-500 bg-white">
                    <SelectValue placeholder="All Domains" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border shadow-lg">
                    <SelectItem value="all">All Domains</SelectItem>
                    {(() => {
                      const domainOptions = require("@/lib/domains").getDomainOptions();
                      console.log('Domain options for filter:', domainOptions);
                      return domainOptions.map((d: { value: string; label: string }) => (
                        <SelectItem key={d.value} value={d.value}>{d.label.replace(/^[^ ]+ /, "")}</SelectItem>
                      ));
                    })()}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="border-gray-300 focus:border-blue-500 bg-white">
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border shadow-lg">
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

        {/* Enhanced Professional Applications Table */}
        <Card className="bg-white border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-purple-50 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-lg">
                  <ClipboardListIcon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl font-bold text-gray-900">
                    Applications ({filteredApplications.length})
                  </CardTitle>
                  <p className="text-sm text-gray-600 mt-1">Manage and track all internship applications</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border border-gray-200">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                  <span className="text-xs font-medium text-gray-600">{filteredApplications.length} shown</span>
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            {filteredApplications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-gray-500">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <Users className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">No Applications Found</h3>
                <p className="text-sm text-gray-500 text-center max-w-md">
                  {searchTerm || domainFilter !== 'all' || statusFilter !== 'all'
                    ? 'No applications match your current filters. Try adjusting your search criteria.'
                    : 'No applications have been submitted yet. Applications will appear here when students apply.'}
                </p>
                {(searchTerm || domainFilter !== 'all' || statusFilter !== 'all') && (
                  <button
                    onClick={() => {
                      setSearchTerm('')
                      setDomainFilter('all')
                      setStatusFilter('all')
                    }}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            ) : (
              <ScrollArea className="w-full h-[calc(100vh-220px)]">
                <Table className="w-full min-w-[1200px]">
                  <TableHeader>
                    <TableRow className="bg-gray-50 border-b border-gray-200">
                      <TableHead className="font-semibold text-gray-800 text-sm uppercase tracking-wider w-64">Applicant</TableHead>
                      <TableHead className="font-semibold text-gray-800 text-sm uppercase tracking-wider w-40">Contact</TableHead>
                      <TableHead className="font-semibold text-gray-800 text-sm uppercase tracking-wider w-40">Domain</TableHead>
                      <TableHead className="font-semibold text-gray-800 text-sm uppercase tracking-wider w-32">Status</TableHead>
                      <TableHead className="font-semibold text-gray-800 text-sm uppercase tracking-wider w-40">Resume</TableHead>
                      <TableHead className="font-semibold text-gray-800 text-sm uppercase tracking-wider w-40">Applied</TableHead>
                      <TableHead className="font-semibold text-gray-800 text-sm uppercase tracking-wider text-center w-40">Actions</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody className="divide-y divide-gray-100">
                    {filteredApplications.map((app, index) => (
                      <TableRow
                        key={app.id}
                        className="group hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-200"
                      >
                        <TableCell className="py-4 px-6 w-64">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                              {app.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="font-semibold text-gray-900 group-hover:text-purple-700 transition-colors">{app.name}</div>
                              <div className="text-sm text-gray-500">{app.email}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="py-4 px-6 w-40">
                          <div className="text-sm text-gray-600">{app.phone}</div>
                        </TableCell>
                        <TableCell className="py-4 px-6 w-40">
                          <Badge
                            variant="outline"
                            className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 border-blue-200 font-semibold"
                          >
                            {app.domain}
                          </Badge>
                        </TableCell>
                        <TableCell className="py-4 px-6 w-32">
                          <Badge className={`${getStatusColor(app.status)} font-bold border`}>
                            {app.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="py-4 px-6 w-40">
                          {app.resumeName ? (
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => viewResume(app.resumeName!)}
                                className="h-8 px-3 text-xs border-blue-300 text-blue-600 hover:bg-blue-50 transition-all duration-200 hover:scale-105"
                              >
                                <Download className="h-3 w-3 mr-1" />
                                View
                              </Button>
                            </div>
                          ) : (
                            <span className="text-gray-400 text-sm font-medium">No resume</span>
                          )}
                        </TableCell>
                        <TableCell className="py-4 px-6 w-40">
                          <div className="text-sm text-gray-600 font-medium">
                            {new Date(app.dateApplied).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </div>
                        </TableCell>
                        <TableCell className="py-4 px-6 text-center w-40">
                          <div className="flex gap-2 justify-center">
                            {app.status === "In Training" && (
                              <Button
                                size="sm"
                                onClick={() => updateApplicationStatus(app.id, "Completed")}
                                className="h-8 px-3 text-xs bg-green-600 hover:bg-green-700 text-white transition-all duration-200 hover:scale-105 active:scale-95 shadow-md"
                              >
                                ✓ Complete
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => router.push(`/admin/student/${app.id}`)}
                              className="h-8 px-3 text-xs text-purple-600 border-purple-300 hover:bg-purple-50 transition-all duration-200 hover:scale-105 active:scale-95 font-semibold"
                            >
                              👁️ View
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}