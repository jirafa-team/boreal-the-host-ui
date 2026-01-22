"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, Search, Hotel, Users, Building2, Clock, AlertCircle, CheckCircle2, Dumbbell, Waves, Sparkles } from "lucide-react"
import { useLanguage } from "@/lib/i18n-context"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

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

type FacilityStatus = "available" | "booked"

type Facility = {
  id: string
  name: string
  type: string
  status: FacilityStatus
  capacity: number
  nextBooking?: {
    clientName: string
    time: string
  }
}

type StaffStatus = "available" | "busy" | "off"

type StaffMember = {
  id: number
  name: string
  avatar: string
  department: "Limpieza" | "Mantenimiento" | "Seguridad" | "Recepción" | "Servicio"
  status: StaffStatus
  tasksToday: number
  maxCapacity: number
  shift: string
  currentRoom?: number
}

type CleaningRequest = {
  id: number
  roomNumber: number
  guestName: string
  requestedTime: string
  status: "pending" | "assigned" | "in-progress" | "completed"
  assignedTo?: string
  priority: "normal" | "urgent"
}

const timeSlots = ["7:00 AM", "11:00 AM", "3:00 PM", "7:00 PM"]

const getStatusText = (status: StaffStatus) => {
  switch (status) {
    case "available":
      return "Disponible"
    case "busy":
      return "Ocupado"
    case "off":
      return "Fuera de servicio"
    default:
      return status
  }
}

const getRequestStatusColor = (status: string) => {
  const colors = {
    pending: "bg-gray-500",
    assigned: "bg-blue-500",
    "in-progress": "bg-orange-500",
    completed: "bg-green-500",
  }
  return colors[status] || "bg-gray-500"
}

const getRequestStatusText = (status: string) => {
  const labels = {
    pending: "Pendiente",
    assigned: "Asignado",
    "in-progress": "En progreso",
    completed: "Completado",
  }
  return labels[status] || status
}

const getTasksForTimeSlot = (staffName: string, timeSlot: string) => {
  // Mock implementation for demonstration purposes
  return [
    {
      id: 1,
      roomNumber: 204,
      guestName: "Sr. García",
      requestedTime: "10:00",
      status: "in-progress",
      assignedTo: staffName,
      priority: "normal",
    },
    {
      id: 2,
      roomNumber: 312,
      guestName: "Sra. López",
      requestedTime: "14:30",
      status: "assigned",
      assignedTo: staffName,
      priority: "urgent",
    },
  ].filter(task => task.requestedTime === timeSlot && task.assignedTo === staffName)
}

