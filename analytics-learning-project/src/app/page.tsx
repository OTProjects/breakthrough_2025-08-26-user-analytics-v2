import PageTracker from '@/components/PageTracker'

export default function Home() {
  return (
    <div className="max-w-2xl">
      <PageTracker pageTitle="Home" />
      <h1 className="text-3xl font-bold mb-4">Analytics Learning Project</h1>
      <p className="text-lg text-white mb-6">
        This project demonstrates three core functionality components:
      </p>
      
      <div className="grid gap-4 mb-8">
        <div className="border rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-2">📊 App Analytics</h2>
          <p className="text-white">
            Track user events and interactions throughout the application
          </p>
        </div>
        
        <div className="border rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-2">💬 User Feedback System</h2>
          <p className="text-white">
            Collect and store user feedback with integrated analytics
          </p>
        </div>
        
        <div className="border rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-2">📈 Data Interpretation</h2>
          <p className="text-white">
            View and analyze collected data through a simple dashboard
          </p>
        </div>
      </div>

      <div className="flex gap-4">
        <a 
          href="/feedback" 
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Try Feedback
        </a>
        <a 
          href="/dashboard" 
          className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
        >
          View Dashboard
        </a>
      </div>
    </div>
  )
}