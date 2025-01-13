import { Metadata } from 'next'
import { SettingsForm } from '@/components/settings/settings-form'

export const metadata: Metadata = {
  title: 'Settings | VisionCreator',
  description: 'Manage your VisionCreator account settings',
}

export default function SettingsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Account Settings</h1>
      <SettingsForm />
    </div>
  )
}

