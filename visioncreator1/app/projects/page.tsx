import { Metadata } from 'next'
import { getServerSession } from 'next-auth/next'
import { redirect } from 'next/navigation'
import { ProjectsHeader } from '@/components/projects/projects-header'
import { ProjectsList } from '@/components/projects/projects-list'
import { getAllProjects } from '@/lib/projects'

export const metadata: Metadata = {
  title: 'Projects | VisionCreator',
  description: 'Manage your VisionCreator projects',
}

export default async function ProjectsPage() {
  const session = await getServerSession()
  if (!session) {
    redirect('/signin')
  }

  const projects = await getAllProjects()

  return (
    <div className="container mx-auto px-4 py-8">
      <ProjectsHeader />
      <ProjectsList initialProjects={projects} />
    </div>
  )
}

