'use client'

import { useState } from 'react'
import { track } from '@/lib/analytics'

export default function FeedbackForm() {
  const [feedback, setFeedback] = useState('')
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Clear any previous errors
    setError('')
    
    if (!feedback.trim()) {
      setError('Feedback is required')
      
      // Track validation error
      track('error', {
        error_message: 'Feedback is required',
        error_type: 'validation',
        page: 'feedback',
      })
      
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ feedback, email }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit feedback')
      }

      // Track the successful submission
      track('feedback_submitted', {
        feedback_length: data.feedbackLength,
        has_email: data.hasEmail,
        email_hash: data.emailHash || undefined,
      })

      setIsSubmitted(true)
      setFeedback('')
      setEmail('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      
      // Track the error
      track('error', {
        error_message: err instanceof Error ? err.message : 'Unknown error',
        error_type: 'feedback_submission',
        page: 'feedback',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleFeedbackFocus = () => {
    track('feedback_opened', {
      source_page: 'feedback',
    })
  }

  const handleFeedbackChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFeedback(e.target.value)
    // Clear error when user starts typing
    if (error) {
      setError('')
    }
  }

  if (isSubmitted) {
    return (
      <div className="max-w-md">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800">
                Thank you for your feedback!
              </h3>
              <div className="mt-2 text-sm text-green-700">
                <p>We've received your feedback and will use it to improve our service.</p>
              </div>
            </div>
          </div>
        </div>
        
        <button
          onClick={() => setIsSubmitted(false)}
          className="text-blue-600 hover:underline text-sm"
        >
          Submit more feedback
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="feedback" className="block text-sm font-medium mb-2">
            Your feedback *
          </label>
          <textarea
            id="feedback"
            name="feedback"
            rows={4}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 text-black placeholder-gray-400 ${
              error ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
            }`}
            placeholder="Tell us what you think..."
            value={feedback}
            onChange={handleFeedbackChange}
            onFocus={handleFeedbackFocus}
            disabled={isSubmitting}
          />
        </div>
        
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-2">
            Email (optional)
          </label>
          <input
            type="email"
            id="email"
            name="email"
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black placeholder-gray-400"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isSubmitting}
          />
          <p className="text-xs text-gray-500 mt-1">
            Email is hashed for analytics privacy
          </p>
        </div>
        
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}
        
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
        </button>
      </form>
    </div>
  )
}