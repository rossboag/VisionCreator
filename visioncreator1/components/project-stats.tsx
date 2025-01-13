import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart, Clock, Image, Video } from 'lucide-react'

export function ProjectStats() {
  const stats = [
    { icon: Image, label: 'Total Designs', value: '128' },
    { icon: Video, label: 'Video Projects', value: '24' },
    { icon: Clock, label: 'Hours Saved', value: '320' },
    { icon: BarChart, label: 'Engagement Rate', value: '24%' },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Project Stats</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 sm:grid-cols-2">
        {stats.map((stat) => (
          <div key={stat.label} className="flex items-center space-x-4">
            <stat.icon className="h-6 w-6 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">{stat.label}</p>
              <p className="text-2xl font-bold">{stat.value}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

