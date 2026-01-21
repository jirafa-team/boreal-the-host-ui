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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  {t("admin.totalRooms")}
                </p>
                <p className="text-3xl font-bold text-foreground mt-2">48</p>
                <p className="text-xs text-muted-foreground mt-1">+2 {t("admin.sinceLastMonth")}</p>
              </div>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Hotel className="w-6 h-6 text-primary" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{t("admin.occupancyRate")}</p>
                <p className="text-3xl font-bold text-foreground mt-2">78%</p>
                <p className="text-xs text-green-600 mt-1">+5% {t("admin.thisWeek")}</p>
              </div>
              <div className="w-12 h-12 bg-chart-2/10 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-chart-2" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{t("admin.availableNow")}</p>
                <p className="text-3xl font-bold text-foreground mt-2">11</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {t("admin.ofTotal")} 48 {t("admin.total")}
                </p>
              </div>
              <div className="w-12 h-12 bg-chart-3/10 rounded-lg flex items-center justify-center">
                <LayoutGrid className="w-6 h-6 text-chart-3" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{t("admin.bookingsToday")}</p>
                <p className="text-3xl font-bold text-foreground mt-2">23</p>
                <p className="text-xs text-muted-foreground mt-1">8 {t("admin.pendingCheckins")}</p>
              </div>
              <div className="w-12 h-12 bg-chart-4/10 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-chart-4" />
              </div>
            </div>
          </Card>
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
