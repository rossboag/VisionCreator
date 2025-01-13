import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

const recentUsers = [
  { id: 1, name: 'Alice Johnson', email: 'alice@example.com', joinDate: '2023-06-15' },
  { id: 2, name: 'Bob Smith', email: 'bob@example.com', joinDate: '2023-06-14' },
  { id: 3, name: 'Charlie Brown', email: 'charlie@example.com', joinDate: '2023-06-13' },
  { id: 4, name: 'Diana Ross', email: 'diana@example.com', joinDate: '2023-06-12' },
]

export function RecentUsers() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Users</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentUsers.map((user) => (
            <div key={user.id} className="flex items-center space-x-4">
              <Avatar>
                <AvatarImage src={`/placeholder.svg?height=40&width=40&text=${user.name[0]}`} />
                <AvatarFallback>{user.name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{user.name}</p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
              <div className="ml-auto text-sm text-muted-foreground">
                Joined {user.joinDate}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

