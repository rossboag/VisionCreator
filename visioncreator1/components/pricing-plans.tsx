'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Check } from 'lucide-react'
import Link from 'next/link'

const plans = [
  {
    name: 'Starter',
    description: 'Perfect for individuals and small projects',
    price: {
      monthly: 9,
      yearly: 90,
    },
    features: [
      '100 AI-generated designs per month',
      'Access to basic templates',
      'Export as PNG/JPEG',
      'Email support within 24 hours',
    ],
  },
  {
    name: 'Pro',
    description: 'Ideal for professionals and growing businesses',
    price: {
      monthly: 29,
      yearly: 290,
    },
    features: [
      'Unlimited AI-generated designs',
      'Access to premium templates',
      'Export as PNG/JPEG/SVG/MP4',
      'Priority support within 4 hours',
      'Team collaboration up to 5 members',
    ],
    popular: true,
  },
  {
    name: 'Teams',
    description: 'For larger teams and organizations',
    price: {
      monthly: 99,
      yearly: 990,
    },
    features: [
      'Everything in Pro',
      'Unlimited team members',
      'Custom template creation',
      'API access for integrations',
      'Dedicated account manager',
      'SSO authentication',
    ],
  },
]

export function PricingPlans() {
  const [isYearly, setIsYearly] = useState(false)

  return (
    <div className="space-y-8">
      <div className="flex justify-center gap-4">
        <Button
          variant={isYearly ? "outline" : "default"}
          onClick={() => setIsYearly(false)}
        >
          Monthly billing
        </Button>
        <Button
          variant={isYearly ? "default" : "outline"}
          onClick={() => setIsYearly(true)}
        >
          Yearly billing
          <span className="ml-2 rounded-full bg-green-100 px-2 py-1 text-xs text-green-600">
            Save 20%
          </span>
        </Button>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <Card key={plan.name} className={plan.popular ? 'border-primary' : ''}>
            <CardHeader>
              <CardTitle>{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-3xl font-bold">
                ${isYearly ? plan.price.yearly : plan.price.monthly}
                <span className="text-sm font-normal text-muted-foreground">
                  /{isYearly ? 'year' : 'month'}
                </span>
              </div>
              <ul className="space-y-2">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full" asChild>
                <Link href={`/signup/${plan.name.toLowerCase()}`}>
                  Start {plan.name} Trial
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

