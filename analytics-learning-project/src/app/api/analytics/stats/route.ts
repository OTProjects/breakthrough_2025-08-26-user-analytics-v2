import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    // Get event counts by type
    const eventCounts = await db.analyticsEvent.groupBy({
      by: ['event'],
      _count: {
        event: true,
      },
      orderBy: {
        _count: {
          event: 'desc',
        },
      },
    })

    // Get events over time (last 7 days)
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    const eventsOverTime = await db.analyticsEvent.findMany({
      where: {
        createdAt: {
          gte: sevenDaysAgo,
        },
      },
      select: {
        event: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    })

    // Get recent events with details
    const recentEvents = await db.analyticsEvent.findMany({
      take: 10,
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        event: true,
        properties: true,
        createdAt: true,
        pageUrl: true,
      },
    })

    // Get session count (unique sessions)
    const sessionCount = await db.analyticsEvent.groupBy({
      by: ['sessionId'],
      _count: {
        sessionId: true,
      },
    })

    // Calculate total events
    const totalEvents = await db.analyticsEvent.count()

    return NextResponse.json({
      eventCounts: eventCounts.map(item => ({
        event: item.event,
        count: item._count.event,
      })),
      eventsOverTime,
      recentEvents,
      totalEvents,
      uniqueSessions: sessionCount.length,
    })
  } catch (error) {
    console.error('Failed to fetch analytics stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics stats' },
      { status: 500 }
    )
  }
}