"use client"

import { ArrowLeft, ArrowRight, GraduationCap } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-mint-50 to-green-50 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-emerald-200/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-green-200/15 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="font-medium">Back</span>
          </Link>
        </div>

        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-12">
            <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-green-600 rounded-3xl mx-auto mb-6 flex items-center justify-center shadow-xl">
              <GraduationCap className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-4xl font-serif font-bold text-gray-800 mb-4">Ready to Start Your Journey?</h2>
            <p className="text-lg text-gray-600 mb-8">
              Join our internship program and kickstart your career in technology
            </p>
          </div>

          <Card className="bg-white/20 backdrop-blur-md border border-white/30 shadow-xl hover:shadow-2xl transition-all duration-300 mb-8">
            <CardContent className="p-8">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Apply for Internship</h3>
                <p className="text-gray-600">Take the first step towards your dream career</p>
              </div>
              <Link href="/apply">
                <Button className="w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-semibold py-4 h-14 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group">
                  Start Application
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  )
}
