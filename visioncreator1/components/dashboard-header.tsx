import { Button } from '@/components/ui/button'
import { PlusCircle } from 'lucide-react'
import Link from 'next/link'

export function DashboardHeader() {
  return (
    <div className="flex justify-between items-center">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <Button asChild>
        <Link href="/create">
          <PlusCircle className="mr-2 h-4 w-4" /> Create New Project
        </Link>
      </Button>
    </div>
  )
}

