import { AppProps } from 'next/app'
import { SessionProvider } from 'next-auth/react'
import { ThemeProvider } from '@/components/theme-provider'
import { Header } from '@/components/layout/header'
import ErrorBoundary from '@/components/error-boundary'
import { reportWebVitals, sendToAnalytics } from '@/lib/vitals'
import '@/styles/globals.css'
import { useEffect, createContext, useState } from 'react'
import { isFeatureEnabled } from '@/lib/feature-flags'
import newrelic from '@newrelic/next'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const FeatureFlagContext = createContext<Record<string, boolean>>({})

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  const [featureFlags, setFeatureFlags] = useState<Record<string, boolean>>({})

  useEffect(() => {
    async function loadFeatureFlags() {
      const flags = {
        newFeature: await isFeatureEnabled('newFeature'),
        betaFeature: await isFeatureEnabled('betaFeature'),
      }
      setFeatureFlags(flags)
    }

    loadFeatureFlags()

    if ('serviceWorker' in navigator) {
      window.addEventListener('load', function() {
        navigator.serviceWorker.register('/service-worker.js').then(
          function(registration) {
            console.log('Service Worker registration successful with scope: ', registration.scope)
          },
          function(err) {
            console.log('Service Worker registration failed: ', err)
          }
        )
      })
    }
  }, [])

  return (
    <SessionProvider session={session}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <FeatureFlagContext.Provider value={featureFlags}>
          <ErrorBoundary>
            <Header />
            <Component {...pageProps} />
          </ErrorBoundary>
        </FeatureFlagContext.Provider>
      </ThemeProvider>
    </SessionProvider>
  )
}

export function reportWebVitals(metric: NextWebVitalsMetric) {
  console.log(metric)
  sendToAnalytics(metric)
}

export default newrelic(MyApp)

