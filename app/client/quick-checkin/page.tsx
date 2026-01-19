"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Hotel, Check, Loader2 } from "lucide-react"

export default function QuickCheckinPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const isFutureReservation = searchParams.get("type") === "future"
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleCheckin = async () => {
    setIsLoading(true)

    await new Promise((resolve) => setTimeout(resolve, 2000))

    setIsLoading(false)
    setIsSuccess(true)

    if (typeof window !== "undefined") {
      localStorage.setItem("userType", "normal")
    }

    setTimeout(() => {
      if (isFutureReservation) {
        router.push("/client?type=future")
      } else {
        router.push("/client")
      }
    }, 2000)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: "#142834" }}>
        <div className="max-w-md w-full text-center space-y-8">
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-[#6f65d0] to-[#67f1d0] rounded-full blur-xl opacity-50" />
              <div className="relative bg-gradient-to-br from-[#6f65d0] to-[#67f1d0] p-6 rounded-full shadow-2xl">
                <Loader2 className="w-16 h-16 text-white animate-spin" />
              </div>
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Procesando Check-In</h2>
            <p className="text-white/70">Por favor espera un momento...</p>
          </div>
          <div className="flex justify-center gap-2">
            <div className="w-2 h-2 bg-[#67f1d0] rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
            <div className="w-2 h-2 bg-[#67f1d0] rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
            <div className="w-2 h-2 bg-[#67f1d0] rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
          </div>
        </div>
      </div>
    )
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: "#142834" }}>
        <div className="max-w-md w-full text-center space-y-8">
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full blur-xl opacity-50 animate-pulse" />
              <div className="relative bg-gradient-to-br from-green-500 to-emerald-500 p-6 rounded-full shadow-2xl">
                <Check className="w-16 h-16 text-white" strokeWidth={3} />
              </div>
            </div>
          </div>
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">¡Check-In Realizado!</h2>
            <p className="text-white/70">Tu habitación está lista. Redirigiendo...</p>
          </div>
          <div className="h-1 w-32 mx-auto rounded-full bg-gradient-to-r from-green-400 to-emerald-400" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: "#142834" }}>
      <div className="max-w-md w-full text-center space-y-8">
        <div className="space-y-4">
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-[#6f65d0] to-[#67f1d0] rounded-full blur-xl opacity-50 animate-pulse" />
              <div className="relative bg-gradient-to-br from-[#6f65d0] to-[#67f1d0] p-6 rounded-full shadow-2xl">
                <Hotel className="w-16 h-16 text-white" />
              </div>
            </div>
          </div>

          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              {isFutureReservation ? "¡Tu reserva está confirmada!" : "¡Bienvenido!"}
            </h1>
            <p className="text-white/70">
              {isFutureReservation ? "Confirma tu check-in anticipado" : "Tu habitación está lista"}
            </p>
          </div>
        </div>

        <div className="h-1 w-32 mx-auto rounded-full bg-gradient-to-r from-[#6f65d0] to-[#67f1d0]" />

        <div className="space-y-4">
          <Button
            onClick={handleCheckin}
            className="w-full py-8 text-xl font-bold bg-gradient-to-r from-[#6f65d0] to-[#67f1d0] hover:opacity-90 transition-opacity text-white shadow-xl"
          >
            HACER CHECK-IN
          </Button>

          <p className="text-white/50 text-sm">Toca el botón para acceder a tu habitación</p>
        </div>

        <div className="flex justify-center gap-2">
          <div className="w-2 h-2 bg-[#67f1d0] rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
          <div className="w-2 h-2 bg-[#67f1d0] rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
          <div className="w-2 h-2 bg-[#67f1d0] rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
        </div>
      </div>
    </div>
  )
}
