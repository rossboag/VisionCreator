import { performance, PerformanceObserver } from 'perf_hooks'
import logger from './logger'

const obs = new PerformanceObserver((items) => {
  items.getEntries().forEach((entry) => {
    logger.info(`${entry.name}: ${entry.duration}ms`)
  })
})

obs.observe({ entryTypes: ['measure'] })

export function measurePerformance<T>(
  name: string,
  fn: () => Promise<T>
): Promise<T> {
  const start = `${name}-start`
  const end = `${name}-end`
  performance.mark(start)
  return fn().then((result) => {
    performance.mark(end)
    performance.measure(name, start, end)
    return result
  })
}

