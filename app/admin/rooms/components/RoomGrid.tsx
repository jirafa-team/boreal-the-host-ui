"use client"

import { Card } from "@/components/ui/card"
import { Calendar, User } from "lucide-react"
import type { Room, RoomStatus } from "./types"

type TFunction = (key: string) => string

export type RoomGridProps = {
  rooms: Room[]
  onEditRoom: (room: Room) => void
  getStatusLabel: (status: RoomStatus) => string
  t: TFunction
}

const statusStyles: Record<RoomStatus, { bg: string; badgeBg: string }> = {
  available: { bg: "rgba(35, 94, 32, 0.15)", badgeBg: "#235E20" },
  occupied: { bg: "rgba(170, 44, 44, 0.15)", badgeBg: "#AA2C2C" },
  reserved: { bg: "rgba(30, 58, 138, 0.15)", badgeBg: "#1E3A8A" },
  maintenance: { bg: "rgba(180, 83, 9, 0.15)", badgeBg: "#B45309" },
}

export function RoomGrid({ rooms, onEditRoom, getStatusLabel, t }: RoomGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {rooms.map((room) => {
        const style = statusStyles[room.status]
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
                className={`px-3 py-1.5 rounded-lg text-xs font-medium text-white shrink-0`}
                style={{ backgroundColor: style.badgeBg }}
              >
                {getStatusLabel(room.status)}
              </div>
            </div>

            <div className="space-y-2">
              <div className="pt-2 border-t border-border">
                <div className="flex items-center gap-2">
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: style.bg }}
                  >
                    <User
                      className="w-3.5 h-3.5"
                      style={{ color: style.badgeBg }}
                    />
                  </div>
                  <span className="text-sm font-medium text-foreground">{room.guest ?? "—"}</span>
                </div>
                {room.checkIn && room.checkOut && (
                  <div className="flex items-center gap-2 mt-2 text-xs">
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: style.bg }}
                    >
                      <Calendar className="w-3.5 h-3.5" style={{ color: style.badgeBg }} />
                    </div>
                    <span className="text-muted-foreground">{new Date(room.checkIn).toLocaleDateString("es-ES")}</span>
                    <span className="text-muted-foreground">→</span>
                    <span className="text-muted-foreground">{new Date(room.checkOut).toLocaleDateString("es-ES")}</span>
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