export default function DashboardControl() {
  const { t } = useLanguage()
  const [activeTab, setActiveTab] = useState<"rooms" | "staff" | "facilities" | "both">("both")
  const [timelineMode, setTimelineMode] = useState<"week" | "month">("week")
  const [currentDate, setCurrentDate] = useState(new Date())
  const [searchTerm, setSearchTerm] = useState("")
  const [searchName, setSearchName] = useState("")
  const [filterDepartment, setFilterDepartment] = useState("all")
  const [expandedSections, setExpandedSections] = useState(new Set<string>())

  // Mock data - Staff
  const staffMembers: StaffMember[] = [
    {
      id: 1,
      name: "María González",
      status: "busy",
      currentRoom: 204,
      tasksToday: 5,
      maxCapacity: 8,
      shift: "7:00 AM - 3:00 PM",
      avatar: "MG",
      department: "Limpieza",
    },
    {
      id: 2,
      name: "Roberto Fernández",
      status: "available",
      tasksToday: 3,
      maxCapacity: 8,
      shift: "7:00 AM - 3:00 PM",
      avatar: "RF",
      department: "Mantenimiento",
    },
    {
      id: 3,
      name: "Carmen Silva",
      status: "busy",
      currentRoom: 312,
      tasksToday: 6,
      maxCapacity: 8,
      shift: "11:00 AM - 7:00 PM",
      avatar: "CS",
      department: "Limpieza",
    },
    {
      id: 4,
      name: "Diego Ramírez",
      status: "available",
      tasksToday: 2,
      maxCapacity: 8,
      shift: "11:00 AM - 7:00 PM",
      avatar: "DR",
      department: "Seguridad",
    },
    {
      id: 5,
      name: "Laura Pérez",
      status: "off",
      tasksToday: 0,
      maxCapacity: 8,
      shift: "Día libre",
      avatar: "LP",
      department: "Recepción",
    },
    {
      id: 6,
      name: "Ana Rodríguez",
      status: "available",
      tasksToday: 4,
      maxCapacity: 8,
      shift: "3:00 PM - 11:00 PM",
      avatar: "AR",
      department: "Servicio",
    },
  ]

  const [requests] = useState<CleaningRequest[]>([
    {
      id: 1,
      roomNumber: 204,
      guestName: "Sr. García",
      requestedTime: "10:00",
      status: "in-progress",
      assignedTo: "María González",
      priority: "normal",
    },
    {
      id: 2,
      roomNumber: 312,
      guestName: "Sra. López",
      requestedTime: "14:30",
      status: "assigned",
      assignedTo: "Carmen Silva",
      priority: "urgent",
    },
  ])

  // Mock data - Rooms
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

  // Mock data - Facilities
  const facilities: Facility[] = [
    { id: "1", name: "Piscina", type: "recreation", status: "available", capacity: 100 },
    { id: "2", name: "Gimnasio", type: "fitness", status: "booked", capacity: 50, nextBooking: { clientName: "Carlos López", time: "14:00" } },
    { id: "3", name: "Restaurante", type: "business", status: "available", capacity: 200 },
  ]

  const filteredRooms = rooms.filter(
    (room) =>
      room.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.guest?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getStatusColor = (status: RoomStatus | FacilityStatus | StaffStatus) => {
    const colors = {
      available: "bg-green-500",
      occupied: "bg-blue-500",
      maintenance: "bg-orange-500",
      reserved: "bg-yellow-500",
      booked: "bg-purple-500",
      busy: "bg-orange-500",
      off: "bg-gray-500",
    }
    return colors[status]
  }

  const getStatusLabel = (status: RoomStatus | FacilityStatus | StaffStatus) => {
    const labels = {
      available: t("admin.available"),
      occupied: t("admin.occupied"),
      maintenance: t("admin.maintenance"),
      reserved: t("admin.reserved"),
      booked: t("admin.booked"),
      busy: t("admin.busy"),
      off: t("admin.off"),
    }
    return labels[status] || status
  }

  const generateDateColumns = () => {
    const columns = []
    const startDate = new Date(currentDate)

    if (timelineMode === "week") {
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

  const navigateDate = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate)
    if (timelineMode === "week") {
      newDate.setDate(newDate.getDate() + (direction === "next" ? 7 : -7))
    } else {
      newDate.setMonth(newDate.getMonth() + (direction === "next" ? 1 : -1))
    }
    setCurrentDate(newDate)
  }

  const toggleSection = (section: string) => {
    const sections = new Set(expandedSections)
    if (sections.has(section)) {
      sections.delete(section)
    } else {
      sections.add(section)
    }
    setExpandedSections(sections)
  }

  const dateColumns = generateDateColumns()

  return (
    <div>
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-10">
        <div className="px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">{t("admin.roomsTimeline")}</h1>
              <p className="text-sm text-muted-foreground">{t("admin.viewRealTimeStatus")}</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigateDate("prev")}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentDate(new Date())}
                >
                  Hoy
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigateDate("next")}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="p-8">
        {/* View Tabs */}
        <div className="flex gap-2 mb-8 flex-wrap">
          <Button
            variant={activeTab === "both" ? "default" : "outline"}
            onClick={() => setActiveTab("both")}
            className="gap-2"
          >
            <Hotel className="w-4 h-4" />
            Todas
          </Button>
          <Button
            variant={activeTab === "rooms" ? "default" : "outline"}
            onClick={() => setActiveTab("rooms")}
            className="gap-2"
          >
            <Hotel className="w-4 h-4" />
            Habitaciones
          </Button>
          <Button
            variant={activeTab === "staff" ? "default" : "outline"}
            onClick={() => setActiveTab("staff")}
            className="gap-2"
          >
            <Users className="w-4 h-4" />
            Personal
          </Button>
          <Button
            variant={activeTab === "facilities" ? "default" : "outline"}
            onClick={() => setActiveTab("facilities")}
            className="gap-2"
          >
            <Building2 className="w-4 h-4" />
            Instalaciones
          </Button>
        </div>

        {/* Rooms Section */}
        {(activeTab === "rooms" || activeTab === "both") && (
          <div className={activeTab === "both" ? "mb-8" : ""}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-foreground">{t("admin.roomsTimeline")}</h2>
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
            </div>

            {/* Search */}
            <Card className="p-6 mb-6">
              <div className="flex gap-4 items-center">
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

            {/* Timeline Table */}
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
                            className={`${timelineMode === "week" ? "w-24" : "w-12"} h-12 rounded flex-shrink-0 ${
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
            <div className="flex items-center gap-6 mt-6 mb-6 border-t border-border">
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
          </div>
        )}

        {filteredRooms.length === 0 && activeTab !== "staff" && (
          <Card className="p-12 text-center">
            <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">{t("admin.noRoomsFound")}</p>
          </Card>
        )}

        {/* Staff Kanban Section */}
        {(activeTab === "staff" || activeTab === "both") && (
          <div className={activeTab === "both" ? "mt-8 pt-8 border-t border-border" : ""}>
            <h2 className="text-xl font-bold text-foreground mb-4">{t("admin.staffStatus")}</h2>
            
            <Card className="p-6">
              {/* Filters */}
              <Card className="p-4 mb-4">
                <div className="flex gap-4 items-end">
                  <div className="flex-1">
                    <Label htmlFor="search-name" className="text-sm font-medium">Buscar por nombre</Label>
                    <Input
                      id="search-name"
                      placeholder="Ej: María, Roberto..."
                      value={searchName}
                      onChange={(e) => setSearchName(e.target.value)}
                      className="mt-2"
                    />
                  </div>
                  <div className="w-48">
                    <Label htmlFor="filter-dept" className="text-sm font-medium">Filtrar por departamento</Label>
                    <Select value={filterDepartment} onValueChange={setFilterDepartment}>
                      <SelectTrigger id="filter-dept" className="mt-2">
                        <SelectValue placeholder="Todos los departamentos" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos los departamentos</SelectItem>
                        <SelectItem value="Limpieza">Limpieza</SelectItem>
                        <SelectItem value="Mantenimiento">Mantenimiento</SelectItem>
                        <SelectItem value="Seguridad">Seguridad</SelectItem>
                        <SelectItem value="Recepción">Recepción</SelectItem>
                        <SelectItem value="Servicio">Servicio</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </Card>

              <div className="overflow-x-auto">
                <div className="min-w-max">
                  {/* Header Row with Time Slots */}
                  <div className="flex gap-2 mb-4 sticky left-0">
                    {/* Staff Column Header */}
                    <div className="w-48 flex-shrink-0">
                      <div className="h-16 flex items-center justify-center bg-muted rounded-lg border border-border">
                        <span className="text-sm font-semibold text-muted-foreground">Personal</span>
                      </div>
                    </div>

                    {/* Time Slot Headers */}
                    <div className="flex gap-2">
                      {timeSlots.map((timeSlot) => (
                        <div key={timeSlot} className="w-32 flex-shrink-0">
                          <div className="h-16 flex flex-col items-center justify-center bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg border border-primary/20">
                            <Clock className="w-4 h-4 text-primary mb-1" />
                            <span className="text-xs font-medium text-foreground">{timeSlot}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Staff Rows */}
                  <div className="space-y-2">
                    {staffMembers
                      .filter((s) => s.status !== "off")
                      .filter((s) =>
                        s.name.toLowerCase().includes(searchName.toLowerCase())
                      )
                      .filter((s) =>
                        filterDepartment === "all" || s.department === filterDepartment
                      )
                      .map((member) => (
                        <div key={member.id} className="flex gap-2">
                          {/* Staff Info (Fixed Column) */}
                          <div className="w-48 flex-shrink-0 sticky left-0 bg-background">
                            <Card className="p-3 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20 h-full">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md">
                                  {member.avatar}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h3 className="font-semibold text-foreground text-sm truncate">{member.name}</h3>
                                  <div className="flex items-center gap-2 mt-1">
                                    <Badge className={getStatusColor(member.status) + " text-white text-xs py-0"}>
                                      {getStatusText(member.status)}
                                    </Badge>
                                    <span className="text-xs text-muted-foreground">
                                      {member.tasksToday}/{member.maxCapacity}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </Card>
                          </div>

                          {/* Time Slots for this Staff Member */}
                          <div className="flex gap-2">
                            {timeSlots.map((timeSlot) => {
                              const tasksInSlot = getTasksForTimeSlot(member.name, timeSlot)
                              const hasTask = tasksInSlot.length > 0

                              return (
                                <div key={timeSlot} className="w-32 flex-shrink-0">
                                  {hasTask ? (
                                    <div className="space-y-2">
                                      {tasksInSlot.map((task) => (
                                        <Card
                                          key={task.id}
                                          className="p-2 bg-gradient-to-r from-primary/10 to-primary/5 border-primary/30 hover:shadow-lg transition-all cursor-pointer h-full"
                                        >
                                          <div className="flex flex-col gap-1">
                                            <div className="flex items-center justify-between">
                                              <span className="font-semibold text-foreground text-xs">{task.roomNumber}</span>
                                              {task.priority === "urgent" && (
                                                <Badge variant="destructive" className="text-[10px] px-1 py-0">
                                                  !
                                                </Badge>
                                              )}
                                            </div>
                                            <p className="text-[10px] text-muted-foreground truncate">{task.guestName}</p>
                                            <Badge className={getRequestStatusColor(task.status) + " text-[10px] px-1 py-0"}>
                                              {getRequestStatusText(task.status)}
                                            </Badge>
                                          </div>
                                        </Card>
                                      ))}
                                    </div>
                                  ) : (
                                    <div className="h-full min-h-[80px] bg-muted/30 rounded-lg border border-dashed border-border flex items-center justify-center">
                                      <span className="text-xs text-muted-foreground/50">Libre</span>
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
              </div>
            </Card>
          </div>
        )}

        {/* Facilities Timeline Section */}
        {(activeTab === "facilities" || activeTab === "both") && (
          <div className={activeTab === "both" ? "mt-8 pt-8 border-t border-border" : ""}>
            <h2 className="text-xl font-bold text-foreground mb-4">Timeline de Instalaciones</h2>
            
            <Card className="p-6 overflow-x-auto">
              <div className="min-w-max">
                {/* Header con horas */}
                <div className="flex border-b border-border bg-muted/50 mb-4 sticky left-0">
                  <div className="w-48 p-4 font-semibold border-r border-border bg-muted/50 shrink-0">Instalación</div>
                  <div className="flex gap-1">
                    {Array.from({ length: 17 }, (_, i) => {
                      const hour = i + 7
                      const time = `${hour.toString().padStart(2, "0")}:00`
                      return (
                        <div key={time} className="w-20 p-3 text-center text-xs font-medium border-r border-border shrink-0">
                          {time}
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Filas de instalaciones */}
                {facilities.map((facility, idx) => (
                  <div key={facility.id} className={`flex border-b border-border last:border-b-0 ${idx % 2 === 0 ? "bg-background" : "bg-muted/30"}`}>
                    {/* Info de instalación */}
                    <div className="w-48 p-4 border-r border-border flex items-center gap-3 shrink-0">
                      <div className={`p-2 rounded-lg shrink-0 ${
                        facility.type === "fitness" ? "bg-orange-500" :
                        facility.type === "recreation" ? "bg-blue-500" :
                        facility.type === "wellness" ? "bg-purple-500" :
                        "bg-teal-500"
                      }`}>
                        {facility.type === "fitness" && <Dumbbell className="w-5 h-5 text-white" />}
                        {facility.type === "recreation" && <Waves className="w-5 h-5 text-white" />}
                        {facility.type === "wellness" && <Sparkles className="w-5 h-5 text-white" />}
                        {facility.type === "business" && <Building2 className="w-5 h-5 text-white" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm truncate">{facility.name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-muted-foreground capitalize">{facility.type}</span>
                          <Badge variant="outline" className="text-xs">Cap. {facility.capacity}</Badge>
                        </div>
                      </div>
                    </div>

                    {/* Time slots */}
                    <div className="flex gap-1">
                      {Array.from({ length: 17 }, (_, i) => {
                        const hour = i + 7
                        const time = `${hour.toString().padStart(2, "0")}:00`
                        return (
                          <div
                            key={time}
                            className={`w-20 p-3 flex items-center justify-center text-xs font-medium border-r border-border shrink-0 ${
                              facility.status === "booked"
                                ? "bg-green-100 border-green-200 text-green-700"
                                : "bg-gray-50 text-gray-400"
                            }`}
                          >
                            {facility.status === "booked" ? "Ocupada" : "-"}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
