import { Button } from "@/components/ui/button"
import { ArrowRight, Mail, Phone } from "lucide-react"
import Link from "next/link"

export default function LandingPage() {
  return (
    // The main container with blue gradient background
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden p-4 sm:p-8">
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

      {/* Header - Z-index increased to z-30 to be on top of all backgrounds */}
      <header className="relative z-30 flex items-center justify-end p-6">
        <div className="flex items-center gap-4">
          <Link href="/intern/login">
            <Button variant="outline" className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6">
              Login
            </Button>
          </Link>
          <Link href="/apply">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6">Register</Button>
          </Link>
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

      {/* Main Content - Z-index increased to z-20 to be on top of all backgrounds */}
      <div className="relative z-20 flex flex-col items-center justify-center min-h-[calc(100vh-200px)] px-4 text-center">
        {/* Main Heading */}
        <h1 className="text-5xl md:text-7xl font-serif font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-6 leading-tight">
          Internship CRM Portal
        </h1>
        {/* Subheading */}
        <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-12 leading-relaxed font-light">
          Transform your internship program with our Internship CRM solution. Streamline applications, track progress,
          and scale your talent pipeline.
        </p>
        {/* CTA Button */}
        <Link href="/apply">
          <Button className="group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-500 transform hover:scale-105">
            Get Started
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
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
              <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                {stat.number}
              </div>
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
                <div className="flex items-center justify-center md:justify-end gap-2 text-gray-600 text-sm hover:text-blue-600 transition-colors">
                  <Phone className="w-4 h-4" />
                  <span>+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center justify-center md:justify-end gap-2 text-gray-600 text-sm hover:text-blue-600 transition-colors">
                  <Mail className="w-4 h-4" />
                  <span>info@aartmultiservices.com</span>
                </div>

              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}