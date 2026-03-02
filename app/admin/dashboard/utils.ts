import type {
  Booking,
  DateColumn,
  Facility,
  Room,
  RoomStatus,
} from "./components/types"

export function getBookingsAtSlot(
  facilityId: string,
  facilityBookings: Booking[],
  timeSlot: string
): Booking[] {
  return facilityBookings.filter((b) => {
    if (b.facilityId !== facilityId) return false
    const bookingStart = parseInt(b.time.split(":")[0])
    const bookingEnd = bookingStart + b.duration / 60
    const slotTime = parseInt(timeSlot.split(":")[0])
    return slotTime >= bookingStart && slotTime < bookingEnd
  })
}

export function isBookingStart(
  facilityId: string,
  facilityBookings: Booking[],
  time: string
): Booking | undefined {
  return facilityBookings.find(
    (b) => b.facilityId === facilityId && b.time === time
  )
}

export function getBookingForSlot(
  facilityId: string,
  facilityBookings: Booking[],
  time: string
): Booking | undefined {
  return facilityBookings.find((booking) => {
    const bookingStartHour = Number.parseInt(booking.time.split(":")[0])
    const bookingStartMinute = Number.parseInt(booking.time.split(":")[1] || "0")
    const bookingDurationHours = booking.duration / 60
    const slotHour = Number.parseInt(time.split(":")[0])
    const slotInHours = slotHour
    const bookingStartInHours = bookingStartHour + bookingStartMinute / 60
    const bookingEndInHours = bookingStartInHours + bookingDurationHours
    return (
      booking.facilityId === facilityId &&
      slotInHours >= bookingStartInHours &&
      slotInHours < bookingEndInHours
    )
  })
}

export function getOccupancyPercentage(
  facilityId: string,
  facilityBookings: Booking[],
  facilityList: Facility[],
  timeSlot: string
): number {
  const facility = facilityList.find((f) => f.id === facilityId)
  if (!facility) return 0
  const slotBookings = getBookingsAtSlot(facilityId, facilityBookings, timeSlot)
  return Math.round((slotBookings.length / facility.capacity) * 100)
}

export function isMultiPartyFacility(facilityType: string): boolean {
  return ["fitness", "recreation", "wellness", "dining"].includes(
    facilityType
  )
}

export function getRoomStatusForDate(
  room: Room,
  date: Date
): RoomStatus {
  if (room.status === "maintenance") return "maintenance"
  if (room.checkIn && room.checkOut) {
    const checkIn = new Date(room.checkIn)
    const checkOut = new Date(room.checkOut)
    const targetDate = new Date(date)
    targetDate.setHours(0, 0, 0, 0)
    checkIn.setHours(0, 0, 0, 0)
    checkOut.setHours(0, 0, 0, 0)
    if (targetDate >= checkIn && targetDate <= checkOut) {
      return room.status
    }
  }
  return "available"
}

export function generateDateColumns(
  currentDate: Date,
  timelineMode: "week" | "month"
): DateColumn[] {
  const columns: DateColumn[] = []
  const startDate = new Date(currentDate)

  if (timelineMode === "week") {
    startDate.setDate(startDate.getDate() - startDate.getDay())
    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate)
      date.setDate(startDate.getDate() + i)
      columns.push({
        label: date.toLocaleDateString("es-ES", {
          weekday: "short",
          day: "numeric",
        }),
        date: new Date(date),
      })
    }
  } else {
    const year = startDate.getFullYear()
    const month = startDate.getMonth()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i)
      columns.push({
        label: i.toString(),
        date: new Date(date),
      })
    }
  }
  return columns
}

export const STAFF_TIME_SLOTS = ["7:00 AM", "11:00 AM", "3:00 PM", "7:00 PM"]

export function getFacilityTimeSlotsArray(): string[] {
  return Array.from({ length: 17 }, (_, i) => {
    const hour = i + 7
    return `${hour.toString().padStart(2, "0")}:00`
  })
}
