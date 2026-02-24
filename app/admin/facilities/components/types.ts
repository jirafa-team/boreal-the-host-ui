import type { LucideIcon } from "lucide-react"
import { Dumbbell, Waves, Sparkles, Video, Coffee, LayoutGrid } from "lucide-react"
import type { Facility as ApiFacility } from "@/interfaces/facility/Facility"

export type Facility = {
  id: string
  name: string
  type: string
  capacity: number
  icon: LucideIcon
  color: string
  startTime: string
  endTime: string
}

export type Booking = {
  facilityId: string
  clientName: string
  clientRoom: string
  time: string
  duration: number
  status: "confirmed" | "pending"
}

export const typeToIconAndColor: Record<string, { icon: LucideIcon; color: string }> = {
  fitness: { icon: Dumbbell, color: "bg-orange-500" },
  recreation: { icon: Waves, color: "bg-blue-500" },
  wellness: { icon: Sparkles, color: "bg-purple-500" },
  business: { icon: Video, color: "bg-teal-500" },
  dining: { icon: Coffee, color: "bg-amber-500" },
}

export function mapApiFacilityToUi(f: ApiFacility): Facility {
  const type = f.type ?? "fitness"
  const { icon, color } = typeToIconAndColor[type] ?? { icon: LayoutGrid, color: "bg-gray-500" }
  return {
    id: f.id,
    name: f.name,
    type,
    capacity: f.capacity ?? 0,
    icon,
    color,
    startTime: f.startTime ?? f.openTime ?? "08:00",
    endTime: f.endTime ?? f.closeTime ?? "20:00",
  }
}

export const TIME_SLOTS = Array.from({ length: 17 }, (_, i) => {
  const hour = i + 7
  return `${hour.toString().padStart(2, "0")}:00`
})

export type NewBookingForm = {
  facilityId: string
  clientName: string
  clientRoom: string
  time: string
  duration: number
  people: number
}
