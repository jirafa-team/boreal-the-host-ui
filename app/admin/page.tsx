"use client"

import { useState } from "react"
import { Hotel, Calendar, Bell, LayoutGrid, Users, BarChart3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { useLanguage } from "@/lib/i18n-context"

export default function AdminDashboard() {
  const [selectedMode, setSelectedMode] = useState<"hotel" | "event">("hotel")
  const { t } = useLanguage()

  return (
    <>
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-10">
        <div className="px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">{t("admin.controlPanel")}</h1>
            <p className="text-sm text-muted-foreground">
              {t("admin.manageYour")} {selectedMode === "hotel" ? t("admin.hotel") : t("admin.eventsLower")}
            </p>
          </div>

          <div className="flex gap-2">
            <Button variant={selectedMode === "hotel" ? "default" : "outline"} onClick={() => setSelectedMode("hotel")}>
              <Hotel className="w-4 h-4 mr-2" />
              {t("admin.hotelMode")}
            </Button>
            <Button variant={selectedMode === "event" ? "default" : "outline"} onClick={() => setSelectedMode("event")}>
              <Calendar className="w-4 h-4 mr-2" />
              {t("admin.eventMode")}
            </Button>
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
                  {selectedMode === "hotel" ? t("admin.totalRooms") : t("admin.totalEvents")}
                </p>
                <p className="text-3xl font-bold text-foreground mt-2">{selectedMode === "hotel" ? "48" : "12"}</p>
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
                <p className="text-3xl font-bold text-foreground mt-2">{selectedMode === "hotel" ? "11" : "5"}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {t("admin.ofTotal")} {selectedMode === "hotel" ? "48" : "12"} {t("admin.total")}
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activity */}
          <Card className="lg:col-span-2 p-6">
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
                    className={`w-2 h-2 rounded-full mt-2 shrink-0 ${
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

          {/* Quick Actions */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">{t("admin.quickActions")}</h2>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start bg-transparent" asChild>
                <Link href="/admin/space-builder">
                  <LayoutGrid className="w-4 h-4 mr-2" />
                  {t("admin.designSpace")}
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start bg-transparent" asChild>
                <Link href="/admin/events">
                  <Calendar className="w-4 h-4 mr-2" />
                  {t("admin.createEvent")}
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start bg-transparent" asChild>
                <Link href="/admin/notifications">
                  <Bell className="w-4 h-4 mr-2" />
                  {t("admin.sendNotification")}
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start bg-transparent" asChild>
                <Link href="/admin/clients">
                  <Users className="w-4 h-4 mr-2" />
                  {t("admin.viewClients")}
                </Link>
              </Button>
            </div>

            <div className="mt-6 pt-6 border-t border-border">
              <h3 className="text-sm font-semibold text-foreground mb-3">{t("admin.quickStats")}</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{t("admin.revenueToday")}</span>
                  <span className="text-sm font-semibold text-foreground">€2,450</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{t("admin.activeClients")}</span>
                  <span className="text-sm font-semibold text-foreground">34</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{t("admin.avgStay")}</span>
                  <span className="text-sm font-semibold text-foreground">3.2 {t("admin.days")}</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </>
  )
}
