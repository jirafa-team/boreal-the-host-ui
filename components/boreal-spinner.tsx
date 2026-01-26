'use client'

export function BorealSpinner() {
  return (
    <div className="flex items-center justify-center">
      <svg
        width="120"
        height="120"
        viewBox="0 0 200 200"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <style>{`
            @keyframes reveal {
              0% {
                opacity: 0;
                transform: scale(0.8);
              }
              100% {
                opacity: 1;
                transform: scale(1);
              }
            }
            
            .section-top-right {
              animation: reveal 0.6s ease-out forwards;
              animation-delay: 0s;
              transform-origin: 100px 100px;
            }
            
            .section-bottom-right {
              animation: reveal 0.6s ease-out forwards;
              animation-delay: 0.3s;
              transform-origin: 100px 100px;
            }
            
            .section-bottom-left {
              animation: reveal 0.6s ease-out forwards;
              animation-delay: 0.6s;
              transform-origin: 100px 100px;
            }
            
            .section-top-left {
              animation: reveal 0.6s ease-out forwards;
              animation-delay: 0.9s;
              transform-origin: 100px 100px;
            }
            
            .center-circle {
              animation: reveal 0.6s ease-out forwards;
              animation-delay: 1.2s;
            }
          `}</style>
          
          {/* Gradientes para cada sección */}
          <linearGradient id="gradientTopRight" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2E3B91" />
            <stop offset="100%" stopColor="#5B4BA3" />
          </linearGradient>
          
          <linearGradient id="gradientBottomRight" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0D7C7C" />
            <stop offset="100%" stopColor="#2E5C6E" />
          </linearGradient>
          
          <linearGradient id="gradientBottomLeft" x1="100%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#00D9FF" />
            <stop offset="100%" stopColor="#00B8A3" />
          </linearGradient>
          
          <linearGradient id="gradientTopLeft" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#00A8CC" />
            <stop offset="100%" stopColor="#00D9FF" />
          </linearGradient>
        </defs>

        {/* Sección Superior Derecha - Púrpura */}
        <path
          className="section-top-right"
          d="M 100 100 Q 130 70 150 20 Q 180 50 160 100 Z"
          fill="url(#gradientTopRight)"
        />

        {/* Sección Inferior Derecha - Teal Oscuro */}
        <path
          className="section-bottom-right"
          d="M 100 100 Q 160 100 180 150 Q 130 130 100 160 Z"
          fill="url(#gradientBottomRight)"
        />

        {/* Sección Inferior Izquierda - Cyan */}
        <path
          className="section-bottom-left"
          d="M 100 100 Q 100 160 50 180 Q 70 130 100 100 Z"
          fill="url(#gradientBottomLeft)"
        />

        {/* Sección Superior Izquierda - Cyan Claro */}
        <path
          className="section-top-left"
          d="M 100 100 Q 50 100 20 50 Q 70 70 100 100 Z"
          fill="url(#gradientTopLeft)"
        />

        {/* Centro blanco */}
        <circle cx="100" cy="100" r="18" fill="white" className="center-circle" />
      </svg>
    </div>
  )
}
