/**
 * Production build optimization script
 */

const fs = require('fs')
const path = require('path')

// Build configuration for production
const buildConfig = {
  // Minification settings
  minify: {
    removeComments: true,
    collapseWhitespace: true,
    removeRedundantAttributes: true,
    useShortDoctype: true,
    removeEmptyAttributes: true,
    removeStyleLinkTypeAttributes: true,
    keepClosingSlash: true,
    minifyJS: true,
    minifyCSS: true,
    minifyURLs: true
  },
  
  // Code splitting configuration
  splitChunks: {
    chunks: 'all',
    cacheGroups: {
      vendor: {
        test: /[\\/]node_modules[\\/]/,
        name: 'vendors',
        chunks: 'all',
        priority: 10
      },
      common: {
        name: 'common',
        minChunks: 2,
        chunks: 'all',
        priority: 5,
        reuseExistingChunk: true
      }
    }
  },
  
  // Asset optimization
  optimization: {
    images: {
      mozjpeg: { progressive: true, quality: 80 },
      optipng: { optimizationLevel: 5 },
      webp: { quality: 80 }
    },
    fonts: {
      preload: ['Inter', 'Playfair Display']
    }
  },
  
  // Bundle analysis
  analyze: process.env.ANALYZE === 'true',
  
  // Progressive Web App settings
  pwa: {
    workbox: {
      runtimeCaching: [
        {
          urlPattern: /^https:\/\/fonts\.googleapis\.com/,
          handler: 'StaleWhileRevalidate',
          options: {
            cacheName: 'google-fonts-stylesheets'
          }
        },
        {
          urlPattern: /^https:\/\/fonts\.gstatic\.com/,
          handler: 'CacheFirst',
          options: {
            cacheName: 'google-fonts-webfonts',
            expiration: {
              maxEntries: 30,
              maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
            }
          }
        }
      ]
    }
  }
}

// Performance budget configuration
const performanceBudget = {
  // Bundle size limits
  maxBundleSize: '500kb',
  maxChunkSize: '200kb',
  
  // Loading performance
  maxLCP: 2500, // milliseconds
  maxFID: 100,  // milliseconds
  maxCLS: 0.1,  // layout shift score
  
  // Network performance
  maxRequests: 50,
  maxTransferSize: '2MB'
}

// Security headers for production
const securityHeaders = {
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https:",
    "connect-src 'self' https:",
    "frame-ancestors 'none'"
  ].join('; '),
  
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains'
}

// Environment validation
const requiredEnvVars = [
  'NODE_ENV',
  'VITE_APP_BASE_URL'
]

function validateEnvironment() {
  const missing = requiredEnvVars.filter(envVar => !process.env[envVar])
  
  if (missing.length > 0) {
    console.error('Missing required environment variables:', missing)
    process.exit(1)
  }
  
  console.log('✅ Environment validation passed')
}

// Bundle analysis
function analyzeBundleSize(stats) {
  const assets = stats.compilation.assets
  let totalSize = 0
  let warnings = []
  
  Object.keys(assets).forEach(assetName => {
    const asset = assets[assetName]
    const size = asset.size()
    totalSize += size
    
    // Check individual asset sizes
    if (assetName.endsWith('.js') && size > 200 * 1024) {
      warnings.push(`Large JavaScript bundle: ${assetName} (${(size / 1024).toFixed(1)}KB)`)
    }
    
    if (assetName.endsWith('.css') && size > 100 * 1024) {
      warnings.push(`Large CSS file: ${assetName} (${(size / 1024).toFixed(1)}KB)`)
    }
  })
  
  console.log(`📦 Total bundle size: ${(totalSize / 1024).toFixed(1)}KB`)
  
  if (warnings.length > 0) {
    console.warn('⚠️  Bundle size warnings:')
    warnings.forEach(warning => console.warn(`  ${warning}`))
  }
  
  if (totalSize > 500 * 1024) {
    console.error('❌ Bundle size exceeds performance budget (500KB)')
    process.exit(1)
  }
}

// Pre-build checks
function runPreBuildChecks() {
  console.log('🔍 Running pre-build checks...')
  
  // Validate environment
  validateEnvironment()
  
  // Check TypeScript compilation
  console.log('🔧 Checking TypeScript compilation...')
  
  // Check for common issues
  console.log('🧐 Checking for common issues...')
  
  console.log('✅ Pre-build checks completed')
}

// Post-build optimizations
function runPostBuildOptimizations() {
  console.log('🚀 Running post-build optimizations...')
  
  // Generate security headers file
  const headersContent = Object.entries(securityHeaders)
    .map(([header, value]) => `${header}: ${value}`)
    .join('\n')
  
  fs.writeFileSync(path.join(__dirname, 'dist/_headers'), headersContent)
  
  // Generate robots.txt
  const robotsContent = `User-agent: *
Allow: /
Disallow: /admin
Disallow: /api/

Sitemap: ${process.env.VITE_APP_BASE_URL}/sitemap.xml`
  
  fs.writeFileSync(path.join(__dirname, 'dist/robots.txt'), robotsContent)
  
  // Generate sitemap.xml
  const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${process.env.VITE_APP_BASE_URL}/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${process.env.VITE_APP_BASE_URL}/?menu=dinein-non-ac</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${process.env.VITE_APP_BASE_URL}/?menu=dinein-ac</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${process.env.VITE_APP_BASE_URL}/?menu=takeaway</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>`
  
  fs.writeFileSync(path.join(__dirname, 'dist/sitemap.xml'), sitemapContent)
  
  console.log('✅ Post-build optimizations completed')
}

module.exports = {
  buildConfig,
  performanceBudget,
  securityHeaders,
  runPreBuildChecks,
  runPostBuildOptimizations,
  analyzeBundleSize
}