import { Suspense } from 'react'
import { Metadata } from 'next'
import dynamic from 'next/dynamic'
import { Loader2 } from 'lucide-react'

const V0Integration = dynamic(() => import('@/components/admin/v0-integration'), {
  loading: () => <div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 animate-spin" /></div>,
})

export const metadata: Metadata = {
  title: 'v0 Integration | Admin Dashboard',
  description: 'Generate and deploy components using v0.dev',
}

export default function V0Page() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">v0 Component Generator</h1>
      <Suspense fallback={<div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 animate-spin" /></div>}>
        <V0Integration />
      </Suspense>
    </div>
  )
}

