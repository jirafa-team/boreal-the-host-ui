"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, Search, LayoutGrid, Calendar, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useLanguage } from "@/lib/i18n-context"

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
  const [timelineMode, setTimelineMode] = useState<"week" | "month">("week")
  const [currentDate, setCurrentDate] = useState(new Date())
  const [searchTerm, setSearchTerm] = useState("")
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newRoom, setNewRoom] = useState({ number: "", type: "Individual", floor: 1 })
  const { t } = useLanguage()

  const [rooms, setRooms] = useState<Room[]>([
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
  ])

  const handleCreateRoom = () => {
    if (newRoom.number.trim()) {
      const newId = (Math.max(...rooms.map(r => parseInt(r.id) || 0), 0) + 1).toString()
      setRooms([...rooms, {
        id: newId,
        number: newRoom.number,
        type: newRoom.type,
        floor: newRoom.floor,
        status: "available"
      }]);
      setNewRoom({ number: "", type: "Individual", floor: 1 });
      setShowCreateModal(false);
    }
  }

  const filteredRooms = rooms.filter(
    (room) =>
      room.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.guest?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getStatusColor = (status: RoomStatus) => {
    const colors = {
      available: "bg-green-500",
      occupied: "bg-blue-500",
      maintenance: "bg-orange-500",
      reserved: "bg-yellow-500",
    }
    return colors[status]
  }

  const getStatusLabel = (status: RoomStatus) => {
    const labels = {
      available: t("admin.available"),
      occupied: t("admin.occupied"),
      maintenance: t("admin.maintenance"),
      reserved: t("admin.reserved"),
    }
    return labels[status]
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
    } else if (timelineMode === "week") {
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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">{t("admin.roomsTitle")}</h1>
              <p className="text-sm text-muted-foreground">{t("admin.manageYourRooms")}</p>
            </div>
            <div className="flex gap-4 items-center">
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-indigo-600 to-indigo-700 text-white shadow-md hover:shadow-lg transition-all duration-300 hover:scale-110 group relative"
                title="Crear habitación"
              >
                <Plus className="w-6 h-6" />
                <span className="absolute bottom-full mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                  Crear habitación
                </span>
              </button>
              <div className="flex gap-2">
                {/* View Mode Toggle */}
                <div className="inline-flex h-10 items-center rounded-lg bg-gray-100 p-1 border border-gray-200">
                  <button
                    onClick={() => setLayoutMode("grid")}
                    className={`px-5 py-2 rounded-md font-medium text-sm transition-all ${
                      layoutMode === "grid"
                        ? "text-white shadow-md"
                        : "text-gray-700 hover:text-gray-900"
                    }`}
                    style={layoutMode === "grid" ? { backgroundColor: "#394a63" } : {}}
                  >
                    Grid
                  </button>
                  <button
                    onClick={() => setLayoutMode("kanban")}
                    className={`px-5 py-2 rounded-md font-medium text-sm transition-all ${
                      layoutMode === "kanban"
                        ? "text-white shadow-md"
                        : "text-gray-700 hover:text-gray-900"
                    }`}
                    style={layoutMode === "kanban" ? { backgroundColor: "#394a63" } : {}}
                  >
                    Timeline
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="p-8">
        {/* Stats Cards - Only show for Grid view */}
        {layoutMode === "grid" && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
            <Card className="p-4 bg-gradient-to-br from-blue-50 to-white text-center">
              <p className="text-5xl font-bold text-blue-600 mb-1">{stats.total}</p>
              <p className="text-xs text-muted-foreground font-medium">{t("admin.totalRooms")}</p>
            </Card>
            <Card className="p-4 bg-gradient-to-br from-green-50 to-white text-center">
              <p className="text-5xl font-bold text-green-600 mb-1">{stats.available}</p>
              <p className="text-xs text-muted-foreground font-medium">{t("admin.availableRooms")}</p>
            </Card>
            <Card className="p-4 bg-gradient-to-br from-red-50 to-white text-center">
              <p className="text-5xl font-bold text-red-600 mb-1">{stats.occupied}</p>
              <p className="text-xs text-muted-foreground font-medium">{t("admin.occupiedRooms")}</p>
            </Card>
            <Card className="p-4 bg-gradient-to-br from-blue-100 to-white text-center">
              <p className="text-5xl font-bold text-blue-700 mb-1">{stats.reserved}</p>
              <p className="text-xs text-muted-foreground font-medium">{t("admin.reservedRooms")}</p>
            </Card>
            <Card className="p-4 bg-gradient-to-br from-yellow-50 to-white text-center">
              <p className="text-5xl font-bold text-yellow-600 mb-1">{stats.maintenance}</p>
              <p className="text-xs text-muted-foreground font-medium">{t("admin.maintenanceRooms")}</p>
            </Card>
          </div>
        )}

        {/* Controls */}
        <Card className="p-6 mb-6">
          <div className="flex gap-4 items-center">
            {/* Search */}
            <div className="relative flex-1 max-w-md w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder={t("admin.searchRoomsPlaceholder")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </Card>

        {layoutMode === "grid" ? (
          /* Rooms Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredRooms.map((room) => (
              <Card key={room.id} className="p-4 hover:shadow-lg transition-shadow cursor-pointer relative">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-bold text-foreground">{t("admin.roomNumber")} {room.number}</h3>
                    <p className="text-sm text-muted-foreground">{room.type}</p>
                    <p className="text-xs text-muted-foreground">{t("admin.floorLabel")} {room.floor}</p>
                  </div>
                  {/* Status Badge - Top Right */}
                  <div
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium text-white shrink-0 ${
                      room.status === "available"
                        ? "bg-green-600"
                        : room.status === "occupied"
                          ? "bg-red-600"
                          : room.status === "reserved"
                            ? "bg-blue-600"
                            : "bg-yellow-600"
                    }`}
                  >
                    {getStatusLabel(room.status)}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="pt-2 border-t border-border">
                    <p className="text-xs text-muted-foreground mb-1">{t("admin.roomGuestLabel")}</p>
                    <button 
                      onClick={() => {
                        console.log("[v0] Guest clicked:", room.guest)
                        // TODO: Add guest detail modal or navigation here
                      }}
                      className="text-sm font-medium text-foreground hover:text-primary hover:underline cursor-pointer transition-colors"
                    >
                      {room.guest}
                    </button>
                    {room.checkIn && room.checkOut && (
                      <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                        <span>{new Date(room.checkIn).toLocaleDateString("es-ES")}</span>
                        <span>→</span>
                        <span>{new Date(room.checkOut).toLocaleDateString("es-ES")}</span>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          /* Kanban Timeline View */
          <div className="space-y-4">
            {/* Timeline Mode Toggle */}
            <div className="flex gap-2">
              <Button
                variant={timelineMode === "week" ? "default" : "outline"}
                size="sm"
                onClick={() => setTimelineMode("week")}
              >
                {t("admin.weekView")}
              </Button>
              <Button
                variant={timelineMode === "month" ? "default" : "outline"}
                size="sm"
                onClick={() => setTimelineMode("month")}
              >
                {t("admin.monthView")}
              </Button>
            </div>

            {/* Timeline Table */}
            <Card className="p-6 overflow-x-auto">
              <div className="min-w-max">
                {/* Timeline Header */}
                <div className="flex border-b border-border mb-4">
                  <div className="w-48 flex-shrink-0 pr-4 pb-4">
                    <p className="text-sm font-semibold text-foreground">{t("admin.roomNumber")}</p>
                  </div>
                  <div className="flex gap-1 pb-4">
                    {dateColumns.map((col, idx) => (
                      <div
                        key={idx}
                        className={`${timelineMode === "week" ? "w-24" : "w-12"} text-center flex-shrink-0`}
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
                            <p className="text-sm font-semibold text-foreground">{t("admin.roomNumber")} {room.number}</p>
                            <p className="text-xs text-muted-foreground">
                              {room.type} · {t("admin.floorLabel")} {room.floor}
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
                                      ? t("admin.roomOccupied")
                                      : status === "reserved"
                                        ? t("admin.roomReserved")
                                        : t("admin.roomMaintenance")}
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
                  <span className="text-xs text-muted-foreground">{t("admin.legendAvailable")}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-red-100 border border-red-200" />
                  <span className="text-xs text-muted-foreground">{t("admin.legendOccupied")}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-blue-100 border border-blue-200" />
                  <span className="text-xs text-muted-foreground">{t("admin.legendReserved")}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-yellow-100 border border-yellow-200" />
                  <span className="text-xs text-muted-foreground">{t("admin.legendMaintenance")}</span>
                </div>
              </div>
            </Card>
          </div>
        )}

        {filteredRooms.length === 0 && (
          <Card className="p-12 text-center">
            <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">{t("admin.noRoomsFound")}</p>
          </Card>
        )}
      </div>

      {/* Create Room Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Crear Nueva Habitación</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Número de Habitación</label>
                <Input
                  type="text"
                  placeholder="Ej: 105"
                  value={newRoom.number}
                  onChange={(e) => setNewRoom({ ...newRoom, number: e.target.value })}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Habitación</label>
                <select
                  value={newRoom.type}
                  onChange={(e) => setNewRoom({ ...newRoom, type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option>Individual</option>
                  <option>Doble</option>
                  <option>Suite</option>
                  <option>Deluxe</option>
                  <option>Presidencial</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Piso</label>
                <select
                  value={newRoom.floor}
                  onChange={(e) => setNewRoom({ ...newRoom, floor: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value={1}>Piso 1</option>
                  <option value={2}>Piso 2</option>
                  <option value={3}>Piso 3</option>
                  <option value={4}>Piso 4</option>
                  <option value={5}>Piso 5</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 justify-end mt-6">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-medium"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreateRoom}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
              >
                Crear Habitación
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
