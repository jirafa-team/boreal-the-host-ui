"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, Search, LayoutGrid, Calendar } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

type RoomStatus = "available" | "occupied" | "maintenance" | "reserved"

type Room = {
  id: string
  number: string
  type: string
  floor: number
  status: RoomStatus
  guest?: string
  checkIn?: string
  checkOut?: string
}

type ViewMode = "day" | "week" | "month"
type LayoutMode = "grid" | "kanban"

export default function RoomsManagement() {
  const [viewMode, setViewMode] = useState<ViewMode>("week")
  const [layoutMode, setLayoutMode] = useState<LayoutMode>("grid")
  const [currentDate, setCurrentDate] = useState(new Date())
  const [searchTerm, setSearchTerm] = useState("")

  const rooms: Room[] = [
    { id: "1", number: "101", type: "Individual", floor: 1, status: "available" },
    {
      id: "2",
      number: "102",
      type: "Doble",
      floor: 1,
      status: "occupied",
      guest: "Juan Pérez",
      checkIn: "2025-01-10",
      checkOut: "2025-01-15",
    },
    { id: "3", number: "103", type: "Suite", floor: 1, status: "maintenance" },
    {
      id: "4",
      number: "104",
      type: "Doble",
      floor: 1,
      status: "reserved",
      guest: "María García",
      checkIn: "2025-01-12",
      checkOut: "2025-01-14",
    },
    { id: "5", number: "201", type: "Deluxe", floor: 2, status: "available" },
    {
      id: "6",
      number: "202",
      type: "Suite",
      floor: 2,
      status: "occupied",
      guest: "Carlos López",
      checkIn: "2025-01-09",
      checkOut: "2025-01-16",
    },
    { id: "7", number: "203", type: "Individual", floor: 2, status: "available" },
    {
      id: "8",
      number: "204",
      type: "Presidencial",
      floor: 2,
      status: "occupied",
      guest: "Ana Martínez",
      checkIn: "2025-01-11",
      checkOut: "2025-01-13",
    },
    { id: "9", number: "301", type: "Doble", floor: 3, status: "available" },
    {
      id: "10",
      number: "302",
      type: "Suite",
      floor: 3,
      status: "reserved",
      guest: "Luis Rodríguez",
      checkIn: "2025-01-13",
      checkOut: "2025-01-18",
    },
    { id: "11", number: "303", type: "Individual", floor: 3, status: "available" },
    { id: "12", number: "304", type: "Doble", floor: 3, status: "available" },
  ]

  const filteredRooms = rooms.filter(
    (room) =>
      room.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.guest?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getStatusColor = (status: RoomStatus) => {
    switch (status) {
      case "available":
        return "bg-green-500"
      case "occupied":
        return "bg-red-500"
      case "maintenance":
        return "bg-yellow-500"
      case "reserved":
        return "bg-blue-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusText = (status: RoomStatus) => {
    switch (status) {
      case "available":
        return "Disponible"
      case "occupied":
        return "Ocupada"
      case "maintenance":
        return "Mantenimiento"
      case "reserved":
        return "Reservada"
      default:
        return "Desconocido"
    }
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("es-ES", { weekday: "long", year: "numeric", month: "long", day: "numeric" })
  }

  const navigateDate = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate)
    if (viewMode === "day") {
      newDate.setDate(newDate.getDate() + (direction === "next" ? 1 : -1))
    } else if (viewMode === "week") {
      newDate.setDate(newDate.getDate() + (direction === "next" ? 7 : -7))
    } else {
      newDate.setMonth(newDate.getMonth() + (direction === "next" ? 1 : -1))
    }
    setCurrentDate(newDate)
  }

  const stats = {
    total: rooms.length,
    available: rooms.filter((r) => r.status === "available").length,
    occupied: rooms.filter((r) => r.status === "occupied").length,
    maintenance: rooms.filter((r) => r.status === "maintenance").length,
    reserved: rooms.filter((r) => r.status === "reserved").length,
  }

  const generateDateColumns = () => {
    const columns = []
    const startDate = new Date(currentDate)

    if (viewMode === "day") {
      for (let i = 0; i < 24; i++) {
        columns.push({
          label: `${i}:00`,
          date: new Date(startDate.setHours(i, 0, 0, 0)),
        })
      }
    } else if (viewMode === "week") {
      startDate.setDate(startDate.getDate() - startDate.getDay())
      for (let i = 0; i < 7; i++) {
        const date = new Date(startDate)
        date.setDate(startDate.getDate() + i)
        columns.push({
          label: date.toLocaleDateString("es-ES", { weekday: "short", day: "numeric" }),
          date: new Date(date),
        })
      }
    } else {
      const year = startDate.getFullYear()
      const month = startDate.getMonth()
      const daysInMonth = new Date(year, month + 1, 0).getDate()
      for (let i = 1; i <= daysInMonth; i++) {
        const date = new Date(year, month, i)
        columns.push({
          label: i.toString(),
          date: new Date(date),
        })
      }
    }
    return columns
  }

  const getRoomStatusForDate = (room: Room, date: Date): RoomStatus => {
    if (room.status === "maintenance") return "maintenance"
    if (room.checkIn && room.checkOut) {
      const checkIn = new Date(room.checkIn)
      const checkOut = new Date(room.checkOut)
      const targetDate = new Date(date)
      targetDate.setHours(0, 0, 0, 0)
      checkIn.setHours(0, 0, 0, 0)
      checkOut.setHours(0, 0, 0, 0)

      if (targetDate >= checkIn && targetDate <= checkOut) {
        return room.status
      }
    }
    return "available"
  }

  const dateColumns = generateDateColumns()

  return (
    <>
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-10">
        <div className="px-8 py-4">
          <h1 className="text-2xl font-bold text-foreground">Gestión de Habitaciones</h1>
          <p className="text-sm text-muted-foreground">Visualiza y gestiona la disponibilidad de tus habitaciones</p>
        </div>
      </header>

      <div className="p-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <Card className="p-4">
            <p className="text-xs text-muted-foreground">Total</p>
            <p className="text-2xl font-bold text-foreground mt-1">{stats.total}</p>
          </Card>
          <Card className="p-4 border-green-200 bg-green-50">
            <p className="text-xs text-green-700">Disponibles</p>
            <p className="text-2xl font-bold text-green-700 mt-1">{stats.available}</p>
          </Card>
          <Card className="p-4 border-red-200 bg-red-50">
            <p className="text-xs text-red-700">Ocupadas</p>
            <p className="text-2xl font-bold text-red-700 mt-1">{stats.occupied}</p>
          </Card>
          <Card className="p-4 border-blue-200 bg-blue-50">
            <p className="text-xs text-blue-700">Reservadas</p>
            <p className="text-2xl font-bold text-blue-700 mt-1">{stats.reserved}</p>
          </Card>
          <Card className="p-4 border-yellow-200 bg-yellow-50">
            <p className="text-xs text-yellow-700">Mantenimiento</p>
            <p className="text-2xl font-bold text-yellow-700 mt-1">{stats.maintenance}</p>
          </Card>
        </div>

        {/* Controls */}
        <Card className="p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por habitación, tipo o huésped..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex gap-2">
              <Button
                variant={layoutMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setLayoutMode("grid")}
              >
                <LayoutGrid className="w-4 h-4 mr-2" />
                Grid
              </Button>
              <Button
                variant={layoutMode === "kanban" ? "default" : "outline"}
                size="sm"
                onClick={() => setLayoutMode("kanban")}
              >
                <Calendar className="w-4 h-4 mr-2" />
                Timeline
              </Button>
            </div>

            {/* View Mode Toggle */}
            <div className="flex gap-2">
              <Button variant={viewMode === "day" ? "default" : "outline"} size="sm" onClick={() => setViewMode("day")}>
                Día
              </Button>
              <Button
                variant={viewMode === "week" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("week")}
              >
                Semana
              </Button>
              <Button
                variant={viewMode === "month" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("month")}
              >
                Mes
              </Button>
            </div>

            {/* Date Navigation */}
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={() => navigateDate("prev")}>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date())}>
                Hoy
              </Button>
              <Button variant="outline" size="icon" onClick={() => navigateDate("next")}>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="mt-4 text-center">
            <p className="text-sm font-medium text-foreground">{formatDate(currentDate)}</p>
          </div>
        </Card>

        {layoutMode === "grid" ? (
          /* Rooms Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredRooms.map((room) => (
              <Card key={room.id} className="p-4 hover:shadow-lg transition-shadow cursor-pointer">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-bold text-foreground">Hab. {room.number}</h3>
                    <p className="text-sm text-muted-foreground">{room.type}</p>
                    <p className="text-xs text-muted-foreground">Piso {room.floor}</p>
                  </div>
                  <div className={`w-3 h-3 rounded-full ${getStatusColor(room.status)}`} />
                </div>

                <div className="space-y-2">
                  <div
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium text-center ${
                      room.status === "available"
                        ? "bg-green-100 text-green-700"
                        : room.status === "occupied"
                          ? "bg-red-100 text-red-700"
                          : room.status === "reserved"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {getStatusText(room.status)}
                  </div>

                  {room.guest && (
                    <div className="pt-2 border-t border-border">
                      <p className="text-xs text-muted-foreground mb-1">Huésped</p>
                      <p className="text-sm font-medium text-foreground">{room.guest}</p>
                      {room.checkIn && room.checkOut && (
                        <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                          <span>{new Date(room.checkIn).toLocaleDateString("es-ES")}</span>
                          <span>→</span>
                          <span>{new Date(room.checkOut).toLocaleDateString("es-ES")}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        ) : (
          /* Kanban Timeline View */
          <Card className="p-6 overflow-x-auto">
            <div className="min-w-max">
              {/* Timeline Header */}
              <div className="flex border-b border-border mb-4">
                <div className="w-48 flex-shrink-0 pr-4 pb-4">
                  <p className="text-sm font-semibold text-foreground">Habitación</p>
                </div>
                <div className="flex gap-1 pb-4">
                  {dateColumns.map((col, idx) => (
                    <div
                      key={idx}
                      className={`${viewMode === "day" ? "w-16" : viewMode === "week" ? "w-24" : "w-12"} text-center flex-shrink-0`}
                    >
                      <p className="text-xs font-medium text-muted-foreground">{col.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Room Rows */}
              <div className="space-y-2">
                {filteredRooms.map((room) => (
                  <div key={room.id} className="flex items-center border-b border-border pb-2 last:border-b-0">
                    {/* Room Info */}
                    <div className="w-48 flex-shrink-0 pr-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full flex-shrink-0 ${getStatusColor(room.status)}`} />
                        <div>
                          <p className="text-sm font-semibold text-foreground">Hab. {room.number}</p>
                          <p className="text-xs text-muted-foreground">
                            {room.type} · Piso {room.floor}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Timeline Cells */}
                    <div className="flex gap-1">
                      {dateColumns.map((col, idx) => {
                        const status = getRoomStatusForDate(room, col.date)
                        return (
                          <div
                            key={idx}
                            className={`${viewMode === "day" ? "w-16" : viewMode === "week" ? "w-24" : "w-12"} h-12 rounded flex-shrink-0 ${
                              status === "available"
                                ? "bg-green-100 border border-green-200"
                                : status === "occupied"
                                  ? "bg-red-100 border border-red-200"
                                  : status === "reserved"
                                    ? "bg-blue-100 border border-blue-200"
                                    : "bg-yellow-100 border border-yellow-200"
                            } flex items-center justify-center group relative cursor-pointer hover:shadow-md transition-shadow`}
                          >
                            {status !== "available" && (
                              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <div className="bg-black/80 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                                  {status === "occupied"
                                    ? "Ocupada"
                                    : status === "reserved"
                                      ? "Reservada"
                                      : "Mantenimiento"}
                                  {room.guest && <div className="text-[10px]">{room.guest}</div>}
                                </div>
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Legend */}
            <div className="flex items-center gap-6 mt-6 pt-6 border-t border-border">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-green-100 border border-green-200" />
                <span className="text-xs text-muted-foreground">Disponible</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-red-100 border border-red-200" />
                <span className="text-xs text-muted-foreground">Ocupada</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-blue-100 border border-blue-200" />
                <span className="text-xs text-muted-foreground">Reservada</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-yellow-100 border border-yellow-200" />
                <span className="text-xs text-muted-foreground">Mantenimiento</span>
              </div>
            </div>
          </Card>
        )}

        {filteredRooms.length === 0 && (
          <Card className="p-12 text-center">
            <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No se encontraron habitaciones con los filtros aplicados</p>
          </Card>
        )}
      </div>
    </>
  )
}
