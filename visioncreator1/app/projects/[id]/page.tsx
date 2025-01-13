import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getProjectById, getAllProjects } from '@/lib/projects'
import { ProjectDetails } from '@/components/projects/project-details'

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const project = await getProjectById(params.id)
  if (!project) {
    return {
      title: 'Project Not Found',
    }
  }
  return {
    title: `${project.name} | VisionCreator`,
    description: `Details for project: ${project.name}`,
  }
}

export async function generateStaticParams() {
  const projects = await getAllProjects()
  return projects.slice(0, 20).map((project) => ({
    id: project.id,
  }))
}

export default async function ProjectPage({ params }: { params: { id: string } }) {
  const project = await getProjectById(params.id)

  if (!project) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <ProjectDetails project={project} />
    </div>
  )
}

