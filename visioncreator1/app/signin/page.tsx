import { Metadata } from 'next'
import { SignInForm } from '@/components/auth/signin-form'

export const metadata: Metadata = {
  title: 'Sign In | VisionCreator',
  description: 'Sign in to your VisionCreator account',
}

export default function SignInPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">
          Sign In to Your Account
        </h1>
        <SignInForm />
      </div>
    </div>
  )
}

