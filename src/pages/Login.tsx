import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAuth } from '@/features/auth/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card'
import { getDemoModeStatus } from '@/lib/supabase'
import { loginSchema, type LoginFormData } from '@/lib/validations'
import { useToast } from '@/components/ui/use-toast'

export function LoginPage() {
  const [loading, setLoading] = useState(false)
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const demoStatus = getDemoModeStatus()
  const { toast } = useToast()

  const {
    register,
    handleSubmit: handleFormSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const handleSubmit = async (data: LoginFormData) => {
    setLoading(true)

    try {
      await signIn(data.email, data.password)
      navigate('/dashboard')
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to sign in'
      setError('root', { message })
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDemoLogin = async (isAdmin = false) => {
    setLoading(true)

    try {
      const demoEmail = isAdmin ? 'admin@example.com' : 'demo@example.com'
      await signIn(demoEmail, 'demo-password')
      navigate('/dashboard')
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to sign in'
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-muted/40">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Sign in</CardTitle>
          <CardDescription>Enter your email and password to access your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleFormSubmit(handleSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                {...register('email')}
                disabled={loading}
              />
              {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link to="/reset-password" className="text-sm text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>
              <Input id="password" type="password" {...register('password')} disabled={loading} />
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password.message}</p>
              )}
            </div>
            {errors.root && (
              <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                {errors.root.message}
              </div>
            )}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>

          {demoStatus.isActive && (
            <div className="mt-6 space-y-3">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">Demo Mode</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleDemoLogin(false)}
                  disabled={loading}
                >
                  Demo User
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleDemoLogin(true)}
                  disabled={loading}
                >
                  Demo Admin
                </Button>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <p className="text-sm text-muted-foreground text-center">
            Don't have an account?{' '}
            <Link to="/signup" className="text-primary hover:underline">
              Sign up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
