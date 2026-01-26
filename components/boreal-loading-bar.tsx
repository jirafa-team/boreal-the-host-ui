'use client'

import { useEffect, useState } from 'react'

export function BorealLoadingBar() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) {
          return prev
        }
        const increment = Math.random() * 15 + 3
        return Math.min(prev + increment, 95)
      })
    }, 400)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex flex-col items-center justify-center gap-10 w-full">
      {/* Logo Boreal */}
      <div className="relative w-40 h-40">
        <img
          src="/images/boreal-20-20logos-20fondo-20transparente.png"
          alt="Boreal Logo"
          className="w-full h-full object-contain drop-shadow-2xl"
          style={{
            filter: 'drop-shadow(0 10px 30px rgba(29, 217, 191, 0.2))',
          }}
        />
      </div>

      {/* Progress Bar Container */}
      <div className="w-full max-w-xs space-y-3">
        {/* Animated Progress Bar with Boreal Gradient */}
        <div className="relative w-full h-2 bg-gradient-to-r from-gray-200/30 via-gray-200/20 to-gray-200/10 rounded-full overflow-hidden backdrop-blur-sm border border-white/10">
          {/* Animated progress fill with Boreal colors */}
          <div
            className="h-full rounded-full transition-all duration-300 ease-out"
            style={{
              width: `${progress}%`,
              background:
                'linear-gradient(90deg, #06B6D4 0%, #1DD9BF 25%, #6366F1 50%, #4F46E5 75%, #0D7A77 100%)',
              boxShadow:
                '0 0 15px rgba(6, 182, 212, 0.6), 0 0 25px rgba(99, 102, 241, 0.4), inset 0 1px 2px rgba(255, 255, 255, 0.3)',
            }}
          />
        </div>

        {/* Progress Text */}
        <div className="flex justify-between items-center px-1">
          <span className="text-xs font-semibold text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-indigo-600">
            {Math.round(progress)}%
          </span>
          <span className="text-xs font-medium text-gray-500">Cargando...</span>
        </div>
      </div>

      {/* Loading dots animation */}
      <div className="flex gap-2">
        <div
          className="w-2 h-2 rounded-full bg-cyan-500"
          style={{
            animation: 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
          }}
        />
        <div
          className="w-2 h-2 rounded-full bg-indigo-500"
          style={{
            animation: 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite 0.3s',
          }}
        />
        <div
          className="w-2 h-2 rounded-full bg-teal-600"
          style={{
            animation: 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite 0.6s',
          }}
        />
      </div>
    </div>
  )
}
