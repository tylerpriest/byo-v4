import { Component, ErrorInfo, ReactNode } from 'react'
import { Button } from '@/components/ui/button'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  }

  public static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)

    this.setState({
      error,
      errorInfo,
    })

    // TODO: Send to error reporting service (e.g., Sentry)
  }

  private handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    })
  }

  private handleReload = () => {
    window.location.href = '/'
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
          <div className="max-w-2xl w-full bg-card border rounded-lg shadow-lg p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-destructive"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  Something went wrong
                </h1>
                <p className="text-sm text-muted-foreground">
                  We apologize for the inconvenience
                </p>
              </div>
            </div>

            <div className="bg-muted/50 rounded-md p-4 mb-6">
              <p className="text-sm font-medium text-foreground mb-2">
                Error Details:
              </p>
              <p className="text-sm text-muted-foreground font-mono">
                {this.state.error?.message || 'Unknown error'}
              </p>
              {import.meta.env.DEV &&
                this.state.errorInfo && (
                  <details className="mt-4">
                    <summary className="text-sm text-muted-foreground cursor-pointer hover:text-foreground">
                      Stack Trace
                    </summary>
                    <pre className="mt-2 text-xs text-muted-foreground overflow-auto max-h-64 p-2 bg-background rounded">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  </details>
                )}
            </div>

            <div className="flex gap-3">
              <Button onClick={this.handleReset} variant="default">
                Try Again
              </Button>
              <Button onClick={this.handleReload} variant="outline">
                Return Home
              </Button>
            </div>

            <p className="mt-6 text-xs text-muted-foreground">
              If this problem persists, please contact support with the error
              details above.
            </p>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
