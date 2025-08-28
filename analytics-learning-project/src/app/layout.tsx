import type { Metadata } from 'next'
import AnalyticsViewer from '@/components/AnalyticsViewer'
import './globals.css'

export const metadata: Metadata = {
  title: 'Analytics Learning Project',
  description: 'Learning analytics, feedback, and data interpretation',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <nav className="border-b bg-gray-50 px-4 py-3">
          <div className="flex items-center gap-6">
            <h1 className="font-semibold text-gray-900">Analytics Learning</h1>
            <div className="flex gap-4">
              <a href="/" className="text-blue-600 hover:underline">Home</a>
              <a href="/feedback" className="text-blue-600 hover:underline">Feedback</a>
              <a href="/dashboard" className="text-blue-600 hover:underline">Dashboard</a>
            </div>
          </div>
        </nav>
        <main className="container mx-auto px-4 py-8">
          {children}
        </main>
        <AnalyticsViewer />
      </body>
    </html>
  )
}