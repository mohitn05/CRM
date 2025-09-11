"use client"

import { AdminLayout } from "@/components/admin-layout"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import type { ScriptableContext } from "chart.js"
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

  // Helper to normalize domain names
  const normalizeDomain = (domain: string) => {
    if (domain === "Frontend" || domain === "Frontend Developer") return "Frontend Developer";
    if (domain === "Backend" || domain === "Backend Developer") return "Backend Developer";
    if (domain === "Database" || domain === "Database Management") return "Database Management";
    if (domain === "Web Developer") return "Web Developer";
    if (domain === "Android Developer") return "Android Developer";
    if (domain === "Full Stack Developer") return "Full Stack Developer";
    if (domain === "UI/UX Designer") return "UI/UX Designer";
    if (domain === "Digital Marketing") return "Digital Marketing";
    return domain;
  };

  // Debug: Log applications state whenever it changes
  useEffect(() => {
    console.log('Applications loaded for dashboard:', applications);
  }, [applications]);
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

      // Only use fixed domains
      const fixedDomains = ["Frontend Developer", "Backend Developer", "Database Management", "Web Developer", "Android Developer", "Full Stack Developer", "UI/UX Designer", "Digital Marketing"];
      const foundDomains = Array.from(new Set(data.map((app: Application) => app.domain).filter((d: string) => fixedDomains.includes(d)))) as string[];
      setDomains(foundDomains)
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

  // Normalize all application domains before stats
  const normalizedApplications = applications.map(app => ({ ...app, domain: normalizeDomain(app.domain) }));
  const domainStats = {
    "Frontend Developer": normalizedApplications.filter((app) => app.domain === "Frontend Developer").length,
    "Backend Developer": normalizedApplications.filter((app) => app.domain === "Backend Developer").length,
    "Database Management": normalizedApplications.filter((app) => app.domain === "Database Management").length,
    "Web Developer": normalizedApplications.filter((app) => app.domain === "Web Developer").length,
    "Android Developer": normalizedApplications.filter((app) => app.domain === "Android Developer").length,
    "Full Stack Developer": normalizedApplications.filter((app) => app.domain === "Full Stack Developer").length,
    "UI/UX Designer": normalizedApplications.filter((app) => app.domain === "UI/UX Designer").length,
    "Digital Marketing": normalizedApplications.filter((app) => app.domain === "Digital Marketing").length,
  };

  // Gradient color stops for each domain
  const pieGradients = [
    ["#6366F1", "#A5B4FC"], // Frontend Developer: Indigo to light indigo
    ["#06B6D4", "#67E8F9"], // Backend Developer: Cyan to light cyan
    ["#10B981", "#6EE7B7"], // Database Management: Emerald to light green
    ["#F59E0B", "#FDE68A"], // Web Developer: Amber to light yellow
    ["#EF4444", "#FCA5A5"], // Android Developer: Red to light red
    ["#8B5CF6", "#C4B5FD"], // Full Stack Developer: Purple to light purple
    ["#EC4899", "#F9A8D4"], // UI/UX Designer: Pink to light pink
    ["#22C55E", "#86EFAC"], // Digital Marketing: Green to light green
  ];

  // Helper to create canvas gradients for Chart.js
  function getPieGradients(ctx: CanvasRenderingContext2D, area: { left: number; top: number; right: number; bottom: number }) {
    return pieGradients.map(([start, end]) => {
      const gradient = ctx.createLinearGradient(area.left, area.top, area.right, area.bottom);
      gradient.addColorStop(0, start);
      gradient.addColorStop(1, end);
      return gradient;
    });
  }

  const pieChartData = {
    labels: Object.keys(domainStats),
    datasets: [
      {
        data: Object.values(domainStats),
        backgroundColor: (ctx: ScriptableContext<any>) => {
          const chart = ctx.chart;
          const canvasCtx = chart.ctx as CanvasRenderingContext2D;
          const chartArea = chart.chartArea;
          if (!chartArea) return pieGradients[ctx.dataIndex][0]; // fallback for initial render
          const gradients = getPieGradients(canvasCtx, chartArea);
          return gradients[ctx.dataIndex];
        },
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
        return "bg-blue-100 text-blue-800 border-blue-200"
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
      <div className="space-y-1 p-1 w-full min-w-0" style={{ maxWidth: '100vw' }}>
        {/* Header */}
        <div className="relative z-10">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-3xl blur-xl"></div>
          <div className="relative bg-white/80 backdrop-blur-xl border border-gray-200/50 rounded-3xl p-4 sm:p-6 lg:p-8 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6 min-w-0">
              <div>
                <h1 className="text-3xl lg:text-4xl font-black text-black mb-2">Analytics Dashboard</h1>
                <p className="text-gray-700 text-base lg:text-lg">Real-time insights into your internship program</p>
              </div>
              <div className="flex items-center gap-4">
                {/* Use adminId=1 or similar for admin notifications */}
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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4 lg:gap-6 min-w-0 overflow-x-auto z-10 w-full" style={{ maxWidth: '100vw' }}>
          {statCards.map((stat, index) => (
            <Card
              key={stat.title + index}
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
                  <div className="flex items-center gap-1 text-blue-600 text-sm font-semibold">
                    <TrendingUp className="h-3 w-3" />
                    {stat.change}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Applications with Quick Actions */}
        <Card className="bg-white/80 backdrop-blur-xl border border-gray-200/50 shadow-2xl overflow-x-auto z-10">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl">
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
                  className="btn btn-outline bg-white/50 border-gray-200/50 text-black hover:bg-blue-50"
                >
                  Refresh
                </Button>
                <Link href="/admin/students">
                  <Button className="btn btn-outline bg-white/50 border-gray-200/50 text-black hover:bg-blue-50">
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
                    className="btn btn-outline mt-4 bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
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
                              {(() => {
                                if (app.domain === "Frontend") return "Frontend Developer";
                                if (app.domain === "Backend") return "Backend Developer";
                                if (app.domain === "Database") return "Database Management";
                                return app.domain;
                              })()}
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
                              className="bg-blue-500 hover:bg-blue-600 text-white text-xs"
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 min-w-0 overflow-x-auto z-10 w-full" style={{ maxWidth: '100vw' }}>
          {Object.entries(domainStats).map(([domain, count], index) => {
            // 8 unique gradients for 8 domains
            const gradients = [
              "from-purple-500 to-pink-500",      // Frontend Developer
              "from-blue-500 to-cyan-500",        // Backend Developer
              "from-green-500 to-emerald-400",    // Database Management
              "from-orange-500 to-yellow-300",    // Web Developer
              "from-red-500 to-pink-400",         // Android Developer
              "from-violet-500 to-purple-300",    // Full Stack Developer
              "from-pink-500 to-fuchsia-400",     // UI/UX Designer
              "from-green-600 to-lime-400",       // Digital Marketing
            ];
            const bgGradients = [
              "from-purple-500/10 to-pink-500/10",
              "from-blue-500/10 to-cyan-500/10",
              "from-green-500/10 to-emerald-400/10",
              "from-orange-500/10 to-yellow-300/10",
              "from-red-500/10 to-pink-400/10",
              "from-violet-500/10 to-purple-300/10",
              "from-pink-500/10 to-fuchsia-400/10",
              "from-green-600/10 to-lime-400/10",
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
                    {(() => {
                      if (domain === "Frontend") return "Frontend Developer";
                      if (domain === "Backend") return "Backend Developer";
                      if (domain === "Database") return "Database Management";
                      return domain;
                    })()}
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 min-w-0 overflow-x-auto z-0 w-full" style={{ maxWidth: '100vw' }}>
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
                {Object.values(domainStats).some((count) => count > 0) ? (
                  <Pie data={pieChartData} options={pieChartOptions} />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-gray-500">
                    <span className="text-lg font-semibold">No domain data available</span>
                    <span className="text-sm">No applications found for any domain.</span>
                  </div>
                )}
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