"use client"

import { AdminLayout } from "@/components/admin-layout"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { ArcElement, BarElement, CategoryScale, Chart, ChartOptions, Legend, LinearScale, Tooltip } from "chart.js"
import { Award, CheckCircle, Clock, Download, Eye, FileText, GraduationCap, Mail, Phone, Target, TrendingUp, Users, XCircle, Zap } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Bar, Pie } from "react-chartjs-2"

// Register Chart.js elements for Pie and Bar charts
Chart.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement)

type Application = {
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

const sendEmailNotification = async (email: string, name: string, status: string) => {
  // Dummy implementation, replace with actual API call
  return Promise.resolve()
}

export default function DashboardPage() {
  const router = useRouter()
  const [applications, setApplications] = useState<Application[]>([])
  const [recentApplications, setRecentApplications] = useState<Application[]>([])
  const [selectedDomain, setSelectedDomain] = useState<string>("")
  const [domains, setDomains] = useState<string[]>([])

  useEffect(() => {
    // Check authentication
    if (!localStorage.getItem("adminAuth")) {
      router.push("/admin/login")
      return
    }

    // Load applications and refresh data
    loadApplications()
  }, [router])

  const loadApplications = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/admin/applications")
      const data = await response.json()
      setApplications(data)

      const recent = data
        .sort((a: Application, b: Application) => new Date(b.dateApplied).getTime() - new Date(a.dateApplied).getTime())
        .slice(0, 10)
      setRecentApplications(recent)

      // Improved domain extraction: handles custom domains, trims, and preserves original casing
      const domainMap: { [key: string]: string } = {}
      data.forEach((app: Application) => {
        if (app.domain && app.domain.trim()) {
          const key = app.domain.trim().toLowerCase()
          if (!domainMap[key]) {
            domainMap[key] = app.domain.trim()
          }
        }
      })
      const uniqueDomains = Object.values(domainMap)
      setDomains(uniqueDomains)
    } catch (error) {
      toast({
        title: "Fetch Error",
        description: "Could not load applications from server",
        variant: "destructive"
      })
    }
  }

  const updateApplicationStatus = async (id: number, newStatus: string) => {
    const applicant = applications.find((app) => app.id === id)
    if (!applicant) return

    // Update application status
    const updatedApplications = applications.map((app) => (app.id === id ? { ...app, status: newStatus } : app))
    setApplications(updatedApplications)
    setRecentApplications((prev) => prev.map((app) => (app.id === id ? { ...app, status: newStatus } : app)))

    // Update intern account status if exists
    const internAccounts = JSON.parse(localStorage.getItem("internAccounts") || "[]")
    const updatedInternAccounts = internAccounts.map((acc: any) =>
      acc.applicationId === id ? { ...acc, status: newStatus } : acc,
    )
    localStorage.setItem("internAccounts", JSON.stringify(updatedInternAccounts))

    // Send email notification
    try {
      await sendEmailNotification(applicant.email, applicant.name, newStatus)

      toast({
        title: `Application ${newStatus} ✅`,
        description: `${applicant.name}'s application has been ${newStatus.toLowerCase()}. Email notification sent successfully.`,
      })
    } catch (error) {
      toast({
        title: `Application ${newStatus}`,
        description: `${applicant.name}'s application has been ${newStatus.toLowerCase()}, but email notification failed.`,
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

  const stats = {
    total: applications.length,
    applied: applications.filter((app) => app.status === "Applied").length,
    inReview: applications.filter((app) => app.status === "In Review" || app.status === "Under Review").length,
    selected: applications.filter((app) => app.status === "Selected").length,
    rejected: applications.filter((app) => app.status === "Rejected").length,
    inTraining: applications.filter((app) => app.status === "In Training").length,
    completed: applications.filter((app) => app.status === "Completed").length,
  }

  const domainStats = {
    Frontend: applications.filter((app) => app.domain === "Frontend").length,
    Backend: applications.filter((app) => app.domain === "Backend").length,
    Database: applications.filter((app) => app.domain === "Database").length,
    Others: applications.filter((app) => app.domain === "Others").length,
  }

  const pieChartData = {
    labels: Object.keys(domainStats),
    datasets: [
      {
        data: Object.values(domainStats),
        backgroundColor: ["#8B5CF6", "#06B6D4", "#10B981", "#F59E0B"],
        borderWidth: 0,
        hoverBorderWidth: 4,
        hoverBorderColor: "#ffffff",
      },
    ],
  }

  const barChartData = {
    labels: ["Applied", "In Review", "Selected", "Rejected", "In Training", "Completed"],
    datasets: [
      {
        label: "Applications",
        data: [stats.applied, stats.inReview, stats.selected, stats.rejected, stats.inTraining, stats.completed],
        backgroundColor: [
          "rgba(59, 130, 246, 0.8)",
          "rgba(245, 158, 11, 0.8)",
          "rgba(34, 197, 94, 0.8)",
          "rgba(239, 68, 68, 0.8)",
          "rgba(147, 51, 234, 0.8)",
          "rgba(107, 114, 128, 0.8)",
        ],
        borderColor: [
          "rgb(59, 130, 246)",
          "rgb(245, 158, 11)",
          "rgb(34, 197, 94)",
          "rgb(239, 68, 68)",
          "rgb(147, 51, 234)",
          "rgb(107, 114, 128)",
        ],
        borderWidth: 2,
      },
    ],
  }

  const barChartOptions: ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          padding: 20,
          usePointStyle: true,
          font: {
            size: 12,
            weight: 500,
          },
          color: "#000000",
        },
      },
      tooltip: {
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        titleColor: "#000000",
        bodyColor: "#000000",
        borderColor: "#e5e7eb",
        borderWidth: 1,
        cornerRadius: 12,
        displayColors: true,
        padding: 12,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: "#000000",
        },
        grid: {
          color: "rgba(0, 0, 0, 0.1)",
        },
      },
      x: {
        ticks: {
          color: "#000000",
        },
        grid: {
          color: "rgba(0, 0, 0, 0.1)",
        },
      },
    },
  }

  const pieChartOptions: ChartOptions<"pie"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          padding: 20,
          usePointStyle: true,
          font: {
            size: 12,
            weight: 500,
          },
          color: "#000000",
        },
      },
      tooltip: {
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        titleColor: "#000000",
        bodyColor: "#000000",
        borderColor: "#e5e7eb",
        borderWidth: 1,
        cornerRadius: 12,
        displayColors: true,
        padding: 12,
      },
    },
  }

  const statCards = [
    {
      title: "Total Applications",
      value: stats.total,
      icon: Users,
      gradient: "from-blue-500 to-purple-600",
      bgGradient: "from-blue-500/10 to-purple-600/10",
      change: "+12%",
      changeType: "increase",
    },
    {
      title: "In Training",
      value: stats.inTraining,
      icon: GraduationCap,
      gradient: "from-purple-500 to-violet-500",
      bgGradient: "from-purple-500/10 to-violet-500/10",
      change: "+15%",
      changeType: "increase",
    },
    {
      title: "Completed",
      value: stats.completed,
      icon: Award,
      gradient: "from-gray-500 to-slate-500",
      bgGradient: "from-gray-500/10 to-slate-500/10",
      change: "+10%",
      changeType: "increase",
    },
    {
      title: "Success Rate",
      value: stats.total > 0 ? `${Math.round((stats.selected / stats.total) * 100)}%` : "0%",
      icon: TrendingUp,
      gradient: "from-pink-500 to-rose-500",
      bgGradient: "from-pink-500/10 to-rose-500/10",
      change: "+3%",
      changeType: "increase",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Applied":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "In Review":
      case "Under Review":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "Selected":
        return "bg-green-100 text-green-800 border-green-200"
      case "Rejected":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  // Filter applications by selected domain
  const filteredApplications = !selectedDomain
    ? applications
    : applications.filter(app => app.domain === selectedDomain)

  return (
    <AdminLayout>
      <div className="space-y-6 p-4 lg:p-6">
        {/* Header */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-3xl blur-xl"></div>
          <div className="relative bg-white/80 backdrop-blur-xl border border-gray-200/50 rounded-3xl p-6 lg:p-8">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div>
                <h1 className="text-3xl lg:text-4xl font-black text-black mb-2">Analytics Dashboard</h1>
                <p className="text-gray-700 text-base lg:text-lg">Real-time insights into your internship program</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-2xl font-bold text-black">{stats.total}</div>
                  <div className="text-gray-700 text-sm">Total Applications</div>
                </div>
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <TrendingUp className="h-8 w-8 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {statCards.map((stat, index) => (
            <Card
              key={index}
              className="group relative overflow-hidden bg-white/80 backdrop-blur-xl border border-gray-200/50 hover:border-gray-300/60 transition-all duration-500 hover:scale-105"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
              ></div>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                <CardTitle className="text-sm font-medium text-black group-hover:text-black transition-colors">
                  {stat.title}
                </CardTitle>
                <div
                  className={`p-2 bg-gradient-to-br ${stat.gradient} rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300`}
                >
                  <stat.icon className="h-4 w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="flex items-end justify-between">
                  <div className="text-2xl lg:text-3xl font-black text-black group-hover:scale-110 transition-transform duration-300">
                    {stat.value}
                  </div>
                  <div className="flex items-center gap-1 text-green-600 text-sm font-semibold">
                    <TrendingUp className="h-3 w-3" />
                    {stat.change}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Applications with Quick Actions */}
        <Card className="bg-white/80 backdrop-blur-xl border border-gray-200/50 shadow-2xl">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl">
                  <Users className="h-5 w-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-black text-xl font-bold">Recent Applications</CardTitle>
                  <CardDescription className="text-gray-700">
                    Latest submissions requiring your attention ({recentApplications.length} total)
                  </CardDescription>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={loadApplications}
                  className="btn btn-outline bg-white/50 border-gray-200/50 text-black hover:bg-gray-100/50"
                >
                  Refresh
                </Button>
                <Link href="/admin/students">
                  <Button className="btn btn-outline bg-white/50 border-gray-200/50 text-black hover:bg-gray-100/50">
                    View All
                  </Button>
                </Link>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentApplications.length === 0 ? (
                <div className="text-center py-8 text-gray-700">
                  <p className="text-lg font-medium mb-2">No applications found</p>
                  <p className="text-sm">Students can apply through the application form.</p>
                  <Button
                    onClick={loadApplications}
                    className="btn btn-outline mt-4 bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100"
                  >
                    Refresh Data
                  </Button>
                </div>
              ) : (
                recentApplications.map((app) => (
                  <div
                    key={app.id}
                    className="bg-gray-50 border border-gray-200 rounded-2xl p-4 lg:p-6 hover:bg-gray-100 transition-all duration-300"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-3">
                          <h3 className="font-semibold text-black text-lg truncate">{app.name}</h3>
                          <div className="flex flex-wrap gap-2">
                            <Badge className={getStatusColor(app.status)}>{app.status}</Badge>
                            <Badge variant="outline" className="text-gray-700 border-gray-300">
                              {app.domain}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2 text-gray-700 text-sm">
                          <span className="flex items-center gap-1 truncate">
                            <Mail className="h-3 w-3 flex-shrink-0" />
                            {app.email}
                          </span>
                          <span className="flex items-center gap-1">
                            <Phone className="h-3 w-3 flex-shrink-0" />
                            {app.phone}
                          </span>
                        </div>
                        {app.resume && (
                          <div className="mt-2">
                            <Button
                              onClick={() => downloadResume(app.resumeName || "resume.pdf")}
                              className="btn btn-outline bg-white/50 border-gray-200/50 text-gray-700 hover:bg-gray-100/50 text-xs"
                            >
                              <FileText className="h-3 w-3 mr-1" />
                              <Download className="h-3 w-3 mr-1" />
                              Resume
                            </Button>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {(app.status === "Applied" || app.status === "Under Review") && (
                          <>
                            <Button
                              onClick={() => updateApplicationStatus(app.id, "In Review")}
                              className="bg-blue-500 hover:bg-blue-600 text-white text-xs"
                            >
                              <Clock className="h-3 w-3 mr-1" />
                              Review
                            </Button>
                            <Button
                              onClick={() => updateApplicationStatus(app.id, "Selected")}
                              className="bg-green-500 hover:bg-green-600 text-white text-xs"
                            >
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Accept
                            </Button>
                            <Button
                              onClick={() => updateApplicationStatus(app.id, "Rejected")}
                              className="bg-red-500 hover:bg-red-600 text-white text-xs"
                            >
                              <XCircle className="h-3 w-3 mr-1" />
                              Reject
                            </Button>
                          </>
                        )}

                        <Link href={`/admin/student/${app.id}`}>
                          <Button
                            className="bg-purple-500 hover:bg-purple-600 text-white text-xs"
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            View
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Domain Distribution Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {Object.entries(domainStats).map(([domain, count], index) => {
            const gradients = [
              "from-purple-500 to-pink-500",
              "from-blue-500 to-cyan-500",
              "from-green-500 to-emerald-500",
              "from-orange-500 to-red-500",
            ];
            const bgGradients = [
              "from-purple-500/10 to-pink-500/10",
              "from-blue-500/10 to-cyan-500/10",
              "from-green-500/10 to-emerald-500/10",
              "from-orange-500/10 to-red-500/10",
            ];
            return (
              <Card
                key={domain}
                className={`group relative overflow-hidden bg-white/80 backdrop-blur-xl border border-gray-200/50 hover:border-gray-300/60 transition-all duration-500 hover:scale-105`}
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${bgGradients[index]} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                ></div>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                  <CardTitle className="text-sm font-medium text-black group-hover:text-black transition-colors">
                    {domain}
                  </CardTitle>
                  <div
                    className={`p-2 bg-gradient-to-br ${gradients[index]} rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Target className="h-4 w-4 text-white" />
                  </div>
                </CardHeader>
                <CardContent className="relative z-10">
                  <div className="flex items-end justify-between">
                    <div className="text-2xl lg:text-3xl font-black text-black group-hover:scale-110 transition-transform duration-300">
                      {count}
                    </div>
                    <p className="text-gray-700 text-sm font-medium">applications</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          <Card className="bg-white/80 backdrop-blur-xl border border-gray-200/50 shadow-2xl">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl">
                  <Zap className="h-5 w-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-black text-xl font-bold">Domain Distribution</CardTitle>
                  <CardDescription className="text-gray-700">
                    Applications across different technical domains
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-64 lg:h-80">
                <Pie data={pieChartData} options={pieChartOptions} />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-xl border border-gray-200/50 shadow-2xl">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl">
                  <TrendingUp className="h-5 w-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-black text-xl font-bold">Application Status</CardTitle>
                  <CardDescription className="text-gray-700">
                    Current status breakdown of all applications
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-64 lg:h-80">
                <Bar data={barChartData} options={barChartOptions} />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  )
}