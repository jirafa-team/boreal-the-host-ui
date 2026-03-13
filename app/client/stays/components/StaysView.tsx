"use client"

import { useRouter } from "next/navigation"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { ArrowRight } from "lucide-react"
import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "@/store/store"
import { setDataSource } from "@/store/slices/dataSourceSlice"
import type { Stay } from "./types"

type TFunction = (key: string) => string

export type StaysViewProps = {
  stays: Stay[]
  userInitials: string
  hasCompletedCheckIn?: boolean
  onStayClick: (stayId: number | string) => void
  onAccessReservationClick?: (stayId: number | string) => void
  onWaitingTripClick?: (stayId: number | string) => void
  onFirstStayCheckinClick: () => void
  t: TFunction
  isLoading?: boolean
  error?: unknown
}

const parseLocalDate = (dateStr: string): Date => {
  const [year, month, day] = dateStr.split("-").map(Number)
  return new Date(year, month - 1, day)
}

export function StaysView({
  stays,
  userInitials,
  hasCompletedCheckIn = false,
  onStayClick,
  onAccessReservationClick,
  onWaitingTripClick,
  onFirstStayCheckinClick,
  t,
  isLoading = false,
  error,
}: StaysViewProps) {
  const router = useRouter()
  const dispatch = useDispatch()
  const dataSource = useSelector((state: RootState) => state.dataSource.dataSource)
  const mockMode = dataSource === "mock"

  const accessReservationLabel = t("stays.accessReservation") || "Acceder a mi reserva"

  const getStatusLabel = (status: string): string => {
    const normalized = status.toLowerCase()
    switch (normalized) {
      case "confirmed":
        return "Confirmada"
      case "checked_in":
        return "En curso"
      case "checked_out":
        return "Finalizada"
      case "cancelled":
        return "Cancelada"
      default:
        return "Pendiente"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center justify-between">
          <Image
            src="/images/thehost-20logo.png"
            alt="TheHost Logo"
            width={240}
            height={120}
            priority
            style={{ height: "auto" }}
          />
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Label htmlFor="stays-datasource" className="text-slate-300 text-sm cursor-pointer">
                {mockMode ? "Mock" : "API"}
              </Label>
              <Switch
                id="stays-datasource"
                checked={mockMode}
                onCheckedChange={(checked) =>
                  dispatch(setDataSource(checked ? "mock" : "api"))
                }
              />
            </div>
            <button
              onClick={() => router.push("/client/profile")}
              className="flex items-center justify-center p-2 rounded-lg bg-slate-700/50 border border-slate-600 hover:border-cyan-500/50 hover:bg-slate-700/70 transition-all cursor-pointer"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center font-semibold text-white text-xs">
                {userInitials || "U"}
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Stays Grid */}
      <div className="max-w-7xl mx-auto">
        {isLoading && (
          <div className="text-center py-16">
            <p className="text-slate-400 text-lg">
              {t("common.loading") || "Cargando..."}
            </p>
          </div>
        )}
        {error != null && !isLoading ? (
          <div className="text-center py-16">
            <p className="text-red-400 text-lg">
              {t("common.error") || "Error al cargar las estadías"}
            </p>
          </div>
        ) : null}
        {!isLoading && !error && (
          <>
            {!hasCompletedCheckIn && stays.length > 0 && (
              <div className="mb-6">
                <Button
                  onClick={onFirstStayCheckinClick}
                  className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold rounded-lg flex items-center justify-center gap-2 h-10"
                >
                  ⚠{" "}
                  {t("stays.completeCheckInData") || "Completar datos para check-in"}
                </Button>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {stays.map((stay) => {
                const rawStatus = (stay.status || "").toLowerCase()
                const now = new Date()
                const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
                const checkInDate = stay.checkIn ? parseLocalDate(stay.checkIn) : null
                const checkOutDate = stay.checkOut ? parseLocalDate(stay.checkOut) : null

                const isFinalized =
                  rawStatus === "checked_out" ||
                  rawStatus === "cancelled" ||
                  (checkOutDate != null && checkOutDate < today)

                const isOngoing = checkInDate != null && checkInDate <= today && checkOutDate != null && checkOutDate > today
                const isFuture = checkInDate != null && checkInDate > today

                let buttonLabel: string | null = null

                if (isFinalized) {
                  buttonLabel = t("stays.finalized") || "Finalizada"
                } else if (!hasCompletedCheckIn) {
                  buttonLabel = t("stays.completeCheckin") || "Completar Check-in"
                } else if (isOngoing) {
                  buttonLabel = accessReservationLabel
                } else if (isFuture) {
                  buttonLabel = t("stays.waitingTripStart") || "Esperando inicio de viaje! ⏳"
                } else {
                  buttonLabel = accessReservationLabel
                }

                const statusLabel = getStatusLabel(rawStatus)
                const badgeClass =
                  rawStatus === "checked_in"
                    ? "bg-blue-500/30 text-blue-300"
                    : rawStatus === "checked_out"
                      ? "bg-yellow-500/30 text-yellow-300"
                      : rawStatus === "cancelled"
                        ? "bg-red-500/30 text-red-300"
                        : "bg-green-500/30 text-green-300"

                return (
                  <div key={stay.id} className="relative">
                    <Card
                      className="bg-slate-800/50 border-slate-700 overflow-hidden hover:shadow-xl hover:shadow-cyan-500/10 transition-all duration-300 cursor-pointer"
                      onClick={() => onStayClick(stay.id)}
                    >
                      <div className="relative h-48 bg-slate-700">
                        <Image
                          src={stay.hotelImage}
                          alt={stay.hotelName}
                          fill
                          className="object-cover"
                          loading="eager"
                        />
                        <div className="absolute inset-0 bg-black/20" />
                        <div className="absolute top-3 right-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${badgeClass}`}>
                            {statusLabel}
                          </span>
                        </div>
                      </div>

                      <CardContent className="pt-6 space-y-4">
                        <div>
                          <h3 className="text-lg font-bold text-white">{stay.hotelName}</h3>
                          <p className="text-sm text-slate-400 mt-1">{stay.roomName}</p>
                        </div>

                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between text-slate-300">
                            <span>{t("stays.checkIn") || "Check-in"}:</span>
                            <span className="text-cyan-300 font-semibold">{stay.checkIn}</span>
                          </div>
                          <div className="flex justify-between text-slate-300">
                            <span>{t("stays.checkOut") || "Check-out"}:</span>
                            <span className="text-cyan-300 font-semibold">{stay.checkOut}</span>
                          </div>
                        </div>

                        {buttonLabel && (
                          <div className="pt-4 border-t border-slate-600">
                            {isFinalized ? (
                              <Button
                                disabled
                                className="w-full bg-slate-600 text-slate-400 font-semibold rounded-lg flex items-center justify-center gap-2 cursor-not-allowed opacity-60"
                              >
                                {buttonLabel}
                              </Button>
                            ) : (
                              <Button
                                className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold rounded-lg flex items-center justify-center gap-2"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  const waitingLabel = t("stays.waitingTripStart") || "Esperando inicio de viaje! ⏳"
                                  if (!hasCompletedCheckIn) {
                                    onFirstStayCheckinClick()
                                  } else if (buttonLabel === accessReservationLabel && onAccessReservationClick) {
                                    onAccessReservationClick(stay.id)
                                  } else if (buttonLabel === waitingLabel && onWaitingTripClick) {
                                    onWaitingTripClick(stay.id)
                                  } else {
                                    onStayClick(stay.id)
                                  }
                                }}
                              >
                                {buttonLabel}
                                <ArrowRight className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                )
              })}
            </div>

            {stays.length === 0 && (
              <div className="text-center py-16">
                <p className="text-slate-400 text-lg">
                  {t("stays.noStays") || "No tienes estadías registradas"}
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}