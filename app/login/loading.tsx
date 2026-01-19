export default function LoginLoading() {
  return (
    <div className="h-screen w-full flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5">
      <div className="text-center space-y-8">
        {/* Animated Logo/Icon */}
        <div className="relative w-24 h-24 mx-auto">
          <div className="absolute inset-0 rounded-full border-4 border-primary/20 animate-pulse"></div>
          <div className="absolute inset-2 rounded-full border-4 border-t-primary border-r-primary border-b-transparent border-l-transparent animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <svg
              className="w-10 h-10 text-primary"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
        </div>

        {/* Loading Text */}
        <div className="space-y-3">
          <h2 className="text-2xl font-bold text-foreground">Iniciando Sesión</h2>
          <p className="text-muted-foreground">Estamos preparando tu experiencia...</p>
        </div>

        {/* Progress Bar */}
        <div className="w-64 mx-auto">
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-primary to-primary/50 animate-[loading_1.5s_ease-in-out_infinite]"></div>
          </div>
        </div>

        {/* Loading Dots */}
        <div className="flex items-center justify-center gap-2">
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
        </div>
      </div>

      <style jsx>{`
        @keyframes loading {
          0% {
            transform: translateX(-100%);
          }
          50% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(-100%);
          }
        }
      `}</style>
    </div>
  )
}
