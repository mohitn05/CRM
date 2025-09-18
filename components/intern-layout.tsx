"use client"

import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import {
    Bell,
    FileText,
    LayoutDashboard,
    LogOut,
    Menu,
    User,
    X
} from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"

interface InternLayoutProps {
    children: React.ReactNode
}

export function InternLayout({ children }: InternLayoutProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [internData, setInternData] = useState<any>(null)
    const pathname = usePathname()
    const router = useRouter()
    const { toast } = useToast()

    useEffect(() => {
        // Check if user is authenticated
        const authData = localStorage.getItem("internAuth")
        if (!authData) {
            router.push("/intern/login")
            return
        }

        try {
            const parsedData = JSON.parse(authData)
            setInternData(parsedData)
        } catch (error) {
            router.push("/intern/login")
        }
    }, [router])

    const handleLogout = () => {
        localStorage.removeItem("internAuth")
        toast({
            title: "Logged Out",
            description: "You have been successfully logged out.",
        })
        router.push("/intern/login")
    }

    const navigationItems = [
        {
            name: "Dashboard",
            href: "/intern/dashboard",
            icon: LayoutDashboard,
        },
        {
            name: "Profile",
            href: "/intern/profile",
            icon: User,
        },
        {
            name: "Applications",
            href: "/intern/applications",
            icon: FileText,
        },
    ]

    if (!internData) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading your dashboard...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
            {/* Mobile sidebar overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:shadow-none ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
            >
                <div className="flex flex-col h-full">
                    {/* Sidebar header */}
                    <div className="flex items-center justify-between p-6 border-b border-gray-200">
                        <div className="flex items-center gap-3">
                            <div className="bg-gradient-to-br from-blue-500 to-purple-600 text-white p-2 rounded-xl">
                                <User className="h-6 w-6" />
                            </div>
                            <div>
                                <h1 className="text-lg font-bold text-gray-900">Intern Dashboard</h1>
                                <p className="text-sm text-gray-500 truncate">{internData.name}</p>
                            </div>
                        </div>
                        <button
                            className="lg:hidden p-1 rounded-md hover:bg-gray-100"
                            onClick={() => setSidebarOpen(false)}
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-4 py-6">
                        <ul className="space-y-2">
                            {navigationItems.map((item) => {
                                const isActive = pathname === item.href
                                return (
                                    <li key={item.name}>
                                        <Link
                                            href={item.href}
                                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive
                                                    ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md"
                                                    : "text-gray-700 hover:bg-gray-100"
                                                }`}
                                            onClick={() => setSidebarOpen(false)}
                                        >
                                            <item.icon className="h-5 w-5" />
                                            <span className="font-medium">{item.name}</span>
                                        </Link>
                                    </li>
                                )
                            })}
                        </ul>
                    </nav>

                    {/* Logout button */}
                    <div className="p-4 border-t border-gray-200">
                        <Button
                            onClick={handleLogout}
                            className="w-full bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-bold py-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-3"
                        >
                            <LogOut className="h-5 w-5" />
                            Logout
                        </Button>
                    </div>
                </div>
            </aside>

            {/* Main content */}
            <div className="flex-1 flex flex-col lg:ml-0">
                {/* Header */}
                <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-200">
                    <div className="flex items-center justify-between p-4">
                        <div className="flex items-center gap-3">
                            <button
                                className="lg:hidden p-2 rounded-md hover:bg-gray-100"
                                onClick={() => setSidebarOpen(true)}
                            >
                                <Menu className="h-6 w-6" />
                            </button>
                            <h1 className="text-xl font-bold text-gray-900">
                                {navigationItems.find(item => item.href === pathname)?.name || "Dashboard"}
                            </h1>
                        </div>

                        <div className="flex items-center gap-4">
                            <button className="p-2 rounded-full hover:bg-gray-100 relative">
                                <Bell className="h-5 w-5 text-gray-600" />
                                <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
                            </button>

                            <div className="flex items-center gap-2">
                                <div className="bg-gradient-to-br from-blue-500 to-purple-600 text-white p-2 rounded-full">
                                    <User className="h-5 w-5" />
                                </div>
                                <div className="hidden sm:block">
                                    <p className="text-sm font-medium text-gray-900">{internData.name}</p>
                                    <p className="text-xs text-gray-500">{internData.email}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page content */}
                <main className="flex-1 p-4 md:p-6 overflow-auto">
                    {children}
                </main>
            </div>
        </div>
    )
}