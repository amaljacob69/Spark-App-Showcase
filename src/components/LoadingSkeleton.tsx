import { useState, useEffect } from 'react'
import { Card, CardContent } from './ui/card'
import { cn } from '@/lib/utils'

interface LoadingSkeletonProps {
  type?: 'card' | 'header' | 'text' | 'menu-grid' | 'menu-item'
  count?: number
  className?: string
}

export function LoadingSkeleton({ 
  type = 'card', 
  count = 1, 
  className 
}: LoadingSkeletonProps) {
  const [loadingPhase, setLoadingPhase] = useState(0)
  
  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingPhase(prev => (prev + 1) % 3)
    }, 500)
    return () => clearInterval(interval)
  }, [])

  const SkeletonBar = ({ width, height = 'h-4', delay = 0 }: { 
    width: string
    height?: string
    delay?: number 
  }) => (
    <div 
      className={cn(
        `${height} ${width} bg-gradient-to-r from-muted via-muted/50 to-muted rounded-md`,
        'animate-pulse',
        className
      )}
      style={{
        animationDelay: `${delay}ms`,
        animationDuration: '1.5s'
      }}
    />
  )

  const CardSkeleton = () => (
    <Card className="overflow-hidden">
      <CardContent className="p-4 sm:p-5 lg:p-6">
        <div className="space-y-4">
          <div className="flex justify-between items-start gap-3">
            <div className="flex-1 space-y-2">
              <SkeletonBar width="w-3/4" height="h-5" />
              <SkeletonBar width="w-full" height="h-3" delay={100} />
              <SkeletonBar width="w-5/6" height="h-3" delay={200} />
            </div>
            <SkeletonBar width="w-16" height="h-6" delay={300} />
          </div>
          
          <div className="flex gap-2">
            <SkeletonBar width="w-16" height="h-5" delay={400} />
            <SkeletonBar width="w-20" height="h-5" delay={500} />
          </div>
          
          <SkeletonBar width="w-full" height="h-9" delay={600} />
        </div>
      </CardContent>
    </Card>
  )

  const MenuItemSkeleton = () => (
    <Card className="overflow-hidden group">
      {/* Image skeleton */}
      <div className="h-48 sm:h-56 bg-gradient-to-br from-muted via-muted/70 to-muted/50 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-pulse" 
             style={{ animationDuration: '2s', animationIterationCount: 'infinite' }} />
      </div>
      
      <CardContent className="p-4 sm:p-5 lg:p-6">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex justify-between items-start gap-3">
            <div className="flex-1 space-y-2">
              <SkeletonBar width="w-4/5" height="h-5" />
              <div className="flex items-center gap-2">
                <SkeletonBar width="w-12" height="h-3" delay={100} />
                <SkeletonBar width="w-8" height="h-3" delay={150} />
              </div>
              <SkeletonBar width="w-full" height="h-3" delay={200} />
              <SkeletonBar width="w-3/4" height="h-3" delay={250} />
            </div>
            <SkeletonBar width="w-16" height="h-7" delay={300} />
          </div>
          
          {/* Badges */}
          <div className="flex gap-2">
            <SkeletonBar width="w-16" height="h-6" delay={400} />
            <SkeletonBar width="w-20" height="h-6" delay={450} />
          </div>
          
          {/* Dietary icons */}
          <div className="flex items-center gap-2">
            <SkeletonBar width="w-12" height="h-3" delay={500} />
            <div className="flex gap-1.5">
              {[...Array(3)].map((_, i) => (
                <SkeletonBar key={i} width="w-7" height="h-7" delay={550 + i * 50} />
              ))}
            </div>
          </div>
          
          {/* Button */}
          <SkeletonBar width="w-full" height="h-9" delay={700} />
        </div>
      </CardContent>
    </Card>
  )

  const HeaderSkeleton = () => (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <SkeletonBar width="w-48" height="h-8" />
          <SkeletonBar width="w-32" height="h-4" delay={100} />
        </div>
        <SkeletonBar width="w-24" height="h-9" delay={200} />
      </div>
      
      {/* Navigation skeleton */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {[...Array(6)].map((_, i) => (
          <SkeletonBar key={i} width="w-20" height="h-8" delay={i * 50} />
        ))}
      </div>
    </div>
  )

  const TextSkeleton = () => (
    <div className="space-y-3">
      {[...Array(count)].map((_, i) => (
        <div key={i} className="space-y-2">
          <SkeletonBar width="w-full" height="h-4" delay={i * 100} />
          <SkeletonBar width="w-5/6" height="h-4" delay={i * 100 + 50} />
          {i < count - 1 && <SkeletonBar width="w-3/4" height="h-4" delay={i * 100 + 100} />}
        </div>
      ))}
    </div>
  )

  const MenuGridSkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
      {[...Array(count)].map((_, i) => (
        <div key={i} className={cn(
          "stagger-fade-in",
          `stagger-slide-up-${Math.min(i + 1, 5)}`
        )}>
          <MenuItemSkeleton />
        </div>
      ))}
    </div>
  )

  const skeletonComponents = {
    card: CardSkeleton,
    header: HeaderSkeleton,
    text: TextSkeleton,
    'menu-grid': MenuGridSkeleton,
    'menu-item': MenuItemSkeleton
  }

  const Component = skeletonComponents[type]

  if (type === 'menu-grid' || type === 'header') {
    return <Component />
  }

  if (count === 1) {
    return <Component />
  }

  return (
    <div className={cn("space-y-4", className)}>
      {[...Array(count)].map((_, i) => (
        <Component key={i} />
      ))}
    </div>
  )
}

// Enhanced skeleton with shimmer effect
export function ShimmerSkeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "relative overflow-hidden bg-muted rounded-md",
        className
      )}
      {...props}
    >
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent" />
    </div>
  )
}

// Specific loading states for different components
export function MenuItemLoadingSkeleton() {
  return (
    <Card className="overflow-hidden animate-pulse">
      <div className="h-48 sm:h-56 bg-muted relative">
        <div className="absolute inset-0 bg-gradient-to-r from-muted via-muted/50 to-muted animate-pulse" />
      </div>
      <CardContent className="p-4 sm:p-5 lg:p-6">
        <div className="space-y-4">
          <div className="flex justify-between items-start gap-3">
            <div className="flex-1 space-y-2">
              <div className="h-5 bg-muted rounded w-3/4" />
              <div className="h-3 bg-muted rounded w-full" />
              <div className="h-3 bg-muted rounded w-5/6" />
            </div>
            <div className="h-6 bg-muted rounded w-16" />
          </div>
          <div className="flex gap-2">
            <div className="h-5 bg-muted rounded w-16" />
            <div className="h-5 bg-muted rounded w-20" />
          </div>
          <div className="h-9 bg-muted rounded w-full" />
        </div>
      </CardContent>
    </Card>
  )
}

export function SearchLoadingSkeleton() {
  return (
    <div className="space-y-4">
      <div className="h-12 bg-muted rounded-xl animate-pulse" />
      <div className="flex gap-2">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-9 bg-muted rounded-lg w-20 animate-pulse" />
        ))}
      </div>
    </div>
  )
}

// Add shimmer keyframe to your CSS
const shimmerKeyframes = `
@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}
`

// You can add this to your index.css file or use it with styled-components