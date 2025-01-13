import fs from 'fs/promises'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'

export interface ComponentVersion {
  id: string
  componentName: string
  code: string
  timestamp: string
  author: string
}

export class ComponentVersionControl {
  private backupDir: string

  constructor(backupDir: string) {
    this.backupDir = backupDir
  }

  async initialize() {
    await fs.mkdir(this.backupDir, { recursive: true })
  }

  async createBackup(componentName: string, code: string, author: string): Promise<ComponentVersion> {
    const version: ComponentVersion = {
      id: uuidv4(),
      componentName,
      code,
      timestamp: new Date().toISOString(),
      author
    }

    const componentDir = path.join(this.backupDir, componentName)
    await fs.mkdir(componentDir, { recursive: true })
    
    const versionPath = path.join(componentDir, `${version.id}.json`)
    await fs.writeFile(versionPath, JSON.stringify(version, null, 2))

    return version
  }

  async getVersions(componentName: string): Promise<ComponentVersion[]> {
    const componentDir = path.join(this.backupDir, componentName)
    
    try {
      const files = await fs.readdir(componentDir)
      const versions = await Promise.all(
        files.map(async (file) => {
          const content = await fs.readFile(path.join(componentDir, file), 'utf-8')
          return JSON.parse(content) as ComponentVersion
        })
      )
      
      return versions.sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      )
    } catch (error) {
      return []
    }
  }

  async rollback(componentName: string, versionId: string): Promise<ComponentVersion | null> {
    const versions = await this.getVersions(componentName)
    const version = versions.find(v => v.id === versionId)
    
    if (!version) {
      return null
    }

    return version
  }
}

