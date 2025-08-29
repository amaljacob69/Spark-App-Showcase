import React from 'react'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="mt-12 pb-20 sm:pb-8 border-t border-border/50 bg-card/50 backdrop-blur-md">
      <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-6 sm:py-8">
        <div className="text-center space-y-4 sm:space-y-5">
          {/* Restaurant Description for SEO */}
          <div className="text-sm sm:text-base text-foreground/80 font-medium max-w-2xl mx-auto">
            <h2 className="text-lg font-display font-semibold text-primary mb-2">
              Paradise Family Restaurant & Bake Shop, Chalakudy
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Experience authentic Kerala cuisine, traditional Arabic dishes, and delicious Chinese specialties. 
              Our fresh bakery items complement our diverse menu. Located in Chalakudy, Kerala.
            </p>
          </div>
          
          {/* Cuisine Specialties */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs sm:text-sm">
            <span className="px-3 py-1 bg-primary/10 text-primary rounded-full font-medium">Kerala Cuisine</span>
            <span className="px-3 py-1 bg-accent/10 text-accent rounded-full font-medium">Arabic Dishes</span>
            <span className="px-3 py-1 bg-secondary/60 text-secondary-foreground rounded-full font-medium">Chinese Food</span>
            <span className="px-3 py-1 bg-muted text-muted-foreground rounded-full font-medium">Fresh Bakery</span>
          </div>
          
          {/* GST Information */}
          <div className="text-sm sm:text-base text-foreground/80 font-medium">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-accent/10 border border-accent/20">
              <span className="text-lg">💰</span>
              <span>Additional 5% GST applicable on all orders • Prices in Indian Rupees (₹)</span>
            </div>
          </div>
          
          {/* Copyright */}
          <div className="text-xs sm:text-sm text-muted-foreground border-t border-border/30 pt-4">
            <p className="flex items-center justify-center gap-2">
              <span>©</span>
              <span>{currentYear}</span>
              <span className="font-semibold text-foreground/70">Paradise Family Restaurant & Bake Shop</span>
            </p>
            <p className="mt-1 text-muted-foreground/60">All rights reserved. Authentic Kerala, Arabic & Chinese Cuisine in Chalakudy</p>
          </div>
        </div>
      </div>
    </footer>
  )
}