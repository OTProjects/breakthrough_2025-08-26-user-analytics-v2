import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { AnalyticsEvent } from '@/lib/analytics'

export async function POST(request: NextRequest) {
  try {
    const event: AnalyticsEvent = await request.json()
    
    await db.analyticsEvent.create({
      data: {
        event: event.event,
        sessionId: event.session_id,
        pageUrl: event.page_url,
        properties: JSON.stringify(event.properties),
        timestamp: new Date(event.timestamp),
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to track event:', error)
    return NextResponse.json(
      { error: 'Failed to track event' },
      { status: 500 }
    )
  }
}