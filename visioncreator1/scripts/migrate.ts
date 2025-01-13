import { PrismaClient } from '@prisma/client'
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

const prisma = new PrismaClient()

async function runMigration() {
  try {
    // Check if we're running on Vercel
    if (process.env.VERCEL) {
      console.log('Running on Vercel, skipping migration check')
      return
    }

    // Check if there are any pending migrations
    const { stdout } = await execAsync('npx prisma migrate status --exit-code')
    
    if (stdout.includes('No pending migrations')) {
      console.log('No pending migrations. Skipping migration.')
      return
    }

    // Run the migration
    await execAsync('npx prisma migrate deploy')

    // Update the Migration table
    const migrationName = `migration_${Date.now()}`
    await prisma.migration.create({
      data: {
        name: migrationName,
      },
    })

    console.log('Migration completed successfully.')
  } catch (error) {
    console.error('Migration failed:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

runMigration()

