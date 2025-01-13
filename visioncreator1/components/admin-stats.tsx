import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, Image, DollarSign, TrendingUp } from 'lucide-react'

export function AdminStats() {
  const stats = [
    { icon: Users, label: 'Total Users', value: '10,483' },
    { icon: Image, label: 'Projects Created', value: '45,231' },
    { icon: DollarSign, label: 'Revenue', value: '$103,200' },
    { icon: TrendingUp, label: 'Active Subscriptions', value: '8,745' },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

