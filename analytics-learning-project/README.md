# Analytics Learning Project

A step-by-step learning project demonstrating three core functionality components: **App Analytics**, **User Feedback System**, and **Data Interpretation**.

## Quick Start

```bash
npm install
npm run dev
```

Visit http://localhost:3000 (or the port shown in terminal)

## Project Overview

This project is built in phases, with each phase building upon the previous one:

- **Phase 1**: Analytics (Event tracking pipeline) ✅
- **Phase 2**: Feedback system (Database + Analytics) ✅
- **Phase 3**: Data interpretation dashboard ✅

## Phase 1 Walkthrough: Analytics Foundation

### What You'll Test

1. **Event Tracking**: Navigate between pages and see events logged
2. **Typed Analytics**: All events follow a strict TypeScript schema
3. **Real-time Verification**: View events as they happen

### Step-by-Step Testing

1. **Start the app** and open your browser to the running localhost URL
2. **Open Developer Console** (F12) - you'll see analytics events logged here
3. **Look for the Analytics Viewer** - purple floating button in bottom-right corner that shows event count
4. **Navigate between pages**:
   - Home → Feedback → Dashboard → Home
   - Each navigation triggers a `page_view` event
5. **Check the Analytics Viewer**:
   - Click the purple "📊 Events" button
   - See real-time event list with timestamps and properties
   - Events are stored in browser localStorage for persistence

### Verify It's Working

✅ **Expected Events**:
- `app_open` - Fired once when you first load the app
- `page_view` - Fired every time you navigate to a new page
- Events show up in both console and the analytics viewer
- Event count increases in the floating button

✅ **Event Properties**:
- Each event has: `timestamp`, `session_id`, `page_url`
- `page_view` events include: `page_title`, `previous_page`
- `app_open` events include: `referrer`, `user_agent`

### Common Pitfalls

❌ **No events showing?**
- Check browser console for errors
- Make sure JavaScript is enabled
- Try refreshing the page

❌ **Analytics viewer not updating?**
- The viewer refreshes every 1 second
- Try clicking "Clear" then navigating again

❌ **Events only in console, not in viewer?**
- Check browser localStorage permissions
- Try a different browser/incognito mode

## Concept Notes

### TypeScript Event Schema
- **Why**: Prevents runtime errors and provides autocomplete
- **How**: `event-schema.ts` defines all possible events and their properties
- **Benefit**: You can't accidentally log malformed data

### Session Tracking
- **What**: Each browser session gets a unique ID (`session_xyz123`)
- **Why**: Groups events from the same user visit
- **Implementation**: Generated on first load, stored in memory

### Local Storage Persistence
- **Purpose**: Events survive page refreshes (Phase 1 only)
- **Location**: Browser localStorage under `analytics_events`
- **Note**: This is for learning - production would use a database

### Event-Driven Architecture
- **Pattern**: `track(eventName, properties)` function
- **Benefit**: Consistent tracking throughout the app
- **Future**: Easy to add external analytics services (PostHog, etc.)

## File Structure

```
src/
├── app/                     # Next.js pages
│   ├── page.tsx            # Home page with tracking
│   ├── feedback/page.tsx   # Feedback page (Phase 2)
│   └── dashboard/page.tsx  # Dashboard page (Phase 3)
├── components/
│   ├── PageTracker.tsx     # Automatic page view tracking
│   └── AnalyticsViewer.tsx # Real-time event viewer
└── lib/analytics/
    ├── event-schema.ts     # TypeScript event definitions
    ├── tracker.ts          # Core analytics logic
    ├── utils.ts           # Helper functions
    └── index.ts           # Public API
```

## Production-Readiness Notes

### Current MVP Implementation (Phase 3)
- **Events**: Dual storage in localStorage + SQLite database with aggregation APIs
- **Feedback**: SQLite database with email hashing and sentiment analysis
- **Dashboard**: Real-time analytics with custom CSS charts and data visualization
- **Data persistence**: SQLite file (`prisma/dev.db`) with complex queries
- **API**: RESTful endpoints for analytics stats, feedback data, and aggregations
- **Sentiment Analysis**: Keyword-based scoring with positive/negative word matching

