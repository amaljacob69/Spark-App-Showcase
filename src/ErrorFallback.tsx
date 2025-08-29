import { Button } from '@/components/ui/button'

interface ErrorFallbackProps {
  error?: Error
  resetErrorBoundary?: () => void
}

export function ErrorFallback({ error, resetErrorBoundary }: ErrorFallbackProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md mx-auto text-center p-6">
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Oops! Something went wrong
          </h2>
          <p className="text-muted-foreground mb-4">
            We apologize for the inconvenience. Please try refreshing the page.
          </p>
          {error && (
            <details className="text-left bg-muted p-3 rounded-md mb-4">
              <summary className="cursor-pointer font-medium mb-2">
                Error Details
              </summary>
              <pre className="text-sm text-destructive whitespace-pre-wrap">
                {error.message}
              </pre>
            </details>
          )}
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button 
            onClick={() => window.location.reload()}
            variant="default"
            className="flex-1 sm:flex-none"
          >
            Refresh Page
          </Button>
          
          {resetErrorBoundary && (
            <Button 
              onClick={resetErrorBoundary}
              variant="outline"
              className="flex-1 sm:flex-none"
            >
              Try Again
            </Button>
          )}
        </div>
        
        <div className="mt-6 pt-4 border-t border-border">
          <p className="text-sm text-muted-foreground">
            If this problem persists, please contact us at{' '}
            <a 
              href="mailto:support@paradise-family.com" 
              className="text-primary hover:underline"
            >
              support@paradise-family.com
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}