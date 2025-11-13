import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'

interface Activity {
  id: string
  type: 'user' | 'organization' | 'system' | 'security'
  action: string
  description: string
  timestamp: Date
  user?: string
}

interface ActivityLogProps {
  maxHeight?: string
  limit?: number
}

// Mock data - in production, this would come from an audit logs table
const mockActivities: Activity[] = [
  {
    id: '1',
    type: 'user',
    action: 'User Login',
    description: 'admin@example.com logged in successfully',
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
    user: 'admin@example.com',
  },
  {
    id: '2',
    type: 'organization',
    action: 'Organization Created',
    description: 'New organization "Acme Corp" was created',
    timestamp: new Date(Date.now() - 1000 * 60 * 15),
    user: 'john@example.com',
  },
  {
    id: '3',
    type: 'user',
    action: 'Role Assigned',
    description: 'Platform admin role assigned to user@example.com',
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    user: 'admin@example.com',
  },
  {
    id: '4',
    type: 'organization',
    action: 'Member Added',
    description: 'New member invited to organization "Acme Corp"',
    timestamp: new Date(Date.now() - 1000 * 60 * 45),
    user: 'john@example.com',
  },
  {
    id: '5',
    type: 'security',
    action: 'Password Reset',
    description: 'Password reset requested for user@example.com',
    timestamp: new Date(Date.now() - 1000 * 60 * 60),
    user: 'user@example.com',
  },
  {
    id: '6',
    type: 'system',
    action: 'Feature Flag Changed',
    description: 'Feature "user-invitations" was enabled',
    timestamp: new Date(Date.now() - 1000 * 60 * 90),
    user: 'admin@example.com',
  },
  {
    id: '7',
    type: 'user',
    action: 'User Signup',
    description: 'New user registered: jane@example.com',
    timestamp: new Date(Date.now() - 1000 * 60 * 120),
    user: 'jane@example.com',
  },
  {
    id: '8',
    type: 'organization',
    action: 'Organization Updated',
    description: 'Organization "Acme Corp" settings were updated',
    timestamp: new Date(Date.now() - 1000 * 60 * 150),
    user: 'john@example.com',
  },
]

export function ActivityLog({ maxHeight = '400px', limit = 10 }: ActivityLogProps) {
  const activities = mockActivities.slice(0, limit)

  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'user':
        return '👤'
      case 'organization':
        return '🏢'
      case 'system':
        return '⚙️'
      case 'security':
        return '🔒'
      default:
        return '📝'
    }
  }

  const getActivityColor = (type: Activity['type']) => {
    switch (type) {
      case 'user':
        return 'text-blue-600'
      case 'organization':
        return 'text-purple-600'
      case 'system':
        return 'text-gray-600'
      case 'security':
        return 'text-red-600'
      default:
        return 'text-gray-600'
    }
  }

  const formatTimestamp = (date: Date) => {
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 1000 / 60)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return date.toLocaleDateString()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Monitor system-wide activities and audit logs</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className={`h-[${maxHeight}]`}>
          <div className="space-y-4">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="text-2xl">{getActivityIcon(activity.type)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className={`font-medium text-sm ${getActivityColor(activity.type)}`}>
                        {activity.action}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">{activity.description}</p>
                      {activity.user && (
                        <p className="text-xs text-muted-foreground mt-1">by {activity.user}</p>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {formatTimestamp(activity.timestamp)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
        <div className="mt-4 p-3 bg-muted/50 rounded-md">
          <p className="text-xs text-muted-foreground">
            📝 Note: Activity logs are currently displaying mock data. In production, this would be
            connected to an audit logging system that tracks all user actions and system events.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
