import { cva, type VariantProps } from "class-variance-authority"
import type * as React from "react"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-2xl border px-4 py-2 text-base font-extrabold transition-all duration-500 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transform hover:scale-105 shadow-lg",
  {
    variants: {
      variant: {
        default: "border-transparent bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:from-blue-600 hover:to-indigo-600",
        secondary: "border-transparent bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 hover:from-gray-200 hover:to-gray-300",
        destructive: "border-transparent bg-gradient-to-r from-rose-500 to-red-500 text-white hover:from-rose-600 hover:to-red-600",
        outline: "text-foreground border-2",
        creative: "border-transparent bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 text-white hover:from-purple-600 hover:via-pink-600 hover:to-rose-600",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
)

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> { }

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
