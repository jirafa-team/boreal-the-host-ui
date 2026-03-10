"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useSelector, useDispatch } from "react-redux"
import type { RootState } from "@/store/store"
import { useLanguage } from "@/lib/i18n-context"
import { useGetUserReservationContextsQuery } from "@/features/reservation/slices/reservationSlice"
import { useGetUserContextsQuery } from "@/features/auth/slices/authSlice"
import { setCurrentOrganization } from "@/features/organization/slices/organizationSlice"
import { ClientExperienceView, type ClientType, type ClientUserData } from "../page"

interface ReservationWithDetails {
  id?: string
  checkIn?: string
  checkOut?: string
  status?: string
  room?: { id?: string; number?: string; name?: string; type?: string }
  user?: { firstName?: string; lastName?: string; email?: string; phone?: string }
}

function formatToYMD(value: string | undefined): string {
  if (!value) return ""
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return value
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  return `${y}-${m}-${day}`
}

function parseLocalDate(dateStr: string): Date {
  const [year, month, day] = dateStr.split("-").map(Number)
  return new Date(year, month - 1, day)
}

function formatDisplayDate(dateStr: string | undefined): string {
  if (!dateStr) return ""
  const d = parseLocalDate(dateStr)
  return d.toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" })
}

function diffInDays(from: Date, to: Date): number {
  return Math.round((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24))
}

export function ClientApiContainer() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const reservationId = searchParams.get("reservationId")

  const dispatch = useDispatch()
  const { t } = useLanguage()

  const dataSource = useSelector((state: RootState) => state.dataSource.dataSource)
  const organizationId = useSelector((state: RootState) => {
    const fromOrg = state.organization?.currentOrganizationId
    if (fromOrg) return fromOrg
    const fromAuth = state.auth?.currentOrganization as { id?: string } | undefined
    return fromAuth?.id ?? undefined
  })
  const authUser = useSelector((state: RootState) => state.auth?.user as {
    firstName?: string
    lastName?: string
    email?: string
  } | undefined)

  const userName = authUser?.firstName || "Huésped"
  const userInitials = `${authUser?.firstName?.charAt(0) || ""}${authUser?.lastName?.charAt(0) || ""}`.toUpperCase() || "H"

  const { data: userContexts } = useGetUserContextsQuery(undefined, {
    skip: dataSource !== "api" || !!organizationId,
  })

  useEffect(() => {
    if (dataSource !== "api" || organizationId || !userContexts?.length) return
    const first = userContexts[0]
    if (first?.organizationId) dispatch(setCurrentOrganization(first.organizationId))
  }, [dataSource, organizationId, userContexts, dispatch])

  const skipReservations = dataSource !== "api" || !organizationId
  const { data } = useGetUserReservationContextsQuery(undefined, {
    skip: skipReservations,
  })

  const reservationsList = (data?.reservations ?? []) as ReservationWithDetails[]

  const targetReservation = useMemo(() => {
    if (!reservationId) return reservationsList[0]
    return reservationsList.find((r) => r.id === reservationId) ?? reservationsList[0]
  }, [reservationsList, reservationId])

  const { userData, clientType } = useMemo((): { userData: ClientUserData; clientType: ClientType } => {
    if (!targetReservation) {
      return {
        userData: {
          name: userName,
          fullName: userName,
          initials: userInitials,
          email: authUser?.email ?? "",
          room: "",
          roomType: "",
          phone: "",
          checkIn: "",
          checkOut: "",
          nights: 0,
        },
        clientType: "normal",
      }
    }

    const checkInStr = formatToYMD(targetReservation.checkIn)
    const checkOutStr = formatToYMD(targetReservation.checkOut)
    const checkInDate = checkInStr ? parseLocalDate(checkInStr) : null
    const checkOutDate = checkOutStr ? parseLocalDate(checkOutStr) : null
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const nights = checkInDate && checkOutDate ? diffInDays(checkInDate, checkOutDate) : 0
    const daysUntilCheckIn = checkInDate && checkInDate > today ? diffInDays(today, checkInDate) : undefined
    const isFuture = checkInDate != null && checkInDate > today
    const clientType: ClientType = isFuture ? "future" : "normal"

    const userData: ClientUserData = {
      name: userName,
      fullName: `${authUser?.firstName ?? ""} ${authUser?.lastName ?? ""}`.trim() || userName,
      initials: userInitials,
      email: authUser?.email ?? targetReservation.user?.email ?? "",
      room: targetReservation.room?.number ?? targetReservation.room?.name ?? "",
      roomType: targetReservation.room?.type ?? "Habitación",
      phone: targetReservation.user?.phone ?? "",
      checkIn: formatDisplayDate(checkInStr),
      checkOut: formatDisplayDate(checkOutStr),
      nights,
      daysUntilCheckIn,
    }

    return { userData, clientType }
  }, [targetReservation, userName, userInitials, authUser])

  return <ClientExperienceView userData={userData} clientType={clientType} />
}