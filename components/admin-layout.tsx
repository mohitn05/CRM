"use client"

import {
  Sidebar,
  SidebarContent,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { useToast } from "@/hooks/use-toast"
import { Building2, LayoutDashboard, LogOut, Menu, User, Users } from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import type React from "react"

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

  const handleLogout = () => {
    localStorage.removeItem("adminAuth")
    toast({
      title: "Logged Out Successfully ✅",
      description: "Thank you for using our platform!",
    })
    router.push("/")
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-gray-50">
        <Sidebar className="bg-white border-r border-gray-200 shadow-sm">
          <SidebarContent className="p-6">
            {/* Header */}
            <div className="border-b border-gray-200 pb-6 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Building2 className="h-6 w-6 text-white" />
                </div>
                <div>
                  <span className="font-bold text-lg text-gray-800">Internship CRM</span>
                  <div className="text-gray-600 text-sm">Admin Portal</div>
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
                    className="group bg-gray-50 hover:bg-gray-100 border border-gray-200 hover:border-gray-300 rounded-xl p-4 transition-all duration-300 data-[active=true]:bg-blue-50 data-[active=true]:border-blue-200 data-[active=true]:shadow-sm"
                  >
                    <Link href={item.url} className="flex items-center gap-3">
                      <div className="p-2 bg-white rounded-lg shadow-sm border border-gray-100">
                        <item.icon className="h-4 w-4 text-gray-700" />
                      </div>
                      <span className="font-medium text-gray-800">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>

            {/* User Profile */}
            <div className="mt-auto pt-6 border-t border-gray-200">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4 mb-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
                      <User className="h-6 w-6 text-white" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900 text-base">Admin User</div>
                    <div className="text-blue-600 text-sm font-medium">Administrator</div>
                    <div className="text-gray-500 text-xs">Online now</div>
                  </div>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 p-3 text-red-600 hover:bg-red-50 rounded-xl transition-all duration-300 border border-red-200 hover:border-red-300 group"
              >
                <div className="p-2 bg-red-100 rounded-lg group-hover:bg-red-200 transition-colors">
                  <LogOut className="h-4 w-4 text-red-600" />
                </div>
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </SidebarContent>
        </Sidebar>

        <SidebarInset className="bg-gray-50 flex-1">
          <header className="sticky top-0 z-40 flex h-16 items-center gap-2 border-b border-gray-200 px-6 bg-white shadow-sm">
            <div className="flex items-center gap-3">
              <SidebarTrigger className="text-gray-700 hover:bg-gray-100 rounded-xl p-2 transition-all duration-300 border border-gray-200 hover:border-gray-300">
                <Menu className="h-5 w-5" />
              </SidebarTrigger>
              <span className="text-gray-700 font-medium">Menu</span>
            </div>
            <div className="ml-auto flex items-center gap-4">
              <div className="text-right">
                <div className="text-gray-800 text-sm font-medium">Welcome back!</div>
                <div className="text-gray-600 text-xs">Admin Dashboard</div>
              </div>
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            </div>
          </header>

          <main className="flex-1 overflow-auto">{children}</main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}