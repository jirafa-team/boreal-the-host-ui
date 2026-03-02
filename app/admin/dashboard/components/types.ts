import type { LucideIcon } from "lucide-react"

export type RoomStatus = "available" | "occupied" | "maintenance" | "reserved"
export type FacilityStatus = "available" | "booked"

export type Room = {
  id: string
  number: string
  type: string
  floor: number
  status: RoomStatus
  guest?: string
  checkIn?: string
  checkOut?: string
}

export type Facility = {
  id: string
  name: string
  type: string
  capacity: number
  icon: LucideIcon
  color: string
  startTime: string
  endTime: string
}

export type Booking = {
  facilityId: string
  clientName: string
  clientRoom: string
  time: string
  duration: number
  status: "confirmed" | "pending"
}

export type StaffStatus = "available" | "busy" | "off"

export type StaffDepartment =
  | "Limpieza"
  | "Mantenimiento"
  | "Seguridad"
  | "Recepción"
  | "Servicio"

export type StaffMember = {
  id: number
  name: string
  avatar: string
  department: StaffDepartment
  status: StaffStatus
  tasksToday: number
  maxCapacity: number
  shift: string
  currentRoom?: number
}

export type CleaningRequestStatus =
  | "pending"
  | "assigned"
  | "in-progress"
  | "completed"

export type CleaningRequest = {
  id: number
  roomNumber: number
  guestName: string
  requestedTime: string
  status: CleaningRequestStatus
  assignedTo?: string
  priority: "normal" | "urgent"
}

export type CheckoutStatus = "completed" | "pending"

export type Checkout = {
  id: number
  room: string
  guestName: string
  status: CheckoutStatus
  balance: number
  lateCheckout: boolean
}

export type DateColumn = {
  label: string
  date: Date
}

export type DashboardTab = "rooms" | "staff" | "facilities" | "checkouts"
