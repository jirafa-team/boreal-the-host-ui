import type { LucideIcon } from "lucide-react"

export type RoomStatus = "available" | "occupied" | "maintenance" | "reserved"
export type FacilityStatus = "available" | "booked"

export type Room = {
  id: string
  number: string
  type: string
  floor: number
  status: RoomStatus
  capacity: number;
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

export type StaffScheduleEntry = {
  dayOfWeek: number
  startTime: string
  endTime: string
  isActive: boolean
}

export type StaffDepartment =
  | "Limpieza"
  | "Mantenimiento"
  | "Seguridad"
  | "Recepción"
  | "Servicio"

export type StaffMember = {
  id: string
  name: string
  avatar: string
  department: StaffDepartment
  status: StaffStatus
  tasksToday: number
  completedTasks: number
  maxCapacity: number
  shift: string
  currentRoom?: number
  schedule?: StaffScheduleEntry[]
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
  id: string
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

/** Client option for room booking autocomplete */
export type RoomBookingClient = {
  id: string
  name: string
  email: string
  phone: string
  room: string
  checkIn: string
  checkOut: string
}

/** Payload when submitting "Crear Reserva de Habitación" */
export type RoomBookingFormPayload = {
  roomId: string
  clientName: string
  clientId?: string
  people: number
  checkIn: string
  checkOut: string
}

/** Payload when submitting "Crear Actividad" (maintenance) */
export type MaintenanceActivityFormPayload = {
  description: string
  priority: "normal" | "urgent"
  deliveryTime: string
  estimatedDurationMinutes: number
  assignedStaffId: string
  scheduledDate: string
  scheduledTime: string
}

/** Payload when submitting "Reserva Manual" (facility booking) */
export type FacilityBookingFormPayload = {
  facilityId: string
  clientName: string
  clientRoom: string
  people: number
  time: string
  duration: number
}
