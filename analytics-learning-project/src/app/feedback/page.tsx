import PageTracker from '@/components/PageTracker'
import FeedbackForm from '@/components/FeedbackForm'

export default function Feedback() {
  return (
    <div>
      <PageTracker pageTitle="Feedback" />
      <h1 className="text-2xl font-bold mb-4">Feedback</h1>
      <p className="text-white mb-6">
        Share your thoughts with us! Your feedback is saved to the database and tracked in analytics.
      </p>
      
      <FeedbackForm />
    </div>
  )
}