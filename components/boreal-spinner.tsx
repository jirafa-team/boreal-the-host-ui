'use client'

import React from 'react'

export function BorealSpinner() {
  return (
    <div className="flex items-center justify-center">
      <style>{`
        @keyframes fillCyan1 {
          0% { clip-path: polygon(50% 50%, 50% 50%, 50% 50%, 50% 50%); }
          100% { clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%); }
        }
        
        @keyframes fillBlue {
          0% { clip-path: polygon(50% 50%, 50% 50%, 50% 50%, 50% 50%); }
          100% { clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%); }
        }
        
        @keyframes fillTeal {
          0% { clip-path: polygon(50% 50%, 50% 50%, 50% 50%, 50% 50%); }
          100% { clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%); }
        }
        
        @keyframes fillCyan2 {
          0% { clip-path: polygon(50% 50%, 50% 50%, 50% 50%, 50% 50%); }
          100% { clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%); }
        }
        
        .section-top {
          animation: fillCyan1 1.2s ease-in-out 0s infinite;
        }
        
        .section-right {
          animation: fillBlue 1.2s ease-in-out 0.4s infinite;
        }
        
        .section-bottom {
          animation: fillTeal 1.2s ease-in-out 0.8s infinite;
        }
        
        .section-left {
          animation: fillCyan2 1.2s ease-in-out 1.2s infinite;
        }
      `}</style>
      
      <svg
        width="100"
        height="100"
        viewBox="0 0 200 200"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          {/* Top - Cyan a Blue */}
          <linearGradient id="gradTop" x1="50%" y1="0%" x2="50%" y2="50%">
            <stop offset="0%" stopColor="#06B6D4" />
            <stop offset="100%" stopColor="#3B82F6" />
          </linearGradient>
          
          {/* Right - Blue a Purple */}
          <linearGradient id="gradRight" x1="50%" y1="50%" x2="100%" y2="50%">
            <stop offset="0%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#7C3AED" />
          </linearGradient>
          
          {/* Bottom - Teal */}
          <linearGradient id="gradBottom" x1="50%" y1="50%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="#0D9488" />
            <stop offset="100%" stopColor="#06B6D4" />
          </linearGradient>
          
          {/* Left - Cyan a Teal */}
          <linearGradient id="gradLeft" x1="50%" y1="50%" x2="0%" y2="50%">
            <stop offset="0%" stopColor="#06B6D4" />
            <stop offset="100%" stopColor="#0D9488" />
          </linearGradient>
        </defs>

        {/* Top petal - Cyan to Blue */}
        <g className="section-top">
          <path
            d="M 100 20 C 120 40 130 60 100 100 C 70 60 80 40 100 20 Z"
            fill="url(#gradTop)"
          />
        </g>

        {/* Right petal - Blue to Purple */}
        <g className="section-right">
          <path
            d="M 180 100 C 160 80 140 90 100 100 C 140 110 160 120 180 100 Z"
            fill="url(#gradRight)"
          />
        </g>

        {/* Bottom petal - Teal */}
        <g className="section-bottom">
          <path
            d="M 100 180 C 80 160 70 140 100 100 C 130 140 120 160 100 180 Z"
            fill="url(#gradBottom)"
          />
        </g>

        {/* Left petal - Cyan to Teal */}
        <g className="section-left">
          <path
            d="M 20 100 C 40 120 60 110 100 100 C 60 90 40 80 20 100 Z"
            fill="url(#gradLeft)"
          />
        </g>

        {/* Centro blanco */}
        <circle cx="100" cy="100" r="14" fill="white" />
      </svg>
    </div>
  )
}
