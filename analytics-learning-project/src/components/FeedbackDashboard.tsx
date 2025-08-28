'use client'

import { useState, useEffect } from 'react'
import SimpleBarChart from './SimpleBarChart'

interface Feedback {
  id: string
  feedback: string
  emailHash: string | null
  createdAt: string
  sentiment: 'positive' | 'negative' | 'neutral'
  positiveScore: number
  negativeScore: number
}

interface SentimentSummary {
  positive: number
  neutral: number
  negative: number
}

interface FeedbackData {
  feedbacks: Feedback[]
  sentimentSummary: SentimentSummary
  totalCount: number
}

export default function FeedbackDashboard() {
  const [data, setData] = useState<FeedbackData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchFeedback()
  }, [])

  const fetchFeedback = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/feedback')
      if (!response.ok) throw new Error('Failed to fetch feedback')
      
      const feedbackData = await response.json()
      setData(feedbackData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-white border rounded-lg p-4">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-300 rounded w-1/4 mb-4"></div>
            <div className="space-y-2">
              <div className="h-3 bg-gray-200 rounded"></div>
              <div className="h-3 bg-gray-200 rounded w-5/6"></div>
              <div className="h-3 bg-gray-200 rounded w-4/6"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-600">Error loading feedback: {error}</p>
        <button 
          onClick={fetchFeedback}
          className="mt-2 text-red-600 hover:underline text-sm"
        >
          Try again
        </button>
      </div>
    )
  }

  if (!data) return null

  const sentimentChartData = [
    { label: '😊 Positive', value: data.sentimentSummary.positive, color: '#10B981' },
    { label: '😐 Neutral', value: data.sentimentSummary.neutral, color: '#F59E0B' },
    { label: '😞 Negative', value: data.sentimentSummary.negative, color: '#EF4444' },
  ]

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return '😊'
      case 'negative': return '😞'
      default: return '😐'
    }
  }

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'text-green-600 bg-green-50'
      case 'negative': return 'text-red-600 bg-red-50'
      default: return 'text-yellow-600 bg-yellow-50'
    }
  }

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border rounded-lg p-4">
          <div className="text-2xl font-bold text-blue-600">{data.totalCount}</div>
          <div className="text-sm text-black">Total Feedback</div>
        </div>
        <div className="bg-white border rounded-lg p-4">
          <div className="text-2xl font-bold text-green-600">{data.sentimentSummary.positive}</div>
          <div className="text-sm text-black">Positive 😊</div>
        </div>
        <div className="bg-white border rounded-lg p-4">
          <div className="text-2xl font-bold text-yellow-600">{data.sentimentSummary.neutral}</div>
          <div className="text-sm text-black">Neutral 😐</div>
        </div>
        <div className="bg-white border rounded-lg p-4">
          <div className="text-2xl font-bold text-red-600">{data.sentimentSummary.negative}</div>
          <div className="text-sm text-black">Negative 😞</div>
        </div>
      </div>

      {/* Sentiment Chart */}
      <SimpleBarChart 
        data={sentimentChartData}
        title="Feedback Sentiment Analysis"
      />

      {/* Recent Feedback */}
      <div className="bg-white border rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-4">Recent Feedback</h3>
        <div className="space-y-4">
          {data.feedbacks.length === 0 ? (
            <p className="text-gray-700 text-center py-4">No feedback received yet</p>
          ) : (
            data.feedbacks.slice(0, 8).map((feedback, index) => (
              <div key={feedback.id} className="border-b border-gray-100 pb-3 last:border-b-0">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <p className="text-gray-800 text-sm mb-1">
                      "{feedback.feedback}"
                    </p>
                    <div className="flex items-center gap-2 text-xs text-gray-700">
                      <span>{new Date(feedback.createdAt).toLocaleDateString()}</span>
                      {feedback.emailHash && (
                        <>
                          <span>•</span>
                          <span>Email provided</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${getSentimentColor(feedback.sentiment)}`}>
                    {getSentimentIcon(feedback.sentiment)} {feedback.sentiment}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Sentiment Analysis Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-800 mb-2">🧠 How Sentiment Analysis Works</h4>
        <div className="text-blue-700 text-sm space-y-2">
          <p><strong>Enhanced Features:</strong></p>
          <ul className="list-disc pl-4 space-y-1">
            <li><strong>Negation Detection:</strong> "not good" → negative (handles context within 2 words)</li>
            <li><strong>Strong Negation Patterns:</strong> "definitely not good" → negative (phrase-level detection)</li>
            <li><strong>Extended Vocabulary:</strong> 25+ positive words, 25+ negative words</li>
            <li><strong>Context Awareness:</strong> Considers word proximity and sentence structure</li>
          </ul>
          <p className="pt-2"><em>Production systems would use transformer models (BERT, RoBERTa) or cloud APIs for even better accuracy.</em></p>
        </div>
      </div>
    </div>
  )
}