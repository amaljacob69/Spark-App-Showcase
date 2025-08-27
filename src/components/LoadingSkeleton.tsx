import { Card } from "./ui/card"

export const MenuLoadingSkeleton = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" role="status" aria-label="Loading menu items">
      {Array.from({ length: 6 }).map((_, index) => (
        <Card key={index} className="overflow-hidden">
          <div className="aspect-video bg-muted animate-pulse" />
          <div className="p-6 space-y-3">
            <div className="h-6 bg-muted animate-pulse rounded" />
            <div className="space-y-2">
              <div className="h-4 bg-muted animate-pulse rounded w-full" />
              <div className="h-4 bg-muted animate-pulse rounded w-3/4" />
            </div>
            <div className="flex items-center justify-between pt-2">
              <div className="h-5 bg-muted animate-pulse rounded w-16" />
              <div className="h-8 bg-muted animate-pulse rounded w-20" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}

export const HeaderLoadingSkeleton = () => {
  return (
    <div className="animate-pulse">
      <div className="h-8 bg-muted rounded w-48 mb-4" />
      <div className="flex gap-2 mb-4">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="h-9 bg-muted rounded w-20" />
        ))}
      </div>
    </div>
  )
}