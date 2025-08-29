/**
 * Utility functions for currency formatting in Indian Rupee
 */

/**
 * Format a number as Indian Rupee currency
 * @param amount - The amount to format
 * @param options - Optional formatting options
 * @returns Formatted currency string
 */
export function formatCurrency(
  amount: number,
  options: {
    showDecimals?: boolean
    compact?: boolean
    locale?: string
  } = {}
): string {
  const {
    showDecimals = false,
    compact = false,
    locale = 'en-IN'
  } = options

  if (typeof amount !== 'number' || isNaN(amount)) {
    return '₹0'
  }

  try {
    if (compact && amount >= 1000) {
      // Use compact notation for large amounts (e.g., ₹1.2K, ₹1.5L)
      return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: 'INR',
        notation: 'compact',
        minimumFractionDigits: showDecimals ? 0 : 0,
        maximumFractionDigits: showDecimals ? 2 : 0,
      }).format(amount)
    }

    // Standard formatting with Indian number system
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: showDecimals ? 2 : 0,
      maximumFractionDigits: showDecimals ? 2 : 0,
    }).format(amount)
  } catch (error) {
    // Fallback formatting if Intl is not supported
    console.warn('Intl.NumberFormat not supported, using fallback formatting')
    return `₹${amount.toFixed(showDecimals ? 2 : 0)}`
  }
}

/**
 * Format currency with Indian number system (lakhs, crores)
 * @param amount - The amount to format
 * @returns Formatted currency string with Indian number system
 */
export function formatIndianCurrency(amount: number): string {
  if (typeof amount !== 'number' || isNaN(amount)) {
    return '₹0'
  }

  // Convert to Indian number system
  if (amount >= 10000000) {
    // Crores
    return `₹${(amount / 10000000).toFixed(1)}Cr`
  } else if (amount >= 100000) {
    // Lakhs
    return `₹${(amount / 100000).toFixed(1)}L`
  } else if (amount >= 1000) {
    // Thousands
    return `₹${(amount / 1000).toFixed(1)}K`
  } else {
    return `₹${amount}`
  }
}

/**
 * Get display price with appropriate formatting for menu items
 * @param price - The price to format
 * @param menuType - The menu type for context
 * @returns Formatted price string suitable for display
 */
export function getDisplayPrice(price: number, menuType?: string): string {
  return formatCurrency(price, { showDecimals: false })
}

/**
 * Calculate GST amount (5% as mentioned in requirements)
 * @param amount - Base amount
 * @returns GST amount
 */
export function calculateGST(amount: number): number {
  const GST_RATE = 0.05 // 5%
  return amount * GST_RATE
}

/**
 * Calculate total with GST
 * @param amount - Base amount
 * @returns Total amount including GST
 */
export function calculateTotalWithGST(amount: number): number {
  return amount + calculateGST(amount)
}

/**
 * Format amount with GST breakdown
 * @param amount - Base amount
 * @returns Object with formatted amounts
 */
export function formatAmountWithGST(amount: number) {
  const baseAmount = amount
  const gstAmount = calculateGST(amount)
  const totalAmount = calculateTotalWithGST(amount)

  return {
    base: formatCurrency(baseAmount),
    gst: formatCurrency(gstAmount, { showDecimals: true }),
    total: formatCurrency(totalAmount, { showDecimals: true }),
    gstRate: '5%'
  }
}

/**
 * Currency constants for the Indian market
 */
export const CURRENCY_CONFIG = {
  code: 'INR',
  symbol: '₹',
  name: 'Indian Rupee',
  locale: 'en-IN',
  gstRate: 0.05, // 5%
  gstText: 'Additional 5% GST applicable'
} as const

/**
 * Validate if an amount is a valid currency value
 * @param amount - The amount to validate
 * @returns True if valid currency amount
 */
export function isValidCurrencyAmount(amount: any): amount is number {
  return typeof amount === 'number' && 
         !isNaN(amount) && 
         isFinite(amount) && 
         amount >= 0
}

/**
 * Parse currency string back to number
 * @param currencyString - String like "₹150" or "150"
 * @returns Parsed number or 0 if invalid
 */
export function parseCurrency(currencyString: string): number {
  if (typeof currencyString !== 'string') {
    return 0
  }

  // Remove currency symbol and commas, then parse
  const cleanString = currencyString
    .replace(/₹/g, '')
    .replace(/,/g, '')
    .trim()

  const parsed = parseFloat(cleanString)
  return isValidCurrencyAmount(parsed) ? parsed : 0
}