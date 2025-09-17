"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Award, GraduationCap, Mail, Phone, TrendingUp, Users } from "lucide-react"
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
        {/* Floating circles with pulse */}
        <div className={`absolute top-20 left-10 w-32 h-32 bg-blue-200/10 rounded-full blur-xl ${isMounted ? 'animate-pulse' : ''}`}></div>
        <div
          className={`absolute top-40 right-20 w-24 h-24 bg-indigo-300/15 rounded-full blur-lg ${isMounted ? 'animate-bounce' : ''}`}
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className={`absolute bottom-32 left-1/4 w-40 h-40 bg-blue-100/20 rounded-full blur-2xl ${isMounted ? 'animate-pulse' : ''}`}
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className={`absolute bottom-20 right-1/3 w-28 h-28 bg-indigo-200/12 rounded-full blur-xl ${isMounted ? 'animate-bounce' : ''}`}
          style={{ animationDelay: "0.5s" }}
        ></div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden z-10">
        {/* Large Circles */}
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-blue-200/30 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-indigo-200/20 rounded-full blur-3xl"></div>
        {/* Dotted Pattern */}
        <div className="absolute top-20 right-20 grid grid-cols-8 gap-3 opacity-40 hidden md:block">
          {Array.from({ length: 64 }).map((_, i) => (
            <div key={i} className="w-2 h-2 bg-blue-400 rounded-full"></div>
          ))}
        </div>
        {/* Bottom Left Dotted Pattern */}
        <div className="absolute bottom-32 left-20 grid grid-cols-6 gap-2 opacity-30 hidden md:block">
          {Array.from({ length: 36 }).map((_, i) => (
            <div key={i} className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></div>
          ))}
        </div>
        {/* Curved Shapes */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-gradient-to-br from-blue-300/20 to-transparent rounded-full transform -translate-x-32 -translate-y-32"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-tl from-indigo-300/15 to-transparent rounded-full transform translate-x-40 translate-y-40"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-20 flex flex-col items-center justify-center min-h-[calc(100vh-200px)] px-4 text-center">
        {/* Main Heading with enhanced animation */}
        <div className={`mb-6 transition-all duration-1000 ${isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-4 py-2 mb-4 animate-fade-in">
            <GraduationCap className="w-5 h-5 text-blue-600 animate-bounce" />
            <span className="text-sm font-medium text-gray-700">Empowering Future Professionals</span>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-6xl font-serif font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-6 leading-tight animate-fade-in-up">
            Internship CRM Portal
          </h1>
        </div>

        {/* Subheading with enhanced animation */}
        <p className={`text-base md:text-lg text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed font-light animate-fade-in-up transition-all duration-1000 delay-150 ${isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          Transform your internship program with our comprehensive CRM solution. Streamline applications, track progress,
          and scale your talent pipeline with professional tools.
        </p>

        {/* CTA Button with enhanced animation */}
        <Link href="/apply">
          <Button className={`group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 md:px-8 md:py-4 text-base md:text-lg font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-500 transform hover:scale-105 animate-fade-in-up transition-all duration-1000 delay-300 ${isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            Get Started
            <ArrowRight className="ml-2 w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform duration-300" />
          </Button>
        </Link>

        {/* Stats or Features with enhanced animation */}
        <div className={`mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto transition-all duration-1000 delay-500 ${isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {[
            {
              icon: Users,
              number: "500+",
              label: "Applications Processed",
              description: "Students successfully matched with internships"
            },
            {
              icon: TrendingUp,
              number: "95%",
              label: "Success Rate",
              description: "Of students completing their internship programs"
            },
            {
              icon: Award,
              number: "24/7",
              label: "System Uptime",
              description: "Reliable platform for continuous learning"
            },
          ].map((stat, index) => (
            <div key={index} className="bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl p-5 md:p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group">
              <div className="flex justify-center mb-4">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                  <stat.icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </div>
              </div>
              <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                {stat.number}
              </div>
              <div className="text-gray-800 font-semibold mb-2">{stat.label}</div>
              <div className="text-gray-600 text-sm">{stat.description}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#f5f7ff] text-gray-800 py-12">
        <div className="container mx-auto px-4 md:px-6 flex flex-col md:flex-row justify-between items-center">
          {/* Left Section */}
          <div className="mb-8 md:mb-0 md:w-1/2">
            {/* Logo and Title */}
            <div className="flex items-center mb-4">
              <div className="bg-purple-600 text-white p-3 rounded-md mr-4">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">
                  <span className="text-gray-800">InternPro</span> <span className="text-purple-600">CRM</span>
                </h1>
                <p className="text-gray-500 text-sm">Professional Internship Management</p>
              </div>
            </div>
            {/* Tagline */}
            <p className="text-gray-600 mt-4">
              Empowering organizations with cutting-edge internship management technology.
            </p>
          </div>

          {/* Right Section */}
          <div className="md:w-1/2 text-right">
            <h2 className="text-xl font-bold mb-4">Contact Us</h2>
            <div className="flex items-center mb-4 justify-end">
              <p className="mr-4">Call us directly</p>
              <a href="tel:+919359463350" className="flex items-center">
                <span className="text-lg font-semibold">+91 93594 63350</span>
                <div className="bg-green-500 text-white p-3 ml-2 rounded-md">
                  <Phone className="w-6 h-6" />
                </div>
              </a>
            </div>
            <div className="flex items-center justify-end">
              <p className="mr-4">Email support</p>
              <a href="mailto:info@aartmultiservices.com" className="flex items-center">
                <span className="text-lg font-semibold">info@aartmultiservices.com</span>
                <div className="bg-purple-600 text-white p-3 ml-2 rounded-md">
                  <Mail className="w-6 h-6" />
                </div>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}