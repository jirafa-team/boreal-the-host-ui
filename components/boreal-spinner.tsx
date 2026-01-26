'use client'

export function BorealSpinner() {
  return (
    <div className="flex items-center justify-center">
      <svg
        width="80"
        height="80"
        viewBox="0 0 200 200"
        className="animate-spin"
        style={{
          animationDuration: '3s',
        }}
      >
        <defs>
          <linearGradient id="gradientCyan" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00D9FF" />
            <stop offset="100%" stopColor="#00B8A3" />
          </linearGradient>
          <linearGradient id="gradientPurple" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#5B4BA3" />
            <stop offset="100%" stopColor="#2E3B91" />
          </linearGradient>
          <style>{`
            @keyframes drawStroke {
              0% {
                stroke-dashoffset: 1000;
              }
              100% {
                stroke-dashoffset: 0;
              }
            }
            
            .boreal-stroke-top-right {
              stroke-dasharray: 300;
              animation: drawStroke 2s ease-in-out infinite;
            }
            
            .boreal-stroke-bottom-right {
              stroke-dasharray: 300;
              animation: drawStroke 2s ease-in-out infinite 0.15s;
            }
            
            .boreal-stroke-bottom-left {
              stroke-dasharray: 300;
              animation: drawStroke 2s ease-in-out infinite 0.3s;
            }
            
            .boreal-stroke-top-left {
              stroke-dasharray: 300;
              animation: drawStroke 2s ease-in-out infinite 0.45s;
            }
          `}</style>
        </defs>

        {/* Top Right Punta - Gradiente Púrpura */}
        <path
          d="M 100 100 Q 140 60 160 20 Q 140 80 100 100"
          fill="url(#gradientPurple)"
          className="boreal-stroke-top-right"
        />

        {/* Bottom Right Punta - Gradiente Púrpura a Teal */}
        <path
          d="M 100 100 Q 140 140 160 180 Q 140 120 100 100"
          fill="url(#gradientCyan)"
          className="boreal-stroke-bottom-right"
        />

        {/* Bottom Left Punta - Gradiente Cyan */}
        <path
          d="M 100 100 Q 60 140 40 180 Q 60 120 100 100"
          fill="url(#gradientCyan)"
          className="boreal-stroke-bottom-left"
        />

        {/* Top Left Punta - Gradiente Púrpura */}
        <path
          d="M 100 100 Q 60 60 40 20 Q 60 80 100 100"
          fill="url(#gradientPurple)"
          className="boreal-stroke-top-left"
        />

        {/* Centro blanco */}
        <circle cx="100" cy="100" r="15" fill="white" />
      </svg>
    </div>
  )
}
