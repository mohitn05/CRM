import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Mail, Phone } from "lucide-react"

export default function LandingPage() {
  return (
    // The main container retains its original gradient background
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-mint-50 to-green-50 relative overflow-hidden">
      {/* NEW: Geometric Wave Background SVG - Lowest Z-index (z-0) */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <svg
          className="absolute top-0 left-0 w-full h-full"
          viewBox="0 0 1200 800"
          preserveAspectRatio="none"
          fill="none"
        >
          <defs>
            <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#059669" stopOpacity="0.05" />
            </linearGradient>
            <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#34d399" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.05" />
            </linearGradient>
          </defs>
          {/* First Wave */}
          <path d="M0,200 Q300,100 600,200 T1200,200 L1200,0 L0,0 Z" fill="url(#gradient1)" />
          {/* Second Wave - adjusted to fill the bottom part of the screen */}
          <path d="M0,400 Q400,300 800,400 T1200,400 L1200,800 L0,800 Z" fill="url(#gradient2)" opacity="0.7" />
        </svg>
      </div>

      {/* NEW: Floating Geometric Shapes for the wave background - Also z-0 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-20 right-20 w-16 h-16 border-2 border-green-200 rotate-45"></div>
        <div className="absolute top-1/3 left-10 w-8 h-8 bg-green-100 rounded-full"></div>
        <div className="absolute bottom-1/4 right-1/3 w-12 h-12 border-2 border-emerald-200 rounded-full"></div>
        <div className="absolute bottom-20 left-1/4 w-6 h-6 bg-teal-100 rotate-45"></div>
      </div>

      {/* Header - Z-index increased to z-30 to be on top of all backgrounds */}
      <header className="relative z-30 flex items-center justify-end p-6 bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="flex items-center gap-4">
          <Link href="/intern/login">
            <Button variant="outline" className="bg-white/20 border-white/30 text-gray-700 hover:bg-white/30">
              Login
            </Button>
          </Link>
          <Link href="/apply">
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">Register</Button>
          </Link>
        </div>
      </header>

      {/* ORIGINAL: Background Decorative Elements - Z-index set to z-10 to be on top of waves */}
      <div className="absolute inset-0 overflow-hidden z-10">
        {/* Large Circles */}
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-emerald-200/30 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-green-200/20 rounded-full blur-3xl"></div>
        {/* Dotted Pattern */}
        <div className="absolute top-20 right-20 grid grid-cols-8 gap-3 opacity-40">
          {Array.from({ length: 64 }).map((_, i) => (
            <div key={i} className="w-2 h-2 bg-emerald-400 rounded-full"></div>
          ))}
        </div>
        {/* Bottom Left Dotted Pattern */}
        <div className="absolute bottom-32 left-20 grid grid-cols-6 gap-2 opacity-30">
          {Array.from({ length: 36 }).map((_, i) => (
            <div key={i} className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
          ))}
        </div>
        {/* Curved Shapes */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-gradient-to-br from-emerald-300/20 to-transparent rounded-full transform -translate-x-32 -translate-y-32"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-tl from-green-300/15 to-transparent rounded-full transform translate-x-40 translate-y-40"></div>
      </div>

      {/* Main Content - Z-index increased to z-20 to be on top of all backgrounds */}
      <div className="relative z-20 flex flex-col items-center justify-center min-h-[calc(100vh-200px)] px-4 text-center">
        {/* Main Heading */}
        <h1 className="text-5xl md:text-7xl font-serif font-bold text-gray-800 mb-6 leading-tight">
          Internship CRM Portal
        </h1>
        {/* Subheading */}
        <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-12 leading-relaxed font-light">
          Transform your internship program with our Internship CRM solution. Streamline applications, track progress,
          and scale your talent pipeline.
        </p>
        {/* CTA Button */}
        <Link href="/apply">
          <Button className="group bg-gray-900 hover:bg-gray-800 text-white px-8 py-4 text-lg font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            Get Started
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
        {/* Stats or Features */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {[
            { number: "500+", label: "Applications Processed" },
            { number: "95%", label: "Success Rate" },
            { number: "24/7", label: "System Uptime" },
          ].map((stat, index) => (
            <div key={index} className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-lg">
              <div className="text-3xl font-bold text-emerald-600 mb-2">{stat.number}</div>
              <div className="text-gray-600 text-sm font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
      {/* Footer - Z-index increased to z-30 to be on top of all backgrounds */}
      <footer className="relative z-30 bg-white/10 backdrop-blur-md border-t border-white/20 py-6">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Copyright */}
            <div className="text-center md:text-left">
              <p className="text-gray-600 text-sm">
                © {new Date().getFullYear()} Internship CRM Portal. All rights reserved.
              </p>
            </div>
            {/* Contact Info */}
            <div className="text-center md:text-right">
              <div className="space-y-1">
                <div className="flex items-center justify-center md:justify-end gap-2 text-gray-600 text-sm">
                  <Mail className="w-4 h-4" />
                  <span>contact@internshipcrm.com</span>
                </div>
                <div className="flex items-center justify-center md:justify-end gap-2 text-gray-600 text-sm">
                  <Phone className="w-4 h-4" />
                  <span>+1 (555) 123-4567</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}