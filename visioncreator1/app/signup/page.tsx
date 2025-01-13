import { Metadata } from 'next'
import { PricingPlans } from '@/components/pricing/pricing-plans'

export const metadata: Metadata = {
  title: 'Sign Up | VisionCreator',
  description: 'Choose a plan and sign up for VisionCreator',
}

export default function SignUpPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold text-center mb-8">Choose Your Plan</h1>
      <PricingPlans />
    </div>
  )
}

