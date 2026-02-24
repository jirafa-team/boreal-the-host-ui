"use client"

import { useLanguage } from "@/lib/i18n-context"
import React, { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "@/store/store"
import { loadMockFacilities, setFacilities } from "@/app/admin/facilities/slice/facilitySlice"
import { FacilitiesView } from "../components/FacilitiesView"
import { mapApiFacilityToUi, TIME_SLOTS, typeToIconAndColor, type Booking, type Facility, type NewBookingForm } from "../components/types"

const MOCK_BOOKINGS: Booking[] = [
  { facilityId: "1", clientName: "Juan Pérez", clientRoom: "301", time: "08:00", duration: 60, status: "confirmed" },
  { facilityId: "1", clientName: "María García", clientRoom: "205", time: "10:00", duration: 60, status: "confirmed" },
  { facilityId: "2", clientName: "Carlos López", clientRoom: "412", time: "09:00", duration: 120, status: "confirmed" },
  { facilityId: "2", clientName: "Ana Martínez", clientRoom: "308", time: "14:00", duration: 60, status: "pending" },
  { facilityId: "3", clientName: "Laura Sánchez", clientRoom: "501", time: "11:00", duration: 60, status: "confirmed" },
  {
    facilityId: "4",
    clientName: "Empresa Tech Corp",
    clientRoom: "N/A",
    time: "09:00",
    duration: 180,
    status: "confirmed",
  },
]

const initialNewBooking: NewBookingForm = {
  facilityId: "",
  clientName: "",
  clientRoom: "",
  time: "",
  duration: 60,
  people: 1,
}

export function FacilitiesMockContainer() {
  const { t, language } = useLanguage()
  const dispatch = useDispatch()
  const dataSource = useSelector((state: RootState) => state.dataSource.dataSource)
  const facilitiesFromSlice = useSelector((state: RootState) => state.facility.facilities)

  useEffect(() => {
    if (dataSource === "mock") dispatch(loadMockFacilities())
  }, [dataSource, dispatch])

  const facilities: Facility[] = React.useMemo(
    () => facilitiesFromSlice.map(mapApiFacilityToUi),
    [facilitiesFromSlice]
  )

  const setFacilitiesForMock = React.useCallback(
    (next: Facility[] | ((prev: Facility[]) => Facility[])) => {
      if (dataSource !== "mock") return
      const list = typeof next === "function" ? next(facilities) : next
      dispatch(
        setFacilities(
          list.map(({ id, name, type, capacity, startTime, endTime }) => ({
            id,
            name,
            type,
            capacity,
            startTime,
            endTime,
          }))
        )
      )
    },
    [dataSource, dispatch, facilities]
  )

  const [bookings, setBookings] = React.useState<Booking[]>(MOCK_BOOKINGS)
  const [viewMode, setViewMode] = React.useState<"list" | "timeline">("list")
  const [selectedDate, setSelectedDate] = React.useState(new Date().toISOString().split("T")[0])
  const [currentDate, setCurrentDate] = React.useState(new Date())
  const [timelineMode, setTimelineMode] = React.useState<"week" | "month">("week")
  const [newBooking, setNewBooking] = React.useState<NewBookingForm>(initialNewBooking)
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [addFacilityOpen, setAddFacilityOpen] = React.useState(false)
  const [editingFacility, setEditingFacility] = React.useState<Facility | null>(null)
  const [editDialogOpen, setEditDialogOpen] = React.useState(false)
  const [clientSuggestions, setClientSuggestions] = React.useState<string[]>([])
  const [showClientSuggestions, setShowClientSuggestions] = React.useState(false)
  const [selectedSlotBookings, setSelectedSlotBookings] = React.useState<Booking[]>([])
  const [bookingsDetailOpen, setBookingsDetailOpen] = React.useState(false)

  const getBookingForSlot = React.useCallback(
    (facilityId: string, time: string) => {
      return bookings.find((booking) => {
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
    },
    [bookings]
  )

  const isBookingStart = React.useCallback(
    (facilityId: string, time: string) => {
      return bookings.find((b) => b.facilityId === facilityId && b.time === time)
    },
    [bookings]
  )

  const getBookingsAtSlot = React.useCallback(
    (facilityId: string, timeSlot: string): Booking[] => {
      return bookings.filter((b) => {
        if (b.facilityId !== facilityId) return false
        const bookingStart = parseInt(b.time.split(":")[0])
        const bookingEnd = bookingStart + b.duration / 60
        const slotTime = parseInt(timeSlot.split(":")[0])
        return slotTime >= bookingStart && slotTime < bookingEnd
      })
    },
    [bookings]
  )

  const getOccupancyPercentage = React.useCallback(
    (facilityId: string, timeSlot: string): number => {
      const facility = facilities.find((f) => f.id === facilityId)
      if (!facility) return 0
      const slotBookings = getBookingsAtSlot(facilityId, timeSlot)
      return Math.round((slotBookings.length / facility.capacity) * 100)
    },
    [facilities, getBookingsAtSlot]
  )

  const isMultiPartyFacility = React.useCallback((facilityType: string): boolean => {
    return ["fitness", "recreation", "wellness", "dining"].includes(facilityType)
  }, [])

  const convertISOToLocaleFormat = React.useCallback(
    (isoDate: string): string => {
      const [year, month, day] = isoDate.split("-")
      if (language === "es" || language === "pt") {
        return `${day}/${month}/${year}`
      }
      return `${month}/${day}/${year}`
    },
    [language]
  )

  const navigateDate = React.useCallback(
    (direction: "prev" | "next") => {
      setCurrentDate((prev) => {
        const newDate = new Date(prev)
        if (timelineMode === "week") {
          newDate.setDate(newDate.getDate() + (direction === "next" ? 7 : -7))
        } else {
          newDate.setMonth(newDate.getMonth() + (direction === "next" ? 1 : -1))
        }
        return newDate
      })
    },
    [timelineMode]
  )

  const handleClientNameChange = React.useCallback(
    (value: string) => {
      setNewBooking((prev) => ({ ...prev, clientName: value }))
      if (value.length > 0) {
        const uniqueClients = Array.from(new Set(bookings.map((b) => b.clientName)))
        const filtered = uniqueClients.filter((c) =>
          c.toLowerCase().includes(value.toLowerCase())
        )
        setClientSuggestions(filtered)
        setShowClientSuggestions(true)
      } else {
        setShowClientSuggestions(false)
      }
    },
    [bookings]
  )

  const handleSelectClient = React.useCallback((clientName: string) => {
    setNewBooking((prev) => {
      const next = { ...prev, clientName }
      const clientBooking = bookings.find((b) => b.clientName === clientName)
      if (clientBooking) {
        next.clientRoom = clientBooking.clientRoom
      }
      return next
    })
    setShowClientSuggestions(false)
  }, [bookings])

  const handleAddBooking = React.useCallback(() => {
    if (newBooking.facilityId && newBooking.clientName && newBooking.time) {
      setBookings((prev) => [
        ...prev,
        {
          ...newBooking,
          status: "confirmed" as const,
        },
      ])
      setNewBooking(initialNewBooking)
      setDialogOpen(false)
    }
  }, [newBooking])

  const handleAddFacility = React.useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      const formData = new FormData(e.currentTarget)
      const type = (formData.get("type") as string) ?? "fitness"
      const { icon, color } = typeToIconAndColor[type] ?? typeToIconAndColor["fitness"]
      const newFacility: Facility = {
        id: (facilities.length + 1).toString(),
        name: formData.get("name") as string,
        type,
        capacity: Number.parseInt(formData.get("capacity") as string),
        startTime: formData.get("startTime") as string,
        endTime: formData.get("endTime") as string,
        icon,
        color,
      }
      setFacilitiesForMock([...facilities, newFacility])
      setAddFacilityOpen(false)
    },
    [facilities, setFacilitiesForMock]
  )

  const handleEditFacility = React.useCallback((facility: Facility) => {
    setEditingFacility(facility)
    setEditDialogOpen(true)
  }, [])

  const handleSaveEdit = React.useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      if (!editingFacility) return
      const formData = new FormData(e.currentTarget)
      const updatedFacility: Facility = {
        ...editingFacility,
        name: formData.get("name") as string,
        type: formData.get("type") as string,
        capacity: Number.parseInt(formData.get("capacity") as string),
        startTime: formData.get("startTime") as string,
        endTime: formData.get("endTime") as string,
      }
      setFacilitiesForMock(
        facilities.map((f) => (f.id === editingFacility.id ? updatedFacility : f))
      )
      setEditDialogOpen(false)
      setEditingFacility(null)
    },
    [editingFacility, facilities, setFacilitiesForMock]
  )

  const handleEditDialogOpenChange = React.useCallback((open: boolean) => {
    setEditDialogOpen(open)
    if (!open) setEditingFacility(null)
  }, [])

  return (
    <FacilitiesView
      viewMode={viewMode}
      setViewMode={setViewMode}
      facilities={facilities}
      bookings={bookings}
      selectedDate={selectedDate}
      onSelectedDateChange={setSelectedDate}
      currentDate={currentDate}
      setCurrentDate={setCurrentDate}
      timelineMode={timelineMode}
      setTimelineMode={setTimelineMode}
      addFacilityOpen={addFacilityOpen}
      setAddFacilityOpen={setAddFacilityOpen}
      dialogOpen={dialogOpen}
      setDialogOpen={setDialogOpen}
      editDialogOpen={editDialogOpen}
      setEditDialogOpen={handleEditDialogOpenChange}
      editingFacility={editingFacility}
      bookingsDetailOpen={bookingsDetailOpen}
      setBookingsDetailOpen={setBookingsDetailOpen}
      selectedSlotBookings={selectedSlotBookings}
      setSelectedSlotBookings={setSelectedSlotBookings}
      newBooking={newBooking}
      setNewBooking={setNewBooking}
      clientSuggestions={clientSuggestions}
      setClientSuggestions={setClientSuggestions}
      showClientSuggestions={showClientSuggestions}
      setShowClientSuggestions={setShowClientSuggestions}
      onAddFacility={handleAddFacility}
      onSaveEdit={handleSaveEdit}
      onAddBooking={handleAddBooking}
      onEditFacility={handleEditFacility}
      onClientNameChange={handleClientNameChange}
      onSelectClient={handleSelectClient}
      getBookingForSlot={getBookingForSlot}
      isBookingStart={isBookingStart}
      getBookingsAtSlot={getBookingsAtSlot}
      getOccupancyPercentage={getOccupancyPercentage}
      isMultiPartyFacility={isMultiPartyFacility}
      navigateDate={navigateDate}
      language={language}
      convertISOToLocaleFormat={convertISOToLocaleFormat}
      t={t}
      timeSlots={TIME_SLOTS}
    />
  )
}
