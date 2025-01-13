import { NextWebVitalsMetric } from 'next/app'
import { getCLS, getFID, getLCP } from 'web-vitals'

const vitalsUrl = 'https://vitals.vercel-analytics.com/v1/vitals'

function getConnectionSpeed() {
  return 'connection' in navigator &&
    navigator['connection'] &&
    'effectiveType' in navigator['connection']
    ? navigator['connection']['effectiveType']
    : ''
}

export function sendToAnalytics(metric: NextWebVitalsMetric) {
  const body = {
    dsn: process.env.NEXT_PUBLIC_VERCEL_ANALYTICS_ID, // Your Analytics ID
    id: metric.id,
    page: window.location.pathname,
    href: window.location.href,
    event_name: metric.name,
    value: metric.value.toString(),
    speed: getConnectionSpeed(),
  }

  const blob = new Blob([new URLSearchParams(body).toString()], {
    type: 'application/x-www-form-urlencoded',
  })
  if (navigator.sendBeacon) {
    navigator.sendBeacon(vitalsUrl, blob)
  } else
    fetch(vitalsUrl, {
      body: blob,
      method: 'POST',
      credentials: 'omit',
      keepalive: true,
    })
}

export function reportWebVitals(onPerfEntry?: (metric: NextWebVitalsMetric) => void) {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    getCLS(onPerfEntry)
    getFID(onPerfEntry)
    getLCP(onPerfEntry)
  }
}

