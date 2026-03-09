"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useLanguage } from "@/lib/i18n-context"
import { StaysView } from "../components/StaysView"
import type { Stay } from "../components/types"

const MOCK_STAYS: Stay[] = [
  {
    id: 1,
    hotelName: "The Grand Plaza Hotel",
    roomName: "Habitación Suite Deluxe",
    checkIn: "2024-03-15",
    checkOut: "2024-03-18",
    status: "Confirmada",
    hotelImage: "/hotel-1.jpg",
  },
  {
    id: 2,
    hotelName: "Riverside Boutique Inn",
    roomName: "Habitación Estándar",
    checkIn: "2024-04-10",
    checkOut: "2024-04-15",
    status: "Próxima",
    hotelImage: "/hotel-2.jpg",
  },
  {
    id: 3,
    hotelName: "Luxury Tower Resort",
    roomName: "Penthouse",
    checkIn: "2024-05-01",
    checkOut: "2024-05-05",
    status: "Pendiente",
    hotelImage: "/hotel-3.jpg",
  },
]

export function StaysMockContainer() {
  const router = useRouter()
  const { t } = useLanguage()
  const [userInitials, setUserInitials] = useState<string>("")
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
    const user = localStorage.getItem("currentUser")
    if (user) {
      const users = JSON.parse(localStorage.getItem("users") || "[]")
      const currentUserData = users.find((u: { email: string }) => u.email === user)
      if (currentUserData) {
        const initials = `${currentUserData.firstName?.charAt(0) || ""}${currentUserData.lastName?.charAt(0) || ""}`.toUpperCase()
        setUserInitials(initials || "U")
      }
    }
  }, [])

  const handleStayClick = (stayId: number) => {
    router.push(`/client/checkin?stayId=${stayId}`)
  }

  const handleFirstStayCheckinClick = () => {
    router.push("/client/checkin")
  }

  if (!isLoaded) {
    return null
  }

  return (
    <StaysView
      stays={MOCK_STAYS}
      userInitials={userInitials}
      onStayClick={handleStayClick}
      onFirstStayCheckinClick={handleFirstStayCheckinClick}
      t={t}
    />
  )
}
