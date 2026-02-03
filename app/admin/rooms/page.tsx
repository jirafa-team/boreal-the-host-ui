"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, Search, LayoutGrid, Calendar, Plus, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useLanguage } from "@/lib/i18n-context"
import { useToast } from "@/hooks/use-toast"

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
  const { toast } = useToast()
  const [viewMode, setViewMode] = useState<ViewMode>("week")
  const [layoutMode, setLayoutMode] = useState<LayoutMode>("grid")
  const [timelineMode, setTimelineMode] = useState<"week" | "month">("week")
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<RoomStatus | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null)
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
      // Check if room number already exists
      const roomExists = rooms.some(r => r.number.toLowerCase() === newRoom.number.toLowerCase())
      if (roomExists) {
        toast({
          title: "Error",
          description: `La habitación número ${newRoom.number} ya existe.`,
          variant: "destructive"
        })
        return
      }
      
      const roomNumber = newRoom.number
      const newId = (Math.max(...rooms.map(r => parseInt(r.id) || 0), 0) + 1).toString()
      setRooms([...rooms, {
        id: newId,
        number: roomNumber,
        type: newRoom.type,
        floor: newRoom.floor,
        status: "available"
      }]);
      setNewRoom({ number: "", type: "Individual", floor: 1 });
      setShowCreateModal(false);
      toast({
        title: "Éxito",
        description: `Habitación ${roomNumber} creada correctamente.`,
      })
    }
  }

  const handleEditRoom = (room: Room) => {
    setSelectedRoom({ ...room })
    setShowEditModal(true)
  }

  const handleUpdateRoom = () => {
    if (selectedRoom) {
      // Check if room number already exists (excluding current room)
      const roomExists = rooms.some(r => r.id !== selectedRoom.id && r.number.toLowerCase() === selectedRoom.number.toLowerCase())
      if (roomExists) {
        toast({
          title: "Error",
          description: `La habitación número ${selectedRoom.number} ya existe.`,
          variant: "destructive"
        })
        return
      }

      setRooms(rooms.map(r => r.id === selectedRoom.id ? selectedRoom : r))
      setShowEditModal(false)
      setSelectedRoom(null)
      toast({
        title: "Éxito",
        description: `Habitación ${selectedRoom.number} actualizada correctamente.`,
      })
    }
  }

  const handleDeleteRoom = () => {
    if (selectedRoom) {
      setRooms(rooms.filter(r => r.id !== selectedRoom.id))
      setShowEditModal(false)
      setSelectedRoom(null)
      toast({
        title: "Éxito",
        description: "Habitación eliminada correctamente.",
      })
    }
  }

  const filteredRooms = rooms.filter(
    (room) => {
      const matchesStatus = statusFilter === null || room.status === statusFilter
      const matchesSearch = room.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           room.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           room.guest?.toLowerCase().includes(searchTerm.toLowerCase())
      
      // Filter by selected date for grid view
      if (layoutMode === "grid") {
        const selectedDateObj = new Date(selectedDate)
        selectedDateObj.setHours(0, 0, 0, 0)
        
        if (room.status === "maintenance") return matchesStatus && matchesSearch
        if (room.checkIn && room.checkOut) {
          const checkIn = new Date(room.checkIn)
          const checkOut = new Date(room.checkOut)
          checkIn.setHours(0, 0, 0, 0)
          checkOut.setHours(0, 0, 0, 0)
          
          if (selectedDateObj >= checkIn && selectedDateObj <= checkOut) {
            return matchesStatus && matchesSearch
          }
        }
        // If no reservation, check if it's available
        if (!room.checkIn || !room.checkOut) {
          return matchesStatus && matchesSearch
        }
        return false
      }
      
      return matchesStatus && matchesSearch
    },
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

  // Convert between ISO date format (yyyy-MM-dd) and locale-specific format
  const convertISOToLocaleFormat = (isoDate: string): string => {
    const [year, month, day] = isoDate.split('-')
    if (useLanguage().language === 'es' || useLanguage().language === 'pt') {
      return `${day}/${month}/${year}` // dd/mm/yyyy
    }
    return `${month}/${day}/${year}` // mm/dd/yyyy
  }

  const convertLocaleToISO = (localeDate: string): string => {
    const parts = localeDate.split('/')
    if (useLanguage().language === 'es' || useLanguage().language === 'pt') {
      // Input is dd/mm/yyyy
      if (parts.length === 3) {
        return `${parts[2]}-${parts[1]}-${parts[0]}`
      }
    } else {
      // Input is mm/dd/yyyy
      if (parts.length === 3) {
        return `${parts[2]}-${parts[0]}-${parts[1]}`
      }
    }
    return localeDate
  }

  const { language } = useLanguage()

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
            <div className="flex gap-4 items-center ml-auto">
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
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-indigo-600 to-indigo-700 text-white shadow-md hover:shadow-lg transition-all duration-300 hover:scale-110 group relative"
                title="Crear habitación"
              >
                <div className="relative flex items-center justify-center">
                  <LayoutGrid className="w-5 h-5" />
                  <span className="absolute text-base font-bold -bottom-0.5 -right-0.5 text-white drop-shadow-lg">+</span>
                </div>
                <span className="absolute top-full mt-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                  Crear habitación
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="p-8">
        {layoutMode === "grid" && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
            <div 
              onClick={() => setStatusFilter(null)}
              className={`p-4 relative rounded-3xl shadow-2xl text-center cursor-pointer transition-all overflow-hidden ${statusFilter === null ? 'text-white' : 'bg-white/95 backdrop-blur-lg hover:shadow-lg'}`}
              style={statusFilter === null ? { backgroundColor: "#1E40AF" } : {}}
            >
              {statusFilter === null && (
                <div className="absolute -top-16 -right-16 w-28 h-28 rounded-full" style={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }} />
              )}
              <div className="relative z-10">
                <p className={`text-6xl font-bold mb-1 ${statusFilter === null ? 'text-white' : 'text-blue-600'}`}>{stats.total}</p>
                <p className={`text-xs font-medium ${statusFilter === null ? 'text-blue-100' : 'text-muted-foreground'}`}>{t("admin.totalRooms")}</p>
              </div>
            </div>
            <div 
              onClick={() => setStatusFilter("available")}
              className={`p-4 relative rounded-3xl shadow-2xl text-center cursor-pointer transition-all overflow-hidden ${statusFilter === "available" ? 'text-white' : 'bg-white/95 backdrop-blur-lg hover:shadow-lg'}`}
              style={statusFilter === "available" ? { backgroundColor: "#235E20" } : {}}
            >
              {statusFilter === "available" && (
                <div className="absolute -top-16 -right-16 w-28 h-28 rounded-full" style={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }} />
              )}
              <div className="relative z-10">
                <p className={`text-6xl font-bold mb-1 ${statusFilter === "available" ? 'text-white' : ''}`} style={statusFilter !== "available" ? { color: "#235E20" } : {}}>{stats.available}</p>
                <p className={`text-xs font-medium ${statusFilter === "available" ? 'text-green-100' : 'text-muted-foreground'}`}>{t("admin.availableRooms")}</p>
              </div>
            </div>
            <div 
              onClick={() => setStatusFilter("occupied")}
              className={`p-4 relative rounded-3xl shadow-2xl text-center cursor-pointer transition-all overflow-hidden ${statusFilter === "occupied" ? 'text-white' : 'bg-white/95 backdrop-blur-lg hover:shadow-lg'}`}
              style={statusFilter === "occupied" ? { backgroundColor: "#AA2C2C" } : {}}
            >
              {statusFilter === "occupied" && (
                <div className="absolute -top-16 -right-16 w-28 h-28 rounded-full" style={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }} />
              )}
              <div className="relative z-10">
                <p className={`text-6xl font-bold mb-1 ${statusFilter === "occupied" ? 'text-white' : ''}`} style={statusFilter !== "occupied" ? { color: "#AA2C2C" } : {}}>{stats.occupied}</p>
                <p className={`text-xs font-medium ${statusFilter === "occupied" ? 'text-red-100' : 'text-muted-foreground'}`}>{t("admin.occupiedRooms")}</p>
              </div>
            </div>
            <div 
              onClick={() => setStatusFilter("reserved")}
              className={`p-4 relative rounded-3xl shadow-2xl text-center cursor-pointer transition-all overflow-hidden ${statusFilter === "reserved" ? 'text-white' : 'bg-white/95 backdrop-blur-lg hover:shadow-lg'}`}
              style={statusFilter === "reserved" ? { backgroundColor: "#1E3A8A" } : {}}
            >
              {statusFilter === "reserved" && (
                <div className="absolute -top-16 -right-16 w-28 h-28 rounded-full" style={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }} />
              )}
              <div className="relative z-10">
                <p className={`text-6xl font-bold mb-1 ${statusFilter === "reserved" ? 'text-white' : 'text-blue-700'}`}>{stats.reserved}</p>
                <p className={`text-xs font-medium ${statusFilter === "reserved" ? 'text-blue-100' : 'text-muted-foreground'}`}>{t("admin.reservedRooms")}</p>
              </div>
            </div>
            <div 
              onClick={() => setStatusFilter("maintenance")}
              className={`p-4 relative rounded-3xl shadow-2xl text-center cursor-pointer transition-all overflow-hidden ${statusFilter === "maintenance" ? 'text-white' : 'bg-white/95 backdrop-blur-lg hover:shadow-lg'}`}
              style={statusFilter === "maintenance" ? { backgroundColor: "#CA8A04" } : {}}
            >
              {statusFilter === "maintenance" && (
                <div className="absolute -top-16 -right-16 w-28 h-28 rounded-full" style={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }} />
              )}
              <div className="relative z-10">
                <p className={`text-6xl font-bold mb-1 ${statusFilter === "maintenance" ? 'text-white' : 'text-yellow-600'}`}>{stats.maintenance}</p>
                <p className={`text-xs font-medium ${statusFilter === "maintenance" ? 'text-yellow-100' : 'text-muted-foreground'}`}>{t("admin.maintenanceRooms")}</p>
              </div>
            </div>
          </div>
        )}

        {/* Controls */}
        <Card className="p-6 mb-6">
          <div className="flex gap-4 items-center flex-wrap">
            {/* Search */}
            <div className="relative flex-1 min-w-xs max-w-md w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder={t("admin.searchRoomsPlaceholder")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Date Filter - Only for Grid View */}
            {layoutMode === "grid" && (
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-foreground">
                  {language === 'es' || language === 'pt' ? 'Fecha:' : 'Date:'}
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                  <div className="pointer-events-none flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg bg-white w-40">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{convertISOToLocaleFormat(selectedDate)}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Card>

        {layoutMode === "grid" ? (
          /* Rooms Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredRooms.map((room) => (
              <Card 
                key={room.id} 
                className="p-4 hover:shadow-lg transition-shadow cursor-pointer relative"
                onClick={() => handleEditRoom(room)}
              >
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
                        ? "bg-blue-600"
                        : room.status === "occupied"
                          ? "bg-blue-600"
                          : room.status === "reserved"
                            ? "bg-blue-600"
                            : "bg-yellow-600"
                    }`}
                    style={
                      room.status === "available"
                        ? { backgroundColor: "#235E20" }
                        : room.status === "occupied"
                          ? { backgroundColor: "#AA2C2C" }
                          : undefined
                    }
                  >
                    {getStatusLabel(room.status)}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="pt-2 border-t border-border">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-6 h-6 rounded-full flex items-center justify-center"
                        style={{ 
                          backgroundColor: room.status === "available" 
                            ? "rgba(35, 94, 32, 0.15)" 
                            : room.status === "occupied" 
                              ? "rgba(170, 44, 44, 0.15)" 
                              : room.status === "reserved" 
                                ? "rgba(30, 58, 138, 0.15)" 
                                : "rgba(180, 83, 9, 0.15)" 
                        }}
                      >
                        <User 
                          className="w-3.5 h-3.5" 
                          style={{ 
                            color: room.status === "available" 
                              ? "#235E20" 
                              : room.status === "occupied" 
                                ? "#AA2C2C" 
                                : room.status === "reserved" 
                                  ? "#1E3A8A" 
                                  : "#B45309" 
                          }} 
                        />
                      </div>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation()
                          // TODO: Add guest detail modal or navigation here
                        }}
                        className="text-sm font-medium text-foreground hover:text-primary hover:underline cursor-pointer transition-colors"
                      >
                        {room.guest}
                      </button>
                    </div>
                    {room.checkIn && room.checkOut && (
                      <div className="flex items-center gap-2 mt-2 text-xs">
                        <div 
                          className="w-6 h-6 rounded-full flex items-center justify-center"
                          style={{ 
                            backgroundColor: room.status === "available" 
                              ? "rgba(35, 94, 32, 0.15)" 
                              : room.status === "occupied" 
                                ? "rgba(170, 44, 44, 0.15)" 
                                : room.status === "reserved" 
                                  ? "rgba(30, 58, 138, 0.15)" 
                                  : "rgba(180, 83, 9, 0.15)" 
                          }}
                        >
                          <Calendar 
                            className="w-3.5 h-3.5" 
                            style={{ 
                              color: room.status === "available" 
                                ? "#235E20" 
                                : room.status === "occupied" 
                                  ? "#AA2C2C" 
                                  : room.status === "reserved" 
                                    ? "#1E3A8A" 
                                    : "#B45309" 
                            }} 
                          />
                        </div>
                        <span className="text-muted-foreground">{new Date(room.checkIn).toLocaleDateString("es-ES")}</span>
                        <span className="text-muted-foreground">→</span>
                        <span className="text-muted-foreground">{new Date(room.checkOut).toLocaleDateString("es-ES")}</span>
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
            {/* Timeline Mode Toggle & Date Navigation */}
            <div className="flex gap-2 justify-between items-center flex-wrap">
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
              
              {/* Timeline Mode Toggle */}
              <div className="flex items-center gap-3">
                <span className={`text-sm font-medium ${timelineMode === "week" ? "text-foreground" : "text-muted-foreground"}`}>
                  Semana
                </span>
                <button
                  onClick={() => setTimelineMode(timelineMode === "week" ? "month" : "week")}
                  className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                    timelineMode === "month"
                      ? "bg-lime-600"
                      : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                      timelineMode === "month" ? "translate-x-7" : "translate-x-1"
                    }`}
                  />
                </button>
                <span className={`text-sm font-medium ${timelineMode === "month" ? "text-foreground" : "text-muted-foreground"}`}>
                  Mes
                </span>
              
              {/* Date Navigation for Timeline */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => navigateDate("prev")}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  title={language === 'es' || language === 'pt' ? "Fecha anterior" : "Previous date"}
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <div className="relative">
                  <input
                    type="date"
                    value={currentDate.toISOString().split('T')[0]}
                    onChange={(e) => setCurrentDate(new Date(e.target.value))}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                  <div className="pointer-events-none flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg bg-white w-40">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{convertISOToLocaleFormat(currentDate.toISOString().split('T')[0])}</span>
                  </div>
                </div>
                <button
                  onClick={() => navigateDate("next")}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  title={language === 'es' || language === 'pt' ? "Fecha siguiente" : "Next date"}
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
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

      {/* Edit Room Modal */}
      {showEditModal && selectedRoom && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md mx-4">
            <h2 className="text-xl font-bold text-foreground mb-4">Editar Habitación {selectedRoom.number}</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Número de Habitación</label>
                <Input
                  value={selectedRoom.number}
                  onChange={(e) => setSelectedRoom({ ...selectedRoom, number: e.target.value })}
                  placeholder="Ej: 101"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Tipo</label>
                <select
                  value={selectedRoom.type}
                  onChange={(e) => setSelectedRoom({ ...selectedRoom, type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="Individual">Individual</option>
                  <option value="Doble">Doble</option>
                  <option value="Suite">Suite</option>
                  <option value="Familiar">Familiar</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Piso</label>
                <Input
                  type="number"
                  value={selectedRoom.floor}
                  onChange={(e) => setSelectedRoom({ ...selectedRoom, floor: parseInt(e.target.value) || 1 })}
                  min={1}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Estado</label>
                <select
                  value={selectedRoom.status}
                  onChange={(e) => setSelectedRoom({ ...selectedRoom, status: e.target.value as RoomStatus })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="available">Disponible</option>
                  <option value="occupied">Ocupada</option>
                  <option value="reserved">Reservada</option>
                  <option value="maintenance">Mantenimiento</option>
                </select>
              </div>

              {(selectedRoom.status === "occupied" || selectedRoom.status === "reserved") && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Huésped</label>
                    <Input
                      value={selectedRoom.guest || ""}
                      onChange={(e) => setSelectedRoom({ ...selectedRoom, guest: e.target.value })}
                      placeholder="Nombre del huésped"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">Check-in</label>
                      <Input
                        type="date"
                        value={selectedRoom.checkIn || ""}
                        onChange={(e) => setSelectedRoom({ ...selectedRoom, checkIn: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">Check-out</label>
                      <Input
                        type="date"
                        value={selectedRoom.checkOut || ""}
                        onChange={(e) => setSelectedRoom({ ...selectedRoom, checkOut: e.target.value })}
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleDeleteRoom}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                Eliminar
              </button>
              <div className="flex-1" />
              <button
                onClick={() => {
                  setShowEditModal(false)
                  setSelectedRoom(null)
                }}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                Cancelar
              </button>
              <button
                onClick={handleUpdateRoom}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
