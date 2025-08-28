#!/usr/bin/env tsx

import { PrismaClient } from '@prisma/client'

const db = new PrismaClient()

async function checkDatabase() {
  try {
    console.log('🔍 Checking database contents...\n')
    
    // Check analytics events
    const eventCount = await db.analyticsEvent.count()
    console.log(`📊 Analytics Events: ${eventCount} total`)
    
    if (eventCount > 0) {
      const recentEvents = await db.analyticsEvent.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: {
          event: true,
          properties: true,
          timestamp: true,
          createdAt: true,
        }
      })
      
      console.log('\n📈 Recent Events:')
      recentEvents.forEach((event, i) => {
        console.log(`${i + 1}. ${event.event} - ${event.timestamp}`)
        console.log(`   Properties: ${event.properties}`)
      })
    }
    
    // Check feedback
    const feedbackCount = await db.feedback.count()
    console.log(`\n💬 Feedback Entries: ${feedbackCount} total`)
    
    if (feedbackCount > 0) {
      const recentFeedback = await db.feedback.findMany({
        orderBy: { createdAt: 'desc' },
        take: 3,
        select: {
          feedback: true,
          emailHash: true,
          createdAt: true,
        }
      })
      
      console.log('\n📝 Recent Feedback:')
      recentFeedback.forEach((fb, i) => {
        console.log(`${i + 1}. "${fb.feedback.substring(0, 50)}${fb.feedback.length > 50 ? '...' : ''}"`)
        console.log(`   Email Hash: ${fb.emailHash || 'None'}`)
        console.log(`   Created: ${fb.createdAt}`)
      })
    }
    
    console.log('\n✅ Database check complete!')
    
  } catch (error) {
    console.error('❌ Database error:', error)
  } finally {
    await db.$disconnect()
  }
}

checkDatabase()