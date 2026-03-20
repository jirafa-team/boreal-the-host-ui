import type {
  Booking,
  DateColumn,
  Facility,
  Room,
  RoomStatus,
  StaffScheduleEntry,
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

/** Rango de una reserva para una habitación (origen: API de reservas) */
export type RoomReservationRange = {
  checkIn: string | Date
  checkOut: string | Date
  status?: string
}

function isDateInRange(date: Date, checkIn: string | Date, checkOut: string | Date): boolean {
  const start = new Date(checkIn)
  const end = new Date(checkOut)
  const target = new Date(date)
  target.setHours(0, 0, 0, 0)
  start.setHours(0, 0, 0, 0)
  end.setHours(0, 0, 0, 0)
  return target >= start && target <= end
}

function reservationStatusToRoomStatus(apiStatus: string | undefined): RoomStatus {
  if (apiStatus === "checked_in") return "occupied"
  if (apiStatus === "checked_out" || apiStatus === "cancelled") return "available"
  return "reserved"
}

/**
 * Estado de la habitación en una fecha usando las reservas como fuente de verdad.
 * Si se pasan reservas para la habitación, el rango (checkIn–checkOut) sale de ahí.
 */
export function getRoomStatusForDate(
  room: Room,
  date: Date,
  roomReservations?: RoomReservationRange[]
): RoomStatus {
  if (room.status === "maintenance") return "maintenance"
  if (roomReservations?.length) {
    for (const res of roomReservations) {
      if (isDateInRange(date, res.checkIn, res.checkOut))
        return reservationStatusToRoomStatus(res.status) ?? room.status
    }
    return "available"
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

/** Maps each STAFF_TIME_SLOTS label to [startHour, endHour) in UTC */
const SLOT_HOUR_BOUNDS: Record<string, [number, number]> = {
  "7:00 AM":  [7,  11],
  "11:00 AM": [11, 15],
  "3:00 PM":  [15, 19],
  "7:00 PM":  [19, 24],
}

/**
 * Returns true if the given time slot overlaps with the staff member's
 * schedule for today (matched by today's day-of-week).
 */
export function isSlotWithinSchedule(
  timeSlot: string,
  schedule?: StaffScheduleEntry[]
): boolean {
  if (!schedule || schedule.length === 0) return false
  const todayDow = (new Date().getDay() + 6) % 7
  const entry = schedule.find((s) => s.dayOfWeek === todayDow && s.isActive)
  if (!entry) return false

  const bounds = SLOT_HOUR_BOUNDS[timeSlot]
  if (!bounds) return false
  const [slotStart, slotEnd] = bounds

  const [schedStartH, schedStartM = 0] = entry.startTime.split(":").map(Number)
  const [schedEndH, schedEndM = 0] = entry.endTime.split(":").map(Number)
  const schedStartMinutes = schedStartH * 60 + schedStartM
  const schedEndMinutes = schedEndH * 60 + schedEndM
  const slotStartMinutes = slotStart * 60
  const slotEndMinutes = slotEnd * 60

  // Overlap: slot starts before schedule ends AND slot ends after schedule starts
  return slotStartMinutes < schedEndMinutes && slotEndMinutes > schedStartMinutes
}

export function getFacilityTimeSlotsArray(): string[] {
  const slots: string[] = []
  for (let i = 0; i < 17; i++) {
    const hour = i + 7
    slots.push(`${hour.toString().padStart(2, "0")}:00`)
    slots.push(`${hour.toString().padStart(2, "0")}:30`)
  }
  return slots
}

/**
 * Returns true if the given 30-min slot (HH:MM) falls within the staff
 * member's schedule for today.
 */
export function isTimeSlotWithinStaffSchedule(
  slot: string,
  schedule?: StaffScheduleEntry[]
): boolean {
  if (!schedule?.length) return false
  const todayDow = (new Date().getDay() + 6) % 7
  const entry = schedule.find((s) => s.dayOfWeek === todayDow && s.isActive)
  if (!entry) return false

  const [slotH, slotM] = slot.split(":").map(Number)
  const slotMinutes = slotH * 60 + (slotM || 0)

  const [schedStartH, schedStartM = 0] = entry.startTime.split(":").map(Number)
  const [schedEndH, schedEndM = 0] = entry.endTime.split(":").map(Number)
  const schedStartMinutes = schedStartH * 60 + schedStartM
  const schedEndMinutes = schedEndH * 60 + schedEndM

  return slotMinutes >= schedStartMinutes && slotMinutes < schedEndMinutes
}

/**
 * Snaps a task's scheduledStartAt to the nearest preceding 30-min slot label.
 * Returns format "HH:MM".
 */
export function getTaskSlotLabel(scheduledStartAt: string): string {
  const d = new Date(scheduledStartAt)
  const h = d.getHours().toString().padStart(2, "0")
  const m = d.getMinutes() < 30 ? "00" : "30"
  return `${h}:${m}`
}

/**
 * Builds a Set of slot labels that are covered (occupied) by a task,
 * given its start time and duration.
 */
export function getTaskCoveredSlots(
  scheduledStartAt: string,
  estimatedDurationMinutes: number
): Set<string> {
  const startSlot = getTaskSlotLabel(scheduledStartAt)
  const [startH, startM] = startSlot.split(":").map(Number)
  const startMinutes = startH * 60 + startM
  const slotCount = Math.ceil(estimatedDurationMinutes / 30)
  const covered = new Set<string>()
  for (let i = 0; i < slotCount; i++) {
    const totalMin = startMinutes + i * 30
    const hh = Math.floor(totalMin / 60).toString().padStart(2, "0")
    const mm = (totalMin % 60).toString().padStart(2, "0")
    covered.add(`${hh}:${mm}`)
  }
  return covered
}
