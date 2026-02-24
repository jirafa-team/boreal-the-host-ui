"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Hotel, ArrowRight, LogOut } from "lucide-react"
import { useLanguage } from "@/lib/i18n-context"

export default function StaysPage() {
  const router = useRouter()
  const { t } = useLanguage()
  const [currentUser, setCurrentUser] = useState<string | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
    const user = localStorage.getItem("currentUser")
    setCurrentUser(user)
  }, [])

  // Mock data de estadías
  const stays = [
    {
      id: 1,
      name: "Habitación Suite Deluxe",
      checkIn: "2024-03-15",
      checkOut: "2024-03-18",
      status: "Confirmada",
      price: "$450",
      image: "bg-gradient-to-br from-blue-400 to-cyan-300",
    },
    {
      id: 2,
      name: "Habitación Estándar",
      checkIn: "2024-04-10",
      checkOut: "2024-04-15",
      status: "Próxima",
      price: "$300",
      image: "bg-gradient-to-br from-purple-400 to-pink-300",
    },
    {
      id: 3,
      name: "Penthouse",
      checkIn: "2024-05-01",
      checkOut: "2024-05-05",
      status: "Pendiente",
      price: "$800",
      image: "bg-gradient-to-br from-amber-400 to-orange-300",
    },
  ]

  const handleStayClick = (stayId: number) => {
    router.push(`/client/checkin?stayId=${stayId}`)
  }

  const handleLogout = () => {
    localStorage.removeItem("currentUser")
    router.push("/")
  }

  if (!isLoaded) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-cyan-400 to-blue-500 p-3 rounded-lg">
              <Hotel className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">{t("stays.myStays") || "Mis Estadías"}</h1>
              <p className="text-slate-400">{t("stays.welcomeBack") || "Bienvenido de vuelta"}, {currentUser}</p>
            </div>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20"
          >
            <LogOut className="w-4 h-4 mr-2" />
            {t("common.logout") || "Cerrar sesión"}
          </Button>
        </div>
      </div>

      {/* Stays Grid */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stays.map((stay) => (
            <Card key={stay.id} className="bg-slate-800/50 border-slate-700 overflow-hidden hover:shadow-xl hover:shadow-cyan-500/10 transition-all duration-300 cursor-pointer" onClick={() => handleStayClick(stay.id)}>
              <div className={`h-40 ${stay.image} relative`}>
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <Hotel className="w-12 h-12 text-white/40" />
                </div>
                <div className="absolute top-3 right-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    stay.status === "Confirmada" ? "bg-green-500/30 text-green-300" :
                    stay.status === "Próxima" ? "bg-blue-500/30 text-blue-300" :
                    "bg-yellow-500/30 text-yellow-300"
                  }`}>
                    {stay.status}
                  </span>
                </div>
              </div>

              <CardContent className="pt-6 space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">{stay.name}</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between text-slate-300">
                      <span>{t("stays.checkIn") || "Check-in"}:</span>
                      <span className="text-cyan-300 font-semibold">{stay.checkIn}</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>{t("stays.checkOut") || "Check-out"}:</span>
                      <span className="text-cyan-300 font-semibold">{stay.checkOut}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-600">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-bold text-cyan-300">{stay.price}</span>
                    <span className="text-xs text-slate-400">{t("stays.perNight") || "por noche"}</span>
                  </div>
                  <Button className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold rounded-lg flex items-center justify-center gap-2">
                    {t("stays.completeCheckin") || "Completar Check-in"}
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {stays.length === 0 && (
          <div className="text-center py-16">
            <Hotel className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400 text-lg">{t("stays.noStays") || "No tienes estadías registradas"}</p>
          </div>
        )}
      </div>
    </div>
  )
}
