import { PrismaClient } from '@prisma/client'
import { execSync } from 'child_process'

const prisma = new PrismaClient()

async function checkMigrations() {
  try {
    // Check if there are any pending migrations
    const output = execSync('npx prisma migrate status --exit-code').toString()
    
    if (output.includes('No pending migrations')) {
      console.log('No pending migrations. Proceeding with deployment.')
      return true
    } else {
      console.error('There are pending migrations. Please run migrations before deploying.')
      return false
    }
  } catch (error) {
    console.error('Error checking migrations:', error)
    return false
  } finally {
    await prisma.$disconnect()
  }
}

checkMigrations().then((result) => {
  process.exit(result ? 0 : 1)
})

