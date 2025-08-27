import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { Badge } from './ui/badge'
import { useKV } from '@github/spark/hooks'
import { MenuItem, MenuType } from '../App'
import { 
  TrendUp, 
  TrendDown, 
  Star, 
  Users, 
  CurrencyDollar,
  Eye,
  ChartBar,
  Clock,
  Target
} from '@phosphor-icons/react'
import { cn } from '@/lib/utils'

interface MenuAnalytics {
  totalItems: number
  availableItems: number
  categoriesCount: number
  averagePrice: { [key in MenuType]: number }
  priceRange: { [key in MenuType]: { min: number, max: number } }
  categoryDistribution: { [category: string]: number }
  popularCategories: string[]
  recentlyAdded: MenuItem[]
  expensiveItems: MenuItem[]
  budgetFriendlyItems: MenuItem[]
}

interface AnalyticsDashboardProps {
  menuItems: MenuItem[]
  className?: string
}

export function AnalyticsDashboard({ menuItems, className }: AnalyticsDashboardProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'all'>('all')
  
  // Calculate analytics
  const analytics: MenuAnalytics = useMemo(() => {
    const totalItems = menuItems.length
    const availableItems = menuItems.filter(item => item.available).length
    const categories = Array.from(new Set(menuItems.map(item => item.category)))
    const categoriesCount = categories.length

    // Calculate average prices per menu type
    const averagePrice: { [key in MenuType]: number } = {
      'dinein-non-ac': 0,
      'dinein-ac': 0,
      'takeaway': 0
    }

    const priceRange: { [key in MenuType]: { min: number, max: number } } = {
      'dinein-non-ac': { min: Infinity, max: -Infinity },
      'dinein-ac': { min: Infinity, max: -Infinity },
      'takeaway': { min: Infinity, max: -Infinity }
    }

    // Calculate pricing analytics
    const menuTypes: MenuType[] = ['dinein-non-ac', 'dinein-ac', 'takeaway']
    
    menuTypes.forEach(menuType => {
      const prices = menuItems
        .filter(item => item.available && item.prices[menuType])
        .map(item => item.prices[menuType])
      
      if (prices.length > 0) {
        averagePrice[menuType] = prices.reduce((sum, price) => sum + price, 0) / prices.length
        priceRange[menuType].min = Math.min(...prices)
        priceRange[menuType].max = Math.max(...prices)
      } else {
        priceRange[menuType] = { min: 0, max: 0 }
      }
    })

    // Category distribution
    const categoryDistribution: { [category: string]: number } = {}
    categories.forEach(category => {
      categoryDistribution[category] = menuItems.filter(item => item.category === category).length
    })

    // Popular categories (by item count)
    const popularCategories = categories
      .sort((a, b) => categoryDistribution[b] - categoryDistribution[a])
      .slice(0, 3)

    // Recently added (mock data since we don't track creation date)
    const recentlyAdded = menuItems.slice(-3)

    // Most expensive items (based on AC pricing)
    const expensiveItems = [...menuItems]
      .sort((a, b) => (b.prices['dinein-ac'] || 0) - (a.prices['dinein-ac'] || 0))
      .slice(0, 3)

    // Budget-friendly items (based on takeaway pricing)
    const budgetFriendlyItems = [...menuItems]
      .filter(item => item.prices['takeaway'] > 0)
      .sort((a, b) => (a.prices['takeaway'] || 0) - (b.prices['takeaway'] || 0))
      .slice(0, 3)

    return {
      totalItems,
      availableItems,
      categoriesCount,
      averagePrice,
      priceRange,
      categoryDistribution,
      popularCategories,
      recentlyAdded,
      expensiveItems,
      budgetFriendlyItems
    }
  }, [menuItems])

  const formatCurrency = (amount: number) => `$${amount.toFixed(2)}`

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-display">
          <ChartBar className="text-primary" size={24} />
          Menu Analytics Dashboard
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Insights and metrics for your restaurant menu
        </p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="pricing">Pricing</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Items</p>
                      <p className="text-2xl font-bold">{analytics.totalItems}</p>
                    </div>
                    <Target className="text-primary" size={20} />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Available</p>
                      <p className="text-2xl font-bold text-green-600">{analytics.availableItems}</p>
                    </div>
                    <Eye className="text-green-600" size={20} />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Categories</p>
                      <p className="text-2xl font-bold">{analytics.categoriesCount}</p>
                    </div>
                    <Users className="text-primary" size={20} />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Unavailable</p>
                      <p className="text-2xl font-bold text-orange-600">
                        {analytics.totalItems - analytics.availableItems}
                      </p>
                    </div>
                    <TrendDown className="text-orange-600" size={20} />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Pricing Tab */}
          <TabsContent value="pricing" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {Object.entries(analytics.averagePrice).map(([menuType, avgPrice]) => (
                <Card key={menuType}>
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-sm">
                          {menuType.replace('-', ' ').toUpperCase()}
                        </h4>
                        <CurrencyDollar className="text-primary" size={16} />
                      </div>
                      
                      <div className="space-y-2">
                        <div>
                          <p className="text-xs text-muted-foreground">Average Price</p>
                          <p className="text-xl font-bold">{formatCurrency(avgPrice)}</p>
                        </div>
                        
                        <div className="flex justify-between text-xs">
                          <span>
                            Min: {formatCurrency(analytics.priceRange[menuType as MenuType].min)}
                          </span>
                          <span>
                            Max: {formatCurrency(analytics.priceRange[menuType as MenuType].max)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Categories Tab */}
          <TabsContent value="categories" className="space-y-4">
            <div className="space-y-4">
              <h4 className="font-medium">Category Distribution</h4>
              <div className="space-y-2">
                {Object.entries(analytics.categoryDistribution)
                  .sort(([,a], [,b]) => b - a)
                  .map(([category, count]) => (
                    <div key={category} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <span className="font-medium">{category}</span>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">{count} items</Badge>
                        <div className="w-20 bg-muted rounded-full h-2">
                          <div 
                            className="bg-primary rounded-full h-2 transition-all duration-500"
                            style={{ 
                              width: `${Math.max(10, (count / analytics.totalItems) * 100)}%` 
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </TabsContent>

          {/* Insights Tab */}
          <TabsContent value="insights" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Popular Categories */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Star className="text-yellow-500" size={20} />
                    Top Categories
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {analytics.popularCategories.map((category, index) => (
                      <div key={category} className="flex items-center gap-3">
                        <Badge variant="outline" className="w-6 h-6 p-0 flex items-center justify-center text-xs">
                          {index + 1}
                        </Badge>
                        <span className="flex-1">{category}</span>
                        <span className="text-sm text-muted-foreground">
                          {analytics.categoryDistribution[category]} items
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Budget Friendly */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <CurrencyDollar className="text-green-600" size={20} />
                    Budget Friendly
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {analytics.budgetFriendlyItems.map((item, index) => (
                      <div key={item.id} className="flex items-center justify-between">
                        <span className="text-sm truncate flex-1 mr-2">{item.name}</span>
                        <Badge variant="outline" className="text-green-600">
                          {formatCurrency(item.prices['takeaway'])}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Premium Items */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <TrendUp className="text-purple-600" size={20} />
                    Premium Items
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {analytics.expensiveItems.map((item) => (
                      <div key={item.id} className="flex items-center justify-between">
                        <span className="text-sm truncate flex-1 mr-2">{item.name}</span>
                        <Badge variant="outline" className="text-purple-600">
                          {formatCurrency(item.prices['dinein-ac'])}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Clock className="text-blue-600" size={20} />
                    Recently Added
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {analytics.recentlyAdded.map((item) => (
                      <div key={item.id} className="flex items-center gap-3">
                        <div className="flex-1">
                          <p className="text-sm font-medium truncate">{item.name}</p>
                          <p className="text-xs text-muted-foreground">{item.category}</p>
                        </div>
                        <Badge 
                          variant={item.available ? "default" : "secondary"}
                          className="text-xs"
                        >
                          {item.available ? "Available" : "Unavailable"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}