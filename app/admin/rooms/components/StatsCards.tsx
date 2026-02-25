"use client"

import type { RoomStatus } from "./types"
import type { RoomStats } from "./types"

type TFunction = (key: string) => string

export type StatsCardsProps = {
  stats: RoomStats
  statusFilter: RoomStatus | null
  onFilterByStatus: (status: RoomStatus | null) => void
  t: TFunction
}

const STATUS_CONFIG: { key: RoomStatus | "total"; labelKey: string; bgActive: string; textInactive: string }[] = [
  { key: "total", labelKey: "admin.totalRooms", bgActive: "#1E40AF", textInactive: "text-blue-600" },
  { key: "available", labelKey: "admin.availableRooms", bgActive: "#235E20", textInactive: "" },
  { key: "occupied", labelKey: "admin.occupiedRooms", bgActive: "#AA2C2C", textInactive: "" },
  { key: "reserved", labelKey: "admin.reservedRooms", bgActive: "#1E3A8A", textInactive: "text-blue-700" },
  { key: "maintenance", labelKey: "admin.maintenanceRooms", bgActive: "#CA8A04", textInactive: "text-yellow-600" },
]

export function StatsCards({ stats, statusFilter, onFilterByStatus, t }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-4">
      {STATUS_CONFIG.map(({ key, labelKey, bgActive, textInactive }) => {
        const isTotal = key === "total"
        const filter = isTotal ? null : (key as RoomStatus)
        const isActive = statusFilter === filter
        const value = isTotal ? stats.total : stats[key as keyof RoomStats]
        return (
          <div
            key={key}
            role="button"
            tabIndex={0}
            onClick={() => onFilterByStatus(filter)}
            onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onFilterByStatus(filter)}
            className={`p-3 relative rounded-2xl shadow-lg text-center cursor-pointer transition-all overflow-hidden ${
              isActive ? "text-white" : "bg-white/95 backdrop-blur-lg hover:shadow-lg"
            }`}
            style={isActive ? { backgroundColor: bgActive } : {}}
          >
            {isActive && (
              <div
                className="absolute -top-12 -right-12 w-20 h-20 rounded-full"
                style={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}
              />
            )}
            <div className="relative z-10">
              <p
                className={`text-4xl font-bold mb-0.5 ${isActive ? "text-white" : textInactive || ""}`}
                style={!isActive && !isTotal ? { color: bgActive } : {}}
              >
                {value}
              </p>
              <p
                className={`text-xs font-medium ${
                  isActive ? (key === "total" ? "text-blue-100" : "text-muted-foreground") : "text-muted-foreground"
                }`}
                style={isActive && key !== "total" ? { color: "inherit" } : {}}
              >
                {t(labelKey)}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
