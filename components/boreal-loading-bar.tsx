'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

export function BorealLoadingBar() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) {
          return prev
        }
        const increment = Math.random() * 20 + 5
        return Math.min(prev + increment, 95)
      })
    }, 600)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex flex-col items-center justify-center space-y-8">
      {/* Logo */}
      <div className="relative w-32 h-32 flex items-center justify-center">
        <Image
          src="/images/boreal-20-20logos-20fondo-20transparente.png"
          alt="Boreal Loading"
          width={128}
          height={128}
          className="drop-shadow-lg"
          priority
        />
      </div>

      {/* Progress Bar Container */}
      <div className="w-full max-w-sm space-y-2">
        {/* Animated Progress Bar */}
        <div className="relative w-full h-1.5 bg-gray-200/30 rounded-full overflow-hidden backdrop-blur-sm">
          {/* Background gradient track */}
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-100/20 to-blue-100/20 rounded-full" />
          
          {/* Animated progress fill */}
          <div
            className="h-full bg-gradient-to-r from-cyan-400 via-cyan-500 to-blue-500 rounded-full transition-all duration-300 ease-out shadow-lg"
            style={{
              width: `${progress}%`,
              boxShadow: '0 0 20px rgba(34, 211, 238, 0.5), 0 0 40px rgba(59, 130, 246, 0.3)',
            }}
          />
        </div>

        {/* Progress percentage */}
        <div className="flex justify-between items-center">
          <p className="text-xs font-medium text-gray-500">
            {Math.round(progress)}%
          </p>
          <p className="text-xs font-medium text-gray-400">
            Cargando...
          </p>
        </div>
      </div>
    </div>
  )
}
