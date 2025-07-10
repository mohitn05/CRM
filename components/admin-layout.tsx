"use client"

import type React from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar"
import { LayoutDashboard, Users, LogOut, Building2, User, Menu } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

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
    router.push("/home")
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-gradient-to-br from-emerald-50 via-mint-50 to-green-50">
        <Sidebar className="bg-white/30 backdrop-blur-xl border-r border-white/30 shadow-2xl">
          <SidebarContent className="p-6">
            {/* Header */}
            <div className="border-b border-white/20 pb-6 mb-6">
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
                    className="group bg-white/30 hover:bg-white/50 border border-white/40 hover:border-white/60 rounded-xl p-4 transition-all duration-300 data-[active=true]:bg-emerald-500/20 data-[active=true]:border-emerald-400/50 data-[active=true]:shadow-lg"
                  >
                    <Link href={item.url} className="flex items-center gap-3">
                      <div className="p-2 bg-white/40 rounded-lg shadow-sm group-hover:shadow-md transition-shadow">
                        <item.icon className="h-4 w-4 text-gray-700" />
                      </div>
                      <span className="font-medium text-gray-800">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>

            {/* User Profile */}
            <div className="mt-auto pt-6 border-t border-white/20">
              <div className="bg-white/30 backdrop-blur-sm border border-white/40 rounded-xl p-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
                    <User className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-800 text-sm">Admin User</div>
                    <div className="text-gray-600 text-xs">Administrator</div>
                  </div>
                </div>
              </div>

              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    onClick={handleLogout}
                    className="group bg-red-50/50 hover:bg-red-100/50 border border-red-200/40 hover:border-red-300/60 rounded-xl p-4 transition-all duration-300"
                  >
                    <div className="p-2 bg-red-100/50 rounded-lg shadow-sm group-hover:shadow-md transition-shadow">
                      <LogOut className="h-4 w-4 text-red-600" />
                    </div>
                    <span className="font-medium text-red-700">Logout</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </div>
          </SidebarContent>
        </Sidebar>

        <SidebarInset className="bg-gradient-to-br from-emerald-50 via-mint-50 to-green-50 flex-1">
          <header className="sticky top-0 z-40 flex h-16 items-center gap-2 border-b border-white/30 px-6 bg-white/20 backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <SidebarTrigger className="text-gray-700 hover:bg-white/30 rounded-xl p-2 transition-all duration-300 border border-white/40 hover:border-white/60">
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
