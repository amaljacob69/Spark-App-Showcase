import { useState, useCallback } from 'react'
import { useKV } from '@/hooks/useKV'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
import { Separator } from './ui/separator'
import { ScrollArea } from './ui/scroll-area'
import { toast } from 'sonner'
import { 
  ShoppingCart, 
  Plus, 
  Minus, 
  Trash,
  Receipt,
  X
} from '@phosphor-icons/react'
import { MenuItem, MenuType, getItemPrice } from '../App'
import { formatCurrency, formatAmountWithGST } from '@/lib/currency'

export interface CartItem extends MenuItem {
  quantity: number
  selectedMenuType: MenuType
}

interface CartDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  cartItems: CartItem[]
  onUpdateQuantity: (itemId: string, quantity: number) => void
  onRemoveItem: (itemId: string) => void
  onClearCart: () => void
}

export function CartDialog({
  open,
  onOpenChange,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart
}: CartDialogProps) {
  const getTotalPrice = useCallback(() => {
    return cartItems.reduce((total, item) => {
      return total + (getItemPrice(item, item.selectedMenuType) * item.quantity)
    }, 0)
  }, [cartItems])

  const getTotalItems = useCallback(() => {
    return cartItems.reduce((total, item) => total + item.quantity, 0)
  }, [cartItems])

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      onRemoveItem(itemId)
    } else {
      onUpdateQuantity(itemId, newQuantity)
    }
  }

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      toast.error('Your cart is empty')
      return
    }

    const totalAmount = getTotalPrice()
    const amountWithGST = formatAmountWithGST(totalAmount)
    const itemCount = getTotalItems()
    
    // Create order summary with Indian Rupee
    const orderSummary = cartItems.map(item => 
      `${item.quantity}x ${item.name} (${item.selectedMenuType.replace('-', ' ').toUpperCase()}) - ${formatCurrency(getItemPrice(item, item.selectedMenuType) * item.quantity)}`
    ).join('\n')

    // Create WhatsApp message with GST breakdown
    const message = `*Paradise Family Restaurant - Order*\n\n${orderSummary}\n\n*Subtotal: ${amountWithGST.base}*\n*GST (${amountWithGST.gstRate}): ${amountWithGST.gst}*\n*Total: ${amountWithGST.total}* (${itemCount} items)\n\nPlease confirm this order. Thank you!`
    
    // WhatsApp URL with Indian number format
    const whatsappNumber = '+919876543210' // Replace with actual restaurant WhatsApp number
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`
    
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer')
    
    toast.success('Order sent via WhatsApp!')
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="flex items-center gap-2 text-xl">
            <ShoppingCart size={24} weight="bold" />
            Your Cart
            {cartItems.length > 0 && (
              <Badge variant="secondary" className="ml-2">
                {getTotalItems()} {getTotalItems() === 1 ? 'item' : 'items'}
              </Badge>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 text-center">
              <ShoppingCart size={64} className="text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Your cart is empty</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Add items from the menu to get started
              </p>
              <Button onClick={() => onOpenChange(false)} variant="outline">
                Continue Shopping
              </Button>
            </div>
          ) : (
            <div className="flex flex-col h-full">
              <ScrollArea className="flex-1 px-6">
                <div className="space-y-4 py-4">
                  {cartItems.map((item) => (
                    <Card key={item.id} className="relative">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start gap-3">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-sm leading-tight mb-1">
                              {item.name}
                            </h4>
                            <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                              {item.description}
                            </p>
                            <div className="flex items-center justify-between">
                              <Badge variant="outline" className="text-xs">
                                {item.selectedMenuType.replace('-', ' ').toUpperCase()}
                              </Badge>
                              <span className="font-bold text-sm">
                                {formatCurrency(getItemPrice(item, item.selectedMenuType))}
                              </span>
                            </div>
                          </div>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-6 w-6 absolute top-2 right-2 text-destructive hover:text-destructive"
                            onClick={() => onRemoveItem(item.id)}
                          >
                            <X size={14} />
                          </Button>
                        </div>
                        
                        <Separator className="my-3" />
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Button
                              size="icon"
                              variant="outline"
                              className="h-8 w-8"
                              onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                            >
                              <Minus size={14} />
                            </Button>
                            <span className="w-8 text-center font-semibold">
                              {item.quantity}
                            </span>
                            <Button
                              size="icon"
                              variant="outline"
                              className="h-8 w-8"
                              onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                            >
                              <Plus size={14} />
                            </Button>
                          </div>
                          <span className="font-bold">
                            {formatCurrency(getItemPrice(item, item.selectedMenuType) * item.quantity)}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>

              <div className="border-t bg-card p-6 space-y-4">
                {(() => {
                  const totalAmount = getTotalPrice()
                  const amountWithGST = formatAmountWithGST(totalAmount)
                  
                  return (
                    <div className="space-y-3">
                      <div className="flex justify-between items-center text-sm">
                        <span>Subtotal:</span>
                        <span>{amountWithGST.base}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span>GST ({amountWithGST.gstRate}):</span>
                        <span>{amountWithGST.gst}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-semibold">Total:</span>
                        <span className="text-2xl font-bold text-primary">
                          {amountWithGST.total}
                        </span>
                      </div>
                    </div>
                  )
                })()}

                <div className="flex gap-3">
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={onClearCart}
                  >
                    <Trash size={16} className="mr-2" />
                    Clear
                  </Button>
                  <Button 
                    className="flex-1"
                    onClick={handleCheckout}
                  >
                    <Receipt size={16} className="mr-2" />
                    Order via WhatsApp
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export function useCart() {
  const [cartItems, setCartItems] = useKV<CartItem[]>('cart-items', [])

  const addToCart = useCallback((item: MenuItem, menuType: MenuType, quantity: number = 1) => {
    setCartItems((currentItems) => {
      const existingItemIndex = currentItems.findIndex(
        cartItem => cartItem.id === item.id && cartItem.selectedMenuType === menuType
      )

      if (existingItemIndex >= 0) {
        // Update quantity of existing item
        const updatedItems = [...currentItems]
        updatedItems[existingItemIndex].quantity += quantity
        return updatedItems
      } else {
        // Add new item to cart
        const newCartItem: CartItem = {
          ...item,
          quantity,
          selectedMenuType: menuType
        }
        return [...currentItems, newCartItem]
      }
    })
    
    toast.success(`Added ${item.name} to cart`)
  }, [setCartItems])

  const updateQuantity = useCallback((itemId: string, quantity: number) => {
    setCartItems((currentItems) =>
      currentItems.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      )
    )
  }, [setCartItems])

  const removeFromCart = useCallback((itemId: string) => {
    setCartItems((currentItems) => {
      const item = currentItems.find(item => item.id === itemId)
      if (item) {
        toast.success(`Removed ${item.name} from cart`)
      }
      return currentItems.filter(item => item.id !== itemId)
    })
  }, [setCartItems])

  const clearCart = useCallback(() => {
    setCartItems([])
    toast.success('Cart cleared')
  }, [setCartItems])

  const getCartItemCount = useCallback(() => {
    return (cartItems || []).reduce((total, item) => total + item.quantity, 0)
  }, [cartItems])

  return {
    cartItems: cartItems || [],
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getCartItemCount
  }
}