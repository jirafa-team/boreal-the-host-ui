"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { useSelector, useDispatch } from "react-redux"
import type { RootState } from "@/store/store"
import { useLanguage } from "@/lib/i18n-context"
import { useGetUserReservationContextsQuery } from "@/features/reservation/slices/reservationSlice"
import { useGetUserContextsQuery } from "@/features/auth/slices/authSlice"
import { setCurrentOrganization } from "@/features/organization/slices/organizationSlice"
import { StaysView } from "../components/StaysView"
import type { Stay } from "../components/types"

const PLACEHOLDER_STAY_IMAGE = "/placeholder.svg"

interface ReservationWithDetails {
  id?: string
  code?: string
  clientId?: string
  roomId?: string
  checkIn?: string
  checkOut?: string
  status?: string
  user?: { firstName?: string; lastName?: string; email?: string }
  room?: { id?: string; number?: string }
}

function formatDate(value: string | undefined): string {
  if (!value) return ""
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return value
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  return `${y}-${m}-${day}`
}

function mapReservationStatus(apiStatus: string | undefined): string {
  return apiStatus?.toLowerCase() ?? "pending"
}

function mapReservationToStay(r: ReservationWithDetails): Stay {
  return {
    id: r.id ?? "",
    hotelName: "Establecimiento",
    roomName: r.room?.number ? `Habitación ${r.room.number}` : "—",
    checkIn: formatDate(r.checkIn),
    checkOut: formatDate(r.checkOut),
    status: mapReservationStatus(r.status),
    hotelImage: PLACEHOLDER_STAY_IMAGE,
  }
}

export function StaysApiContainer() {
  const router = useRouter()
  const dispatch = useDispatch()
  const { t } = useLanguage()
  const dataSource = useSelector((state: RootState) => state.dataSource.dataSource)
  const organizationId = useSelector((state: RootState) => {
    const fromOrg = state.organization?.currentOrganizationId
    if (fromOrg) return fromOrg
    const fromAuth = state.auth?.currentOrganization as { id?: string } | undefined
    return fromAuth?.id ?? undefined
  })
  const [isRedirecting, setIsRedirecting] = useState(false)

  const { data: userContexts } = useGetUserContextsQuery(undefined, {
    skip: dataSource !== "api" || !!organizationId,
  })

  useEffect(() => {
    if (dataSource !== "api" || organizationId || !userContexts?.length) return
    const first = userContexts[0]
    if (first?.organizationId) dispatch(setCurrentOrganization(first.organizationId))
  }, [dataSource, organizationId, userContexts, dispatch])

  const skipReservations = dataSource !== "api" || !organizationId
  const { data, isLoading, error } = useGetUserReservationContextsQuery(undefined, {
    skip: skipReservations,
  })

  const [userInitials, setUserInitials] = useState<string>("")
  const [isLoaded, setIsLoaded] = useState(false)

  const reservationsList = data?.reservations ?? []
  const hasCompletedCheckIn = !!data?.checkInCompletedAt

  const stays: Stay[] = useMemo(() => {
    const raw = reservationsList as ReservationWithDetails[]
    return raw.map(mapReservationToStay)
  }, [reservationsList])

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

  useEffect(() => {
    if (!data || isLoading) return

    if (hasCompletedCheckIn) {
      const raw = data.reservations as ReservationWithDetails[]
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      const activeStay = raw.find((r) => {
        const status = r.status?.toLowerCase()
        if (status === "checked_in") return true
        const checkIn = r.checkIn ? new Date(r.checkIn) : null
        const checkOut = r.checkOut ? new Date(r.checkOut) : null
        return checkIn && checkOut && checkIn <= today && checkOut > today
      })

      if (activeStay?.id) {
        router.push(`/client?reservationId=${activeStay.id}`)
        return
      }
    }

    setIsRedirecting(false)
  }, [data, isLoading, hasCompletedCheckIn])

  if (!isLoaded || isLoading || isRedirecting) return null

  const handleStayClick = (stayId: number | string) => {
    if (!hasCompletedCheckIn) {
      router.push("/client/checkin")
    } else {
      router.push(`/client/reservation-details?reservationId=${stayId}`)
    }
  }

  const handleAccessReservationClick = (stayId: number | string) => {
    router.push(`/client?reservationId=${stayId}`)
  }

  const handleWaitingTripClick = (stayId: number | string) => {
    console.log("AA")
    router.push(`/client?reservationId=${stayId}`)
  }

  const handleFirstStayCheckinClick = () => {
    router.push("/client/checkin")
  }

  // No renderizar nada mientras se evalúa la redirección
  if (!isLoaded || isLoading) return null

  return (
    <StaysView
      stays={stays}
      userInitials={userInitials}
      hasCompletedCheckIn={hasCompletedCheckIn}
      onStayClick={handleStayClick}
      onAccessReservationClick={handleAccessReservationClick}
      onWaitingTripClick={handleWaitingTripClick}
      onFirstStayCheckinClick={handleFirstStayCheckinClick}
      t={t}
      isLoading={isLoading}
      error={error}
    />
  )
}