'use client'

import { useEffect, useState } from 'react'

export function BorealLoadingBar() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 100
        const increment = Math.random() * 4 + 1
        return Math.min(prev + increment, 100)
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex flex-col items-center justify-center gap-12 w-full max-w-md">
      {/* Boreal Logo - Static */}
      <img
        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Boreal%20-%20Logos%20Fondo%20transparente-ubZrjxMOj3R7xPHOr0FFzrtTXekF0J.png"
        alt="Boreal Logo"
        className="w-48 h-48 object-contain"
      />

      {/* Progress Bar Container */}
      <div className="w-full max-w-sm space-y-3">
        {/* Animated Progress Bar with Boreal Gradient */}
        <div className="relative w-full h-1 bg-gray-200 rounded-full overflow-hidden shadow-sm">
          {/* Animated progress fill with Boreal colors */}
          <div
            className="h-full rounded-full transition-all duration-300 ease-out"
            style={{
              width: `${progress}%`,
              background:
                'linear-gradient(90deg, #06B6D4 0%, #1DD9BF 25%, #6366F1 50%, #4F46E5 75%, #0D7A77 100%)',
              boxShadow:
                '0 0 12px rgba(6, 182, 212, 0.8), 0 0 20px rgba(99, 102, 241, 0.6)',
            }}
          />
        </div>

        {/* Progress Text */}
        <div className="flex justify-between items-center px-1">
          <span className="text-sm font-semibold text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-indigo-600">
            {Math.round(progress)}%
          </span>
          <span className="text-sm font-medium text-gray-600">Cargando...</span>
        </div>
      </div>
    </div>
  )
}
