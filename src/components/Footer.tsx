import React from 'react'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="mt-12 pb-20 sm:pb-8 border-t border-border/50 bg-card/50 backdrop-blur-md">
      <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-6 sm:py-8">
        <div className="text-center space-y-3 sm:space-y-4">
          {/* GST Information */}
          <div className="text-sm sm:text-base text-foreground/80 font-medium">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-accent/10 border border-accent/20">
              <span className="text-lg">💰</span>
              <span>Additional 5% GST will be applicable on all orders</span>
            </div>
          </div>
          
          {/* Copyright */}
          <div className="text-xs sm:text-sm text-muted-foreground border-t border-border/30 pt-4">
            <p className="flex items-center justify-center gap-2">
              <span>©</span>
              <span>{currentYear}</span>
              <span className="font-semibold text-foreground/70">Paradise Family Restaurant & Bake Shop</span>
            </p>
            <p className="mt-1 text-muted-foreground/60">All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}