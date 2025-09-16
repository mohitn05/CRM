"use client"

import { AdvancedSkeleton } from "@/components/advanced-skeleton"
import { GraduationCap } from "lucide-react"

export function GlobalLoading() {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
            {/* Background decorative elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -left-40 w-80 h-80 bg-blue-200/30 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-indigo-200/20 rounded-full blur-3xl"></div>
            </div>

            <div className="relative z-10 flex flex-col items-center">
                {/* Animated logo */}
                <div className="relative mb-8 animate-pulse">
                    <div className="w-24 h-24 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-3xl flex items-center justify-center shadow-2xl">
                        <GraduationCap className="w-12 h-12 text-white" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-400 rounded-full animate-ping" />
                </div>

                {/* Loading text with animated dots */}
                <div className="text-2xl font-bold bg-gradient-to-r from-gray-800 via-blue-700 to-purple-700 bg-clip-text text-transparent mb-12">
                    Loading your experience
                    <span className="inline-flex">
                        <span className="animate-pulse">.</span>
                        <span className="animate-pulse delay-150">.</span>
                        <span className="animate-pulse delay-300">.</span>
                    </span>
                </div>

                {/* Progress bar skeleton */}
                <div className="w-80 mb-8">
                    <AdvancedSkeleton className="w-full h-2 rounded-full" />
                </div>

                {/* Content skeletons */}
                <div className="w-full max-w-md space-y-4">
                    <AdvancedSkeleton className="w-full h-4 rounded" />
                    <AdvancedSkeleton className="w-3/4 h-4 rounded" />
                    <AdvancedSkeleton className="w-5/6 h-4 rounded" />
                    <AdvancedSkeleton className="w-2/3 h-4 rounded" />
                </div>
            </div>
        </div>
    )
}