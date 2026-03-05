"use client"

import { useLanguage } from "@/lib/i18n-context"
import React from "react"
import { useSelector } from "react-redux"
import type { RootState } from "@/store/store"
import {
  useGetFacilitiesQuery,
  useCreateFacilityMutation,
  useUpdateFacilityMutation,
  useDeleteFacilityMutation,
} from "@/app/admin/facilities/slice/facilitySlice"
import { FacilitiesView } from "../components/FacilitiesView"
import { mapApiFacilityToUi, type Booking, type Facility } from "../components/types"
import { useGetFacilityTypesQuery } from "@/features/taxonomy-facility-type/slices/taxonomyFacilityTypeSlice"

export function FacilitiesApiContainer() {
  const { t } = useLanguage()
  const dataSource = useSelector((state: RootState) => state.dataSource.dataSource)
  const skip = dataSource !== "api"

  const { data: apiData, isLoading, error } = useGetFacilitiesQuery(undefined, { skip })
  const [createFacility] = useCreateFacilityMutation()
  const [updateFacility] = useUpdateFacilityMutation()
  const [deleteFacility] = useDeleteFacilityMutation()

  const { data: typesData } = useGetFacilityTypesQuery(undefined, { skip })
  const facilityTypes = typesData?.data ?? []

  const facilities: Facility[] = React.useMemo(() => {
    const list = apiData?.data?.objects ?? []
    return list.map(mapApiFacilityToUi)
  }, [apiData])

  const bookings: Booking[] = []

  const [addFacilityOpen, setAddFacilityOpen] = React.useState(false)
  const [editingFacility, setEditingFacility] = React.useState<Facility | null>(null)
  const [editDialogOpen, setEditDialogOpen] = React.useState(false)
  const [selectedSlotBookings, setSelectedSlotBookings] = React.useState<Booking[]>([])
  const [bookingsDetailOpen, setBookingsDetailOpen] = React.useState(false)

  const resolveFacilityTypeId = React.useCallback(
    (typeValue: string): string => {
      const byId = facilityTypes.find((ft) => ft.id === typeValue)
      if (byId) return byId.id
      const byName = facilityTypes.find(
        (ft) => ft.name?.toLowerCase() === typeValue.toLowerCase()
      )
      return byName?.id ?? typeValue
    },
    [facilityTypes]
  )

  const handleAddFacility = React.useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      const formData = new FormData(e.currentTarget)
      const typeValue = (formData.get("type") as string) ?? "fitness"
      const facilityTypeId = resolveFacilityTypeId(typeValue)
      try {
        await createFacility({
          name: formData.get("name") as string,
          facilityTypeId,
          capacity: Number(formData.get("capacity")),
          openTime: formData.get("startTime") as string,
          closeTime: formData.get("endTime") as string,
        }).unwrap()
        setAddFacilityOpen(false)
      } catch {
        // Error handled by RTK Query / UI
      }
    },
    [createFacility, resolveFacilityTypeId]
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
      const typeValue = (formData.get("type") as string) ?? editingFacility.type
      const facilityTypeId = resolveFacilityTypeId(typeValue)
      try {
        await updateFacility({
          id: editingFacility.id,
          payload: {
            name: formData.get("name") as string,
            facilityTypeId,
            capacity: Number(formData.get("capacity")),
            openTime: formData.get("startTime") as string,
            closeTime: formData.get("endTime") as string,
          },
        }).unwrap()
        setEditDialogOpen(false)
        setEditingFacility(null)
      } catch {
        // Error handled by RTK Query / UI
      }
    },
    [editingFacility, updateFacility, resolveFacilityTypeId]
  )

  const handleDeleteFacility = React.useCallback(
    async (facilityId: string) => {
      try {
        await deleteFacility(facilityId).unwrap()
      } catch {
        // Error handled by RTK Query / UI
      }
    },
    [deleteFacility]
  )

  const handleEditDialogOpenChange = React.useCallback((open: boolean) => {
    setEditDialogOpen(open)
    if (!open) setEditingFacility(null)
  }, [])

  const getBookingsForFacility = React.useCallback((_facilityId: string): Booking[] => {
    return []
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
      isLoading={isLoading}
      error={error}
    />
  )
}
