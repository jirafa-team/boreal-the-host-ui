"use client"

import { Card } from "@/components/ui/card"
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react"
import type { Room, RoomStatus, DateColumn } from "./types"

type TFunction = (key: string) => string

export type RoomTimelineProps = {
  rooms: Room[]
  dateColumns: DateColumn[]
  timelineMode: "week" | "month"
  currentDate: Date
  selectedMonth: { year: number; month: number }
  onCurrentDateChange: (date: Date) => void
  onSelectedMonthChange: (month: { year: number; month: number }) => void
  navigateDate: (direction: "prev" | "next") => void
  getRoomStatusForDate: (room: Room, date: Date) => RoomStatus
  getStatusColor: (status: RoomStatus) => string
  onTimelineModeChange: (mode: "week" | "month") => void
  language: string
  convertISOToLocaleFormat: (isoDate: string) => string
  t: TFunction
}

export function RoomTimeline({
  rooms,
  dateColumns,
  timelineMode,
  currentDate,
  selectedMonth,
  onCurrentDateChange,
  onSelectedMonthChange,
  navigateDate,
  getRoomStatusForDate,
  getStatusColor,
  onTimelineModeChange,
  language,
  convertISOToLocaleFormat,
  t,
}: RoomTimelineProps) {
  return (
    <div className="space-y-4">
      <div className="flex gap-2 justify-between items-center flex-wrap">
        <div className="flex items-center gap-3">
          <span className={`text-sm font-medium ${timelineMode === "week" ? "text-foreground" : "text-muted-foreground"}`}>
            {language === "es" || language === "pt" ? "Semana" : "Week"}
          </span>
          <button
            type="button"
            onClick={() => onTimelineModeChange(timelineMode === "week" ? "month" : "week")}
            className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
              timelineMode === "month" ? "bg-lime-600" : "bg-gray-300"
            }`}
            aria-label={timelineMode === "week" ? "Switch to month" : "Switch to week"}
          >
            <span
              className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                timelineMode === "month" ? "translate-x-7" : "translate-x-1"
              }`}
            />
          </button>
          <span className={`text-sm font-medium ${timelineMode === "month" ? "text-foreground" : "text-muted-foreground"}`}>
            {language === "es" || language === "pt" ? "Mes" : "Month"}
          </span>
        </div>

        {timelineMode === "week" ? (
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
        ) : (
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                const newMonth = selectedMonth.month - 1
                if (newMonth < 0) {
                  onSelectedMonthChange({ year: selectedMonth.year - 1, month: 11 })
                } else {
                  onSelectedMonthChange({ ...selectedMonth, month: newMonth })
                }
              }}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title={language === "es" || language === "pt" ? "Mes anterior" : "Previous month"}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <select
              value={`${selectedMonth.year}-${selectedMonth.month}`}
              onChange={(e) => {
                const [year, month] = e.target.value.split("-")
                onSelectedMonthChange({ year: parseInt(year, 10), month: parseInt(month, 10) })
              }}
              className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm font-medium cursor-pointer"
            >
              {Array.from({ length: 12 }, (_, i) => {
                const year = selectedMonth.year
                const month = i
                const monthName = new Date(year, month, 1).toLocaleDateString(
                  language === "es" ? "es-ES" : language === "pt" ? "pt-BR" : "en-US",
                  { month: "long", year: "numeric" }
                )
                return (
                  <option key={`${year}-${month}`} value={`${year}-${month}`}>
                    {monthName}
                  </option>
                )
              })}
            </select>
            <button
              type="button"
              onClick={() => {
                const newMonth = selectedMonth.month + 1
                if (newMonth > 11) {
                  onSelectedMonthChange({ year: selectedMonth.year + 1, month: 0 })
                } else {
                  onSelectedMonthChange({ ...selectedMonth, month: newMonth })
                }
              }}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title={language === "es" || language === "pt" ? "Mes siguiente" : "Next month"}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      <Card className="p-6 overflow-x-auto">
        <div className="min-w-max">
          <div className="flex border-b border-border mb-4">
            <div className="w-48 flex-shrink-0 pr-4 pb-4">
              <p className="text-sm font-semibold text-foreground">{t("admin.roomNumber")}</p>
            </div>
            <div className="flex gap-1 pb-4">
              {dateColumns.map((col, idx) => (
                <div
                  key={idx}
                  className={`${timelineMode === "week" ? "w-24" : "w-12"} text-center flex-shrink-0`}
                >
                  <p className="text-xs font-medium text-muted-foreground">{col.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            {rooms.map((room) => (
              <div key={room.id} className="flex items-center border-b border-border pb-2 last:border-b-0">
                <div className="w-48 flex-shrink-0 pr-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full flex-shrink-0 ${getStatusColor(room.status)}`} />
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        {t("admin.roomNumber")} {room.number}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {room.type} · {t("admin.floorLabel")} {room.floor}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-1">
                  {dateColumns.map((col, idx) => {
                    const status = getRoomStatusForDate(room, col.date)
                    return (
                      <div
                        key={idx}
                        className={`${timelineMode === "week" ? "w-24" : "w-12"} h-12 rounded flex-shrink-0 ${
                          status === "available"
                            ? "bg-green-100 border border-green-200"
                            : status === "occupied"
                              ? "bg-red-100 border border-red-200"
                              : status === "reserved"
                                ? "bg-blue-100 border border-blue-200"
                                : "bg-yellow-100 border border-yellow-200"
                        } flex items-center justify-center group relative cursor-pointer hover:shadow-md transition-shadow`}
                        title={room.guest ?? status}
                      >
                        {status !== "available" && (
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="bg-black/80 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                              {status === "occupied"
                                ? t("admin.roomOccupied")
                                : status === "reserved"
                                  ? t("admin.roomReserved")
                                  : t("admin.roomMaintenance")}
                              {room.guest && <div className="text-[10px]">{room.guest}</div>}
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-6 mt-6 pt-6 border-t border-border">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-green-100 border border-green-200" />
              <span className="text-xs text-muted-foreground">{t("admin.legendAvailable")}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-red-100 border border-red-200" />
              <span className="text-xs text-muted-foreground">{t("admin.legendOccupied")}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-blue-100 border border-blue-200" />
              <span className="text-xs text-muted-foreground">{t("admin.legendReserved")}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-yellow-100 border border-yellow-200" />
              <span className="text-xs text-muted-foreground">{t("admin.legendMaintenance")}</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
