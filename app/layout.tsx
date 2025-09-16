import { Toaster } from "@/components/ui/toaster";
import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import '../styles/enhanced-toasts.css';
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
}