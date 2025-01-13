import { Metadata } from 'next'
import { ComponentsList } from '@/components/admin/components-list'

export const metadata: Metadata = {
  title: 'Generated Components | Admin Dashboard',
  description: 'View and manage all generated components',
}

export default function ComponentsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Generated Components</h1>
      <ComponentsList />
    </div>
  )
}

