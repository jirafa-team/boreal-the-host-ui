"use client"

import { useLanguage } from "@/lib/i18n-context"
import React from "react"
import { useSelector } from "react-redux"
import type { RootState } from "@/store/store"
import {
  useGetFacilitiesQuery,
  useCreateFacilityMutation,
  useUpdateFacilityMutation,
} from "@/app/admin/facilities/slice/facilitySlice"
import { FacilitiesView } from "../components/FacilitiesView"
import { mapApiFacilityToUi, TIME_SLOTS, type Booking, type Facility, type NewBookingForm } from "../components/types"
import { useGetFacilityTypesQuery } from "@/features/taxonomy-facility-type/slices/taxonomyFacilityTypeSlice"
import { TaxonomyFacilityType } from "@/interfaces/taxonomy-facility-type/TaxonomyFacilityType"

const initialNewBooking: NewBookingForm = {
  facilityId: "",
  clientName: "",
  clientRoom: "",
  time: "",
  duration: 60,
  people: 1,
}

export function FacilitiesApiContainer() {
  const { t, language } = useLanguage()
  const dataSource = useSelector((state: RootState) => state.dataSource.dataSource)
  const skip = dataSource !== "api"

  const { data: apiData, isLoading, error } = useGetFacilitiesQuery(undefined, { skip })
  const [createFacility] = useCreateFacilityMutation()
  const [updateFacility] = useUpdateFacilityMutation()

  const facilities: Facility[] = React.useMemo(() => {
    const list = apiData?.data?.objects ?? []
    return list.map(mapApiFacilityToUi)
  }, [apiData])

  const { data } = useGetFacilityTypesQuery()
  const facilitiesTypes: TaxonomyFacilityType[] = data?.data ?? []
  console.log(facilitiesTypes)

  const bookings: Booking[] = []

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

  const getBookingForSlot = React.useCallback((_facilityId: string, _time: string) => undefined, [])
  const isBookingStart = React.useCallback((_facilityId: string, _time: string) => undefined, [])
  const getBookingsAtSlot = React.useCallback((_facilityId: string, _timeSlot: string) => [] as Booking[], [])
  const getOccupancyPercentage = React.useCallback((_facilityId: string, _timeSlot: string) => 0, [])
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

  const handleClientNameChange = React.useCallback((value: string) => {
    setNewBooking((prev) => ({ ...prev, clientName: value }))
    setClientSuggestions([])
    setShowClientSuggestions(false)
  }, [])

  const handleSelectClient = React.useCallback((clientName: string) => {
    setNewBooking((prev) => ({ ...prev, clientName }))
    setShowClientSuggestions(false)
  }, [])

  const handleAddBooking = React.useCallback(() => {
    setNewBooking(initialNewBooking)
    setDialogOpen(false)
  }, [])

  const handleAddFacility = React.useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      const formData = new FormData(e.currentTarget)
      const name = formData.get("name") as string
      const type = (formData.get("type") as string) ?? "fitness"
      const capacity = Number(formData.get("capacity"))
      const openTime = formData.get("startTime") as string
      const closeTime = formData.get("endTime") as string
      try {
        await createFacility({
          name,
          facilityTypeId: type,
          capacity,
          openTime,
          closeTime,
        }).unwrap()
        setAddFacilityOpen(false)
      } catch {
        // Error handled by RTK Query / UI
      }
    },
    [createFacility]
  )

  const handleEditFacility = React.useCallback((facility: Facility) => {
    setEditingFacility(facility)
    setEditDialogOpen(true)
  }, [])

  const handleSaveEdit = React.useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      if (!editingFacility) return
      const formData = new FormData(e.currentTarget)
      try {
        await updateFacility({
          id: editingFacility.id,
          payload: {
            name: formData.get("name") as string,
            type: formData.get("type") as string,
            capacity: Number(formData.get("capacity")),
            startTime: formData.get("startTime") as string,
            endTime: formData.get("endTime") as string,
          },
        }).unwrap()
        setEditDialogOpen(false)
        setEditingFacility(null)
      } catch {
        // Error handled by RTK Query / UI
      }
    },
    [editingFacility, updateFacility]
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
      facilitiesTypes={facilitiesTypes}
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
      isLoading={isLoading}
      error={error}
    />
  )
}
