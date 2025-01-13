import { Metadata } from 'next'
import { AdminDashboardHeader } from '@/components/admin/admin-dashboard-header'
import { AdminStats } from '@/components/admin/admin-stats'
import { RecentUsers } from '@/components/admin/recent-users'
import { PopularTemplates } from '@/components/admin/popular-templates'

export const metadata: Metadata = {
  title: 'Admin Dashboard | VisionCreator',
  description: 'Manage VisionCreator users and content',
}

export default function AdminDashboardPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <AdminDashboardHeader />
      <AdminStats />
      <div className="grid gap-6 mt-6 md:grid-cols-2">
        <RecentUsers />
        <PopularTemplates />
      </div>
    </div>
  )
}

