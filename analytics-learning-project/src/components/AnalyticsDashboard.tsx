'use client'

import { useState, useEffect } from 'react'
import SimpleBarChart from './SimpleBarChart'

interface EventCount {
  event: string
  count: number
}

interface RecentEvent {
  event: string
  properties: string
  createdAt: string
  pageUrl: string
}

interface AnalyticsData {
  eventCounts: EventCount[]
  recentEvents: RecentEvent[]
  totalEvents: number
  uniqueSessions: number
}

export default function AnalyticsDashboard() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/analytics/stats')
      if (!response.ok) throw new Error('Failed to fetch analytics')
      
      const analyticsData = await response.json()
      setData(analyticsData)
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
        <p className="text-red-600">Error loading analytics: {error}</p>
        <button 
          onClick={fetchAnalytics}
          className="mt-2 text-red-600 hover:underline text-sm"
        >
          Try again
        </button>
      </div>
    )
  }

  if (!data) return null

  const chartData = data.eventCounts.map(item => ({
    label: item.event.replace(/_/g, ' '),
    value: item.count,
    color: getEventColor(item.event)
  }))

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border rounded-lg p-4">
          <div className="text-2xl font-bold text-blue-600">{data.totalEvents}</div>
          <div className="text-sm text-black">Total Events</div>
        </div>
        <div className="bg-white border rounded-lg p-4">
          <div className="text-2xl font-bold text-green-600">{data.uniqueSessions}</div>
          <div className="text-sm text-black">Unique Sessions</div>
        </div>
        <div className="bg-white border rounded-lg p-4">
          <div className="text-2xl font-bold text-purple-600">{data.eventCounts.length}</div>
          <div className="text-sm text-black">Event Types</div>
        </div>
      </div>

      {/* Event Counts Chart */}
      <SimpleBarChart 
        data={chartData}
        title="Events by Type"
      />

      {/* Recent Events */}
      <div className="bg-white border rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-4 text-black">Recent Events</h3>
        <div className="space-y-2">
          {data.recentEvents.slice(0, 8).map((event, index) => (
            <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
              <div className="flex items-center gap-3">
                <span 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: getEventColor(event.event) }}
                />
                <span 
                  className="font-medium text-sm"
                  style={{ color: getEventColor(event.event) }}
                >
                  {event.event.replace(/_/g, ' ')}
                </span>
                <span className="text-xs text-gray-700">
                  {new Date(event.createdAt).toLocaleTimeString()}
                </span>
              </div>
              <div className="text-xs text-gray-600 max-w-xs truncate">
                {event.pageUrl}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function getEventColor(eventType: string): string {
  const colors: Record<string, string> = {
    'app_open': '#3B82F6',      // Blue
    'page_view': '#10B981',     // Green 
    'feedback_opened': '#F59E0B', // Amber
    'feedback_submitted': '#8B5CF6', // Purple
    'error': '#EF4444'          // Red
  }
  return colors[eventType] || '#6B7280' // Gray fallback
}