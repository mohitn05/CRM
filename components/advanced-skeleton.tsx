"use client"

import { cn } from "@/lib/utils"

interface AdvancedSkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: "page" | "card" | "list" | "text" | "avatar" | "header" | "button" | "input" | "chart"
}

function AdvancedSkeleton({
    className,
    variant = "text",
    ...props
}: AdvancedSkeletonProps) {
    const getVariantClasses = () => {
        switch (variant) {
            case "page":
                return "w-full h-screen"
            case "card":
                return "w-full h-64 rounded-xl"
            case "list":
                return "w-full h-16"
            case "text":
                return "w-full h-4 rounded"
            case "avatar":
                return "w-12 h-12 rounded-full"
            case "header":
                return "w-full h-16"
            case "button":
                return "w-24 h-10 rounded-lg"
            case "input":
                return "w-full h-12 rounded-lg"
            case "chart":
                return "w-full h-64 rounded-xl"
            default:
                return "w-full h-4 rounded"
        }
    }

    return (
        <div
            className={cn(
                "animate-pulse rounded-md bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%]",
                getVariantClasses(),
                className
            )}
            style={{
                animation: "shimmer 2s infinite linear",
            }}
            {...props}
        />
    )
}

export { AdvancedSkeleton }
