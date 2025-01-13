import { Button } from '@/components/ui/button'
import { PlusCircle, Settings, Code2, List } from 'lucide-react'
import Link from 'next/link'

export function AdminDashboardHeader() {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      <div className="space-x-2">
        <Button asChild variant="outline">
          <Link href="/admin/settings">
            <Settings className="mr-2 h-4 w-4" /> Admin Settings
          </Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/admin/v0">
            <Code2 className="mr-2 h-4 w-4" /> v0 Integration
          </Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/admin/components">
            <List className="mr-2 h-4 w-4" /> Generated Components
          </Link>
        </Button>
        <Button asChild>
          <Link href="/admin/templates/new">
            <PlusCircle className="mr-2 h-4 w-4" /> New Template
          </Link>
        </Button>
      </div>
    </div>
  )
}

