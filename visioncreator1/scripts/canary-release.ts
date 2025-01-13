import { setFeatureFlag } from '../lib/feature-flags'

async function canaryRelease(featureName: string, initialPercentage: number = 10, incrementPercentage: number = 10, intervalMinutes: number = 30) {
  console.log(`Starting canary release for feature: ${featureName}`)

  let currentPercentage = initialPercentage

  while (currentPercentage <= 100) {
    await setFeatureFlag(featureName, true, currentPercentage)
    console.log(`Feature ${featureName} enabled for ${currentPercentage}% of users`)

    await new Promise(resolve => setTimeout(resolve, intervalMinutes * 60 * 1000))

    currentPercentage += incrementPercentage
  }

  console.log(`Canary release completed for feature: ${featureName}`)
}

// Usage example
canaryRelease('newFeature', 5, 20, 60)
  .catch(console.error)

