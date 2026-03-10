"use client"

import { useSearchParams } from "next/navigation"
import { ClientExperienceView, type ClientType, type ClientUserData } from "../page"

const futureUserDataDefault: ClientUserData = {
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

const vipUserDataDefault: ClientUserData = {
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

const normalUserDataDefault: ClientUserData = {
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

export function ClientMockContainer() {
  const searchParamsHook = useSearchParams()
  const clientTypeFromQuery = (searchParamsHook.get("type") || "normal") as ClientType

  const userData =
    clientTypeFromQuery === "vip"
      ? vipUserDataDefault
      : clientTypeFromQuery === "future"
        ? futureUserDataDefault
        : normalUserDataDefault

  return <ClientExperienceView userData={userData} clientType={clientTypeFromQuery} />
}

