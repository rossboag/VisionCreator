import { Metadata } from 'next'
import { EditProjectForm } from '@/components/projects/edit-project-form'
import { getProjectById } from '@/lib/projects'

export const metadata: Metadata = {
  title: 'Edit Project | VisionCreator',
  description: 'Edit your VisionCreator project',
}

interface EditProjectPageProps {
  params: {
    id: string
  }
}

export default async function EditProjectPage({ params }: EditProjectPageProps) {
  const project = await getProjectById(params.id)

  if (!project) {
    return <div>Project not found</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Edit Project: {project.title}</h1>
      <EditProjectForm project={project} />
    </div>
  )
}

