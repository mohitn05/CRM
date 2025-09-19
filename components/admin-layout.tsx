"use client"
import { NotificationBell } from "@/components/notification-bell"
import { useToast } from "@/hooks/use-toast"
import {
  Award,
  Briefcase,
  Code,
  Database,
  FileText,
  Globe,
  GraduationCap,
  Layers,
  LayoutDashboard,
  LogOut,
  Monitor,
  Palette,
  Server,
  Smartphone,
  Star,
  Target,
  User,
  Users,
  X,
  Zap
} from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import React, { useEffect } from "react"

const menuItems = [
  { title: "Dashboard", url: "/admin/dashboard", icon: LayoutDashboard },
  { title: "Students", url: "/admin/students", icon: Users },
]

// Animated Background Component
const AnimatedBackground = () => {
  const [isClient, setIsClient] = React.useState(false)
  const [elementPositions, setElementPositions] = React.useState<Array<{
    x: number
    y: number
    duration: number
    scale: number
    animationType: string
  }>>([])
  const [particleData, setParticleData] = React.useState<Array<{
    x: number
    y: number
    size: number
    duration: number
    animationType: string
    delay: number
  }>>([])

  const floatingElements = [
    { icon: Code, color: "from-blue-500 to-purple-600", size: "w-8 h-8", delay: "0s" },
    { icon: Database, color: "from-green-500 to-teal-600", size: "w-6 h-6", delay: "2s" },
    { icon: Monitor, color: "from-purple-500 to-pink-600", size: "w-10 h-10", delay: "4s" },
    { icon: Smartphone, color: "from-orange-500 to-red-600", size: "w-7 h-7", delay: "1s" },
    { icon: Server, color: "from-indigo-500 to-blue-600", size: "w-9 h-9", delay: "3s" },
    { icon: Palette, color: "from-pink-500 to-rose-600", size: "w-8 h-8", delay: "5s" },
    { icon: Layers, color: "from-teal-500 to-cyan-600", size: "w-6 h-6", delay: "6s" },
    { icon: FileText, color: "from-yellow-500 to-orange-600", size: "w-7 h-7", delay: "1.5s" },
    { icon: Globe, color: "from-blue-500 to-indigo-600", size: "w-8 h-8", delay: "3.5s" },
    { icon: Briefcase, color: "from-gray-500 to-slate-600", size: "w-9 h-9", delay: "2.5s" },
    { icon: Award, color: "from-emerald-500 to-green-600", size: "w-7 h-7", delay: "4.5s" },
    { icon: Star, color: "from-amber-500 to-yellow-600", size: "w-6 h-6", delay: "0.5s" },
    { icon: Zap, color: "from-violet-500 to-purple-600", size: "w-8 h-8", delay: "5.5s" },
    { icon: Target, color: "from-red-500 to-pink-600", size: "w-7 h-7", delay: "1.8s" },
  ]

  // Generate random values only on client side
  useEffect(() => {
    setIsClient(true)

    // Generate element positions
    const positions = floatingElements.map((_, index) => ({
      x: Math.random() * 90,
      y: Math.random() * 90,
      duration: 15 + Math.random() * 20,
      scale: 0.7 + Math.random() * 0.6,
      animationType: index % 2 === 0 ? 'floatSmooth' : 'drift'
    }))
    setElementPositions(positions)

    // Generate particle data
    const particles = Array.from({ length: 20 }).map((_, index) => ({
      x: Math.random() * 90,
      y: Math.random() * 90,
      size: 3 + Math.random() * 8,
      duration: 20 + Math.random() * 25,
      animationType: index % 3 === 0 ? 'floatSmooth' : index % 3 === 1 ? 'drift' : 'float',
      delay: Math.random() * 15
    }))
    setParticleData(particles)
  }, [])

  // Don't render on server side to prevent hydration errors
  if (!isClient) {
    return null
  }

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-purple-50/20 to-pink-50/30" />

      {/* Moving Elements */}
      {floatingElements.map((element, index) => {
        const IconComponent = element.icon
        const position = elementPositions[index]

        if (!position) return null

        return (
          <div
            key={index}
            className={`absolute opacity-25 hover:opacity-40 transition-opacity duration-1000`}
            style={{
              left: `${position.x}%`,
              top: `${position.y}%`,
              animationDelay: element.delay,
              transform: `scale(${position.scale})`,
            }}
          >
            <div
              className={`
                ${element.size} bg-gradient-to-br ${element.color} rounded-2xl 
                flex items-center justify-center shadow-lg
              `}
              style={{
                animation: `${position.animationType} ${position.duration}s ease-in-out infinite, rotate ${position.duration * 1.5}s linear infinite`,
              }}
            >
              <IconComponent className="w-1/2 h-1/2 text-white" />
            </div>
          </div>
        )
      })}

      {/* Floating Particles */}
      {particleData.map((particle, index) => {
        return (
          <div
            key={`particle-${index}`}
            className="absolute rounded-full bg-gradient-to-r from-blue-400/30 to-purple-400/30 animate-pulse"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              animation: `${particle.animationType} ${particle.duration}s ease-in-out infinite, fadeInOut 6s ease-in-out infinite`,
              animationDelay: `${particle.delay}s`,
            }}
          />
        )
      })}

      {/* Gradient Orbs */}
      <div
        className="absolute w-96 h-96 bg-gradient-to-r from-blue-400/20 to-purple-600/20 rounded-full blur-3xl animate-pulse"
        style={{
          top: '10%',
          right: '10%',
          animation: 'floatSmooth 30s ease-in-out infinite, pulse 8s ease-in-out infinite',
        }}
      />
      <div
        className="absolute w-80 h-80 bg-gradient-to-r from-purple-400/20 to-pink-600/20 rounded-full blur-3xl animate-pulse"
        style={{
          bottom: '15%',
          left: '5%',
          animation: 'drift 35s ease-in-out infinite, pulse 10s ease-in-out infinite',
          animationDelay: '5s',
        }}
      />
      <div
        className="absolute w-72 h-72 bg-gradient-to-r from-teal-400/20 to-cyan-600/20 rounded-full blur-3xl animate-pulse"
        style={{
          top: '60%',
          right: '30%',
          animation: 'float 40s ease-in-out infinite, pulse 12s ease-in-out infinite',
          animationDelay: '10s',
        }}
      />
    </div>
  )
}

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const { toast } = useToast()
  const [sidebarOpen, setSidebarOpen] = React.useState(false)
  const [autoHideTimeout, setAutoHideTimeout] = React.useState<NodeJS.Timeout | null>(null)

  // Clear timeout when component unmounts
  useEffect(() => {
    return () => {
      if (autoHideTimeout) {
        clearTimeout(autoHideTimeout)
      }
    }
  }, [autoHideTimeout])

  // Close sidebar when route changes
  useEffect(() => {
    setSidebarOpen(false)
    if (autoHideTimeout) {
      clearTimeout(autoHideTimeout)
      setAutoHideTimeout(null)
    }
  }, [pathname, autoHideTimeout])

  function handleLogout() {
    localStorage.removeItem("adminAuth")
    toast({
      title: "Logged Out Successfully ✅",
      description: "Thank you for using our platform!",
    })
    router.push("/")
  }

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
    // Clear any existing timeout
    if (autoHideTimeout) {
      clearTimeout(autoHideTimeout)
      setAutoHideTimeout(null)
    }
  }

  const handleMouseEnterSidebar = () => {
    // Clear timeout when mouse enters sidebar
    if (autoHideTimeout) {
      clearTimeout(autoHideTimeout)
      setAutoHideTimeout(null)
    }
  }

  const handleMouseLeaveSidebar = () => {
    // Set timeout to close sidebar after 3 seconds when mouse leaves
    if (sidebarOpen) {
      const timeout = setTimeout(() => {
        setSidebarOpen(false)
      }, 3000)
      setAutoHideTimeout(timeout)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex relative overflow-hidden">
      {/* Animated Background */}
      <AnimatedBackground />

      {/* Add Custom CSS Animations */}
      <style jsx global>{`
        @keyframes float {
          0% { transform: translateY(0px) translateX(0px) rotate(0deg); }
          25% { transform: translateY(-30px) translateX(25px) rotate(90deg); }
          50% { transform: translateY(-60px) translateX(-20px) rotate(180deg); }
          75% { transform: translateY(-30px) translateX(30px) rotate(270deg); }
          100% { transform: translateY(0px) translateX(0px) rotate(360deg); }
        }
        
        @keyframes floatSmooth {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(40px, -40px) scale(1.1); }
          66% { transform: translate(-35px, -25px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        
        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes fadeInOut {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.4; }
        }
        
        @keyframes drift {
          0% { transform: translateX(0px) translateY(0px); }
          25% { transform: translateX(50px) translateY(-30px); }
          50% { transform: translateX(-30px) translateY(-60px); }
          75% { transform: translateX(-50px) translateY(-20px); }
          100% { transform: translateX(0px) translateY(0px); }
        }
        
        .animate-float {
          animation: floatSmooth 20s ease-in-out infinite;
        }
        
        .animate-drift {
          animation: drift 25s ease-in-out infinite;
        }
      `}</style>
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-60 z-40 transition-opacity duration-500"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Hidden by default, shows only when opened */}
      <aside
        className={`
          fixed z-50 h-screen w-64 bg-white/95 backdrop-blur-sm border-r border-gray-200 shadow-xl
          transform transition-all duration-500 ease-in-out

          ${sidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}
        `}
        onMouseEnter={handleMouseEnterSidebar}
        onMouseLeave={handleMouseLeaveSidebar}
      >
        <div className="flex flex-col h-full">
          {/* Logo Section */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-blue-600 via-purple-500 to-purple-700 text-white p-2 rounded-xl shadow-lg">
                <GraduationCap className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-lg font-extrabold bg-gradient-to-r from-blue-700 via-purple-600 to-purple-800 bg-clip-text text-transparent">
                  InternPro CRM
                </h1>
                <p className="text-sm text-gray-500">
                  Admin Portal
                </p>
              </div>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="flex-1 p-4 space-y-2">
            {menuItems.map((item) => {
              const isActive = pathname === item.url
              return (
                <Link
                  key={item.title}
                  href={item.url}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors
                    ${isActive
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                    }
                  `}
                  onClick={() => {
                    setSidebarOpen(false)
                    // Clear any existing timeout
                    if (autoHideTimeout) {
                      clearTimeout(autoHideTimeout)
                      setAutoHideTimeout(null)
                    }
                  }}
                >
                  <item.icon className="h-5 w-5" />
                  {item.title}
                </Link>
              )
            })}
          </nav>

          {/* User Profile Section */}
          <div className="border-t border-gray-200 p-4">
            <div className="mb-4">
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-white" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-900">
                    Admin User
                  </p>
                  <p className="text-xs text-gray-600">
                    Administrator
                  </p>
                  <p className="text-xs text-green-600 font-medium">
                    Online now
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-red-200 hover:border-red-300"
            >
              <LogOut className="h-4 w-4" />
              <span className="text-sm font-medium">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area - Full width always */}
      <div className="flex-1 flex flex-col overflow-hidden w-full relative z-10">
        {/* Header */}
        <header className="bg-white/90 backdrop-blur-sm border-b border-gray-200 shadow-sm relative z-20">
          <div className="flex items-center justify-between h-16 px-6">
            <div className="flex items-center gap-4">
              <button
                onClick={toggleSidebar}
                className="group relative p-3 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <div className="relative">
                  {sidebarOpen ? (
                    <X className="h-5 w-5 transition-transform duration-300" />
                  ) : (
                    <GraduationCap className="h-5 w-5 transition-transform duration-300 group-hover:rotate-90" />
                  )}
                </div>
                <div className="absolute inset-0 bg-white/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </button>

              {/* Logo and Name in Header for Mobile View */}
              <div className="flex items-center gap-2 md:hidden">
                <div className="bg-gradient-to-br from-blue-600 via-purple-500 to-purple-700 text-white p-1.5 rounded-lg shadow-md">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <span className="text-lg font-extrabold bg-gradient-to-r from-blue-700 via-purple-600 to-purple-800 bg-clip-text text-transparent">
                  InternPro CRM
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-semibold text-gray-900">
                  Welcome back!
                </p>
                <p className="text-xs text-gray-500">
                  Admin Dashboard
                </p>
              </div>
              <div className="flex items-center gap-3">
                <NotificationBell adminId={1} />
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-auto bg-transparent relative z-10">
          <div className="h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}