"use client"
import { NotificationBell } from "@/components/notification-bell"
import {
  SidebarContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { useToast } from "@/hooks/use-toast"
import {
  Building2,
  LayoutDashboard,
  LogOut,
  Menu,
  User,
  Users,
} from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import React from "react"

const menuItems = [
  { title: "Dashboard", url: "/admin/dashboard", icon: LayoutDashboard },
  { title: "Students", url: "/admin/students", icon: Users },
]

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const { toast } = useToast()
  const [sidebarOpen, setSidebarOpen] = React.useState(false)

  function handleLogout() {
    localStorage.removeItem("adminAuth")
    toast({
      title: "Logged Out Successfully ✅",
      description: "Thank you for using our platform!",
    })
    router.push("/")
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex w-full bg-white">
            {/* Mobile overlay */}
            {sidebarOpen && (
              <div
                className="fixed inset-0 z-50 bg-black bg-opacity-40 md:hidden"
                onClick={() => setSidebarOpen(false)}
              />
            )}

            {/* Sidebar */}
            <aside
              className={`fixed z-50 top-0 left-0 h-full w-72 bg-white border-r border-gray-200 shadow-sm transform transition-transform duration-300
                ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
                md:static md:translate-x-0 md:w-64 md:block md:z-auto`}
            >
              <SidebarContent className="p-6 flex flex-col h-full">
                {/* Logo */}
                <div className="px-4 py-6 border-b border-gray-200 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <Building2 className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h1 className="text-base md:text-lg font-bold text-gray-800">
                        Internship CRM
                      </h1>
                      <p className="text-xs md:text-sm text-gray-600">
                        Admin Portal
                      </p>
                    </div>
                  </div>
                </div>

                {/* Nav */}
                <SidebarMenu className="flex-1 px-2 space-y-2">
                  {menuItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        isActive={pathname === item.url}
                        className="group bg-gray-50 hover:bg-gray-100 border border-gray-200 hover:border-gray-300 rounded-xl transition-all duration-300 data-[active=true]:bg-blue-50 data-[active=true]:border-blue-200 data-[active=true]:shadow-sm"
                      >
                        <Link
                          href={item.url}
                          className="flex w-full px-3 py-2 rounded hover:bg-gray-100 items-center gap-2"
                        >
                          <item.icon className="h-4 w-4 text-gray-700" />
                          <span className="font-medium text-gray-800 text-sm md:text-base">
                            {item.title}
                          </span>
                        </Link>

                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>

                {/* User */}
                <div className="px-4 py-6 border-t border-gray-200 mt-auto">
                  <div className="mb-4 p-3 md:p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
                          <User className="h-5 w-5 md:h-6 md:w-6 text-white" />
                        </div>
                        <div className="absolute -top-1 -right-1 w-3 h-3 md:w-4 md:h-4 bg-blue-400 rounded-full border-2 border-white animate-pulse" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm md:text-base">
                          Admin User
                        </p>
                        <p className="text-blue-600 text-xs md:text-sm font-medium">
                          Administrator
                        </p>
                        <p className="text-gray-500 text-xs">Online now</p>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 p-2 md:p-3 text-red-600 hover:bg-red-50 rounded-xl transition-all duration-300 border border-red-200 hover:border-red-300"
                  >
                    <div className="p-2 bg-red-100 rounded-lg transition-colors group-hover:bg-red-200">
                      <LogOut className="h-4 w-4 text-red-600" />
                    </div>
                    <span className="font-medium text-sm md:text-base">
                      Logout
                    </span>
                  </button>
                </div>
              </SidebarContent>
            </aside>

            {/* Main */}
            <div className="flex-1 flex flex-col min-h-screen md:ml-64 bg-white">
              <header className="sticky top-0 z-40 flex h-16 items-center gap-2 border-b border-gray-200 px-4 md:px-6 bg-white shadow-sm">
                <button
                  className="md:hidden p-2 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-100 transition"
                  onClick={() => setSidebarOpen((o) => !o)}
                  aria-label="Toggle menu"
                >
                  <Menu className="h-5 w-5" />
                </button>
                <span className="text-gray-700 font-medium text-sm md:text-base">
                  Menu
                </span>
                <div className="ml-auto flex items-center gap-3">
                  <div className="hidden sm:block text-right">
                    <p className="text-xs md:text-sm font-medium text-gray-800">
                      Welcome back!
                    </p>
                    <p className="text-xs text-gray-600">Admin Dashboard</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                    {/* @ts-ignore */}
                    <NotificationBell adminId={1} />
                  </div>
                </div>
              </header>
              <main className="flex-1 overflow-auto">{children}</main>
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  )
}