### What Production Would Need
- **External Analytics Service**: PostHog, Amplitude, or Mixpanel for:
  - Long-term storage with data warehousing capabilities
  - User-level tracking across sessions, devices, and platforms
  - Advanced analytics (funnels, cohorts, retention, A/B testing)
  - Professional dashboards with filtering and segmentation
- **Production Database**: PostgreSQL or ClickHouse for analytics workloads
- **Advanced Sentiment Analysis**: Machine learning models (VADER, TextBlob, OpenAI API)
- **Real-time Processing**: Apache Kafka or similar for event streaming
- **Data Warehouse**: BigQuery, Snowflake, or Redshift for analytical queries
- **Business Intelligence**: Tableau, Looker, or Grafana for executive dashboards  
- **Authentication & Authorization**: Role-based access to different dashboard views
- **API Rate Limiting**: Prevent dashboard API abuse and manage query costs
- **Caching Strategy**: Redis for dashboard data with smart invalidation
- **Performance Monitoring**: Track dashboard load times and query performance
- **Data Retention Policies**: Automated cleanup and archival of old analytics data

## Phase 2 Walkthrough: Feedback System + Database Integration

### What You'll Test

1. **Database Persistence**: All events now save to SQLite database + localStorage
2. **Feedback Form**: Fully functional form with validation and success states
3. **Integrated Analytics**: Feedback submissions trigger analytics events
4. **Privacy**: Email addresses are hashed before analytics tracking

### Step-by-Step Testing

1. **Navigate to Feedback page** - Notice the form is now fully enabled
2. **Test Form Validation**:
   - Try submitting empty form - see validation error
   - Enter just feedback text - form should work
3. **Submit Feedback**:
   - Fill in feedback textarea
   - Optionally add email (will be hashed for privacy)
   - Click "Submit Feedback"
4. **Watch Analytics Events**:
   - `feedback_opened` - Fired when you focus on the textarea
   - `feedback_submitted` - Fired on successful submission with metadata
   - `error` - Fired if submission fails
5. **Check Success State**: Form shows success message and reset option
6. **Verify Database Storage**: 
   - Check browser console - you'll see Prisma query logs
   - Both analytics events AND feedback records are saved to SQLite

### Verify It's Working

✅ **Form Functionality**:
- Form validation prevents empty submissions
- Success message appears after submission
- Form resets after successful submission
- Can submit multiple pieces of feedback

✅ **Analytics Integration**:
- `feedback_opened` event when focusing textarea
- `feedback_submitted` event with properties: `feedback_length`, `has_email`, `email_hash`
- Error tracking if API calls fail

✅ **Database Storage**:
- Check browser console for Prisma query logs (showing database writes)
- Events stored in both localStorage (instant) and SQLite database (persistent)
- Feedback stored separately in database with hashed emails

### Common Pitfalls

❌ **Form not submitting?**
- Check browser console for API errors
- Ensure database was created with `npm run db:push`

❌ **No database logs?**
- Prisma query logs appear in terminal where `npm run dev` is running
- Look for `prisma:query INSERT INTO...` messages

❌ **Analytics events not saving to database?**
- Check Network tab in DevTools for `/api/analytics/track` calls
- Should see 200 status codes for successful saves

## Concept Notes

### Database Integration Architecture
- **Dual Persistence**: Events save to both localStorage (immediate) and database (persistent)
- **API Layer**: Next.js API routes handle database operations (`/api/analytics/track`, `/api/feedback`)
- **Prisma ORM**: Type-safe database operations with auto-generated client
- **SQLite**: Local file-based database for development simplicity

### Privacy-First Design
- **Email Hashing**: User emails are hashed before analytics tracking
- **Separation of Concerns**: Personal data (raw email) stored separately from analytics
- **Optional Data**: Email field is optional, analytics work without it

### Event-Driven Feedback Flow
1. User focuses textarea → `feedback_opened` event
2. User submits form → API saves to database
3. Successful save → `feedback_submitted` event with metadata
4. Any errors → `error` event for debugging

### Form State Management
- **Loading States**: Form shows "Submitting..." and disables during API calls
- **Error Handling**: Server errors displayed to user with analytics tracking
- **Success Flow**: Success message with option to submit more feedback

