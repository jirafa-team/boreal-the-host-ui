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
    { id: "b1", facilityId: "breakfast", startAt: "2026-03-11T06:30:00.000Z", endAt: "2026-03-11T07:00:00.000Z", currentOccupancy: 25, occupationPercentage: 42, status: "available", capacity: 60 },
    { id: "b2", facilityId: "breakfast", startAt: "2026-03-11T07:00:00.000Z", endAt: "2026-03-11T07:30:00.000Z", currentOccupancy: 42, occupationPercentage: 70, status: "available", capacity: 60 },
    { id: "b3", facilityId: "breakfast", startAt: "2026-03-11T07:30:00.000Z", endAt: "2026-03-11T08:00:00.000Z", currentOccupancy: 56, occupationPercentage: 93, status: "available", capacity: 60 },
    { id: "b4", facilityId: "breakfast", startAt: "2026-03-11T08:00:00.000Z", endAt: "2026-03-11T08:30:00.000Z", currentOccupancy: 48, occupationPercentage: 80, status: "available", capacity: 60 },
    { id: "b5", facilityId: "breakfast", startAt: "2026-03-11T08:30:00.000Z", endAt: "2026-03-11T09:00:00.000Z", currentOccupancy: 35, occupationPercentage: 58, status: "available", capacity: 60 },
    { id: "b6", facilityId: "breakfast", startAt: "2026-03-11T09:00:00.000Z", endAt: "2026-03-11T09:30:00.000Z", currentOccupancy: 18, occupationPercentage: 30, status: "available", capacity: 60 },
    { id: "b7", facilityId: "breakfast", startAt: "2026-03-11T09:30:00.000Z", endAt: "2026-03-11T10:00:00.000Z", currentOccupancy: 8, occupationPercentage: 13, status: "available", capacity: 60 },
    { id: "b8", facilityId: "breakfast", startAt: "2026-03-11T10:00:00.000Z", endAt: "2026-03-11T10:30:00.000Z", currentOccupancy: 5, occupationPercentage: 8, status: "available", capacity: 60 },
  ],
  cleaning: [
    { id: "c1", facilityId: "cleaning", startAt: "2026-03-11T09:00:00.000Z", endAt: "2026-03-11T10:00:00.000Z", currentOccupancy: 2, occupationPercentage: 20, status: "available", capacity: 10 },
    { id: "c2", facilityId: "cleaning", startAt: "2026-03-11T10:00:00.000Z", endAt: "2026-03-11T11:00:00.000Z", currentOccupancy: 4, occupationPercentage: 40, status: "available", capacity: 10 },
    { id: "c3", facilityId: "cleaning", startAt: "2026-03-11T11:00:00.000Z", endAt: "2026-03-11T12:00:00.000Z", currentOccupancy: 6, occupationPercentage: 60, status: "available", capacity: 10 },
    { id: "c4", facilityId: "cleaning", startAt: "2026-03-11T12:00:00.000Z", endAt: "2026-03-11T13:00:00.000Z", currentOccupancy: 8, occupationPercentage: 80, status: "available", capacity: 10 },
    { id: "c5", facilityId: "cleaning", startAt: "2026-03-11T13:00:00.000Z", endAt: "2026-03-11T14:00:00.000Z", currentOccupancy: 5, occupationPercentage: 50, status: "available", capacity: 10 },
    { id: "c6", facilityId: "cleaning", startAt: "2026-03-11T14:00:00.000Z", endAt: "2026-03-11T15:00:00.000Z", currentOccupancy: 3, occupationPercentage: 30, status: "available", capacity: 10 },
    { id: "c7", facilityId: "cleaning", startAt: "2026-03-11T15:00:00.000Z", endAt: "2026-03-11T16:00:00.000Z", currentOccupancy: 1, occupationPercentage: 10, status: "available", capacity: 10 },
  ],
  gym: [
    { id: "g1", facilityId: "gym", startAt: "2026-03-11T06:00:00.000Z", endAt: "2026-03-11T07:00:00.000Z", currentOccupancy: 20, occupationPercentage: 50, status: "available", capacity: 40 },
    { id: "g2", facilityId: "gym", startAt: "2026-03-11T07:00:00.000Z", endAt: "2026-03-11T08:00:00.000Z", currentOccupancy: 35, occupationPercentage: 88, status: "available", capacity: 40 },
    { id: "g3", facilityId: "gym", startAt: "2026-03-11T08:00:00.000Z", endAt: "2026-03-11T09:00:00.000Z", currentOccupancy: 38, occupationPercentage: 95, status: "available", capacity: 40 },
    { id: "g4", facilityId: "gym", startAt: "2026-03-11T09:00:00.000Z", endAt: "2026-03-11T10:00:00.000Z", currentOccupancy: 10, occupationPercentage: 25, status: "available", capacity: 40 },
    { id: "g5", facilityId: "gym", startAt: "2026-03-11T17:00:00.000Z", endAt: "2026-03-11T18:00:00.000Z", currentOccupancy: 32, occupationPercentage: 80, status: "available", capacity: 40 },
    { id: "g6", facilityId: "gym", startAt: "2026-03-11T18:00:00.000Z", endAt: "2026-03-11T19:00:00.000Z", currentOccupancy: 39, occupationPercentage: 98, status: "available", capacity: 40 },
    { id: "g7", facilityId: "gym", startAt: "2026-03-11T19:00:00.000Z", endAt: "2026-03-11T20:00:00.000Z", currentOccupancy: 25, occupationPercentage: 63, status: "available", capacity: 40 },
    { id: "g8", facilityId: "gym", startAt: "2026-03-11T20:00:00.000Z", endAt: "2026-03-11T21:00:00.000Z", currentOccupancy: 12, occupationPercentage: 30, status: "available", capacity: 40 },
  ],
  pool: [
    { id: "p1", facilityId: "pool", startAt: "2026-03-11T09:00:00.000Z", endAt: "2026-03-11T10:00:00.000Z", currentOccupancy: 15, occupationPercentage: 30, status: "available", capacity: 50 },
    { id: "p2", facilityId: "pool", startAt: "2026-03-11T10:00:00.000Z", endAt: "2026-03-11T11:00:00.000Z", currentOccupancy: 8, occupationPercentage: 16, status: "available", capacity: 50 },
    { id: "p3", facilityId: "pool", startAt: "2026-03-11T11:00:00.000Z", endAt: "2026-03-11T12:00:00.000Z", currentOccupancy: 32, occupationPercentage: 64, status: "available", capacity: 50 },
    { id: "p4", facilityId: "pool", startAt: "2026-03-11T12:00:00.000Z", endAt: "2026-03-11T13:00:00.000Z", currentOccupancy: 42, occupationPercentage: 84, status: "available", capacity: 50 },
    { id: "p5", facilityId: "pool", startAt: "2026-03-11T15:00:00.000Z", endAt: "2026-03-11T16:00:00.000Z", currentOccupancy: 12, occupationPercentage: 24, status: "available", capacity: 50 },
    { id: "p6", facilityId: "pool", startAt: "2026-03-11T16:00:00.000Z", endAt: "2026-03-11T17:00:00.000Z", currentOccupancy: 28, occupationPercentage: 56, status: "available", capacity: 50 },
    { id: "p7", facilityId: "pool", startAt: "2026-03-11T17:00:00.000Z", endAt: "2026-03-11T18:00:00.000Z", currentOccupancy: 38, occupationPercentage: 76, status: "available", capacity: 50 },
    { id: "p8", facilityId: "pool", startAt: "2026-03-11T18:00:00.000Z", endAt: "2026-03-11T19:00:00.000Z", currentOccupancy: 45, occupationPercentage: 90, status: "available", capacity: 50 },
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