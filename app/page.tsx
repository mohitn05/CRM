"use client"
import { Button } from "@/components/ui/button"
import { ArrowRight, GraduationCap, Mail, Phone, Users } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

export default function LandingPage() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
      {/* Enhanced Geometric Wave Background */}
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
          </defs>

          {/* Top flowing wave */}
          <path d="M0,150 Q200,50 400,120 T800,100 Q1000,80 1200,140 L1200,0 L0,0 Z" fill="url(#gradient1)" />

          {/* Second wave layer */}
          <path d="M0,250 Q300,150 600,220 T1200,200 L1200,0 L0,0 Z" fill="url(#gradient2)" opacity="0.8" />

          {/* Bottom flowing wave */}
          <path d="M0,600 Q400,500 800,580 T1200,560 L1200,800 L0,800 Z" fill="url(#gradient3)" opacity="0.7" />
        </svg>
      </div>

      {/* Floating geometric shapes with enhanced animations */}
      <div className="absolute inset-0 z-0 overflow-hidden hidden md:block">
        {/* Floating circles with pulse and bounce */}
        <div className={`absolute top-20 left-10 w-32 h-32 bg-blue-200/10 rounded-full blur-xl ${isMounted ? 'animate-pulse' : ''}`}></div>
        <div className={`absolute top-40 right-20 w-24 h-24 bg-indigo-300/15 rounded-full blur-lg ${isMounted ? 'animate-bounce' : ''}`} style={{ animationDelay: "1s" }}></div>
        <div className={`absolute bottom-32 left-1/4 w-40 h-40 bg-blue-100/20 rounded-full blur-2xl ${isMounted ? 'animate-pulse' : ''}`} style={{ animationDelay: "2s" }}></div>
        <div className={`absolute bottom-20 right-1/3 w-28 h-28 bg-indigo-200/12 rounded-full blur-xl ${isMounted ? 'animate-bounce' : ''}`} style={{ animationDelay: "0.5s" }}></div>
        {/* Extra animated circles for more randomness */}
        <div className="absolute top-10 right-1/4 w-16 h-16 bg-purple-200/20 rounded-full blur-2xl animate-pulse" style={{ animationDelay: "1.5s" }}></div>
        <div className="absolute bottom-10 left-1/5 w-24 h-24 bg-pink-200/20 rounded-full blur-2xl animate-bounce" style={{ animationDelay: "2.5s" }}></div>
        <div className="absolute top-1/2 left-1/2 w-20 h-20 bg-green-200/20 rounded-full blur-xl animate-pulse" style={{ animationDelay: "2.2s" }}></div>
        <div className="absolute top-1/3 right-1/5 w-28 h-28 bg-blue-300/20 rounded-full blur-2xl animate-bounce" style={{ animationDelay: "1.8s" }}></div>
        <div className="absolute bottom-1/4 right-1/6 w-14 h-14 bg-indigo-200/20 rounded-full blur-xl animate-pulse" style={{ animationDelay: "2.8s" }}></div>
      </div>

      {/* HEADER - updated */}
      <header className="relative z-30 flex items-center justify-between p-6">
        {/* Left: Logo + Name (gradient) */}
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-blue-600 via-purple-500 to-purple-700 text-white p-2.5 rounded-xl shadow-lg">
            <GraduationCap className="w-7 h-7" />
          </div>
          <span className="text-2xl font-extrabold bg-gradient-to-r from-blue-700 via-purple-600 to-purple-800 bg-clip-text text-transparent">
            InternPro CRM
          </span>
        </div>
        {/* Right: Buttons (gradient, modern) */}
        <div className="flex items-center gap-4">
          <Link href="/intern/login">
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl px-6 py-2 font-semibold shadow-md hover:shadow-lg transition-all duration-300">
              Login
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <div className="relative z-20 flex flex-col items-center justify-center min-h-[calc(100vh-200px)] px-4 text-center">
        {/* Main Heading with enhanced animation and layout */}
        <div className={`mb-8 transition-all duration-1000 ${isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ minHeight: '200px' }}>
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 via-purple-100 to-purple-200 backdrop-blur-sm border border-white/30 rounded-full px-5 py-2 mb-4 animate-fade-in shadow-md">
            <GraduationCap className="w-6 h-6 text-blue-600 animate-bounce" />
            <span className="text-base font-semibold text-blue-700">Empowering Future Professionals</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold bg-gradient-to-r from-blue-700 via-purple-600 to-purple-800 bg-clip-text text-transparent mb-6 leading-tight animate-fade-in-up drop-shadow-xl">
            Internship CRM Portal
          </h1>
        </div>

        {/* Subheading with enhanced animation and spacing */}
        <p className={`text-lg md:text-xl text-gray-700 max-w-2xl mx-auto mb-10 leading-relaxed font-medium animate-fade-in-up transition-all duration-1000 delay-150 ${isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          Transform your internship program with our comprehensive CRM solution.<br />
          Streamline applications, track progress, and scale your talent pipeline with professional tools.
        </p>

        {/* CTA Button with enhanced animation and gradient */}
        <div className={`transition-all duration-1000 delay-300 ${isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <Link href="/apply">
            <Button className="group bg-gradient-to-r from-blue-600 via-purple-600 to-purple-700 hover:from-blue-700 hover:to-purple-800 text-white px-8 py-4 text-lg font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105">
              Apply Now
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </Button>
          </Link>
        </div>

        {/* Stats Cards - screenshot style */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-4xl mx-auto transition-all duration-1000 delay-500">
          {/* Card 1 */}
          <div className="bg-gradient-to-br from-blue-50 via-indigo-100 to-purple-100 shadow-lg border border-blue-100 rounded-2xl p-8 flex flex-col items-center min-w-[260px] group">
            <div className="bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl p-4 mb-6 flex items-center justify-center">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
            <div className="text-3xl font-extrabold text-blue-600 mb-2">500+</div>
            <div className="text-lg font-semibold text-gray-800 mb-2">Applications Processed</div>
            <div className="w-full h-1 bg-gray-100 rounded-full mt-4 mb-2 relative overflow-hidden">
              <div className="absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 transition-all duration-700 group-hover:w-full w-0" />
            </div>
          </div>
          {/* Card 2 */}
          <div className="bg-gradient-to-br from-blue-50 via-green-50 to-green-100 shadow-lg border border-green-100 rounded-2xl p-8 flex flex-col items-center min-w-[260px] group">
            <div className="bg-gradient-to-br from-green-400 to-green-600 rounded-xl p-4 mb-6 flex items-center justify-center">
              <Users className="w-8 h-8 text-white" />
            </div>
            <div className="text-3xl font-extrabold text-green-600 mb-2">98.5%</div>
            <div className="text-lg font-semibold text-gray-800 mb-2">Success Rate</div>
            <div className="w-full h-1 bg-gray-100 rounded-full mt-4 mb-2 relative overflow-hidden">
              <div className="absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-green-400 via-blue-400 to-green-600 transition-all duration-700 group-hover:w-full w-0" />
            </div>
          </div>
          {/* Card 3 */}
          <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-blue-100 shadow-lg border border-purple-100 rounded-2xl p-8 flex flex-col items-center min-w-[260px] group">
            <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl p-4 mb-6 flex items-center justify-center">
              <ArrowRight className="w-8 h-8 text-white" />
            </div>
            <div className="text-3xl font-extrabold text-purple-600 mb-2">24/7</div>
            <div className="text-lg font-semibold text-gray-800 mb-2">System Uptime</div>
            <div className="w-full h-1 bg-gray-100 rounded-full mt-4 mb-2 relative overflow-hidden">
              <div className="absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 transition-all duration-700 group-hover:w-full w-0" />
            </div>
          </div>
        </div>
        {/* Add extra space before footer */}
        <div className="h-10 md:h-16 lg:h-20" />
      </div>

      {/* FOOTER - enhanced to match screenshot */}
      <footer className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 text-gray-800 py-8 border-t border-white/30">
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col lg:flex-row justify-between items-center lg:items-start gap-8 lg:gap-0">
          {/* Left Section */}
          <div className="flex-1 min-w-[280px] text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start mb-4">
              <div className="bg-gradient-to-br from-blue-600 to-purple-600 text-white p-2.5 rounded-xl mr-3 shadow-md">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-extrabold bg-gradient-to-r from-blue-700 via-purple-600 to-indigo-800 bg-clip-text text-transparent">
                  InternPro <span className="text-purple-600">CRM</span>
                </h1>
                <p className="text-gray-600 text-sm font-medium">Professional Internship Management</p>
              </div>
            </div>
            <p className="text-gray-700 text-base mt-4 mb-6 max-w-lg leading-relaxed mx-auto lg:mx-0">
              Empowering organizations with cutting-edge internship management technology.
            </p>
          </div>
          {/* Right Section - Enhanced Contact Info */}
          <div className="flex-1 min-w-[280px] max-w-md">
            <h2 className="text-xl font-extrabold bg-gradient-to-r from-blue-700 via-purple-600 to-indigo-800 bg-clip-text text-transparent mb-6 text-center lg:text-left">
              Contact Us
            </h2>
            <div className="space-y-4">
              {/* Phone Contact Card */}
              <div className="bg-white/40 backdrop-blur-lg border border-white/40 rounded-xl p-3 shadow-md hover:shadow-lg transition-all duration-300 group">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="bg-gradient-to-br from-green-400 to-emerald-500 text-white p-2 rounded-lg mr-3 shadow-sm">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 text-sm">Call Us</h3>
                      <a href="tel:+919359463350" className="text-blue-600 hover:text-indigo-700 font-bold text-sm transition-colors">
                        +91 93594 63350
                      </a>
                    </div>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <ArrowRight className="w-3 h-3 text-blue-500" />
                  </div>
                </div>
              </div>

              {/* Email Contact Card */}
              <div className="bg-white/40 backdrop-blur-lg border border-white/40 rounded-xl p-3 shadow-md hover:shadow-lg transition-all duration-300 group">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="bg-gradient-to-br from-purple-500 to-indigo-600 text-white p-2 rounded-lg mr-3 shadow-sm">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 text-sm">Email Us</h3>
                      <a
                        href="https://mail.google.com/mail/?view=cm&fs=1&to=info@aartmultiservices.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-indigo-700 font-bold text-sm transition-colors"
                      >
                        info@aartmultiservices.com
                      </a>
                    </div>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <ArrowRight className="w-3 h-3 text-blue-500" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright and Powered By Section - Always at the bottom */}
        <div className="max-w-7xl mx-auto px-4 md:px-8 mt-8 pt-6 border-t border-white/20">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-xs text-center md:text-left">© 2025 InternPro CRM. All rights reserved.</p>
            <p className="text-gray-400 text-[10px] text-center md:text-right">Powered by AartMultiservices Technology Solutions</p>
          </div>
        </div>
      </footer>
    </div>
  );
}