### Next Steps
Phase 2 demonstrates the full feedback system with database integration and privacy-conscious analytics. Phase 3 completes the project with a comprehensive dashboard for data interpretation.

## Phase 3 Walkthrough: Data Interpretation Dashboard

### What You'll Test

1. **Real-time Analytics Visualization**: Interactive charts and metrics from your collected events
2. **Feedback Sentiment Analysis**: Basic keyword-based sentiment scoring with visual breakdown  
3. **Data Aggregation**: Summary statistics and trend analysis
4. **Dynamic Updates**: Dashboard data refreshes as you interact with the app

### Step-by-Step Testing

1. **Navigate to Dashboard** (`/dashboard`) - See the complete analytics overview
2. **Check Summary Stats**:
   - Total events tracked across all sessions
   - Unique browser sessions recorded  
   - Different types of events captured
3. **View Event Analytics**:
   - Bar chart showing event frequency by type
   - Color-coded recent events with timestamps
   - Real-time data from your database
4. **Explore Feedback Analysis**:
   - Sentiment breakdown (😊 Positive, 😐 Neutral, 😞 Negative)
   - Individual feedback entries with sentiment scores
   - Basic keyword-based sentiment analysis explanation
5. **Test Real-time Updates**:
   - Navigate between pages → see event counts increase
   - Submit new feedback → see sentiment analysis update
   - Refresh dashboard → data persists from database

### Verify It's Working

✅ **Analytics Dashboard**:
- Shows total events, unique sessions, event types
- Bar chart displays event distribution with colors
- Recent events list shows latest activity with timestamps

✅ **Feedback Dashboard**:  
- Displays sentiment breakdown with emoji indicators
- Individual feedback shows calculated sentiment scores
- Explains how the basic sentiment analysis works

✅ **Data Integration**:
- All data comes from SQLite database (not localStorage)
- Charts update as you use the app
- Sentiment analysis processes feedback in real-time

✅ **Database Queries**:
- Check terminal for Prisma queries showing data aggregation
- API endpoints (`/api/analytics/stats`, `/api/feedback`) return structured data
- Complex groupBy and aggregation queries working

### Common Pitfalls

❌ **Dashboard not loading?**
- Check browser console for API errors
- Ensure database has data (navigate pages, submit feedback first)
- Look for Network tab 500 errors on dashboard API calls

❌ **No charts showing?**
- Dashboard needs existing data to visualize
- Try navigating between pages several times to generate events
- Submit feedback to see sentiment analysis

❌ **Sentiment analysis shows all neutral?**
- Try feedback with words like "great", "love", "terrible", "hate"
- The system looks for specific positive/negative keywords
- Neutral means no strong sentiment keywords detected

## Concept Notes

### Data Aggregation & Analytics
- **Database Queries**: Complex GROUP BY operations for event counting and trend analysis
- **Real-time Processing**: API endpoints calculate statistics on-demand from live data
- **Performance**: SQLite handles aggregations efficiently for learning purposes
- **Scalability**: Production would use pre-computed aggregations and caching

### Enhanced Sentiment Analysis  
- **Negation Detection**: Understands "not good" vs "good" (context within 2 words)
- **Strong Negation Patterns**: Handles phrases like "definitely not good", "absolutely not"
- **Extended Vocabulary**: 25+ positive words, 25+ negative words with domain-specific terms
- **Context Awareness**: Considers word proximity and sentence structure
- **Limitations**: Still doesn't handle sarcasm, complex grammar, or cultural context
- **Production Alternative**: Would use transformer models (BERT, RoBERTa) or cloud APIs (OpenAI, Google Cloud)

### Dashboard Architecture
- **Server-Side Rendering**: Next.js pages with client-side data fetching
- **Component Structure**: Modular dashboard components for reusability
- **State Management**: React hooks for loading states and error handling
- **Visual Design**: CSS-based charts avoiding external charting libraries

### Data Visualization Strategy
- **Simple Charts**: Custom CSS bar charts instead of heavy charting libraries
- **Color Coding**: Consistent color scheme across events and sentiment
- **Progressive Enhancement**: Loading states and error handling for good UX
- **Responsive Design**: Dashboard works on different screen sizes

---

## Development Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Analytics**: Custom typed wrapper
- **Storage**: localStorage (Phase 1) → SQLite (Phase 2)