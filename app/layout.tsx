import { Toaster } from "@/components/ui/toaster";
import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import './globals.css';

export const metadata: Metadata = {
  title: 'Internship CRM Portal',
  description: 'Created with love for interns',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children} <Toaster /> </body>
    </html>
  )
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </div>
        <Toaster />
      </body>
    </html>
  )
}