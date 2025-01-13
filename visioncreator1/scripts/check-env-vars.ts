import dotenv from 'dotenv'
import fs from 'fs'

dotenv.config()

const requiredEnvVars = [
  'DATABASE_URL',
  'NEXTAUTH_URL',
  'NEXTAUTH_SECRET',
  'OPENAI_API_KEY',
  'REDIS_URL',
  'V0_API_KEY',
  'V0_API_URL',
  'NEW_RELIC_LICENSE_KEY',
  'NEXT_PUBLIC_SENTRY_DSN',
  'NEXT_PUBLIC_VERCEL_ANALYTICS_ID',
  'VERCEL_TOKEN',
  'VERCEL_ORG_ID',
  'VERCEL_PROJECT_ID',
  'VERCEL_URL',
  'VERCEL_ENV',
  'VERCEL_REGION',
  'SMTP_HOST',
  'SMTP_PORT',
  'SMTP_USER',
  'SMTP_PASSWORD',
  'SMTP_FROM',
]

function checkEnvVars() {
  const missingVars = requiredEnvVars.filter(varName => !process.env[varName])

  if (missingVars.length > 0) {
    console.error('Error: The following required environment variables are missing:')
    missingVars.forEach(varName => console.error(`- ${varName}`))
    process.exit(1)
  } else {
    console.log('All required environment variables are set.')
  }
}

function generateEnvExample() {
  const envExample = requiredEnvVars.map(varName => `${varName}=`).join('\n')
  fs.writeFileSync('.env.example', envExample)
  console.log('.env.example file has been generated.')
}

checkEnvVars()
generateEnvExample()

