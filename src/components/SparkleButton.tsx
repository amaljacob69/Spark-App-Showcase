import { useEffect, useState } from 'react'

interface SparkleProps {
  children: React.ReactNode
  className?: string
}

export function SparkleButton({ children, className = '' }: SparkleProps) {
  const [sparkles, setSparkles] = useState<Array<{ id: number; x: number; y: number; size: number }>>([])

  useEffect(() => {
    const addSparkle = () => {
      const newSparkle = {
        id: Math.random(),
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 3 + 2
      }
      
      setSparkles(prev => [...prev.slice(-4), newSparkle]) // Keep only last 5 sparkles
      
      // Remove sparkle after animation
      setTimeout(() => {
        setSparkles(prev => prev.filter(s => s.id !== newSparkle.id))
      }, 1000)
    }

    const interval = setInterval(addSparkle, 600)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {children}
      {sparkles.map(sparkle => (
        <div
          key={sparkle.id}
          className="absolute pointer-events-none animate-pulse"
          style={{
            left: `${sparkle.x}%`,
            top: `${sparkle.y}%`,
            fontSize: `${sparkle.size}px`,
            animation: `pwa-sparkle-float 1s ease-out forwards`
          }}
        >
          ✨
        </div>
      ))}
    </div>
  )
}