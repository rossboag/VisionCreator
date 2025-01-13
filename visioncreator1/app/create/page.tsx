import { Suspense } from 'react'
import { Metadata } from 'next'
import dynamic from 'next/dynamic'
import { Loader2 } from 'lucide-react'

const AIBuilder = dynamic(() => import('@/components/ai-builder/ai-builder'), {
  loading: () => <div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 animate-spin" /></div>,
})

export const metadata: Metadata = {
  title: 'Create New Project | VisionCreator',
  description: 'Create a new AI-powered design project',
}

export default function CreateProjectPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Create New Project</h1>
      <Suspense fallback={<div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 animate-spin" /></div>}>
        <AIBuilder />
      </Suspense>
    </div>
  )
}

