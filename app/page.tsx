"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, GraduationCap, Mail, Phone, User } from "lucide-react"
import Link from "next/link"

export default function LandingPage() {
  return (
    // The main container with blue gradient background
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
      {/* Enhanced Geometric Wave Background SVG - Lowest Z-index (z-0) */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <svg
          className="absolute top-0 left-0 w-full h-full"
          viewBox="0 0 1200 800"
          preserveAspectRatio="none"
          fill="none"
        >
          <defs>
            <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.15" />
              <stop offset="50%" stopColor="#1d4ed8" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#1e40af" stopOpacity="0.05" />
            </linearGradient>
            <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.12" />
              <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#1d4ed8" stopOpacity="0.04" />
            </linearGradient>
            <linearGradient id="gradient3" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#93c5fd" stopOpacity="0.1" />
              <stop offset="50%" stopColor="#60a5fa" stopOpacity="0.06" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.03" />
            </linearGradient>
            <linearGradient id="gradient4" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#dbeafe" stopOpacity="0.08" />
              <stop offset="50%" stopColor="#93c5fd" stopOpacity="0.05" />
              <stop offset="100%" stopColor="#60a5fa" stopOpacity="0.02" />
            </linearGradient>
          </defs>

          {/* Top flowing wave */}
          <path d="M0,150 Q200,50 400,120 T800,100 Q1000,80 1200,140 L1200,0 L0,0 Z" fill="url(#gradient1)" />

          {/* Second wave layer */}
          <path d="M0,250 Q300,150 600,220 T1200,200 L1200,0 L0,0 Z" fill="url(#gradient2)" opacity="0.8" />

          {/* Middle dynamic wave */}
          <path
            d="M0,400 Q150,320 300,380 Q450,440 600,380 Q750,320 900,380 Q1050,440 1200,380 L1200,800 L0,800 Z"
            fill="url(#gradient3)"
            opacity="0.6"
          />

          {/* Bottom flowing wave */}
          <path d="M0,600 Q400,500 800,580 T1200,560 L1200,800 L0,800 Z" fill="url(#gradient4)" opacity="0.7" />

          {/* Additional decorative curves */}
          <path d="M0,300 Q600,200 1200,280" stroke="url(#gradient1)" strokeWidth="2" fill="none" opacity="0.3" />
          <path
            d="M0,500 Q400,420 800,480 Q1000,520 1200,480"
            stroke="url(#gradient2)"
            strokeWidth="1.5"
            fill="none"
            opacity="0.4"
          />
        </svg>
      </div>

      {/* Moving geometric shapes */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {/* Floating circles with pulse */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-200/10 rounded-full blur-xl animate-pulse"></div>
        <div
          className="absolute top-40 right-20 w-24 h-24 bg-indigo-300/15 rounded-full blur-lg animate-bounce"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute bottom-32 left-1/4 w-40 h-40 bg-blue-100/20 rounded-full blur-2xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute bottom-20 right-1/3 w-28 h-28 bg-indigo-200/12 rounded-full blur-xl animate-bounce"
          style={{ animationDelay: "0.5s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 w-36 h-36 bg-blue-300/8 rounded-full blur-2xl animate-pulse"
          style={{ animationDelay: "1.5s" }}
        ></div>

        {/* Moving geometric shapes with random paths */}
        <div
          className="absolute top-16 -left-16 w-16 h-16 bg-blue-400/20 rotate-45 animate-spin"
          style={{ animation: "moveRandom1 20s linear infinite" }}
        ></div>
        <div
          className="absolute top-32 -left-20 w-12 h-12 bg-indigo-500/15 rounded-full"
          style={{ animation: "moveRandom2 25s linear infinite", animationDelay: "3s" }}
        ></div>
        <div
          className="absolute top-48 -left-12 w-8 h-8 bg-blue-300/25"
          style={{ animation: "moveRandom3 18s linear infinite", animationDelay: "6s" }}
        ></div>

        <div
          className="absolute bottom-16 -right-16 w-20 h-20 bg-indigo-400/18 rotate-45"
          style={{ animation: "moveRandom4 22s linear infinite" }}
        ></div>
        <div
          className="absolute bottom-32 -right-24 w-14 h-14 bg-blue-500/12 rounded-full"
          style={{ animation: "moveRandom5 28s linear infinite", animationDelay: "4s" }}
        ></div>
        <div
          className="absolute bottom-48 -right-10 w-10 h-10 bg-indigo-300/20"
          style={{ animation: "moveRandom6 16s linear infinite", animationDelay: "7s" }}
        ></div>

        {/* Diagonal moving shapes with random paths */}
        <div
          className="absolute -top-8 left-1/4 w-6 h-6 bg-blue-600/15 rotate-45"
          style={{ animation: "moveRandom7 30s linear infinite" }}
        ></div>
        <div
          className="absolute -top-12 left-1/2 w-8 h-8 bg-indigo-400/20 rounded-full"
          style={{ animation: "moveRandom8 35s linear infinite", animationDelay: "5s" }}
        ></div>
        <div
          className="absolute -top-6 right-1/4 w-4 h-4 bg-blue-500/25"
          style={{ animation: "moveRandom1 25s linear infinite", animationDelay: "8s" }}
        ></div>

        {/* Floating triangles with random movement */}
        <div
          className="absolute top-1/3 -left-8 w-0 h-0 border-l-[8px] border-r-[8px] border-b-[14px] border-l-transparent border-r-transparent border-b-blue-400/20"
          style={{ animation: "moveRandom2 24s linear infinite", animationDelay: "2s" }}
        ></div>
        <div
          className="absolute top-2/3 -right-8 w-0 h-0 border-l-[10px] border-r-[10px] border-b-[18px] border-l-transparent border-r-transparent border-b-indigo-500/15"
          style={{ animation: "moveRandom3 26s linear infinite", animationDelay: "9s" }}
        ></div>
      </div>

      {/* NEW: Floating Geometric Shapes for the wave background - Also z-0 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-20 right-20 w-16 h-16 border-2 border-blue-200 rotate-45"></div>
        <div className="absolute top-1/3 left-10 w-8 h-8 bg-blue-100 rounded-full"></div>
        <div className="absolute bottom-1/4 right-1/3 w-12 h-12 border-2 border-indigo-200 rounded-full"></div>
        <div className="absolute bottom-20 left-1/4 w-6 h-6 bg-blue-100 rotate-45"></div>
      </div>

      {/* Enhanced Professional Header with Company Branding */}
      <header className="relative z-30 bg-white/10 backdrop-blur-xl border-b border-white/20 shadow-lg">
        <div className="w-full px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Company Logo & Brand */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl transform hover:scale-110 transition-transform duration-300">
                  <GraduationCap className="w-7 h-7 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-pulse"></div>
              </div>
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-800 via-blue-700 to-purple-700 bg-clip-text text-transparent">
                  InternPro CRM
                </h2>
                <p className="text-sm text-gray-600 font-medium">Professional Internship Management</p>
              </div>
            </div>

            {/* Navigation & Action Buttons */}
            <div className="flex items-center gap-6">
              {/* Professional Navigation Menu */}
              <nav className="hidden md:flex items-center gap-8">
                <a href="#contact" className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-300 relative group">
                  Contact
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
                </a>
              </nav>

              {/* Enhanced Action Buttons */}
              <div className="flex items-center gap-3">
                <Link href="/intern/login">
                  <Button
                    variant="outline"
                    className="group relative overflow-hidden bg-white/20 backdrop-blur-md hover:bg-white/30 text-gray-700 hover:text-blue-700 border border-white/40 hover:border-blue-400/60 rounded-2xl px-6 py-3 font-semibold shadow-lg hover:shadow-xl transition-all duration-500 transform hover:scale-105"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/10 to-blue-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                    <div className="relative flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <span>Login</span>
                    </div>
                  </Button>
                </Link>
                <Link href="/apply">
                  <Button className="group relative overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white rounded-2xl px-8 py-3 font-bold shadow-xl hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-500 transform hover:scale-105 border border-white/20">
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                    <div className="relative flex items-center gap-2">
                      <GraduationCap className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                      <span>Apply Now</span>
                    </div>
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ORIGINAL: Background Decorative Elements - Z-index set to z-10 to be on top of waves */}
      <div className="absolute inset-0 overflow-hidden z-10">
        {/* Large Circles */}
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-blue-200/30 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-indigo-200/20 rounded-full blur-3xl"></div>
        {/* Dotted Pattern */}
        <div className="absolute top-20 right-20 grid grid-cols-8 gap-3 opacity-40">
          {Array.from({ length: 64 }).map((_, i) => (
            <div key={i} className="w-2 h-2 bg-blue-400 rounded-full"></div>
          ))}
        </div>
        {/* Bottom Left Dotted Pattern */}
        <div className="absolute bottom-32 left-20 grid grid-cols-6 gap-2 opacity-30">
          {Array.from({ length: 36 }).map((_, i) => (
            <div key={i} className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></div>
          ))}
        </div>
        {/* Curved Shapes */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-gradient-to-br from-blue-300/20 to-transparent rounded-full transform -translate-x-32 -translate-y-32"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-tl from-indigo-300/15 to-transparent rounded-full transform translate-x-40 translate-y-40"></div>
      </div>

      {/* Enhanced Professional Hero Section */}
      <div className="relative z-20 flex flex-col items-center justify-center min-h-[calc(100vh-200px)] px-6 text-center">
        {/* Enhanced Main Heading with Professional Typography */}
        <div className="max-w-5xl mx-auto mb-8">
          <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-6 leading-tight tracking-tight">
            Professional
          </h1>
          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-8 leading-tight">
            Internship CRM Platform
          </h1>
        </div>

        {/* Enhanced Value Proposition */}
        <div className="max-w-4xl mx-auto mb-12">
          <p className="text-xl md:text-2xl text-gray-700 leading-relaxed font-medium mb-6">
            Transform your internship program with enterprise-grade CRM technology.
          </p>
          <p className="text-lg md:text-xl text-gray-600 leading-relaxed font-light">
            Streamline applications, automate workflows, track progress, and scale your talent pipeline with advanced analytics and reporting.
          </p>
        </div>

        {/* Professional CTA Section */}
        <div className="flex justify-center mb-16">
          <Link href="/apply">
            <Button className="group relative overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white px-12 py-6 text-xl font-bold rounded-3xl shadow-2xl hover:shadow-3xl hover:shadow-blue-500/30 transition-all duration-700 transform hover:scale-110 border-2 border-white/20">
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1200"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative flex items-center gap-3">
                <GraduationCap className="w-7 h-7 group-hover:rotate-12 transition-transform duration-500" />
                <span>Start Your Journey</span>
                <ArrowRight className="w-6 h-6 group-hover:translate-x-2 group-hover:scale-110 transition-all duration-500" />
              </div>
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl blur opacity-20 group-hover:opacity-40 transition-opacity duration-500 -z-10"></div>
            </Button>
          </Link>
        </div>
        {/* Professional Stats & Achievements Section */}
        <div className="w-full max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { number: "500+", label: "Applications Processed", icon: <GraduationCap className="w-8 h-8" />, color: "from-blue-500 to-indigo-600" },
              { number: "98.5%", label: "Success Rate", icon: <User className="w-8 h-8" />, color: "from-green-500 to-emerald-600" },
              { number: "24/7", label: "System Uptime", icon: <ArrowRight className="w-8 h-8" />, color: "from-purple-500 to-pink-600" },
            ].map((stat, index) => (
              <div key={index} className="group relative">
                <div className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:bg-white/30">
                  <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-3xl" style={{ background: `linear-gradient(135deg, var(--tw-gradient-stops))` }}></div>

                  {/* Icon */}
                  <div className="relative mb-6">
                    <div className={`inline-flex p-4 bg-gradient-to-r ${stat.color} rounded-2xl text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      {stat.icon}
                    </div>
                  </div>

                  {/* Number */}
                  <div className={`text-4xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-3 group-hover:scale-110 transition-transform duration-300`}>
                    {stat.number}
                  </div>

                  {/* Label */}
                  <div className="text-gray-700 font-semibold text-lg leading-tight">
                    {stat.label}
                  </div>

                  {/* Animated Progress Bar */}
                  <div className="mt-4 h-1 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${stat.color} rounded-full transform translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-1000`}
                      style={{ animationDelay: `${index * 0.2}s` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>


        </div>
      </div>

      {/* Spacer Section */}
      <div className="relative z-20 py-8"></div>

      {/* Enhanced Professional Footer */}
      <footer className="relative z-30 bg-white/15 backdrop-blur-xl border-t border-white/30 py-6" id="contact">
        <div className="w-full px-6">
          <div className="max-w-7xl mx-auto">
            {/* Main Footer Content - Three Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-4">

              {/* Left Section - Company Info */}
              <div className="text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start gap-3 mb-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl">
                    <GraduationCap className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold bg-gradient-to-r from-gray-800 via-blue-700 to-purple-700 bg-clip-text text-transparent">
                      InternPro CRM
                    </h3>
                    <p className="text-xs text-gray-600 font-medium">Professional Internship Management</p>
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed font-medium max-w-sm mx-auto lg:mx-0 text-sm">
                  Empowering organizations with cutting-edge internship management technology.
                </p>
              </div>

              {/* Center Section - Empty for elegant spacing */}
              <div className="hidden lg:block"></div>

              {/* Right Section - Contact Information */}
              <div className="text-center lg:text-right">
                <h4 className="text-lg font-bold text-gray-800 mb-3">Contact Us</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-center lg:justify-end gap-2 group cursor-pointer" onClick={() => window.open("tel:+919359463350")}>
                    <div className="order-2 lg:order-1">
                      <p className="text-xs text-gray-500 font-medium">Call us directly</p>
                      <p className="text-gray-700 font-semibold group-hover:text-blue-600 transition-colors duration-300 text-sm">+91 93594 63350</p>
                    </div>
                    <div className="order-1 lg:order-2 p-2 bg-gradient-to-r from-green-500 to-blue-600 rounded-xl text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <Phone className="w-4 h-4" />
                    </div>
                  </div>

                  <div className="flex items-center justify-center lg:justify-end gap-2 group cursor-pointer" onClick={() => window.open("mailto:info@aartmultiservices.com")}>
                    <div className="order-2 lg:order-1">
                      <p className="text-xs text-gray-500 font-medium">Email support</p>
                      <p className="text-gray-700 font-semibold group-hover:text-blue-600 transition-colors duration-300 text-sm">info@aartmultiservices.com</p>
                    </div>
                    <div className="order-1 lg:order-2 p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <Mail className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Footer */}
            <div className="border-t border-white/20 pt-4">
              <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
                {/* Left - Copyright */}
                <div className="text-center lg:text-left">
                  <p className="text-gray-600 font-medium">
                    © {new Date().getFullYear()} InternPro CRM. All rights reserved.
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Powered by AartMultiservices Technology Solutions
                  </p>
                </div>

                {/* Right - Legal Links */}
                <div className="flex items-center gap-4">
                  <a href="#" className="text-gray-600 hover:text-blue-600 text-xs font-medium transition-colors duration-300 hover:underline">Privacy Policy</a>
                  <a href="#" className="text-gray-600 hover:text-blue-600 text-xs font-medium transition-colors duration-300 hover:underline">Terms of Service</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}