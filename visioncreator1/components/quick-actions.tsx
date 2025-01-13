import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText, Image, Play, Settings } from 'lucide-react'
import Link from 'next/link'

export function QuickActions() {
  const actions = [
    { icon: FileText, label: 'New Text Design', href: '/create?type=text' },
    { icon: Image, label: 'New Image Design', href: '/create?type=image' },
    { icon: Play, label: 'New Video Design', href: '/create?type=video' },
    { icon: Settings, label: 'Settings', href: '/settings' },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 sm:grid-cols-2">
        {actions.map((action) => (
          <Button key={action.label} variant="outline" asChild className="justify-start">
            <Link href={action.href}>
              <action.icon className="mr-2 h-4 w-4" />
              {action.label}
            </Link>
          </Button>
        ))}
      </CardContent>
    </Card>
  )
}

