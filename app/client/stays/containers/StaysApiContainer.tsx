"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useLanguage } from "@/lib/i18n-context"
import { StaysView } from "../components/StaysView"
import type { Stay } from "../components/types"

export function StaysApiContainer() {
  const router = useRouter()
  const { t } = useLanguage()
  const [userInitials, setUserInitials] = useState<string>("")
  const [isLoaded, setIsLoaded] = useState(false)

  // When stays API exists: useGetStaysQuery(undefined, { skip: dataSource !== "api" })
  // Map response to Stay[] and pass isLoading, error to StaysView
  const stays: Stay[] = []
  const isLoading = false
  const error = undefined

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
      stays={stays}
      userInitials={userInitials}
      onStayClick={handleStayClick}
      onFirstStayCheckinClick={handleFirstStayCheckinClick}
      t={t}
      isLoading={isLoading}
      error={error}
    />
  )
}
