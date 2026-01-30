"use client"

import { useState } from "react"

import { Hotel, Bell, LayoutGrid, Users, BarChart3 } from "lucide-react"
import { Card } from "@/components/ui/card"
import { useLanguage } from "@/lib/i18n-context"

export default function AdminDashboard() {
  const { t } = useLanguage()
  const [selectedMode, setSelectedMode] = useState("hotel"); // Declare selectedMode variable

  return (
    <>
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-10">
        <div className="px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">{t("admin.controlPanel")}</h1>
            <p className="text-sm text-muted-foreground">
              {t("admin.manageYour")} {t("admin.hotel")}
            </p>
          </div>
        </div>
      </header>

      <div className="p-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div
            className="relative overflow-hidden rounded-lg p-4 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer"
            style={{
              background: selectedMode === "hotel" ? "linear-gradient(135deg, rgb(29, 78, 216), rgb(37, 99, 235))" : "white",
              color: selectedMode === "hotel" ? "white" : "black"
            }}
            onClick={() => setSelectedMode("hotel")}
          >
            {selectedMode === "hotel" && (
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 right-0 w-20 h-20 bg-white rounded-full -mr-8 -mt-8"></div>
              </div>
            )}
            <div className="relative flex items-center gap-3">
              <div className={`p-2 rounded-lg ${selectedMode === "hotel" ? "bg-white/20" : "bg-primary/10"}`}>
                <Hotel className={`w-5 h-5 ${selectedMode === "hotel" ? "text-white" : "text-primary"}`} />
              </div>
              <div>
                <p className={`text-sm ${selectedMode === "hotel" ? "opacity-90" : "text-muted-foreground"}`}>{t("admin.totalRooms")}</p>
                <p className="text-2xl font-bold">48</p>
              </div>
            </div>
          </div>

          <div
            className="relative overflow-hidden rounded-lg p-4 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer"
            style={{
              background: selectedMode === "occupancy" ? "linear-gradient(135deg, rgb(34, 197, 94), rgb(22, 163, 74))" : "white",
              color: selectedMode === "occupancy" ? "white" : "black"
            }}
            onClick={() => setSelectedMode("occupancy")}
          >
            {selectedMode === "occupancy" && (
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 right-0 w-20 h-20 bg-white rounded-full -mr-8 -mt-8"></div>
              </div>
            )}
            <div className="relative flex items-center gap-3">
              <div className={`p-2 rounded-lg ${selectedMode === "occupancy" ? "bg-white/20" : "bg-green-100"}`}>
                <BarChart3 className={`w-5 h-5 ${selectedMode === "occupancy" ? "text-white" : "text-green-600"}`} />
              </div>
              <div>
                <p className={`text-sm ${selectedMode === "occupancy" ? "opacity-90" : "text-muted-foreground"}`}>{t("admin.occupancyRate")}</p>
                <p className="text-2xl font-bold">78%</p>
              </div>
            </div>
          </div>

          <div
            className="relative overflow-hidden rounded-lg p-4 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer"
            style={{
              background: selectedMode === "available" ? "linear-gradient(135deg, rgb(124, 58, 255), rgb(109, 40, 217))" : "white",
              color: selectedMode === "available" ? "white" : "black"
            }}
            onClick={() => setSelectedMode("available")}
          >
            {selectedMode === "available" && (
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 right-0 w-20 h-20 bg-white rounded-full -mr-8 -mt-8"></div>
              </div>
            )}
            <div className="relative flex items-center gap-3">
              <div className={`p-2 rounded-lg ${selectedMode === "available" ? "bg-white/20" : "bg-purple-100"}`}>
                <LayoutGrid className={`w-5 h-5 ${selectedMode === "available" ? "text-white" : "text-purple-600"}`} />
              </div>
              <div>
                <p className={`text-sm ${selectedMode === "available" ? "opacity-90" : "text-muted-foreground"}`}>{t("admin.availableNow")}</p>
                <p className="text-2xl font-bold">11</p>
              </div>
            </div>
          </div>

          <div
            className="relative overflow-hidden rounded-lg p-4 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer"
            style={{
              background: selectedMode === "bookings" ? "linear-gradient(135deg, rgb(234, 179, 8), rgb(202, 138, 4))" : "white",
              color: selectedMode === "bookings" ? "white" : "black"
            }}
            onClick={() => setSelectedMode("bookings")}
          >
            {selectedMode === "bookings" && (
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 right-0 w-20 h-20 bg-white rounded-full -mr-8 -mt-8"></div>
              </div>
            )}
            <div className="relative flex items-center gap-3">
              <div className={`p-2 rounded-lg ${selectedMode === "bookings" ? "bg-white/20" : "bg-yellow-100"}`}>
                <Users className={`w-5 h-5 ${selectedMode === "bookings" ? "text-white" : "text-yellow-600"}`} />
              </div>
              <div>
                <p className={`text-sm ${selectedMode === "bookings" ? "opacity-90" : "text-muted-foreground"}`}>{t("admin.bookingsToday")}</p>
                <p className="text-2xl font-bold">23</p>
              </div>
            </div>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 gap-6">
          {/* Recent Activity */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">{t("admin.recentActivity")}</h2>
            <div className="space-y-4">
              {[
                {
                  action: "Nueva reserva confirmada",
                  item: "Habitación 204 - Suite Premium",
                  user: "Carlos Martínez",
                  time: "Hace 5 min",
                  status: "success",
                },
                {
                  action: "Check-out completado",
                  item: "Habitación 105",
                  user: "Ana López",
                  time: "Hace 15 min",
                  status: "neutral",
                },
                {
                  action: "Evento creado",
                  item: "Conferencia Anual Q1",
                  user: "Admin",
                  time: "Hace 1 hora",
                  status: "info",
                },
                {
                  action: "Mantenimiento programado",
                  item: "Habitación 302",
                  user: "Sistema",
                  time: "Hace 2 horas",
                  status: "warning",
                },
                {
                  action: "Pago recibido",
                  item: "Reserva #1847",
                  user: "María González",
                  time: "Hace 3 horas",
                  status: "success",
                },
              ].map((activity, idx) => (
                <div key={idx} className="flex items-start gap-4 pb-4 border-b border-border last:border-0 last:pb-0">
                  <div
                    className={`w-1 h-12 rounded-full shrink-0 ${
                      activity.status === "success"
                        ? "bg-green-500"
                        : activity.status === "warning"
                          ? "bg-yellow-500"
                          : activity.status === "info"
                            ? "bg-blue-500"
                            : "bg-muted"
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground text-sm">{activity.action}</p>
                    <p className="text-sm text-muted-foreground truncate">{activity.item}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-muted-foreground">{activity.user}</span>
                      <span className="text-xs text-muted-foreground">·</span>
                      <span className="text-xs text-muted-foreground">{activity.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </>
  )
}
