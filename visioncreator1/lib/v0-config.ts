import { experimental_generateComponents } from 'ai/v0'

export const v0Config = {
  apiKey: process.env.V0_API_KEY,
  apiUrl: process.env.V0_API_URL || 'https://api.v0.dev',
  backupDir: process.env.BACKUP_DIR || './backups',
  componentsDir: process.env.COMPONENTS_DIR || './components/generated'
}

if (!v0Config.apiKey) {
  console.error('V0_API_KEY is not set in the environment variables')
}

export const v0Client = {
  generate: async (options: Parameters<typeof experimental_generateComponents>[0]) => {
    if (!v0Config.apiKey) {
      throw new Error('V0_API_KEY is not set')
    }
    return experimental_generateComponents(options)
  }
}

