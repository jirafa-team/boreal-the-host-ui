export type ClientType = "normal" | "vip" | "future"

export interface ClientUserData {
    name: string
    fullName: string
    initials: string
    email: string
    room: string
    roomType: string
    roomCapacity: number;
    phone: string
    checkIn: string
    checkOut: string
    nights: number
    daysUntilCheckIn?: number
}

export interface FacilityItem {
    id: string
    name: string
    openTime: string
    closeTime: string
    capacity: number
    image?: string
}

export interface FacilitySlot {
    id: string
    facilityId: string
    startAt: string
    endAt: string
    currentOccupancy: number
    occupationPercentage: number
    status: string
    capacity: number
}

export interface ClientEvent {
    id: number
    name: string
    description: string
    date: string
    time: string
    location: string
    category: string
    registered: boolean
    image: string
    attendees: number
    duration: string
    gradient: string
}