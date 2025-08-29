import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Progress } from './ui/progress'
import { Badge } from './ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { 
  TrendUp, 
  Eye, 
  Users, 
  Star, 
  Clock, 
  ChartBar,
  Download,
  Calendar,
  Filter
} from '@phosphor-icons/react'
import { MenuItem } from '@/types'

interface MenuAnalyticsProps {
  items: MenuItem[]
  isVisible: boolean
}

interface ItemAnalytics {
  id: string
  name: string
  views: number
  orders: number
  rating: number
  conversionRate: number
  revenue: number
  category: string
  trending: boolean
}

export function MenuAnalytics({ items, isVisible }: MenuAnalyticsProps) {
  const [analytics, setAnalytics] = useState<ItemAnalytics[]>([])
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'quarter'>('week')
  const [loading, setLoading] = useState(true)

  // Generate mock analytics data
  useEffect(() => {
    if (!isVisible || !items.length) return

    const generateAnalytics = () => {
      const analyticsData = items.map((item, index) => {
        const baseViews = 50 + Math.floor(Math.random() * 500)
        const baseOrders = Math.floor(baseViews * (0.1 + Math.random() * 0.3))
        const rating = 3 + Math.random() * 2
        
        return {
          id: item.id,
          name: item.name,
          category: item.category,
          views: baseViews,
          orders: baseOrders,
          rating: Math.round(rating * 10) / 10,
          conversionRate: Math.round((baseOrders / baseViews) * 100),
          revenue: baseOrders * (item.prices?.['dinein-ac'] || 0),
          trending: Math.random() > 0.7
        }
      })

      setAnalytics(analyticsData.sort((a, b) => b.revenue - a.revenue))
      setLoading(false)
    }

    setLoading(true)
    const timer = setTimeout(generateAnalytics, 1000)
    return () => clearTimeout(timer)
  }, [items, isVisible, timeframe])

  if (!isVisible) return null

  const totalRevenue = analytics.reduce((sum, item) => sum + item.revenue, 0)
  const totalOrders = analytics.reduce((sum, item) => sum + item.orders, 0)
  const totalViews = analytics.reduce((sum, item) => sum + item.views, 0)
  const averageRating = analytics.length > 0 
    ? analytics.reduce((sum, item) => sum + item.rating, 0) / analytics.length 
    : 0

  const topPerformers = analytics.slice(0, 5)
  const trendingItems = analytics.filter(item => item.trending).slice(0, 3)
  const categoryStats = analytics.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = { orders: 0, revenue: 0, count: 0 }
    }
    acc[item.category].orders += item.orders
    acc[item.category].revenue += item.revenue
    acc[item.category].count += 1
    return acc
  }, {} as Record<string, { orders: number; revenue: number; count: number }>)

  const LoadingSkeleton = () => (
    <div className="space-y-4">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
          <div className="h-2 bg-muted rounded w-full"></div>
        </div>
      ))}
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Header with time selector */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Menu Analytics</h2>
          <p className="text-muted-foreground">Performance insights for your menu items</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Tabs value={timeframe} onValueChange={(v) => setTimeframe(v as any)}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="week">7 Days</TabsTrigger>
              <TabsTrigger value="month">30 Days</TabsTrigger>
              <TabsTrigger value="quarter">90 Days</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <Button size="sm" variant="outline" className="gap-2">
            <Download size={16} />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <ChartBar size={20} className="text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold text-green-600">
                  ${loading ? '---' : totalRevenue.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users size={20} className="text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Orders</p>
                <p className="text-2xl font-bold text-blue-600">
                  {loading ? '---' : totalOrders.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Eye size={20} className="text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Views</p>
                <p className="text-2xl font-bold text-purple-600">
                  {loading ? '---' : totalViews.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Star size={20} className="text-orange-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg. Rating</p>
                <p className="text-2xl font-bold text-orange-600">
                  {loading ? '---' : averageRating.toFixed(1)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Analytics Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performers */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendUp className="text-primary" size={20} />
              Top Performers
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading ? (
              <LoadingSkeleton />
            ) : (
              topPerformers.map((item, index) => (
                <div key={item.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-sm">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium truncate">{item.name}</h4>
                    <p className="text-sm text-muted-foreground">{item.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-600">${item.revenue.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">{item.orders} orders</p>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Trending Items */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="text-primary" size={20} />
              Trending Now
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading ? (
              <LoadingSkeleton />
            ) : trendingItems.length > 0 ? (
              trendingItems.map((item) => (
                <div key={item.id} className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100">
                  <div className="flex-shrink-0">
                    <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                      🔥 HOT
                    </Badge>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium truncate">{item.name}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex items-center gap-1">
                        <Star size={12} className="text-yellow-400 fill-current" />
                        <span className="text-xs">{item.rating}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">•</span>
                      <span className="text-xs text-muted-foreground">{item.conversionRate}% conversion</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-purple-600">
                      +{Math.floor(Math.random() * 50 + 10)}%
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-muted-foreground py-8">
                <Clock size={40} className="mx-auto mb-2 opacity-50" />
                <p>No trending items at the moment</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Category Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="text-primary" size={20} />
            Category Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <LoadingSkeleton />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(categoryStats).map(([category, stats]) => (
                <div key={category} className="p-4 rounded-lg bg-muted/30 border border-border/50">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium">{category}</h4>
                    <Badge variant="outline">{stats.count} items</Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Revenue</span>
                      <span className="font-medium text-green-600">
                        ${stats.revenue.toLocaleString()}
                      </span>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Orders</span>
                      <span className="font-medium">{stats.orders}</span>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Avg. per item</span>
                      <span className="font-medium">
                        ${Math.round(stats.revenue / stats.count).toLocaleString()}
                      </span>
                    </div>
                    
                    <Progress 
                      value={(stats.revenue / totalRevenue) * 100} 
                      className="h-2 mt-2"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Performance Details Table */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Performance</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <LoadingSkeleton />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border text-left">
                    <th className="pb-3 font-medium">Item</th>
                    <th className="pb-3 font-medium text-right">Views</th>
                    <th className="pb-3 font-medium text-right">Orders</th>
                    <th className="pb-3 font-medium text-right">Conversion</th>
                    <th className="pb-3 font-medium text-right">Revenue</th>
                    <th className="pb-3 font-medium text-right">Rating</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.slice(0, 10).map((item) => (
                    <tr key={item.id} className="border-b border-border/50">
                      <td className="py-3">
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-muted-foreground">{item.category}</p>
                        </div>
                      </td>
                      <td className="py-3 text-right">{item.views}</td>
                      <td className="py-3 text-right">{item.orders}</td>
                      <td className="py-3 text-right">{item.conversionRate}%</td>
                      <td className="py-3 text-right font-medium text-green-600">
                        ${item.revenue.toLocaleString()}
                      </td>
                      <td className="py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Star size={14} className="text-yellow-400 fill-current" />
                          <span>{item.rating}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}