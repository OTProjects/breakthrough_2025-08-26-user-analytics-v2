import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { hashEmail } from '@/lib/analytics'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { feedback, email } = body

    if (!feedback || feedback.trim().length === 0) {
      return NextResponse.json(
        { error: 'Feedback is required' },
        { status: 400 }
      )
    }

    const emailHash = email ? hashEmail(email.toLowerCase().trim()) : null

    const savedFeedback = await db.feedback.create({
      data: {
        feedback: feedback.trim(),
        email: email?.toLowerCase().trim() || null,
        emailHash,
      },
    })

    return NextResponse.json({ 
      success: true, 
      id: savedFeedback.id,
      hasEmail: !!email,
      feedbackLength: feedback.trim().length,
      emailHash
    })
  } catch (error) {
    console.error('Failed to save feedback:', error)
    return NextResponse.json(
      { error: 'Failed to save feedback' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const feedbacks = await db.feedback.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        feedback: true,
        emailHash: true,
        createdAt: true,
      },
    })

    // Improved sentiment analysis with negation detection
    const sentimentAnalysis = feedbacks.map(fb => {
      const text = fb.feedback.toLowerCase()
      
      // Enhanced word lists
      const positiveWords = [
        'good', 'great', 'awesome', 'excellent', 'love', 'like', 'amazing', 
        'fantastic', 'perfect', 'wonderful', 'nice', 'outstanding', 'brilliant',
        'superb', 'helpful', 'useful', 'satisfied', 'happy', 'pleased', 'easy',
        'smooth', 'fast', 'works', 'working', 'beautiful', 'clean'
      ]
      
      const negativeWords = [
        'bad', 'terrible', 'awful', 'hate', 'dislike', 'horrible', 'poor', 
        'worst', 'sucks', 'broken', 'useless', 'frustrated', 'annoying',
        'slow', 'confusing', 'difficult', 'problem', 'issue', 'bug', 'error',
        'fail', 'failed', 'disappointing', 'ugly', 'hard'
      ]
      
      // Negation words that flip sentiment
      const negationWords = ['not', 'no', 'never', 'nothing', 'nobody', 'nowhere', 
                            'neither', 'nor', 'barely', 'hardly', 'scarcely', 'seldom',
                            'don\'t', 'doesn\'t', 'didn\'t', 'won\'t', 'wouldn\'t', 'can\'t',
                            'couldn\'t', 'shouldn\'t', 'isn\'t', 'aren\'t', 'wasn\'t', 'weren\'t']
      
      // Strong negative phrases that override positive words
      const strongNegativePatterns = [
        'definitely not', 'absolutely not', 'completely not', 'totally not',
        'not at all', 'far from', 'anything but', 'opposite of'
      ]
      
      // Check for strong negative patterns first
      let hasStrongNegation = false
      for (const pattern of strongNegativePatterns) {
        if (text.includes(pattern)) {
          hasStrongNegation = true
          break
        }
      }
      
      let positiveScore = 0
      let negativeScore = 0
      
      if (hasStrongNegation) {
        // If strong negation is present, treat any positive words as negative
        for (const word of positiveWords) {
          if (text.includes(word)) {
            negativeScore += 2 // Strong negative weight
          }
        }
        for (const word of negativeWords) {
          if (text.includes(word)) {
            negativeScore += 1
          }
        }
      } else {
        // Normal sentiment analysis with negation detection
        const words = text.split(/\s+/)
        
        for (let i = 0; i < words.length; i++) {
          const word = words[i].replace(/[^\w]/g, '') // Remove punctuation
          
          // Check if this word is preceded by negation within 2 words
          const hasNegation = i > 0 && (
            negationWords.includes(words[i-1]) || 
            (i > 1 && negationWords.includes(words[i-2]))
          )
          
          if (positiveWords.includes(word)) {
            if (hasNegation) {
              negativeScore += 1 // Negated positive becomes negative
            } else {
              positiveScore += 1
            }
          } else if (negativeWords.includes(word)) {
            if (hasNegation) {
              positiveScore += 1 // Negated negative becomes positive
            } else {
              negativeScore += 1
            }
          }
        }
      }
      
      // Determine sentiment with more nuanced scoring
      let sentiment = 'neutral'
      const scoreDifference = positiveScore - negativeScore
      
      if (scoreDifference > 0) {
        sentiment = 'positive'
      } else if (scoreDifference < 0) {
        sentiment = 'negative'
      }
      // If equal scores or both zero, remains neutral
      
      return {
        ...fb,
        sentiment,
        positiveScore,
        negativeScore,
      }
    })

    // Calculate sentiment summary
    const sentimentSummary = {
      positive: sentimentAnalysis.filter(fb => fb.sentiment === 'positive').length,
      neutral: sentimentAnalysis.filter(fb => fb.sentiment === 'neutral').length,
      negative: sentimentAnalysis.filter(fb => fb.sentiment === 'negative').length,
    }

    return NextResponse.json({ 
      feedbacks: sentimentAnalysis,
      sentimentSummary,
      totalCount: feedbacks.length 
    })
  } catch (error) {
    console.error('Failed to fetch feedback:', error)
    return NextResponse.json(
      { error: 'Failed to fetch feedback' },
      { status: 500 }
    )
  }
}