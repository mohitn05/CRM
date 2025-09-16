"use client"

import { AdminLayout } from "@/components/admin-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import type { ScriptableContext } from "chart.js"
import { ArcElement, BarElement, CategoryScale, Chart, ChartOptions, Legend, LinearScale, Tooltip } from "chart.js"
import { Award, BookOpen, Calendar, ClipboardListIcon, Code, Database, GraduationCap, Layers, Monitor, Palette, Send, Server, Smartphone, Target, TrendingUp, Users } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
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
  const [lastUpdated, setLastUpdated] = useState<string>("")
  const [isClient, setIsClient] = useState(false)

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

  const [recentApplications, setRecentApplications] = useState<Application[]>([])
  const [selectedDomain, setSelectedDomain] = useState<string>("")
  const [domains, setDomains] = useState<string[]>([])

  useEffect(() => {
    // Set client flag to avoid hydration mismatches
    setIsClient(true)

    // Check authentication
    if (!localStorage.getItem("adminAuth")) {
      router.push("/admin/login")
      return
    }

    // Load applications and refresh data
    loadApplications()

    // Set up periodic refresh every 5 minutes to keep data fresh
    const interval = setInterval(() => {
      loadApplications()
    }, 5 * 60 * 1000) // 5 minutes

    return () => clearInterval(interval)
  }, [router])

  const loadApplications = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/admin/applications")
      const data = await response.json()
      setApplications(data)
      setLastUpdated(new Date().toLocaleString('en-CA'))

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
        title: "🚨 Data Load Failed",
        description: "⚠️ Could not load applications from server. Please refresh and try again.",
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
        title: `🎯 ${newStatus} - Success!`,
        description: `✨ ${applicant.name}'s application has been ${newStatus.toLowerCase()}. Email notification sent successfully.`,
        variant: "success" as any,
      })
    } catch (error) {
      toast({
        title: `⚠️ ${newStatus} - Email Failed`,
        description: `📝 ${applicant.name}'s application has been ${newStatus.toLowerCase()}, but email notification failed to send.`,
        variant: "warning" as any,
      })
    }
  }

  const downloadResume = (fileName: string) => {
    try {
      // Open the file in a new tab for download
      const fileUrl = `http://localhost:5000/uploads/${fileName}`
      window.open(fileUrl, '_blank')

      toast({
        title: "📄 Resume Opened Successfully!",
        description: `✅ ${fileName} has been opened in a new tab. You can save it using Ctrl+S.`,
        variant: "info" as any,
      })
    } catch (error) {
      toast({
        title: "❌ Download Failed",
        description: "⚠️ Could not open resume file. Please check if the file exists and try again.",
        variant: "destructive",
      })
    }
  }

  const stats = useMemo(() => ({
    total: applications.length,
    applied: applications.filter((app) => app.status === "Applied").length,
    inReview: applications.filter((app) => app.status === "In Review" || app.status === "Under Review").length,
    selected: applications.filter((app) => app.status === "Selected").length,
    rejected: applications.filter((app) => app.status === "Rejected").length,
    inTraining: applications.filter((app) => app.status === "In Training").length,
    completed: applications.filter((app) => app.status === "Completed").length,
  }), [applications])

  // Normalize all application domains before stats
  const normalizedApplications = useMemo(() =>
    applications.map(app => ({ ...app, domain: normalizeDomain(app.domain) })),
    [applications]
  )

  const domainStats = useMemo(() => ({
    "Frontend Developer": normalizedApplications.filter((app) => app.domain === "Frontend Developer").length,
    "Backend Developer": normalizedApplications.filter((app) => app.domain === "Backend Developer").length,
    "Database Management": normalizedApplications.filter((app) => app.domain === "Database Management").length,
    "Web Developer": normalizedApplications.filter((app) => app.domain === "Web Developer").length,
    "Android Developer": normalizedApplications.filter((app) => app.domain === "Android Developer").length,
    "Full Stack Developer": normalizedApplications.filter((app) => app.domain === "Full Stack Developer").length,
    "UI/UX Designer": normalizedApplications.filter((app) => app.domain === "UI/UX Designer").length,
    "Digital Marketing": normalizedApplications.filter((app) => app.domain === "Digital Marketing").length,
  }), [normalizedApplications])

  // Gradient color stops for each domain - Using your specified colors with gradients
  const pieGradients = [
    ["#1E90FF", "#87CEEB"], // Frontend Developer: Dodger Blue to Sky Blue
    ["#FF4500", "#FFA500"], // Backend Developer: Orange Red to Orange
    ["#32CD32", "#90EE90"], // Database Management: Lime Green to Light Green
    ["#FFD700", "#FFFFE0"], // Web Developer: Bright Gold to Light Yellow
    ["#8A2BE2", "#DDA0DD"], // Android Developer: Blue Violet to Plum
    ["#FF1493", "#FFB6C1"], // Full Stack Developer: Deep Pink to Light Pink
    ["#00CED1", "#AFEEEE"], // UI/UX Designer: Dark Turquoise to Pale Turquoise
    ["#DC143C", "#FFB6C1"], // Digital Marketing: Crimson Red to Light Pink
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

  const pieChartData = useMemo(() => ({
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
  }), [domainStats])

  const barChartData = useMemo(() => ({
    labels: ["Applied", "In Review", "Selected", "Rejected", "In Training", "Completed"],
    datasets: [
      {
        label: "Applications",
        data: [stats.applied, stats.inReview, stats.selected, stats.rejected, stats.inTraining, stats.completed],
        backgroundColor: [
          "#1E90FF", // Applied - Dodger Blue (matching Frontend Developer)
          "#FFD700", // In Review - Bright Gold (matching Web Developer)
          "#32CD32", // Selected - Lime Green (matching Database Management)
          "#DC143C", // Rejected - Crimson Red (matching Digital Marketing)
          "#8A2BE2", // In Training - Blue Violet (matching Android Developer)
          "#00CED1", // Completed - Dark Turquoise (matching UI/UX Designer)
        ],
        borderColor: [
          "#1E90FF", // Applied
          "#FFD700", // In Review
          "#32CD32", // Selected
          "#DC143C", // Rejected
          "#8A2BE2", // In Training
          "#00CED1", // Completed
        ],
        borderWidth: 2,
      },
    ],
  }), [stats])

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
      <div className="p-6 space-y-8">
        {/* Enhanced Professional Header Section */}
        <div className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-2xl shadow-lg border border-gray-200 p-8 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full -translate-y-8 translate-x-8"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-indigo-500/10 to-cyan-500/10 rounded-full translate-y-4 -translate-x-4"></div>

          <div className="relative z-10">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-3xl flex items-center justify-center shadow-xl">
                  <TrendingUp className="h-10 w-10 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-2">
                    Admin Dashboard
                  </h1>
                  <p className="text-gray-600 text-lg font-medium">
                    Comprehensive internship program management & analytics
                  </p>
                  <div className="flex items-center gap-4 mt-3">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span>Live Updates</span>
                    </div>
                    <div className="text-sm text-gray-500">
                      Last updated: {isClient ? (lastUpdated || "Loading...") : "Loading..."}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {stats.total}
                  </div>
                  <div className="text-sm font-medium text-gray-600">Total Applications</div>
                  <div className="text-xs text-green-600 font-medium mt-1 flex items-center justify-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    +12% this month
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                    {Math.round((stats.selected / Math.max(stats.total, 1)) * 100)}%
                  </div>
                  <div className="text-sm font-medium text-gray-600">Success Rate</div>
                  <div className="text-xs text-emerald-600 font-medium mt-1 flex items-center justify-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    +3% improvement
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Stats Cards with Professional Design */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat, index) => (
            <Card key={stat.title + index} className="group bg-white border-gray-200 hover:shadow-xl transition-all duration-300 hover:scale-105 hover:border-blue-300 relative overflow-hidden">
              {/* Background gradient overlay */}
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>

              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 relative z-10">
                <CardTitle className="text-sm font-bold text-gray-600 group-hover:text-gray-800 transition-colors">
                  {stat.title}
                </CardTitle>
                <div className={`p-3 bg-gradient-to-br ${stat.gradient} rounded-xl shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300`}>
                  <stat.icon className="h-5 w-5 text-white" />
                </div>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="flex items-end justify-between">
                  <div className="text-3xl font-bold text-gray-900 group-hover:text-gray-800 transition-colors">
                    {stat.value}
                  </div>
                  <div className="flex items-center gap-1 text-emerald-600 text-sm font-semibold bg-emerald-50 px-2 py-1 rounded-full">
                    <TrendingUp className="h-3 w-3" />
                    {stat.change}
                  </div>
                </div>
                <div className="mt-2 text-xs text-gray-500 font-medium">
                  {stat.changeType === 'increase' ? '↗' : '↘'} vs last month
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Educational Insights Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 bg-white border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg">
                  <BookOpen className="h-5 w-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl font-bold text-gray-900">Educational Insights</CardTitle>
                  <CardDescription className="text-sm text-gray-600">Learning outcomes and student progress</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { title: "Avg. Completion Time", value: "8.2 weeks", icon: Calendar, color: "from-blue-500 to-indigo-500" },
                  { title: "Top Performing Domain", value: "Frontend Dev", icon: Target, color: "from-purple-500 to-pink-500" },
                  { title: "Mentor Satisfaction", value: "4.8/5.0", icon: Award, color: "from-emerald-500 to-teal-500" }
                ].map((item, index) => (
                  <div key={index} className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <div className={`w-10 h-10 bg-gradient-to-br ${item.color} rounded-lg flex items-center justify-center mb-3`}>
                      <item.icon className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="text-sm font-semibold text-gray-600 mb-1">{item.title}</h3>
                    <p className="text-xl font-bold text-gray-900">{item.value}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 bg-blue-50/50 border border-blue-200 rounded-xl p-4">
                <h3 className="font-semibold text-blue-800 flex items-center gap-2 mb-2">
                  <BookOpen className="w-5 h-5" />
                  Educational Program Note
                </h3>
                <p className="text-blue-700 text-sm">
                  This dashboard provides insights into student learning outcomes and program effectiveness.
                  Use these metrics to improve curriculum alignment with industry needs and enhance student success rates.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="bg-white border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-purple-50 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg">
                  <Layers className="h-5 w-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl font-bold text-gray-900">Quick Actions</CardTitle>
                  <CardDescription className="text-sm text-gray-600">Manage your program efficiently</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <button
                onClick={() => router.push('/admin/students')}
                className="w-full flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 hover:from-blue-100 hover:to-indigo-100 transition-all duration-200 group"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                  <Users className="h-5 w-5 text-white" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-gray-900 group-hover:text-blue-700">View All Students</h3>
                  <p className="text-sm text-gray-600">Manage applications and progress</p>
                </div>
              </button>

              <button
                onClick={loadApplications}
                className="w-full flex items-center gap-3 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-200 hover:from-emerald-100 hover:to-teal-100 transition-all duration-200 group"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-white" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-gray-900 group-hover:text-emerald-700">Refresh Data</h3>
                  <p className="text-sm text-gray-600">Update dashboard statistics</p>
                </div>
              </button>

              <button
                className="w-full flex items-center gap-3 p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200 hover:from-amber-100 hover:to-orange-100 transition-all duration-200 group"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg flex items-center justify-center">
                  <Send className="h-5 w-5 text-white" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-gray-900 group-hover:text-amber-700">Send Notifications</h3>
                  <p className="text-sm text-gray-600">Communicate with students</p>
                </div>
              </button>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Recent Applications with Professional Styling */}
        <Card className="bg-white border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg">
                  <ClipboardListIcon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl font-bold text-gray-900">Recent Applications</CardTitle>
                  <p className="text-sm text-gray-600 mt-1">Latest submissions requiring your attention</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border border-gray-200">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-xs font-medium text-gray-600">{recentApplications.length} active</span>
                </div>
                <button
                  onClick={loadApplications}
                  className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-all duration-200 hover:scale-105 active:scale-95"
                >
                  🔄 Refresh
                </button>
                <button
                  onClick={() => router.push('/admin/students')}
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-sm font-medium rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 hover:scale-105 active:scale-95"
                >
                  📋 View All
                </button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {recentApplications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-gray-500">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <ClipboardListIcon className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">No Recent Applications</h3>
                <p className="text-sm text-gray-500 text-center max-w-md">
                  When new applications are submitted, they will appear here for quick review and management.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="text-left py-4 px-6 font-semibold text-gray-800 text-sm uppercase tracking-wider">Applicant</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-800 text-sm uppercase tracking-wider">Contact</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-800 text-sm uppercase tracking-wider">Domain</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-800 text-sm uppercase tracking-wider">Status</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-800 text-sm uppercase tracking-wider">Applied</th>
                      <th className="text-center py-4 px-6 font-semibold text-gray-800 text-sm uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {recentApplications.slice(0, 5).map((app, index) => (
                      <tr key={app.id} className="group hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200">
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                              {app.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">{app.name}</div>
                              <div className="text-sm text-gray-500">{app.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="text-sm text-gray-600">{app.phone}</div>
                        </td>
                        <td className="py-4 px-6">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border border-blue-200">
                            {app.domain}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold border ${getStatusColor(app.status)}`}>
                            {app.status}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <div className="text-sm text-gray-600">
                            {(() => {
                              try {
                                return new Date(app.dateApplied).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric'
                                })
                              } catch {
                                return 'Invalid date'
                              }
                            })()}
                          </div>
                        </td>
                        <td className="py-4 px-6 text-center">
                          <button
                            onClick={() => router.push(`/admin/student/${app.id}`)}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-sm font-medium rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 hover:scale-105 active:scale-95 shadow-md hover:shadow-lg"
                          >
                            <span>👁️</span>
                            <span>View</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Enhanced Domain Statistics Cards */}
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-3">Domain Applications Overview</h2>
            <p className="text-gray-600 text-lg">Applications distribution across different technical domains</p>
            <div className="flex items-center justify-center gap-4 mt-4">
              <div className="flex items-center gap-2 bg-green-50 px-3 py-1 rounded-full border border-green-200">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-green-700">Live Data</span>
              </div>
              <div className="text-sm text-gray-500">
                Updated every 5 minutes
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Frontend Developer - Dodger Blue */}
            <Card className="group cursor-pointer transition-all duration-500 hover:shadow-2xl hover:scale-105 hover:-translate-y-2 bg-gradient-to-br from-blue-50 to-sky-50 border-blue-200 hover:border-blue-400 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-sky-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardContent className="p-6 text-center relative z-10">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-sky-400 rounded-2xl flex items-center justify-center group-hover:rotate-12 group-hover:scale-110 transition-all duration-500 shadow-lg group-hover:shadow-xl" style={{ backgroundImage: 'linear-gradient(to bottom right, #1E90FF, #87CEEB)' }}>
                  <Monitor className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2 group-hover:text-blue-700 transition-colors duration-300">Frontend Developer</h3>
                <div className="text-4xl font-black mb-2 group-hover:scale-110 transition-transform duration-300" style={{ color: '#1E90FF' }}>{domainStats["Frontend Developer"]}</div>
                <p className="text-gray-600 text-sm font-medium">applications submitted</p>
                <div className="mt-3 w-full bg-blue-100 rounded-full h-2 group-hover:h-3 transition-all duration-300">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-sky-400 h-full rounded-full transition-all duration-1000"
                    style={{ width: `${Math.min((domainStats["Frontend Developer"] / Math.max(...Object.values(domainStats))) * 100, 100)}%` }}
                  ></div>
                </div>
              </CardContent>
            </Card>

            {/* Backend Developer - Orange Red */}
            <Card className="group cursor-pointer transition-all duration-500 hover:shadow-2xl hover:scale-105 hover:-translate-y-2 bg-gradient-to-br from-orange-50 to-red-50 border-orange-200 hover:border-orange-400 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardContent className="p-6 text-center relative z-10">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center group-hover:rotate-12 group-hover:scale-110 transition-all duration-500 shadow-lg group-hover:shadow-xl" style={{ backgroundImage: 'linear-gradient(to bottom right, #FF4500, #FFA500)' }}>
                  <Server className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2 group-hover:text-orange-700 transition-colors duration-300">Backend Developer</h3>
                <div className="text-4xl font-black mb-2 group-hover:scale-110 transition-transform duration-300" style={{ color: '#FF4500' }}>{domainStats["Backend Developer"]}</div>
                <p className="text-gray-600 text-sm font-medium">applications submitted</p>
                <div className="mt-3 w-full bg-orange-100 rounded-full h-2 group-hover:h-3 transition-all duration-300">
                  <div
                    className="bg-gradient-to-r from-orange-500 to-red-500 h-full rounded-full transition-all duration-1000"
                    style={{ width: `${Math.min((domainStats["Backend Developer"] / Math.max(...Object.values(domainStats))) * 100, 100)}%` }}
                  ></div>
                </div>
              </CardContent>
            </Card>

            {/* Database Management - Lime Green */}
            <Card className="group cursor-pointer transition-all duration-500 hover:shadow-2xl hover:scale-105 hover:-translate-y-2 bg-gradient-to-br from-lime-50 to-green-50 border-lime-200 hover:border-lime-400 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-lime-500/5 to-green-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardContent className="p-6 text-center relative z-10">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-lime-500 to-green-400 rounded-2xl flex items-center justify-center group-hover:rotate-12 group-hover:scale-110 transition-all duration-500 shadow-lg group-hover:shadow-xl" style={{ backgroundImage: 'linear-gradient(to bottom right, #32CD32, #90EE90)' }}>
                  <Database className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2 group-hover:text-green-700 transition-colors duration-300">Database Management</h3>
                <div className="text-4xl font-black mb-2 group-hover:scale-110 transition-transform duration-300" style={{ color: '#32CD32' }}>{domainStats["Database Management"]}</div>
                <p className="text-gray-600 text-sm font-medium">applications submitted</p>
                <div className="mt-3 w-full bg-lime-100 rounded-full h-2 group-hover:h-3 transition-all duration-300">
                  <div
                    className="bg-gradient-to-r from-lime-500 to-green-400 h-full rounded-full transition-all duration-1000"
                    style={{ width: `${Math.min((domainStats["Database Management"] / Math.max(...Object.values(domainStats))) * 100, 100)}%` }}
                  ></div>
                </div>
              </CardContent>
            </Card>

            {/* Web Developer - Bright Gold */}
            <Card className="group cursor-pointer transition-all duration-500 hover:shadow-2xl hover:scale-105 hover:-translate-y-2 bg-gradient-to-br from-yellow-50 to-amber-50 border-yellow-200 hover:border-yellow-400 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-amber-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardContent className="p-6 text-center relative z-10">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-yellow-400 to-amber-300 rounded-2xl flex items-center justify-center group-hover:rotate-12 group-hover:scale-110 transition-all duration-500 shadow-lg group-hover:shadow-xl" style={{ backgroundImage: 'linear-gradient(to bottom right, #FFD700, #FFFFE0)' }}>
                  <Code className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2 group-hover:text-yellow-700 transition-colors duration-300">Web Developer</h3>
                <div className="text-4xl font-black mb-2 group-hover:scale-110 transition-transform duration-300" style={{ color: '#FFD700' }}>{domainStats["Web Developer"]}</div>
                <p className="text-gray-600 text-sm font-medium">applications submitted</p>
                <div className="mt-3 w-full bg-yellow-100 rounded-full h-2 group-hover:h-3 transition-all duration-300">
                  <div
                    className="bg-gradient-to-r from-yellow-400 to-amber-300 h-full rounded-full transition-all duration-1000"
                    style={{ width: `${Math.min((domainStats["Web Developer"] / Math.max(...Object.values(domainStats))) * 100, 100)}%` }}
                  ></div>
                </div>
              </CardContent>
            </Card>

            {/* Android Developer - Blue Violet */}
            <Card className="group cursor-pointer transition-all duration-500 hover:shadow-2xl hover:scale-105 hover:-translate-y-2 bg-gradient-to-br from-violet-50 to-purple-50 border-violet-200 hover:border-violet-400 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardContent className="p-6 text-center relative z-10">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-violet-600 to-purple-400 rounded-2xl flex items-center justify-center group-hover:rotate-12 group-hover:scale-110 transition-all duration-500 shadow-lg group-hover:shadow-xl" style={{ backgroundImage: 'linear-gradient(to bottom right, #8A2BE2, #DDA0DD)' }}>
                  <Smartphone className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2 group-hover:text-violet-700 transition-colors duration-300">Android Developer</h3>
                <div className="text-4xl font-black mb-2 group-hover:scale-110 transition-transform duration-300" style={{ color: '#8A2BE2' }}>{domainStats["Android Developer"]}</div>
                <p className="text-gray-600 text-sm font-medium">applications submitted</p>
                <div className="mt-3 w-full bg-violet-100 rounded-full h-2 group-hover:h-3 transition-all duration-300">
                  <div
                    className="bg-gradient-to-r from-violet-600 to-purple-400 h-full rounded-full transition-all duration-1000"
                    style={{ width: `${Math.min((domainStats["Android Developer"] / Math.max(...Object.values(domainStats))) * 100, 100)}%` }}
                  ></div>
                </div>
              </CardContent>
            </Card>

            {/* Full Stack Developer - Deep Pink */}
            <Card className="group cursor-pointer transition-all duration-500 hover:shadow-2xl hover:scale-105 hover:-translate-y-2 bg-gradient-to-br from-pink-50 to-rose-50 border-pink-200 hover:border-pink-400 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-rose-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardContent className="p-6 text-center relative z-10">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-pink-600 to-rose-400 rounded-2xl flex items-center justify-center group-hover:rotate-12 group-hover:scale-110 transition-all duration-500 shadow-lg group-hover:shadow-xl" style={{ backgroundImage: 'linear-gradient(to bottom right, #FF1493, #FFB6C1)' }}>
                  <Layers className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2 group-hover:text-pink-700 transition-colors duration-300">Full Stack Developer</h3>
                <div className="text-4xl font-black mb-2 group-hover:scale-110 transition-transform duration-300" style={{ color: '#FF1493' }}>{domainStats["Full Stack Developer"]}</div>
                <p className="text-gray-600 text-sm font-medium">applications submitted</p>
                <div className="mt-3 w-full bg-pink-100 rounded-full h-2 group-hover:h-3 transition-all duration-300">
                  <div
                    className="bg-gradient-to-r from-pink-600 to-rose-400 h-full rounded-full transition-all duration-1000"
                    style={{ width: `${Math.min((domainStats["Full Stack Developer"] / Math.max(...Object.values(domainStats))) * 100, 100)}%` }}
                  ></div>
                </div>
              </CardContent>
            </Card>

            {/* UI/UX Designer - Dark Turquoise */}
            <Card className="group cursor-pointer transition-all duration-500 hover:shadow-2xl hover:scale-105 hover:-translate-y-2 bg-gradient-to-br from-cyan-50 to-teal-50 border-cyan-200 hover:border-cyan-400 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardContent className="p-6 text-center relative z-10">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-cyan-500 to-teal-400 rounded-2xl flex items-center justify-center group-hover:rotate-12 group-hover:scale-110 transition-all duration-500 shadow-lg group-hover:shadow-xl" style={{ backgroundImage: 'linear-gradient(to bottom right, #00CED1, #AFEEEE)' }}>
                  <Palette className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2 group-hover:text-cyan-700 transition-colors duration-300">UI/UX Designer</h3>
                <div className="text-4xl font-black mb-2 group-hover:scale-110 transition-transform duration-300" style={{ color: '#00CED1' }}>{domainStats["UI/UX Designer"]}</div>
                <p className="text-gray-600 text-sm font-medium">applications submitted</p>
                <div className="mt-3 w-full bg-cyan-100 rounded-full h-2 group-hover:h-3 transition-all duration-300">
                  <div
                    className="bg-gradient-to-r from-cyan-500 to-teal-400 h-full rounded-full transition-all duration-1000"
                    style={{ width: `${Math.min((domainStats["UI/UX Designer"] / Math.max(...Object.values(domainStats))) * 100, 100)}%` }}
                  ></div>
                </div>
              </CardContent>
            </Card>

            {/* Digital Marketing - Red */}
            <Card className="group cursor-pointer transition-all duration-500 hover:shadow-2xl hover:scale-105 hover:-translate-y-2 bg-gradient-to-br from-red-50 to-pink-50 border-red-200 hover:border-red-400 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardContent className="p-6 text-center relative z-10">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-red-600 to-pink-500 rounded-2xl flex items-center justify-center group-hover:rotate-12 group-hover:scale-110 transition-all duration-500 shadow-lg group-hover:shadow-xl" style={{ backgroundImage: 'linear-gradient(to bottom right, #DC143C, #FFB6C1)' }}>
                  <Send className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2 group-hover:text-red-700 transition-colors duration-300">Digital Marketing</h3>
                <div className="text-4xl font-black mb-2 group-hover:scale-110 transition-transform duration-300" style={{ color: '#DC143C' }}>{domainStats["Digital Marketing"]}</div>
                <p className="text-gray-600 text-sm font-medium">applications submitted</p>
                <div className="mt-3 w-full bg-red-100 rounded-full h-2 group-hover:h-3 transition-all duration-300">
                  <div
                    className="bg-gradient-to-r from-red-600 to-pink-500 h-full rounded-full transition-all duration-1000"
                    style={{ width: `${Math.min((domainStats["Digital Marketing"] / Math.max(...Object.values(domainStats))) * 100, 100)}%` }}
                  ></div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Enhanced Analytics Charts Section */}
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Analytics & Insights</h2>
            <p className="text-gray-600">Real-time data visualization and performance metrics</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-white border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 group">
              <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg group-hover:scale-110 transition-transform duration-300">
                    <TrendingUp className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-bold text-gray-900">Application Status</CardTitle>
                    <CardDescription className="text-sm">Current status breakdown of all applications</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="h-80">
                  {stats.total > 0 ? (
                    <Bar data={barChartData} options={barChartOptions} />
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-gray-500">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <TrendingUp className="h-8 w-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-700 mb-2">No Status Data</h3>
                      <p className="text-sm text-gray-500 text-center max-w-md">
                        Application status data will appear here once submissions are received.
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 group">
              <CardHeader className="bg-gradient-to-r from-gray-50 to-purple-50 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg group-hover:scale-110 transition-transform duration-300">
                    <Layers className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-bold text-gray-900">Domain Distribution</CardTitle>
                    <CardDescription className="text-sm">Applications across different technical domains</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="h-80">
                  {Object.values(domainStats).some((count) => count > 0) ? (
                    <Pie data={pieChartData} options={pieChartOptions} />
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-gray-500">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <Layers className="h-8 w-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-700 mb-2">No Domain Data</h3>
                      <p className="text-sm text-gray-500 text-center max-w-md">
                        Domain distribution will be displayed here as applications are received across different technical areas.
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Professional Footer Section */}
        <div className="bg-gradient-to-r from-slate-50 to-gray-50 rounded-2xl shadow-sm border border-gray-200 p-8 mt-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Users className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Talent Management</h3>
              <p className="text-sm text-gray-600">Comprehensive internship program with end-to-end candidate tracking and development.</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Real-time Analytics</h3>
              <p className="text-sm text-gray-600">Live dashboard with performance metrics, application trends, and success rate tracking.</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Award className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Success Tracking</h3>
              <p className="text-sm text-gray-600">Monitor intern progress from application to completion with detailed performance insights.</p>
            </div>
          </div>
          <div className="border-t border-gray-200 mt-8 pt-6 text-center">
            <p className="text-sm text-gray-500">© 2024 Internship CRM Platform - Professional Talent Management System</p>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}