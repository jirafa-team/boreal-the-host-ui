"use client"

import { useState, useMemo } from "react"
import { useParams } from "next/navigation"
import { useLanguage } from "@/lib/i18n-context"
import {
  Dumbbell,
  Waves,
  Sparkles,
  Video,
  Coffee,
  UtensilsCrossed,
} from "lucide-react"
import { DashboardView } from "../components/DashboardView"
import type {
  Room,
  Facility,
  Booking,
  StaffMember,
  CleaningRequest,
  Checkout,
  DashboardTab,
  RoomStatus,
  StaffStatus,
} from "../components/types"
import {
  generateDateColumns,
  getRoomStatusForDate,
} from "../utils"

const MOCK_FACILITIES: Facility[] = [
  {
    id: "1",
    name: "Gimnasio",
    type: "fitness",
    capacity: 15,
    icon: Dumbbell,
    color: "bg-orange-500",
    startTime: "06:00",
    endTime: "22:00",
  },
  {
    id: "2",
    name: "Piscina",
    type: "recreation",
    capacity: 30,
    icon: Waves,
    color: "bg-blue-500",
    startTime: "08:00",
    endTime: "20:00",
  },
  {
    id: "3",
    name: "Spa",
    type: "wellness",
    capacity: 8,
    icon: Sparkles,
    color: "bg-purple-500",
    startTime: "09:00",
    endTime: "21:00",
  },
  {
    id: "4",
    name: "Sala de Conferencias A",
    type: "business",
    capacity: 50,
    icon: Video,
    color: "bg-teal-500",
    startTime: "07:00",
    endTime: "23:00",
  },
  {
    id: "5",
    name: "Sala de Conferencias B",
    type: "business",
    capacity: 25,
    icon: Video,
    color: "bg-cyan-500",
    startTime: "07:00",
    endTime: "23:00",
  },
  {
    id: "6",
    name: "Cafetería",
    type: "dining",
    capacity: 40,
    icon: Coffee,
    color: "bg-amber-500",
    startTime: "06:30",
    endTime: "23:00",
  },
  {
    id: "7",
    name: "Restaurante Premium",
    type: "dining",
    capacity: 60,
    icon: UtensilsCrossed,
    color: "bg-rose-500",
    startTime: "12:00",
    endTime: "23:30",
  },
]

const MOCK_BOOKINGS: Booking[] = [
  {
    facilityId: "1",
    clientName: "Juan Pérez",
    clientRoom: "301",
    time: "08:00",
    duration: 60,
    status: "confirmed",
  },
  {
    facilityId: "1",
    clientName: "María García",
    clientRoom: "205",
    time: "10:00",
    duration: 60,
    status: "confirmed",
  },
  {
    facilityId: "2",
    clientName: "Carlos López",
    clientRoom: "412",
    time: "09:00",
    duration: 120,
    status: "confirmed",
  },
  {
    facilityId: "2",
    clientName: "Ana Martínez",
    clientRoom: "308",
    time: "14:00",
    duration: 60,
    status: "pending",
  },
  {
    facilityId: "3",
    clientName: "Laura Sánchez",
    clientRoom: "501",
    time: "11:00",
    duration: 60,
    status: "confirmed",
  },
  {
    facilityId: "4",
    clientName: "Empresa Tech Corp",
    clientRoom: "N/A",
    time: "09:00",
    duration: 180,
    status: "confirmed",
  },
]

