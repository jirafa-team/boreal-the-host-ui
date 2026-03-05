"use client"

import { Card } from "@/components/ui/card"
import { Calendar, Users } from "lucide-react"
import type { Room, RoomStatus } from "./types"

type TFunction = (key: string) => string

export type RoomGridProps = {
  rooms: Room[]
  onEditRoom: (room: Room) => void
  getStatusLabel: (status: RoomStatus) => string
  t: TFunction
}

const statusBadgeBg: Record<RoomStatus, string> = {
  available: "#235E20",
  occupied: "#AA2C2C",
  reserved: "#1E3A8A",
  maintenance: "#CA8A04",
}

const statusIconBg: Record<RoomStatus, string> = {
  available: "rgba(35, 94, 32, 0.15)",
  occupied: "rgba(170, 44, 44, 0.15)",
  reserved: "rgba(30, 58, 138, 0.15)",
  maintenance: "rgba(180, 83, 9, 0.15)",
}

const statusIconColor: Record<RoomStatus, string> = {
  available: "#235E20",
  occupied: "#AA2C2C",
  reserved: "#1E3A8A",
  maintenance: "#B45309",
}

export function RoomGrid({ rooms, onEditRoom, getStatusLabel, t }: RoomGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {rooms.map((room) => {
        const badgeBg = statusBadgeBg[room.status]
        const iconBg = statusIconBg[room.status]
        const iconColor = statusIconColor[room.status]
        const capacity = room.capacity ?? 1
        return (
          <Card
            key={room.id}
            className="p-4 hover:shadow-lg transition-shadow cursor-pointer relative"
            onClick={() => onEditRoom(room)}
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-lg font-bold text-foreground">
                  {t("admin.roomNumber")} {room.number}
                </h3>
                <p className="text-sm text-muted-foreground">{room.type}</p>
                <p className="text-xs text-muted-foreground">
                  {t("admin.floorLabel")} {room.floor}
                </p>
              </div>
              <div
                className="px-3 py-1.5 rounded-lg text-xs font-medium text-white shrink-0"
                style={{ backgroundColor: badgeBg }}
              >
                {getStatusLabel(room.status)}
              </div>
            </div>

            <div className="space-y-2">
              <div className="pt-2 border-t border-border">
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: iconBg }}
                  >
                    <Users
                      className="w-3.5 h-3.5"
                      style={{ color: iconColor }}
                    />
                  </div>
                  <span className="text-sm font-medium text-foreground">
                    {capacity} {capacity === 1 ? "persona" : "personas"}
                  </span>
                </div>
                {room.checkIn && room.checkOut && (
                  <div className="flex items-center gap-2 mt-2 text-xs">
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: iconBg }}
                    >
                      <Calendar
                        className="w-3.5 h-3.5"
                        style={{ color: iconColor }}
                      />
                    </div>
                    <span className="text-muted-foreground">
                      {new Date(room.checkIn).toLocaleDateString("es-ES")}
                    </span>
                    <span className="text-muted-foreground">→</span>
                    <span className="text-muted-foreground">
                      {new Date(room.checkOut).toLocaleDateString("es-ES")}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </Card>
        )
      })}
    </div>
  )
}
