import PageTracker from '@/components/PageTracker'
import AnalyticsDashboard from '@/components/AnalyticsDashboard'
import FeedbackDashboard from '@/components/FeedbackDashboard'

export default function Dashboard() {
  return (
    <div>
      <PageTracker pageTitle="Dashboard" />
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Analytics Dashboard</h1>
        <p className="text-black">
          Real-time analytics and feedback analysis from your application data.
        </p>
      </div>
      
      <div className="space-y-8">
        <section>
          <h2 className="text-xl font-semibold mb-4 text-blue-800">📊 Event Analytics</h2>
          <AnalyticsDashboard />
        </section>
        
        <section>
          <h2 className="text-xl font-semibold mb-4 text-green-800">💬 Feedback Analysis</h2>
          <FeedbackDashboard />
        </section>
      </div>
    </div>
  )
}