"use client"

import * as ToastPrimitives from "@radix-ui/react-toast"
import { cva, type VariantProps } from "class-variance-authority"
import { X } from "lucide-react"
import * as React from "react"

import { cn } from "@/lib/utils"

const ToastProvider = ToastPrimitives.Provider

const ToastViewport = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Viewport>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Viewport>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Viewport
    ref={ref}
    className={cn(
      "fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[480px]",
      className,
    )}
    {...props}
  />
))
ToastViewport.displayName = ToastPrimitives.Viewport.displayName

const toastVariants = cva(
  "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-2xl border-0 p-6 pr-8 shadow-2xl transition-all duration-500 data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full transform hover:scale-105 backdrop-blur-xl",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-r from-blue-500/75 via-indigo-500/75 to-purple-500/75 text-white border-2 border-white/20 shadow-blue-500/30 hover:shadow-2xl hover:shadow-blue-500/40",
        destructive: "bg-gradient-to-r from-red-500/75 via-pink-500/75 to-rose-500/75 text-white border-2 border-white/20 shadow-red-500/30 hover:shadow-2xl hover:shadow-red-500/40",
        success: "bg-gradient-to-r from-emerald-500/75 via-teal-500/75 to-green-500/75 text-white border-2 border-white/20 shadow-emerald-500/30 hover:shadow-2xl hover:shadow-emerald-500/40",
        warning: "bg-gradient-to-r from-yellow-500/75 via-orange-500/75 to-amber-500/75 text-white border-2 border-white/20 shadow-yellow-500/30 hover:shadow-2xl hover:shadow-yellow-500/40",
        info: "bg-gradient-to-r from-cyan-500/75 via-blue-500/75 to-indigo-500/75 text-white border-2 border-white/20 shadow-cyan-500/30 hover:shadow-2xl hover:shadow-cyan-500/40",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
)

const Toast = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Root> & VariantProps<typeof toastVariants>
>(({ className, variant, ...props }, ref) => {
  return (
    <ToastPrimitives.Root
      ref={ref}
      className={cn(toastVariants({ variant }), "relative overflow-hidden", className)}
      {...props}
    >
      {/* Shimmer effect overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 pointer-events-none" />
      {/* Glass morphism overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      {/* Content wrapper */}
      <div className="relative z-10 flex w-full items-center justify-between space-x-4">
        {props.children}
      </div>
      {/* Glow effect */}
      <div className="absolute -inset-1 bg-gradient-to-r opacity-20 group-hover:opacity-40 transition-opacity duration-500 -z-10 blur rounded-2xl"
        style={{
          background: variant === 'destructive' ? 'linear-gradient(to right, rgb(239 68 68), rgb(236 72 153), rgb(244 63 94))' :
            variant === 'success' ? 'linear-gradient(to right, rgb(16 185 129), rgb(20 184 166), rgb(34 197 94))' :
              variant === 'warning' ? 'linear-gradient(to right, rgb(245 158 11), rgb(249 115 22), rgb(251 191 36))' :
                variant === 'info' ? 'linear-gradient(to right, rgb(6 182 212), rgb(59 130 246), rgb(99 102 241))' :
                  'linear-gradient(to right, rgb(59 130 246), rgb(99 102 241), rgb(168 85 247))'
        }} />
    </ToastPrimitives.Root>
  )
})
Toast.displayName = ToastPrimitives.Root.displayName

const ToastAction = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Action>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Action>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Action
    ref={ref}
    className={cn(
      "inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium ring-offset-background transition-colors hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 group-[.destructive]:border-muted/40 group-[.destructive]:hover:border-destructive/30 group-[.destructive]:hover:bg-destructive group-[.destructive]:hover:text-destructive-foreground group-[.destructive]:focus:ring-destructive",
      className,
    )}
    {...props}
  />
))
ToastAction.displayName = ToastPrimitives.Action.displayName

const ToastClose = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Close>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Close>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Close
    ref={ref}
    className={cn(
      "absolute right-2 top-2 rounded-full p-2 text-white/70 opacity-70 transition-all duration-300 hover:text-white hover:opacity-100 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-white/50 group-hover:opacity-100 hover:bg-white/20 hover:scale-110 transform",
      className,
    )}
    toast-close=""
    {...props}
  >
    <X className="h-4 w-4" />
  </ToastPrimitives.Close>
))
ToastClose.displayName = ToastPrimitives.Close.displayName

const ToastTitle = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Title>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Title>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Title
    ref={ref}
    className={cn("text-lg font-bold text-white drop-shadow-sm", className)}
    {...props}
  />
))
ToastTitle.displayName = ToastPrimitives.Title.displayName

const ToastDescription = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Description>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Description>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Description
    ref={ref}
    className={cn("text-sm text-white/90 drop-shadow-sm font-medium", className)}
    {...props}
  />
))
ToastDescription.displayName = ToastPrimitives.Description.displayName

type ToastProps = React.ComponentPropsWithoutRef<typeof Toast>

type ToastActionElement = React.ReactElement<typeof ToastAction>

export {
  Toast, ToastAction, ToastClose, ToastDescription, ToastProvider, ToastTitle, ToastViewport, type ToastActionElement, type ToastProps
}

