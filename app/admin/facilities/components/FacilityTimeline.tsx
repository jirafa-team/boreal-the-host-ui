"use client"

import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react"
import type { Booking, Facility } from "./types"
import { TIME_SLOTS } from "./types"

type TFunction = (key: string) => string

export type FacilityTimelineProps = {
  facilities: Facility[]
  timeSlots: string[]
  currentDate: Date
  timelineMode: "week" | "month"
  onTimelineModeChange: (mode: "week" | "month") => void
  onCurrentDateChange: (date: Date) => void
  navigateDate: (direction: "prev" | "next") => void
  getBookingForSlot: (facilityId: string, time: string) => Booking | undefined
  isBookingStart: (facilityId: string, time: string) => Booking | undefined
  getBookingsAtSlot: (facilityId: string, timeSlot: string) => Booking[]
  getOccupancyPercentage: (facilityId: string, timeSlot: string) => number
  isMultiPartyFacility: (facilityType: string) => boolean
  onShowBookingsDetail: (bookings: Booking[]) => void
  onEditFacility: (facility: Facility) => void
  language: string
  convertISOToLocaleFormat: (isoDate: string) => string
  t: TFunction
}

export function FacilityTimeline({
  facilities,
  timeSlots,
  currentDate,
  timelineMode,
  onTimelineModeChange,
  onCurrentDateChange,
  navigateDate,
  getBookingForSlot,
  isBookingStart,
  getBookingsAtSlot,
  getOccupancyPercentage,
  isMultiPartyFacility,
  onShowBookingsDetail,
  onEditFacility,
  language,
  convertISOToLocaleFormat,
  t,
}: FacilityTimelineProps) {
  return (
    <>
      <div className="mb-6 flex gap-2 justify-between items-center flex-wrap">
        <div className="flex items-center gap-3">
          <span className={`text-sm font-medium ${timelineMode === "week" ? "text-foreground" : "text-muted-foreground"}`}>
            {t("admin.week")}
          </span>
          <button
            type="button"
            onClick={() => onTimelineModeChange(timelineMode === "week" ? "month" : "week")}
            className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
              timelineMode === "month" ? "bg-lime-600" : "bg-gray-300"
            }`}
          >
            <span
              className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                timelineMode === "month" ? "translate-x-7" : "translate-x-1"
              }`}
            />
          </button>
          <span className={`text-sm font-medium ${timelineMode === "month" ? "text-foreground" : "text-muted-foreground"}`}>
            {t("admin.month")}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigateDate("prev")}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title={language === "es" || language === "pt" ? "Fecha anterior" : "Previous date"}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="relative">
            <input
              type="date"
              value={currentDate.toISOString().split("T")[0]}
              onChange={(e) => onCurrentDateChange(new Date(e.target.value))}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            />
            <div className="pointer-events-none flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg bg-white w-40">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">{convertISOToLocaleFormat(currentDate.toISOString().split("T")[0])}</span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => navigateDate("next")}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title={language === "es" || language === "pt" ? "Fecha siguiente" : "Next date"}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <div style={{ width: "fit-content", minWidth: "100%" }}>
            <div className="flex border-b border-border bg-muted/50 sticky top-0 z-10">
              <div className="w-64 p-4 font-semibold border-r border-border bg-muted/50 shrink-0">Facility</div>
              {timeSlots.map((slot) => (
                <div key={slot} className="w-32 p-3 text-center text-sm font-medium border-r border-border shrink-0">
                  {slot}
                </div>
              ))}
            </div>

            {facilities.map((facility, idx) => {
              const Icon = facility.icon
              return (
                <div key={facility.id} className={`flex ${idx % 2 === 0 ? "bg-background" : "bg-muted/30"}`}>
                  <div className="w-64 p-4 border-r border-border flex items-center gap-3 shrink-0 group relative">
                    <div className={`${facility.color} p-2 rounded-lg shrink-0`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm truncate">{facility.name}</p>
                      <p className="text-xs text-muted-foreground capitalize">{facility.type}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">Cap. {facility.capacity}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {facility.startTime} - {facility.endTime}
                      </p>
                    </div>
                    <Button
                      type="button"
                      onClick={() => onEditFacility(facility)}
                      className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity px-2 py-1 text-xs rounded bg-primary/10 text-primary hover:bg-primary/20"
                    >
                      Editar
                    </Button>
                  </div>

                  <div className="flex">
                    {timeSlots.map((slot) => {
                      const bookingAtStart = isBookingStart(facility.id, slot)
                      const booking = getBookingForSlot(facility.id, slot)
                      const slotBookings = getBookingsAtSlot(facility.id, slot)
                      const occupancy = getOccupancyPercentage(facility.id, slot)

                      if (bookingAtStart) {
                        const durationHours = bookingAtStart.duration / 60
                        const widthInColumns = durationHours

                        return (
                          <div
                            key={slot}
                            className="relative border-r border-border group shrink-0"
                            style={{ width: `${widthInColumns * 128}px` }}
                          >
                            <div
                              className={`absolute inset-2 rounded-lg ${
                                bookingAtStart.status === "confirmed"
                                  ? "bg-gradient-to-br from-green-500/30 to-green-600/20 border-2 border-green-500"
                                  : "bg-gradient-to-br from-amber-500/30 to-amber-600/20 border-2 border-amber-500"
                              } p-3 flex flex-col justify-center hover:shadow-lg transition-all cursor-pointer hover:scale-[1.02] min-h-[72px]`}
                              onClick={() => slotBookings.length > 0 && onShowBookingsDetail(slotBookings)}
                              role="button"
                              tabIndex={0}
                              onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") slotBookings.length > 0 && onShowBookingsDetail(slotBookings)
                              }}
                            >
                              {isMultiPartyFacility(facility.type) ? (
                                <div className="flex flex-col items-center justify-center gap-2">
                                  <p className="text-lg font-bold text-foreground">
                                    {slotBookings.length}/{facility.capacity}
                                  </p>
                                  <p className="text-[10px] text-muted-foreground">Ocupación: {occupancy}%</p>
                                </div>
                              ) : (
                                <>
                                  <p className="text-sm font-bold truncate text-foreground">
                                    {slotBookings.length > 1 ? `${slotBookings.length} participantes` : bookingAtStart.clientName}
                                  </p>
                                  <p className="text-[10px] text-muted-foreground truncate">
                                    {slotBookings.length > 1 ? `Ocupación: ${occupancy}%` : `Hab. ${bookingAtStart.clientRoom}`}
                                  </p>
                                  <div className="text-[10px] text-muted-foreground font-medium mt-0.5 flex items-center gap-2">
                                    <span>{bookingAtStart.duration / 60}h</span>
                                    {slotBookings.length > 0 && (
                                      <span className="text-xs px-1.5 py-0.5 rounded bg-primary/20 text-primary">
                                        {slotBookings.length}/{facility.capacity}
                                      </span>
                                    )}
                                  </div>
                                </>
                              )}

                              {slotBookings.length > 0 && (
                                <div className="mt-2 w-full bg-black/10 rounded-full h-1.5">
                                  <div
                                    className={`h-1.5 rounded-full transition-all ${
                                      occupancy > 80 ? "bg-red-500" : occupancy > 50 ? "bg-amber-500" : "bg-green-500"
                                    }`}
                                    style={{ width: `${occupancy}%` }}
                                  />
                                </div>
                              )}
                            </div>

                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-20">
                              <div className="bg-popover border border-border rounded-lg shadow-xl p-4 min-w-[280px]">
                                <p className="font-bold text-sm mb-3">Detalles del horario {slot}</p>
                                {slotBookings.length > 0 ? (
                                  <div className="space-y-2">
                                    <p className="text-xs text-muted-foreground">
                                      <span className="font-medium">Ocupación:</span> {slotBookings.length}/{facility.capacity} ({occupancy}%)
                                    </p>
                                    {slotBookings.length <= 3 ? (
                                      <div className="space-y-2">
                                        {slotBookings.map((b, i) => (
                                          <div key={i} className="text-xs text-muted-foreground border-t border-border pt-2">
                                            <p className="font-medium text-foreground">{b.clientName}</p>
                                            <p>Hab. {b.clientRoom}</p>
                                          </div>
                                        ))}
                                      </div>
                                    ) : (
                                      <Button
                                        type="button"
                                        onClick={() => onShowBookingsDetail(slotBookings)}
                                        className="mt-2 text-xs text-primary hover:underline font-medium"
                                      >
                                        Ver los {slotBookings.length} participantes →
                                      </Button>
                                    )}
                                  </div>
                                ) : (
                                  <p className="text-xs text-muted-foreground">Sin reservas</p>
                                )}
                              </div>
                            </div>
                          </div>
                        )
                      }

                      if (booking) {
                        const slotBookingsAtTime = getBookingsAtSlot(facility.id, slot)
                        const occupancyAtTime = getOccupancyPercentage(facility.id, slot)

                        if (slotBookingsAtTime.length > 0) {
                          return (
                            <div
                              key={slot}
                              className="w-32 border-r border-border p-2 shrink-0 min-h-[88px] flex items-center justify-center cursor-pointer hover:bg-primary/5 transition-colors"
                              onClick={() => onShowBookingsDetail(slotBookingsAtTime)}
                              role="button"
                              tabIndex={0}
                              onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") onShowBookingsDetail(slotBookingsAtTime)
                              }}
                            >
                              <div className="w-full space-y-2">
                                <p className="text-xs font-medium text-foreground text-center">
                                  {slotBookingsAtTime.length}/{facility.capacity}
                                </p>
                                <div className="w-full bg-black/10 rounded-full h-2">
                                  <div
                                    className={`h-2 rounded-full transition-all ${
                                      occupancyAtTime > 80 ? "bg-red-500" : occupancyAtTime > 50 ? "bg-amber-500" : "bg-green-500"
                                    }`}
                                    style={{ width: `${occupancyAtTime}%` }}
                                  />
                                </div>
                              </div>
                            </div>
                          )
                        }
                        return null
                      }

                      return (
                        <div key={slot} className="w-32 border-r border-border p-2 shrink-0 min-h-[88px] flex items-center">
                          <div className="w-full border-2 border-dashed border-muted-foreground/20 rounded-md h-16 flex items-center justify-center hover:border-primary/30 hover:bg-primary/5 transition-colors cursor-pointer">
                            <span className="text-xs text-muted-foreground/50 font-medium">Libre</span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </>
  )
}