const MOCK_ROOMS: Room[] = [
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

const MOCK_STAFF: StaffMember[] = [
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

const MOCK_REQUESTS: CleaningRequest[] = [
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
]

const INITIAL_CHECKOUTS: Checkout[] = [
  {
    id: 1,
    room: "301",
    guestName: "Carlos Mendoza",
    status: "completed",
    balance: 0,
    lateCheckout: false,
  },
  {
    id: 2,
    room: "205",
    guestName: "María García",
    status: "completed",
    balance: 150,
    lateCheckout: true,
  },
  {
    id: 3,
    room: "412",
    guestName: "John Smith",
    status: "pending",
    balance: 2800,
    lateCheckout: false,
  },
  {
    id: 4,
    room: "501",
    guestName: "Ahmed Hassan",
    status: "pending",
    balance: 3500,
    lateCheckout: true,
  },
  {
    id: 5,
    room: "103",
    guestName: "Emma Wilson",
    status: "pending",
    balance: 550,
    lateCheckout: false,
  },
  {
    id: 6,
    room: "502",
    guestName: "Roberto Silva",
    status: "completed",
    balance: 0,
    lateCheckout: false,
  },
]

function getStatusColor(
  status: RoomStatus | "booked" | StaffStatus
): string {
  const colors: Record<string, string> = {
    available: "bg-green-500",
    occupied: "bg-blue-500",
    maintenance: "bg-orange-500",
    reserved: "bg-yellow-500",
    booked: "bg-purple-500",
    busy: "bg-orange-500",
    off: "bg-gray-500",
  }
  return colors[status] ?? "bg-gray-500"
}

function getStatusText(status: StaffStatus): string {
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

function getRequestStatusColor(status: string): string {
  const colors: Record<string, string> = {
    pending: "bg-gray-500",
    assigned: "bg-blue-500",
    "in-progress": "bg-orange-500",
    completed: "bg-green-500",
  }
  return colors[status] ?? "bg-gray-500"
}

function getRequestStatusText(status: string): string {
  const labels: Record<string, string> = {
    pending: "Pendiente",
    assigned: "Asignado",
    "in-progress": "En progreso",
    completed: "Completado",
  }
  return labels[status] ?? status
}

function getTasksForTimeSlot(
  staffName: string,
  timeSlot: string
): CleaningRequest[] {
  return MOCK_REQUESTS.filter(
    (task) =>
      task.assignedTo === staffName &&
      (timeSlot === "11:00 AM"
        ? task.requestedTime.startsWith("10")
        : timeSlot === "3:00 PM"
          ? task.requestedTime.startsWith("14")
          : false)
  )
}

export function DashboardMockContainer() {
  const { t, language } = useLanguage()
  const params = useParams()
  const orgId = params?.orgId as string | undefined

  const [activeTab, setActiveTab] =
    useState<DashboardTab>("rooms")
  const [timelineMode, setTimelineMode] = useState<"week" | "month">("week")
  const [currentDate, setCurrentDate] = useState(new Date())
  const [searchTerm, setSearchTerm] = useState("")
  const [searchName, setSearchName] = useState("")
  const [filterDepartment, setFilterDepartment] = useState("all")
  const [checkouts, setCheckouts] = useState<Checkout[]>(INITIAL_CHECKOUTS)
  const [checkoutSearchRoom, setCheckoutSearchRoom] = useState("")
  const [checkoutSearchGuest, setCheckoutSearchGuest] = useState("")
  const [checkoutSearchStatus, setCheckoutSearchStatus] = useState("all")

  const facilities = MOCK_FACILITIES
  const bookings = MOCK_BOOKINGS
  const rooms = MOCK_ROOMS
  const staffMembers = MOCK_STAFF
  const requests = MOCK_REQUESTS

  const filteredRooms = useMemo(
    () =>
      rooms.filter(
        (room) =>
          room.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
          room.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (room.guest?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
      ),
    [rooms, searchTerm]
  )

  const filteredCheckouts = useMemo(
    () =>
      checkouts.filter((checkout) => {
        const matchesRoom = checkout.room
          .toLowerCase()
          .includes(checkoutSearchRoom.toLowerCase())
        const matchesGuest = checkout.guestName
          .toLowerCase()
          .includes(checkoutSearchGuest.toLowerCase())
        const matchesStatus =
          checkoutSearchStatus === "all" ||
          checkout.status === checkoutSearchStatus
        return matchesRoom && matchesGuest && matchesStatus
      }),
    [checkouts, checkoutSearchRoom, checkoutSearchGuest, checkoutSearchStatus]
  )

  const dateColumns = useMemo(
    () => generateDateColumns(currentDate, timelineMode),
    [currentDate, timelineMode]
  )

  const getStatusLabel = (
    status: RoomStatus | "booked" | StaffStatus
  ): string => {
    const labels: Record<string, string> = {
      available: t("admin.available"),
      occupied: t("admin.occupied"),
      maintenance: t("admin.maintenance"),
      reserved: t("admin.reserved"),
      booked: t("admin.booked"),
      busy: t("admin.busy"),
      off: t("admin.off"),
    }
    return labels[status] ?? status
  }

  const navigateDate = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate)
    if (timelineMode === "week") {
      newDate.setDate(newDate.getDate() + (direction === "next" ? 7 : -7))
    } else {
      newDate.setMonth(
        newDate.getMonth() + (direction === "next" ? 1 : -1)
      )
    }
    setCurrentDate(newDate)
  }

  const convertISOToLocaleFormat = (isoDate: string): string => {
    const [year, month, day] = isoDate.split("-")
    if (language === "es" || language === "pt") {
      return `${day}/${month}/${year}`
    }
    return `${month}/${day}/${year}`
  }

  const handleCompleteCheckout = (checkoutId: number) => {
    setCheckouts((prev) =>
      prev.map((checkout) =>
        checkout.id === checkoutId
          ? { ...checkout, status: "completed" as const }
          : checkout
      )
    )
  }

  const checkoutsCompletedCount = checkouts.filter(
    (c) => c.status === "completed"
  ).length
  const checkoutsPendingCount = checkouts.filter(
    (c) => c.status === "pending"
  ).length

  return (
    <DashboardView
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      timelineMode={timelineMode}
      setTimelineMode={setTimelineMode}
      currentDate={currentDate}
      onCurrentDateChange={setCurrentDate}
      searchTerm={searchTerm}
      onSearchTermChange={setSearchTerm}
      searchName={searchName}
      onSearchNameChange={setSearchName}
      filterDepartment={filterDepartment}
      onFilterDepartmentChange={setFilterDepartment}
      filteredRooms={filteredRooms}
      dateColumns={dateColumns}
      staffMembers={staffMembers}
      requests={requests}
      getTasksForTimeSlot={getTasksForTimeSlot}
      facilities={facilities}
      bookings={bookings}
      filteredCheckouts={filteredCheckouts}
      checkoutSearchRoom={checkoutSearchRoom}
      onCheckoutSearchRoomChange={setCheckoutSearchRoom}
      checkoutSearchGuest={checkoutSearchGuest}
      onCheckoutSearchGuestChange={setCheckoutSearchGuest}
      checkoutSearchStatus={checkoutSearchStatus}
      onCheckoutSearchStatusChange={setCheckoutSearchStatus}
      checkoutsCompletedCount={checkoutsCompletedCount}
      checkoutsPendingCount={checkoutsPendingCount}
      onCompleteCheckout={handleCompleteCheckout}
      onShowBookingsDetail={() => {}}
      navigateDate={navigateDate}
      convertISOToLocaleFormat={convertISOToLocaleFormat}
      getStatusColor={getStatusColor}
      getStatusLabel={getStatusLabel}
      getRoomStatusForDate={getRoomStatusForDate}
      getStatusText={getStatusText}
      getRequestStatusColor={getRequestStatusColor}
      getRequestStatusText={getRequestStatusText}
      t={t}
      language={language}
      orgId={orgId}
    />
  )
}
