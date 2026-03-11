"use client"

import { useSearchParams } from "next/navigation"
import { ClientExperienceView } from "../page"
import type { ClientType, ClientUserData, FacilityItem, FacilitySlot, ClientEvent } from "../types"

const futureUserData: ClientUserData = {
  name: "Ana",
  fullName: "Ana García",
  initials: "AG",
  email: "ana.garcia@email.com",
  room: "305",
  roomType: "Deluxe",
  phone: "+54 11 4567 8901",
  checkIn: "5 Dic 2024",
  checkOut: "10 Dic 2024",
  nights: 5,
  daysUntilCheckIn: 18,
}

const vipUserData: ClientUserData = {
  name: "Isabella",
  fullName: "Isabella Von Habsburg",
  initials: "IV",
  email: "isabella.von.habsburg@luxury.com",
  room: "Penthouse 901",
  roomType: "Presidential Suite",
  phone: "+41 79 555 1234",
  checkIn: "20 Nov 2024",
  checkOut: "28 Nov 2024",
  nights: 7,
}

const normalUserData: ClientUserData = {
  name: "Carlos",
  fullName: "Carlos Martínez",
  initials: "CM",
  email: "carlos.martinez@email.com",
  room: "204",
  roomType: "Suite Premium",
  phone: "+34 612 345 678",
  checkIn: "12 Nov 2024",
  checkOut: "15 Nov 2024",
  nights: 3,
}

export const mockFacilities: FacilityItem[] = [
  { id: "breakfast", name: "Desayuno", openTime: "07:00", closeTime: "11:00", capacity: 60, image: "/images/hotel-breakfast-buffet.jpg" },
  { id: "cleaning", name: "Limpieza", openTime: "09:00", closeTime: "17:00", capacity: 10, image: "/images/hotel-room-cleaning.jpg" },
  { id: "gym", name: "Gimnasio", openTime: "06:00", closeTime: "23:00", capacity: 40, image: "/images/modern-hotel-gym.jpg" },
  { id: "pool", name: "Piscina", openTime: "09:00", closeTime: "19:00", capacity: 50, image: "/images/luxury-hotel-pool.jpg" },
]

export const mockSlotsByFacility: Record<string, FacilitySlot[]> = {
  breakfast: [
    { time: "6:30 AM", available: true, reserved: 25, capacity: 60 },
    { time: "7:00 AM", available: true, reserved: 42, capacity: 60 },
    { time: "7:30 AM", available: true, reserved: 56, capacity: 60 },
    { time: "8:00 AM", available: true, reserved: 48, capacity: 60 },
    { time: "8:30 AM", available: true, reserved: 35, capacity: 60 },
    { time: "9:00 AM", available: true, reserved: 18, capacity: 60 },
    { time: "9:30 AM", available: true, reserved: 8, capacity: 60 },
    { time: "10:00 AM", available: true, reserved: 5, capacity: 60 },
  ],
  cleaning: [
    { time: "9:00 AM", available: true, reserved: 2, capacity: 10 },
    { time: "10:00 AM", available: true, reserved: 4, capacity: 10 },
    { time: "11:00 AM", available: true, reserved: 6, capacity: 10 },
    { time: "12:00 PM", available: true, reserved: 8, capacity: 10 },
    { time: "1:00 PM", available: true, reserved: 5, capacity: 10 },
    { time: "2:00 PM", available: true, reserved: 3, capacity: 10 },
    { time: "3:00 PM", available: true, reserved: 1, capacity: 10 },
  ],
  gym: [
    { time: "6:00 AM", available: true, reserved: 20, capacity: 40 },
    { time: "7:00 AM", available: true, reserved: 35, capacity: 40 },
    { time: "8:00 AM", available: true, reserved: 38, capacity: 40 },
    { time: "9:00 AM", available: true, reserved: 10, capacity: 40 },
    { time: "5:00 PM", available: true, reserved: 32, capacity: 40 },
    { time: "6:00 PM", available: true, reserved: 39, capacity: 40 },
    { time: "7:00 PM", available: true, reserved: 25, capacity: 40 },
    { time: "8:00 PM", available: true, reserved: 12, capacity: 40 },
  ],
  pool: [
    { time: "9:00 AM", available: true, reserved: 15, capacity: 50 },
    { time: "10:00 AM", available: true, reserved: 8, capacity: 50 },
    { time: "11:00 AM", available: true, reserved: 32, capacity: 50 },
    { time: "12:00 PM", available: true, reserved: 42, capacity: 50 },
    { time: "3:00 PM", available: true, reserved: 12, capacity: 50 },
    { time: "4:00 PM", available: true, reserved: 28, capacity: 50 },
    { time: "5:00 PM", available: true, reserved: 38, capacity: 50 },
    { time: "6:00 PM", available: true, reserved: 45, capacity: 50 },
  ],
}

export const mockEvents: ClientEvent[] = [
  {
    id: 1,
    name: "Conferencia Anual Q1",
    description: "Presentación de resultados del primer trimestre y estrategias futuras",
    date: "2024-11-13",
    time: "10:00",
    location: "Salón Principal",
    category: "conference",
    registered: true,
    image: "/business-conference-presentation.jpg",
    attendees: 45,
    duration: "2 horas",
    gradient: "from-blue-500 to-purple-600",
  },
  {
    id: 2,
    name: "Cena de Gala",
    description: "Cena formal con menú de autor y música en vivo",
    date: "2024-11-14",
    time: "20:00",
    location: "Restaurante",
    category: "dining",
    registered: false,
    image: "/elegant-gala-dinner-restaurant.jpg",
    attendees: 60,
    duration: "3 horas",
    gradient: "from-amber-500 to-red-600",
  },
  {
    id: 3,
    name: "Workshop de Innovación",
    description: "Taller práctico sobre nuevas tecnologías y metodologías ágiles",
    date: "2024-11-15",
    time: "14:00",
    location: "Sala de Conferencias B",
    category: "workshop",
    registered: false,
    image: "/innovation-technology-workshop.jpg",
    attendees: 30,
    duration: "4 horas",
    gradient: "from-green-500 to-teal-600",
  },
]

export function ClientMockContainer() {
  const searchParams = useSearchParams()
  const clientTypeFromQuery = (searchParams.get("type") || "normal") as ClientType

  const userData =
    clientTypeFromQuery === "vip"
      ? vipUserData
      : clientTypeFromQuery === "future"
        ? futureUserData
        : normalUserData

  return (
    <ClientExperienceView
      userData={userData}
      clientType={clientTypeFromQuery}
      facilities={mockFacilities}
      mockSlots={mockSlotsByFacility}
      events={mockEvents}
    />
  )
}