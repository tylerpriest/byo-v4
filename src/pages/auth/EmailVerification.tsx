import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card'
import { getSupabaseClient } from '@/lib/supabase'
import { Loader2, CheckCircle2, XCircle } from 'lucide-react'

type VerificationStatus = 'verifying' | 'success' | 'error' | 'expired'

export function EmailVerificationPage() {
  const [status, setStatus] = useState<VerificationStatus>('verifying')
  const [errorMessage, setErrorMessage] = useState('')
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  useEffect(() => {
    async function verifyEmail() {
      const token = searchParams.get('token')
      const type = searchParams.get('type')

      // If no token, check if this is an OAuth callback
      if (!token && type !== 'recovery') {
        const supabase = getSupabaseClient()
        const { error } = await supabase.auth.getSession()

        if (error) {
          setStatus('error')
          setErrorMessage(error.message)
        } else {
          setStatus('success')
        }
        return
      }

      // Handle password recovery separately
      if (type === 'recovery') {
        navigate('/reset-password')
        return
      }

      // Verify email confirmation
      if (token) {
        try {
          const supabase = getSupabaseClient()
          const { error } = await supabase.auth.verifyOtp({
            token_hash: token,
            type: 'email',
          })

          if (error) {
            if (error.message.includes('expired')) {
              setStatus('expired')
            } else {
              setStatus('error')
              setErrorMessage(error.message)
            }
          } else {
            setStatus('success')
          }
        } catch (err) {
          setStatus('error')
          setErrorMessage(err instanceof Error ? err.message : 'Verification failed')
        }
      } else {
        setStatus('error')
        setErrorMessage('Invalid verification link')
      }
    }

    void verifyEmail()
  }, [searchParams, navigate])

  const handleContinue = () => {
    if (status === 'success') {
      navigate('/dashboard')
    } else {
      navigate('/login')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-muted/40">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex justify-center mb-4">
            {status === 'verifying' && <Loader2 className="h-12 w-12 text-primary animate-spin" />}
            {status === 'success' && <CheckCircle2 className="h-12 w-12 text-green-500" />}
            {(status === 'error' || status === 'expired') && (
              <XCircle className="h-12 w-12 text-destructive" />
            )}
          </div>
          <CardTitle className="text-center">
            {status === 'verifying' && 'Verifying your email...'}
            {status === 'success' && 'Email verified!'}
            {status === 'error' && 'Verification failed'}
            {status === 'expired' && 'Link expired'}
          </CardTitle>
          <CardDescription className="text-center">
            {status === 'verifying' && 'Please wait while we confirm your email address'}
            {status === 'success' && 'Your email has been successfully verified'}
            {status === 'error' && errorMessage}
            {status === 'expired' &&
              'This verification link has expired. Please request a new one.'}
          </CardDescription>
        </CardHeader>

        {status !== 'verifying' && (
          <>
            <CardContent>
              <p className="text-sm text-muted-foreground text-center">
                {status === 'success'
                  ? 'You can now access all features of your account'
                  : 'If you continue to experience issues, please contact support'}
              </p>
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
              <Button onClick={handleContinue} className="w-full">
                {status === 'success' ? 'Go to Dashboard' : 'Back to Login'}
              </Button>
              {status !== 'success' && (
                <Button variant="outline" onClick={() => navigate('/signup')} className="w-full">
                  Create New Account
                </Button>
              )}
            </CardFooter>
          </>
        )}
      </Card>
    </div>
  )
}
