'use client'

import { useEffect } from 'react'
import { track } from '@/lib/analytics'

interface PageTrackerProps {
  pageTitle: string
  previousPage?: string
}

export default function PageTracker({ pageTitle, previousPage }: PageTrackerProps) {
  useEffect(() => {
    track('page_view', {
      page_title: pageTitle,
      previous_page: previousPage
    })
  }, [pageTitle, previousPage])

  return null
}