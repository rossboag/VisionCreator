import { Metadata } from 'next'
import { DashboardHeader } from '@/components/dashboard/dashboard-header'
import { RecentProjects } from '@/components/dashboard/recent-projects'
import { QuickActions } from '@/components/dashboard/quick-actions'
import { ProjectStats } from '@/components/dashboard/project-stats'

export const metadata: Metadata = {
  title: 'Dashboard | VisionCreator',
  description: 'Manage your VisionCreator projects and activities',
}

export default function DashboardPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <DashboardHeader />
      <div className="grid gap-6 mt-6 md:grid-cols-2">
        <QuickActions />
        <ProjectStats />
      </div>
      <RecentProjects />
    </div>
  )
}

