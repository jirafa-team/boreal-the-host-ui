"use client"

import { useState } from "react"
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

import { Hotel, Bell, LayoutGrid, Users, BarChart3, Calendar } from "lucide-react"
import { Card } from "@/components/ui/card"
import { useLanguage } from "@/lib/i18n-context"

// Mock data for different dates
const kpiDataByDate: Record<string, { rooms: number; occupancy: number; available: number; bookings: number }> = {
  "today": { rooms: 48, occupancy: 78, available: 11, bookings: 23 },
  "tomorrow": { rooms: 48, occupancy: 82, available: 9, bookings: 18 },
  "in-2-days": { rooms: 48, occupancy: 45, available: 26, bookings: 12 },
  "in-3-days": { rooms: 48, occupancy: 95, available: 2, bookings: 31 },
}

// Mock data for check-in/check-out chart
const checkInCheckOutData = [
  { time: "06:00", checkIn: 2, checkOut: 1 },
  { time: "07:00", checkIn: 5, checkOut: 2 },
  { time: "08:00", checkIn: 8, checkOut: 4 },
  { time: "09:00", checkIn: 12, checkOut: 6 },
  { time: "10:00", checkIn: 15, checkOut: 10 },
  { time: "11:00", checkIn: 11, checkOut: 14 },
  { time: "12:00", checkIn: 8, checkOut: 18 },
  { time: "13:00", checkIn: 5, checkOut: 12 },
  { time: "14:00", checkIn: 3, checkOut: 8 },
  { time: "15:00", checkIn: 4, checkOut: 5 },
]

// Mock data for tickets chart
const ticketsData = [
  { date: "Lunes", abiertos: 12, cerrados: 8 },
  { date: "Martes", abiertos: 15, cerrados: 11 },
  { date: "Miércoles", abiertos: 10, cerrados: 14 },
  { date: "Jueves", abiertos: 18, cerrados: 12 },
  { date: "Viernes", abiertos: 22, cerrados: 19 },
  { date: "Sábado", abiertos: 8, cerrados: 15 },
  { date: "Domingo", abiertos: 5, cerrados: 10 },
]

// Mock data for orders demand by hour
const ordersDemanData = [
  { time: "06:00", pedidos: 3 },
  { time: "07:00", pedidos: 8 },
  { time: "08:00", pedidos: 14 },
  { time: "09:00", pedidos: 22 },
  { time: "10:00", pedidos: 28 },
  { time: "11:00", pedidos: 35 },
  { time: "12:00", pedidos: 42 },
  { time: "13:00", pedidos: 38 },
  { time: "14:00", pedidos: 25 },
  { time: "15:00", pedidos: 18 },
  { time: "16:00", pedidos: 12 },
  { time: "17:00", pedidos: 9 },
  { time: "18:00", pedidos: 15 },
  { time: "19:00", pedidos: 32 },
  { time: "20:00", pedidos: 28 },
]

export default function AdminDashboard() {
  const { t } = useLanguage()
  const [selectedMode, setSelectedMode] = useState("hotel")
  const [selectedDate, setSelectedDate] = useState("today")

  const getDateLabel = (dateKey: string) => {
    const today = new Date()
    const dateMap: Record<string, string> = {
      "today": today.toLocaleDateString("es-ES", { day: "2-digit", month: "short", year: "numeric" }),
      "tomorrow": new Date(today.getTime() + 86400000).toLocaleDateString("es-ES", { day: "2-digit", month: "short", year: "numeric" }),
      "in-2-days": new Date(today.getTime() + 172800000).toLocaleDateString("es-ES", { day: "2-digit", month: "short", year: "numeric" }),
      "in-3-days": new Date(today.getTime() + 259200000).toLocaleDateString("es-ES", { day: "2-digit", month: "short", year: "numeric" }),
    }
    return dateMap[dateKey] || dateKey
  }

  const getKPIData = () => kpiDataByDate[selectedDate] || kpiDataByDate["today"]

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
        {/* Date Filter */}
        <div className="mb-6 flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-muted-foreground" />
            <span className="text-sm font-medium text-muted-foreground">Fecha:</span>
          </div>
          <div className="flex gap-2 flex-wrap">
            {[
              { key: "today", label: "Hoy" },
              { key: "tomorrow", label: "Mañana" },
              { key: "in-2-days", label: "En 2 días" },
              { key: "in-3-days", label: "En 3 días" },
            ].map((date) => (
              <button
                key={date.key}
                onClick={() => setSelectedDate(date.key)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  selectedDate === date.key
                    ? "bg-primary text-white shadow-md"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {date.label} <span className="text-xs opacity-75">({getDateLabel(date.key)})</span>
              </button>
            ))}
          </div>
        </div>

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
                <p className="text-2xl font-bold">{getKPIData().rooms}</p>
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
                <p className="text-2xl font-bold">{getKPIData().occupancy}%</p>
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
                <p className="text-2xl font-bold">{getKPIData().available}</p>
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
                <p className="text-2xl font-bold">{getKPIData().bookings}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 gap-6">
          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Check-in / Check-out Chart */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">Check-in / Check-out por Hora</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={checkInCheckOutData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="checkIn" stroke="#2563eb" strokeWidth={2} name="Check-in" />
                  <Line type="monotone" dataKey="checkOut" stroke="#dc2626" strokeWidth={2} name="Check-out" />
                </LineChart>
              </ResponsiveContainer>
            </Card>

            {/* Tickets Chart */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">Incidencias/Tickets</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={ticketsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="abiertos" fill="#f97316" name="Abiertos" />
                  <Bar dataKey="cerrados" fill="#22c55e" name="Cerrados" />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>

          {/* Orders Demand Chart - Full Width */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Demanda de Pedidos por Hora</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={ordersDemanData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="pedidos" stroke="#8b5cf6" strokeWidth={2} name="Pedidos" dot={{ fill: "#8b5cf6", r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </Card>

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
