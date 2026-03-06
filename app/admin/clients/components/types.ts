export interface Guest {
  id: string
  name: string
  email: string
  phone: string
  relationship: string
}

export type ClientStatus = "checked-in" | "checked-out" | "reserved" | "no-reservation"

export interface Client {
  id: string
  reservationId?: string
  name: string
  email: string
  phone: string
  room: string
  checkIn: string
  checkOut: string
  status: ClientStatus
  vip: boolean
  nationality: string
  guests: number | string
  totalSpent: number | string
  notes?: string
  roomType?: "standard" | "deluxe" | "premium"
  visitCount?: number | string
  groupMembers?: Guest[]
  category?: "Basic" | "Preferred" | "Elite" | "VIP"
}
