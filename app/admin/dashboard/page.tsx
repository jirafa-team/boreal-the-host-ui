"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, Search, Hotel, Users, Building2, Clock, AlertCircle, CheckCircle2, Dumbbell, Waves, Sparkles, Video, Coffee, UtensilsCrossed, Calendar } from "lucide-react"
import { useLanguage } from "@/lib/i18n-context"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type RoomStatus = "available" | "occupied" | "maintenance" | "reserved"
type FacilityStatus = "available" | "booked"

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

type Facility = {
  id: string
  name: string
  type: string
  capacity: number
  icon: typeof Dumbbell
  color: string
  startTime: string
  endTime: string
}

type Booking = {
  facilityId: string
  clientName: string
  clientRoom: string
  time: string
  duration: number
  status: "confirmed" | "pending"
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

const isBookingStart = (facilityId: string, facilityBookings: Booking[], time: string) => {
  const booking = facilityBookings.find((b) => b.facilityId === facilityId && b.time === time)
  return booking
}

const getBookingForSlot = (facilityId: string, facilityBookings: Booking[], time: string) => {
  return facilityBookings.find((booking) => {
    const bookingStartHour = Number.parseInt(booking.time.split(":")[0])
    const bookingStartMinute = Number.parseInt(booking.time.split(":")[1] || "0")
    const bookingDurationHours = booking.duration / 60
    const slotHour = Number.parseInt(time.split(":")[0])

    const slotInHours = slotHour
    const bookingStartInHours = bookingStartHour + bookingStartMinute / 60
    const bookingEndInHours = bookingStartInHours + bookingDurationHours

    return booking.facilityId === facilityId && slotInHours >= bookingStartInHours && slotInHours < bookingEndInHours
  })
}

const getBookingsAtSlot = (facilityId: string, facilityBookings: Booking[], timeSlot: string): Booking[] => {
  return facilityBookings.filter((b) => {
    if (b.facilityId !== facilityId) return false
    const bookingStart = parseInt(b.time.split(":")[0])
    const bookingEnd = bookingStart + b.duration / 60
    const slotTime = parseInt(timeSlot.split(":")[0])
    return slotTime >= bookingStart && slotTime < bookingEnd
  })
}

const getOccupancyPercentage = (facilityId: string, facilityBookings: Booking[], facilityList: Facility[], timeSlot: string): number => {
  const facility = facilityList.find((f) => f.id === facilityId)
  if (!facility) return 0
  const slotBookings = getBookingsAtSlot(facilityId, facilityBookings, timeSlot)
  return Math.round((slotBookings.length / facility.capacity) * 100)
}

const isMultiPartyFacility = (facilityType: string): boolean => {
  return ["fitness", "recreation", "wellness", "dining"].includes(facilityType)
}

const handleShowBookingsDetail = (slotBookings: Booking[]) => {
  // Implementation for showing bookings detail
  console.log("Bookings detail:", slotBookings)
}

export default function DashboardControl() {
  const { t, language } = useLanguage()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<"rooms" | "staff" | "facilities" | "checkouts">("rooms")
  const [timelineMode, setTimelineMode] = useState<"week" | "month">("week")
  const [currentDate, setCurrentDate] = useState(new Date())
  const [searchTerm, setSearchTerm] = useState("")
  const [searchName, setSearchName] = useState("")
  const [filterDepartment, setFilterDepartment] = useState("all")
  const [expandedSections, setExpandedSections] = useState(new Set<string>())
  const [selectedSlotBookings, setSelectedSlotBookings] = useState<Booking[]>([])
  const [bookingsDetailOpen, setBookingsDetailOpen] = useState(false)
  const [checkoutSearchRoom, setCheckoutSearchRoom] = useState("")
  const [checkoutSearchGuest, setCheckoutSearchGuest] = useState("")
  const [checkoutSearchStatus, setCheckoutSearchStatus] = useState("all")
  const [checkouts, setCheckouts] = useState([
    { id: 1, room: "301", guestName: "Carlos Mendoza", status: "completed" as const, balance: 0, lateCheckout: false },
    { id: 2, room: "205", guestName: "María García", status: "completed" as const, balance: 150, lateCheckout: true },
    { id: 3, room: "412", guestName: "John Smith", status: "pending" as const, balance: 2800, lateCheckout: false },
    { id: 4, room: "501", guestName: "Ahmed Hassan", status: "pending" as const, balance: 3500, lateCheckout: true },
    { id: 5, room: "103", guestName: "Emma Wilson", status: "pending" as const, balance: 550, lateCheckout: false },
    { id: 6, room: "502", guestName: "Roberto Silva", status: "completed" as const, balance: 0, lateCheckout: false },
  ])

  const mockFacilities: Facility[] = [
    { id: "1", name: "Gimnasio", type: "fitness", capacity: 15, icon: Dumbbell, color: "bg-orange-500", startTime: "06:00", endTime: "22:00" },
    { id: "2", name: "Piscina", type: "recreation", capacity: 30, icon: Waves, color: "bg-blue-500", startTime: "08:00", endTime: "20:00" },
    { id: "3", name: "Spa", type: "wellness", capacity: 8, icon: Sparkles, color: "bg-purple-500", startTime: "09:00", endTime: "21:00" },
    { id: "4", name: "Sala de Conferencias A", type: "business", capacity: 50, icon: Video, color: "bg-teal-500", startTime: "07:00", endTime: "23:00" },
    { id: "5", name: "Sala de Conferencias B", type: "business", capacity: 25, icon: Video, color: "bg-cyan-500", startTime: "07:00", endTime: "23:00" },
    { id: "6", name: "Cafetería", type: "dining", capacity: 40, icon: Coffee, color: "bg-amber-500", startTime: "06:30", endTime: "23:00" },
    { id: "7", name: "Restaurante Premium", type: "dining", capacity: 60, icon: UtensilsCrossed, color: "bg-rose-500", startTime: "12:00", endTime: "23:30" },
  ]

  const mockBookings: Booking[] = [
    { facilityId: "1", clientName: "Juan Pérez", clientRoom: "301", time: "08:00", duration: 60, status: "confirmed" },
    { facilityId: "1", clientName: "María García", clientRoom: "205", time: "10:00", duration: 60, status: "confirmed" },
    { facilityId: "2", clientName: "Carlos López", clientRoom: "412", time: "09:00", duration: 120, status: "confirmed" },
    { facilityId: "2", clientName: "Ana Martínez", clientRoom: "308", time: "14:00", duration: 60, status: "pending" },
    { facilityId: "3", clientName: "Laura Sánchez", clientRoom: "501", time: "11:00", duration: 60, status: "confirmed" },
    {
      facilityId: "4",
      clientName: "Empresa Tech Corp",
      clientRoom: "N/A",
      time: "09:00",
      duration: 180,
      status: "confirmed",
    },
  ]

  const [bookings, setBookings] = useState<Booking[]>(mockBookings)

  const timeSlotsArray = Array.from({ length: 17 }, (_, i) => {
    const hour = i + 7
    return `${hour.toString().padStart(2, "0")}:00`
  })

  const handleShowBookingsDetailFunction = (bookingsList: Booking[]) => {
    setSelectedSlotBookings(bookingsList)
    setBookingsDetailOpen(true)
  }

  const mockCheckouts = [
    { id: 1, room: "301", guestName: "Carlos Mendoza", status: "completed" as const, balance: 0, lateCheckout: false },
    { id: 2, room: "205", guestName: "María García", status: "completed" as const, balance: 150, lateCheckout: true },
    { id: 3, room: "412", guestName: "John Smith", status: "pending" as const, balance: 2800, lateCheckout: false },
    { id: 4, room: "501", guestName: "Ahmed Hassan", status: "pending" as const, balance: 3500, lateCheckout: true },
    { id: 5, room: "103", guestName: "Emma Wilson", status: "pending" as const, balance: 550, lateCheckout: false },
    { id: 6, room: "502", guestName: "Roberto Silva", status: "completed" as const, balance: 0, lateCheckout: false },
  ]

  const filteredCheckouts = checkouts.filter(checkout => {
    const matchesRoom = checkout.room.toLowerCase().includes(checkoutSearchRoom.toLowerCase())
    const matchesGuest = checkout.guestName.toLowerCase().includes(checkoutSearchGuest.toLowerCase())
    const matchesStatus = checkoutSearchStatus === "all" || checkout.status === checkoutSearchStatus
    return matchesRoom && matchesGuest && matchesStatus
  })

  const handleCompleteCheckout = (checkoutId: number) => {
    setCheckouts(checkouts.map(checkout =>
      checkout.id === checkoutId ? { ...checkout, status: "completed" as const } : checkout
    ))
  }

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

  const convertISOToLocaleFormat = (isoDate: string): string => {
    const [year, month, day] = isoDate.split('-')
    if (language === 'es' || language === 'pt') {
      return `${day}/${month}/${year}` // dd/mm/yyyy
    }
    return `${month}/${day}/${year}` // mm/dd/yyyy
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

  const facilities: Facility[] = mockFacilities
  const facilityList: Facility[] = mockFacilities // Declare facilityList variable

  return (
    <div>
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-10">
        <div className="px-8 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                {activeTab === "rooms" && t("admin.roomsTimeline")}
                {activeTab === "staff" && "Estado de Personal"}
                {activeTab === "facilities" && "Timeline de Amenities"}
              </h1>
              <p className="text-sm text-muted-foreground">
                {activeTab === "rooms" && t("admin.viewRealTimeStatus")}
                {activeTab === "staff" && "Gestiona y visualiza el estado del personal en tiempo real"}
                {activeTab === "facilities" && "Visualiza la disponibilidad y ocupación de los amenities"}
              </p>
            </div>
          </div>
          {/* View Tabs */}
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setActiveTab("rooms")}
              className={`group relative overflow-hidden rounded-lg px-5 py-2 text-white transition-all duration-300 text-xs font-medium ${
                activeTab === "rooms"
                  ? "bg-gradient-to-br from-purple-600 to-purple-700 shadow-lg scale-105 ring-2 ring-white ring-opacity-50"
                  : "bg-gradient-to-br from-purple-600 to-purple-700 opacity-60 hover:opacity-75 shadow-sm hover:shadow-md hover:scale-105"
              }`}
            >
              <div className="absolute top-0 right-0 w-12 h-12 bg-white opacity-10 rounded-full -mr-6 -mt-6"></div>
              <Hotel className="w-4 h-4 inline mr-2 relative z-10" />
              <span className="relative z-10">Habitaciones</span>
            </button>
            <button
              onClick={() => setActiveTab("staff")}
              className={`group relative overflow-hidden rounded-lg px-5 py-2 text-white transition-all duration-300 text-xs font-medium ${
                activeTab === "staff"
                  ? "bg-gradient-to-br from-lime-600 to-lime-700 shadow-lg scale-105 ring-2 ring-white ring-opacity-50"
                  : "bg-gradient-to-br from-lime-600 to-lime-700 opacity-60 hover:opacity-75 shadow-sm hover:shadow-md hover:scale-105"
              }`}
            >
              <div className="absolute top-0 right-0 w-12 h-12 bg-white opacity-10 rounded-full -mr-6 -mt-6"></div>
              <Users className="w-4 h-4 inline mr-2 relative z-10" />
              <span className="relative z-10">Personal</span>
            </button>
            <button
              onClick={() => setActiveTab("facilities")}
              className={`group relative overflow-hidden rounded-lg px-5 py-2 text-white transition-all duration-300 text-xs font-medium ${
                activeTab === "facilities"
                  ? "bg-gradient-to-br from-orange-600 to-orange-700 shadow-lg scale-105 ring-2 ring-white ring-opacity-50"
                  : "bg-gradient-to-br from-orange-600 to-orange-700 opacity-60 hover:opacity-75 shadow-sm hover:shadow-md hover:scale-105"
              }`}
            >
              <div className="absolute top-0 right-0 w-12 h-12 bg-white opacity-10 rounded-full -mr-6 -mt-6"></div>
              <Building2 className="w-4 h-4 inline mr-2 relative z-10" />
              <span className="relative z-10">Amenities</span>
            </button>
            <button
              onClick={() => setActiveTab("checkouts")}
              className={`group relative overflow-hidden rounded-lg px-5 py-2 text-white transition-all duration-300 text-xs font-medium ${
                activeTab === "checkouts"
                  ? "bg-gradient-to-br from-red-600 to-red-700 shadow-lg scale-105 ring-2 ring-white ring-opacity-50"
                  : "bg-gradient-to-br from-red-600 to-red-700 opacity-60 hover:opacity-75 shadow-sm hover:shadow-md hover:scale-105"
              }`}
            >
              <div className="absolute top-0 right-0 w-12 h-12 bg-white opacity-10 rounded-full -mr-6 -mt-6"></div>
              <CheckCircle2 className="w-4 h-4 inline mr-2 relative z-10" />
              <span className="relative z-10">Check-outs del Día</span>
            </button>
          </div>
        </div>
      </header>

      {filteredRooms.length === 0 && activeTab === "rooms" && (
        <Card className="p-12 text-center m-8 mt-6">
          <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-sm text-muted-foreground">{t("admin.noRoomsFound")}</p>
        </Card>
      )}

      {/* Rooms Timeline Section */}
      {activeTab === "rooms" && (
        <div className="px-8 py-6">
          <Card className="p-6 overflow-x-auto">
            {/* Filters and View Toggle */}
            <div className="flex items-end justify-between gap-4 mb-6 pb-6 border-b border-border flex-wrap">
              <div className="flex-1 max-w-xs">
                <label className="text-sm font-medium text-foreground block mb-2">Buscar habitación</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Ej: 101, 205..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              {/* Timeline Mode Toggle & Date Navigation */}
              <div className="flex items-center gap-4 flex-wrap">
                {/* Week/Month Toggle */}
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
                </div>

                {/* Date Navigation */}
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
            </div>

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
      {(activeTab === "staff") && (
        <div className="px-8 py-6">
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
      {(activeTab === "facilities") && (
        <div className="px-8 py-6">
          <div className="bg-card rounded-lg border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <div style={{ width: "fit-content", minWidth: "100%" }}>
                {/* Header con horas */}
                <div className="flex border-b border-border bg-muted/50 sticky top-0 z-10">
                  <div className="w-64 p-4 font-semibold border-r border-border bg-muted/50 shrink-0">Facility</div>
                  {timeSlotsArray.map((slot) => (
                    <div key={slot} className="w-32 p-3 text-center text-sm font-medium border-r border-border shrink-0">
                      {slot}
                    </div>
                  ))}
                </div>

                {/* Filas de facilities */}
                {facilities.map((facility, idx) => {
                  const Icon = facility.icon
                  return (
                    <div key={facility.id} className={`flex ${idx % 2 === 0 ? "bg-background" : "bg-muted/30"}`}>
                      {/* Info de facility */}
                      <div className="w-64 p-4 border-r border-border flex items-center gap-3 shrink-0 group relative">
                        <div className={`${facility.color} p-2 rounded-lg shrink-0`}>
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm truncate">{facility.name}</p>
                          <p className="text-xs text-muted-foreground capitalize">{facility.type}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">Cap. {facility.capacity}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{facility.startTime} - {facility.endTime}</p>
                        </div>
                      </div>

                      <div className="flex">
                        {timeSlotsArray.map((slot) => {
                          const bookingAtStart = isBookingStart(facility.id, bookings, slot)
                          const booking = getBookingForSlot(facility.id, bookings, slot)
                          const slotBookings = getBookingsAtSlot(facility.id, bookings, slot)
                          const occupancy = getOccupancyPercentage(facility.id, bookings, facilities, slot)

                          // Si hay una reserva que empieza en este slot
                          if (bookingAtStart) {
                            const durationHours = bookingAtStart.duration / 60
                            const widthInColumns = durationHours

                            return (
                              <div
                                key={slot}
                                className="relative border-r border-border group shrink-0"
                                style={{ width: `${widthInColumns * 128}px` }}
                              >
                                <div
                                  className={`absolute inset-2 rounded-lg ${
                                    bookingAtStart.status === "confirmed"
                                      ? "bg-gradient-to-br from-green-500/30 to-green-600/20 border-2 border-green-500"
                                      : "bg-gradient-to-br from-amber-500/30 to-amber-600/20 border-2 border-amber-500"
                                  } p-3 flex flex-col justify-center hover:shadow-lg transition-all cursor-pointer hover:scale-[1.02] min-h-[72px]`}
                                  onClick={() => slotBookings.length > 0 && handleShowBookingsDetailFunction(slotBookings)}
                                >
                                  {/* Multi-party facilities show only capacity info */}
                                  {isMultiPartyFacility(facility.type) ? (
                                    <div className="flex flex-col items-center justify-center gap-2">
                                      <p className="text-lg font-bold text-foreground">
                                        {slotBookings.length}/{facility.capacity}
                                      </p>
                                      <p className="text-[10px] text-muted-foreground">
                                        Ocupación: {occupancy}%
                                      </p>
                                    </div>
                                  ) : (
                                    <>
                                      <p className="text-sm font-bold truncate text-foreground">
                                        {slotBookings.length > 1 ? `${slotBookings.length} participantes` : bookingAtStart.clientName}
                                      </p>
                                      <p className="text-[10px] text-muted-foreground truncate">
                                        {slotBookings.length > 1 ? `Ocupación: ${occupancy}%` : `Hab. ${bookingAtStart.clientRoom}`}
                                      </p>
                                      <div className="text-[10px] text-muted-foreground font-medium mt-0.5 flex items-center gap-2">
                                        <span>{bookingAtStart.duration / 60}h</span>
                                        {slotBookings.length > 0 && (
                                          <span className="text-xs px-1.5 py-0.5 rounded bg-primary/20 text-primary">
                                            {slotBookings.length}/{facility.capacity}
                                          </span>
                                        )}
                                      </div>
                                    </>
                                  )}
                                  
                                  {/* Barra de ocupación */}
                                  {slotBookings.length > 0 && (
                                    <div className="mt-2 w-full bg-black/10 rounded-full h-1.5">
                                      <div
                                        className={`h-1.5 rounded-full transition-all ${
                                          occupancy > 80
                                            ? "bg-red-500"
                                            : occupancy > 50
                                              ? "bg-amber-500"
                                              : "bg-green-500"
                                        }`}
                                        style={{ width: `${occupancy}%` }}
                                      />
                                    </div>
                                  )}
                                </div>

                                {/* Tooltip mejorado */}
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-20">
                                  <div className="bg-popover border border-border rounded-lg shadow-xl p-4 min-w-[280px]">
                                    <p className="font-bold text-sm mb-3">Detalles del horario {slot}</p>
                                    {slotBookings.length > 0 ? (
                                      <div className="space-y-2">
                                        <p className="text-xs text-muted-foreground">
                                          <span className="font-medium">Ocupación:</span> {slotBookings.length}/{facility.capacity} ({occupancy}%)
                                        </p>
                                        {slotBookings.length <= 3 ? (
                                          <div className="space-y-2">
                                            {slotBookings.map((b, idx) => (
                                              <div key={idx} className="text-xs text-muted-foreground border-t border-border pt-2">
                                                <p className="font-medium text-foreground">{b.clientName}</p>
                                                <p>Hab. {b.clientRoom}</p>
                                              </div>
                                            ))}
                                          </div>
                                        ) : (
                                          <Button
                                            onClick={() => handleShowBookingsDetailFunction(slotBookings)}
                                            className="mt-2 text-xs text-primary hover:underline font-medium"
                                          >
                                            Ver los {slotBookings.length} participantes →
                                          </Button>
                                        )}
                                      </div>
                                    ) : (
                                      <p className="text-xs text-muted-foreground">Sin reservas</p>
                                    )}
                                  </div>
                                </div>
                              </div>
                            )
                          }
                          // Si hay una reserva que cubre este slot pero no empieza aquí, mostrar barra de ocupación
                          else if (booking) {
                            const slotBookingsAtTime = getBookingsAtSlot(facility.id, bookings, slot)
                            const occupancyAtTime = getOccupancyPercentage(facility.id, bookings, facilities, slot)
                            
                            if (slotBookingsAtTime.length > 0) {
                              return (
                                <div
                                  key={slot}
                                  className="w-32 border-r border-border p-2 shrink-0 min-h-[88px] flex items-center justify-center cursor-pointer hover:bg-primary/5 transition-colors"
                                  onClick={() => handleShowBookingsDetailFunction(slotBookingsAtTime)}
                                >
                                  <div className="w-full space-y-2">
                                    <p className="text-xs font-medium text-foreground text-center">
                                      {slotBookingsAtTime.length}/{facility.capacity}
                                    </p>
                                    <div className="w-full bg-black/10 rounded-full h-2">
                                      <div
                                        className={`h-2 rounded-full transition-all ${
                                          occupancyAtTime > 80
                                            ? "bg-red-500"
                                            : occupancyAtTime > 50
                                              ? "bg-amber-500"
                                              : "bg-green-500"
                                        }`}
                                        style={{ width: `${occupancyAtTime}%` }}
                                      />
                                    </div>
                                  </div>
                                </div>
                              )
                            }
                            return null
                          }
                          // Slot libre
                          else {
                            return (
                              <div
                                key={slot}
                                className="w-32 border-r border-border p-2 shrink-0 min-h-[88px] flex items-center"
                              >
                                <div className="w-full border-2 border-dashed border-muted-foreground/20 rounded-md h-16 flex items-center justify-center hover:border-primary/30 hover:bg-primary/5 transition-colors cursor-pointer">
                                  <span className="text-xs text-muted-foreground/50 font-medium">Libre</span>
                                </div>
                              </div>
                            )
                          }
                        })}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Checkouts Section */}
      {activeTab === "checkouts" && (
        <div className="px-8 py-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-foreground">Check-outs del Día</h2>
              <div className="flex gap-3">
                <div className="bg-green-50 rounded-lg px-6 py-4 border border-green-200 flex flex-col items-center justify-center">
                  <p className="text-5xl font-bold text-green-600 mb-2">
                    {mockCheckouts.filter(c => c.status === "completed").length}
                  </p>
                  <p className="text-gray-600 text-xs">Completados</p>
                </div>
                <div className="bg-orange-50 rounded-lg px-6 py-4 border border-orange-200 flex flex-col items-center justify-center">
                  <p className="text-5xl font-bold text-orange-600 mb-2">
                    {mockCheckouts.filter(c => c.status === "pending").length}
                  </p>
                  <p className="text-gray-600 text-xs">Pendientes</p>
                </div>
              </div>
            </div>

            {/* Search and Filter Section */}
            <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Buscar por Habitación</label>
                <input
                  type="text"
                  placeholder="Ej: 301"
                  value={checkoutSearchRoom}
                  onChange={(e) => setCheckoutSearchRoom(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Buscar por Cliente</label>
                <input
                  type="text"
                  placeholder="Nombre del cliente"
                  value={checkoutSearchGuest}
                  onChange={(e) => setCheckoutSearchGuest(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Filtrar por Estado</label>
                <select
                  value={checkoutSearchStatus}
                  onChange={(e) => setCheckoutSearchStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="all">Todos los estados</option>
                  <option value="completed">Completado</option>
                  <option value="pending">Pendiente</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="text-left px-4 py-3 font-semibold text-gray-900 text-sm">Habitación</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-900 text-sm">Cliente</th>
                    <th className="text-right px-4 py-3 font-semibold text-gray-900 text-sm">Saldo Pendiente</th>
                    <th className="text-center px-4 py-3 font-semibold text-gray-900 text-sm">Adicionales</th>
                    <th className="text-center px-4 py-3 font-semibold text-gray-900 text-sm">Estado</th>
                    <th className="text-center px-4 py-3 font-semibold text-gray-900 text-sm">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCheckouts.map((checkout) => (
                    <tr key={checkout.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 text-gray-900 font-semibold">#{checkout.room}</td>
                      <td className="px-4 py-3 text-gray-700">
                        <button
                          onClick={() => router.push(`/admin/clients/${checkout.id}`)}
                          className="text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                        >
                          {checkout.guestName}
                        </button>
                      </td>
                      <td className="px-4 py-3 text-right font-semibold text-gray-900">
                        ${checkout.balance.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {checkout.lateCheckout ? (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                            Late Check-out
                          </span>
                        ) : (
                          <span className="text-gray-400 text-sm">-</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          checkout.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : "bg-orange-100 text-orange-800"
                        }`}>
                          {checkout.status === "completed" ? "Completado" : "Pendiente"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        {checkout.status === "pending" ? (
                          <button
                            onClick={() => handleCompleteCheckout(checkout.id)}
                            className="flex items-center justify-center gap-1 px-3 py-1.5 text-white rounded-lg text-xs font-medium transition-all hover:opacity-90"
                            style={{ backgroundColor: "#235E20" }}
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            Completar
                          </button>
                        ) : (
                          <span className="text-gray-400 text-xs">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
