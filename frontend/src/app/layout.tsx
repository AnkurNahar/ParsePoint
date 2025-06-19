import './globals.css'
import type { Metadata } from 'next'
import { ReactNode } from 'react'
import { Toaster } from 'react-hot-toast'

export const metadata: Metadata = {
  title: 'ParsePoint',
  description: 'Extract blog and PDF content with markdown normalization.'
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gradient-to-br from-indigo-50 to-purple-100 min-h-screen text-gray-800 font-sans antialiased">
        <Toaster position="top-right" toastOptions={{ className: 'text-sm font-medium' }} />
        {children}
      </body>
    </html>
  )
}
