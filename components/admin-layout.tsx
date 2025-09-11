"use client"

import { NotificationBell } from "@/components/notification-bell"

import {
  SidebarContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider
} from "@/components/ui/sidebar"
import { useToast } from "@/hooks/use-toast"
import { Building2, LayoutDashboard, LogOut, Menu, User, Users } from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import React from "react"

const menuItems = [
  {
    title: "Dashboard",
    url: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Students",
    url: "/admin/students",
    icon: Users,
  },
]

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const { toast } = useToast()
  const [sidebarOpen, setSidebarOpen] = React.useState(false)

  const handleLogout = () => {
    localStorage.removeItem("adminAuth")
    toast({
      title: "Logged Out Successfully ✅",
      description: "Thank you for using our platform!",
    })
    router.push("/")
  }

  // Responsive sidebar: show as drawer on mobile/tablet
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-white">
        {/* Overlay for mobile sidebar */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-50 bg-black bg-opacity-40 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        {/* Sidebar: hidden on mobile, drawer on mobile, static on md+ */}
        <aside
          className={`fixed z-50 top-0 left-0 h-full w-72 bg-white border-r border-gray-200 shadow-sm transform transition-transform duration-300
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:static md:block md:w-64 md:z-0`}
          style={{ maxWidth: "16rem" }}
        >
          <SidebarContent className="p-6 flex flex-col h-full">
            {/* Header */}
            <div className="border-b border-gray-200 pb-6 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Building2 className="h-6 w-6 text-white" />
                </div>
                <div>
                  <span className="font-bold text-gray-800 text-base md:text-lg">Internship CRM</span>
                  <div className="text-gray-600 text-xs md:text-sm">Admin Portal</div>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <SidebarMenu className="space-y-2">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.url}
                    className="group bg-gray-50 hover:bg-gray-100 border border-gray-200 hover:border-gray-300 rounded-xl transition-all duration-300 data-[active=true]:bg-blue-50 data-[active=true]:border-blue-200 data-[active=true]:shadow-sm"
                  >
                    <Link href={item.url} className="flex items-center gap-2 md:gap-3">
                      <div className="p-2 bg-white rounded-lg shadow-sm border border-gray-100">
                        <item.icon className="h-4 w-4 text-gray-700" />
                      </div>
                      <span className="font-medium text-gray-800 text-sm md:text-base">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>

            {/* User Profile */}
            <div className="mt-auto pt-6 border-t border-gray-200">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-3 md:p-4 mb-4 shadow-sm">
                <div className="flex items-center gap-2 md:gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
                      <User className="h-5 w-5 md:h-6 md:w-6 text-white" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-3 h-3 md:w-4 md:h-4 bg-blue-400 rounded-full border-2 border-white animate-pulse"></div>
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900 text-sm md:text-base">Admin User</div>
                    <div className="text-blue-600 text-xs md:text-sm font-medium">Administrator</div>
                    <div className="text-gray-500 text-xs">Online now</div>
                  </div>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 md:gap-3 p-2 md:p-3 text-red-600 hover:bg-red-50 rounded-xl transition-all duration-300 border border-red-200 hover:border-red-300 group"
              >
                <div className="p-2 bg-red-100 rounded-lg group-hover:bg-red-200 transition-colors">
                  <LogOut className="h-4 w-4 text-red-600" />
                </div>
                <span className="font-medium text-sm md:text-base">Logout</span>
              </button>
            </div>
          </SidebarContent>
        </aside>

        {/* Main content area */}
        <div className="flex-1 flex flex-col min-h-screen md:ml-64 w-full min-w-0 bg-white p-0 m-0" style={{ maxWidth: 'calc(100vw - 16rem)' }}>
          <header className="sticky top-0 z-40 flex h-16 items-center gap-2 border-b border-gray-200 px-4 md:px-6 bg-white shadow-sm">
            <div className="flex items-center gap-2 md:gap-3">
              {/* Menu button: only visible on mobile/tablet */}
              <button
                className="text-gray-700 hover:bg-gray-100 rounded-xl p-2 transition-all duration-300 border border-gray-200 hover:border-gray-300 md:hidden"
                onClick={() => setSidebarOpen((open) => !open)}
                aria-label="Open sidebar menu"
              >
                <Menu className="h-5 w-5" />
              </button>
              <span className="text-gray-700 font-medium text-sm md:text-base">Menu</span>
            </div>
            <div className="ml-auto flex items-center gap-2 md:gap-4">
              <div className="text-right hidden sm:block">
                <div className="text-gray-800 text-xs md:text-sm font-medium">Welcome back!</div>
                <div className="text-gray-600 text-xs">Admin Dashboard</div>
              </div>
              <div className="flex items-center gap-1 md:gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                {/* Notification bell for admin */}
                <span>
                  {/* @ts-ignore-next-line: NotificationBell is client-side */}
                  <NotificationBell adminId={1} />
                </span>
              </div>
            </div>
          </header>

          <main className="flex-1 overflow-auto">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  )
}