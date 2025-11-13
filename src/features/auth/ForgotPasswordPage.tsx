import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from './AuthContext'
import {
  Button,
  Input,
  Label,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui'

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const { resetPassword } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await resetPassword(email)
      setSuccess(true)
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to send reset email'
      )
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Check your email</CardTitle>
            <CardDescription>
              We've sent a password reset link to {email}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/login">
              <Button variant="outline" className="w-full">
                Back to Sign In
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Reset Password</CardTitle>
          <CardDescription>
            Enter your email address and we'll send you a link to reset your
            password
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            {error && (
              <div className="text-sm text-destructive bg-destructive/10 p-3 rounded">
                {error}
              </div>
            )}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Sending...' : 'Send Reset Link'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link to="/login" className="text-sm text-primary hover:underline">
              Back to Sign In
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
