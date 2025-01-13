import { PrismaClient } from '@prisma/client'
import { cacheGet, cacheSet } from '@/lib/redis'

const prisma = new PrismaClient()

export async function getProjectById(id: string) {
  try {
    const project = await prisma.project.findUnique({
      where: { id },
    })
    return project
  } catch (error) {
    console.error('Error fetching project:', error)
    return null
  }
}

export async function getAllProjects() {
  const cacheKey = 'all_projects'
  const cachedProjects = await cacheGet(cacheKey)
  
  if (cachedProjects) {
    return cachedProjects
  }

  const projects = await prisma.project.findMany({
    take: 100, // Limit to 100 projects for performance
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      title: true,
      description: true,
      type: true,
      imageUrl: true,
      createdAt: true,
    },
  })

  await cacheSet(cacheKey, projects, 60 * 5) // Cache for 5 minutes
  return projects
}

export async function createProject(data: any) {
  try {
    const project = await prisma.project.create({
      data,
    })
    return project
  } catch (error) {
    console.error('Error creating project:', error)
    return null
  }
}

export async function updateProject(id: string, data: any) {
  try {
    const project = await prisma.project.update({
      where: { id },
      data,
    })
    return project
  } catch (error) {
    console.error('Error updating project:', error)
    return null
  }
}

export async function deleteProject(id: string) {
  try {
    await prisma.project.delete({
      where: { id },
    })
    return true
  } catch (error) {
    console.error('Error deleting project:', error)
    return false
  }
}

