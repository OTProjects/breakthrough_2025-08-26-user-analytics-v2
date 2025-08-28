'use client'

import { useState, useEffect } from 'react'
import { getTracker, AnalyticsEvent } from '@/lib/analytics'

export default function AnalyticsViewer() {
  const [events, setEvents] = useState<AnalyticsEvent[]>([])
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setEvents(getTracker().getStoredEvents())
    }, 1000)
    
    return () => clearInterval(interval)
  }, [])

  const clearEvents = () => {
    getTracker().clearEvents()
    setEvents([])
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-purple-600 text-white px-3 py-2 rounded-full shadow-lg hover:bg-purple-700 text-sm"
      >
        📊 Events ({events.length})
      </button>
      
      {isOpen && (
        <div className="absolute bottom-12 right-0 bg-white border rounded-lg shadow-xl w-80 max-h-96 overflow-y-auto">
          <div className="flex justify-between items-center p-3 border-b">
            <h3 className="font-semibold">Analytics Events</h3>
            <div className="flex gap-2">
              <button
                onClick={clearEvents}
                className="text-xs bg-red-500 text-white px-2 py-1 rounded"
              >
                Clear
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="text-xs bg-gray-500 text-white px-2 py-1 rounded"
              >
                ✕
              </button>
            </div>
          </div>
          
          <div className="p-2 space-y-2">
            {events.length === 0 ? (
              <p className="text-gray-500 text-sm">No events yet</p>
            ) : (
              events.slice(-10).reverse().map((event, i) => (
                <div key={i} className="text-xs border rounded p-2">
                  <div className="font-mono font-semibold text-blue-600">
                    {event.event}
                  </div>
                  <div className="text-gray-500">
                    {new Date(event.timestamp).toLocaleTimeString()}
                  </div>
                  <div className="text-gray-600 mt-1">
                    {JSON.stringify(event.properties, null, 1)}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}