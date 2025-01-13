import { Metadata } from 'next'
import { AdminSignInForm } from '@/components/auth/admin-signin-form'

export const metadata: Metadata = {
  title: 'Admin Sign In | VisionCreator',
  description: 'Sign in to the VisionCreator admin panel',
}

export default function AdminSignInPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">
          Admin Sign In
        </h1>
        <AdminSignInForm />
      </div>
    </div>
  )
}

