export interface BaseEventProperties {
  timestamp: string
  session_id: string
  page_url: string
}

export interface AppOpenEvent extends BaseEventProperties {
  event: 'app_open'
  properties: {
    referrer?: string
    user_agent: string
  }
}

export interface PageViewEvent extends BaseEventProperties {
  event: 'page_view'
  properties: {
    page_title: string
    previous_page?: string
  }
}

export interface FeedbackOpenedEvent extends BaseEventProperties {
  event: 'feedback_opened'
  properties: {
    source_page: string
  }
}

export interface FeedbackSubmittedEvent extends BaseEventProperties {
  event: 'feedback_submitted'
  properties: {
    feedback_length: number
    has_email: boolean
    email_hash?: string
  }
}

export interface ErrorEvent extends BaseEventProperties {
  event: 'error'
  properties: {
    error_message: string
    error_type: string
    page: string
  }
}

export type AnalyticsEvent = 
  | AppOpenEvent 
  | PageViewEvent 
  | FeedbackOpenedEvent 
  | FeedbackSubmittedEvent 
  | ErrorEvent

export type EventName = AnalyticsEvent['event']

export type EventPropertiesMap = {
  [K in AnalyticsEvent as K['event']]: K['properties']
}