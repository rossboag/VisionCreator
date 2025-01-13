import lighthouse from 'lighthouse'
import puppeteer from 'puppeteer'
import { writeFileSync } from 'fs'

const URL = 'http://localhost:3000' // Replace with your staging URL

async function runLighthouseTest() {
  const browser = await puppeteer.launch({ headless: true })
  const page = await browser.newPage()

  const { lhr } = await lighthouse(URL, {
    port: (new URL(browser.wsEndpoint())).port,
    output: 'json',
    logLevel: 'info',
    onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
  })

  await browser.close()

  if (!lhr) {
    throw new Error('Lighthouse test failed')
  }

  const reportPath = './lighthouse-report.json'
  writeFileSync(reportPath, JSON.stringify(lhr, null, 2))

  console.log('Lighthouse scores:')
  console.log('Performance:', lhr.categories.performance.score * 100)
  console.log('Accessibility:', lhr.categories.accessibility.score * 100)
  console.log('Best Practices:', lhr.categories['best-practices'].score * 100)
  console.log('SEO:', lhr.categories.seo.score * 100)

  // Check if scores meet the threshold
  const threshold = 0.8 // 80%
  if (
    lhr.categories.performance.score < threshold ||
    lhr.categories.accessibility.score < threshold ||
    lhr.categories['best-practices'].score < threshold ||
    lhr.categories.seo.score < threshold
  ) {
    throw new Error('Performance test failed: Scores below threshold')
  }

  console.log('Performance test passed!')
}

runLighthouseTest().catch((error) => {
  console.error('Performance test failed:', error)
  process.exit(1)
})

