"use client"

import { useLanguage } from "@/lib/i18n-context"
import React, { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useUserTimeZone } from "@/hooks/useUserTimeZone"
import type { RootState } from "@/store/store"
import { loadMockFacilities, setFacilities } from "@/app/admin/facilities/slice/facilitySlice"
import { FacilitiesView } from "../components/FacilitiesView"
import { mapApiFacilityToUi, typeToIconAndColor, type Booking, type Facility } from "../components/types"

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

export function FacilitiesMockContainer() {
  const { t } = useLanguage()
  const { toUtcTime } = useUserTimeZone()
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

  const [bookings] = React.useState<Booking[]>(MOCK_BOOKINGS)
  const [addFacilityOpen, setAddFacilityOpen] = React.useState(false)
  const [editingFacility, setEditingFacility] = React.useState<Facility | null>(null)
  const [editDialogOpen, setEditDialogOpen] = React.useState(false)
  const [selectedSlotBookings, setSelectedSlotBookings] = React.useState<Booking[]>([])
  const [bookingsDetailOpen, setBookingsDetailOpen] = React.useState(false)

  const getBookingsForFacility = React.useCallback(
    (facilityId: string): Booking[] => {
      return bookings.filter((b) => b.facilityId === facilityId)
    },
    [bookings]
  )

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
        startTime: toUtcTime(formData.get("startTime") as string),
        endTime: toUtcTime(formData.get("endTime") as string),
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
        startTime: toUtcTime(formData.get("startTime") as string),
        endTime: toUtcTime(formData.get("endTime") as string),
      }
      setFacilitiesForMock(
        facilities.map((f) => (f.id === editingFacility.id ? updatedFacility : f))
      )
      setEditDialogOpen(false)
      setEditingFacility(null)
    },
    [editingFacility, facilities, setFacilitiesForMock]
  )

  const handleDeleteFacility = React.useCallback(
    (facilityId: string) => {
      setFacilitiesForMock(facilities.filter((f) => f.id !== facilityId))
    },
    [facilities, setFacilitiesForMock]
  )

  const handleEditDialogOpenChange = React.useCallback((open: boolean) => {
    setEditDialogOpen(open)
    if (!open) setEditingFacility(null)
  }, [])

  return (
    <FacilitiesView
      facilities={facilities}
      bookings={bookings}
      addFacilityOpen={addFacilityOpen}
      setAddFacilityOpen={setAddFacilityOpen}
      editDialogOpen={editDialogOpen}
      setEditDialogOpen={handleEditDialogOpenChange}
      editingFacility={editingFacility}
      bookingsDetailOpen={bookingsDetailOpen}
      setBookingsDetailOpen={setBookingsDetailOpen}
      selectedSlotBookings={selectedSlotBookings}
      setSelectedSlotBookings={setSelectedSlotBookings}
      onAddFacility={handleAddFacility}
      onSaveEdit={handleSaveEdit}
      onEditFacility={handleEditFacility}
      onDeleteFacility={handleDeleteFacility}
      getBookingsForFacility={getBookingsForFacility}
      t={t}
    />
  )
}
