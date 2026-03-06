'use client'

import { useState } from 'react'
import { useSelector } from 'react-redux'
import type { RootState } from '@/store/store'
import { SettingsView } from '../components/SettingsView'
import type { SettingsItem } from '../components/types'
import { useGetDepartmentsQuery, useCreateDepartmentMutation, useUpdateDepartmentMutation, useDeleteDepartmentMutation } from '@/features/taxonomy-department/slices/taxonomyDepartmentSlice'
import { useGetFacilityTypesQuery, useCreateFacilityTypeMutation, useUpdateFacilityTypeMutation, useDeleteFacilityTypeMutation } from '@/features/taxonomy-facility-type/slices/taxonomyFacilityTypeSlice'
import { useGetRoomTypesQuery, useCreateRoomTypeMutation, useUpdateRoomTypeMutation, useDeleteRoomTypeMutation } from '@/features/taxonomy-room-type/slices/taxonomyRoomTypeSlice'
import { useGetEventCategoriesQuery, useCreateEventCategoryMutation, useUpdateEventCategoryMutation, useDeleteEventCategoryMutation } from '@/features/taxonomy-event-category/slices/taxonomyEventCategorySlice'

function mapTaxonomyToSettingsItem(item: { id: string; name: string; active?: boolean }): SettingsItem {
  const active = item.active !== false
  return {
    id: item.id,
    name: item.name,
    description: '',
    status: active ? 'Activo' : 'Inactivo',
    active,
  }
}

const EMPTY_ITEMS: SettingsItem[] = []

export function SettingsApiContainer() {
  const dataSource = useSelector((state: RootState) => state.dataSource.dataSource)
  const skip = dataSource !== 'api'

  const { data: departmentsData } = useGetDepartmentsQuery(undefined, { skip })
  const { data: facilityTypesData } = useGetFacilityTypesQuery(undefined, { skip })
  const { data: roomTypesData } = useGetRoomTypesQuery(undefined, { skip })
  const { data: eventCategoriesData } = useGetEventCategoriesQuery(undefined, { skip })

  const [createDepartment] = useCreateDepartmentMutation()
  const [updateDepartment] = useUpdateDepartmentMutation()
  const [deleteDepartmentApi] = useDeleteDepartmentMutation()
  const [createFacilityType] = useCreateFacilityTypeMutation()
  const [updateFacilityType] = useUpdateFacilityTypeMutation()
  const [deleteFacilityType] = useDeleteFacilityTypeMutation()
  const [createRoomType] = useCreateRoomTypeMutation()
  const [updateRoomType] = useUpdateRoomTypeMutation()
  const [deleteRoomTypeApi] = useDeleteRoomTypeMutation()
  const [createEventCategory] = useCreateEventCategoryMutation()
  const [updateEventCategory] = useUpdateEventCategoryMutation()
  const [deleteEventCategoryApi] = useDeleteEventCategoryMutation()

  const departments: SettingsItem[] = departmentsData?.data ? departmentsData.data.map(mapTaxonomyToSettingsItem) : EMPTY_ITEMS
  const amenities: SettingsItem[] = facilityTypesData?.data ? facilityTypesData.data.map(mapTaxonomyToSettingsItem) : EMPTY_ITEMS
  const roomTypes: SettingsItem[] = roomTypesData?.data ? roomTypesData.data.map(mapTaxonomyToSettingsItem) : EMPTY_ITEMS
  const eventTypes: SettingsItem[] = eventCategoriesData?.data ? eventCategoriesData.data.map(mapTaxonomyToSettingsItem) : EMPTY_ITEMS
  const floors = EMPTY_ITEMS
  const shifts = EMPTY_ITEMS
  const eventSpaces = EMPTY_ITEMS
  const recommendationCategories = EMPTY_ITEMS
  const clientCategories = EMPTY_ITEMS

  const [selectedCard, setSelectedCard] = useState('Departamentos')
  const [searchTerm, setSearchTerm] = useState('')
  const [searchStatus, setSearchStatus] = useState('all')
  const [habitacionesTab, setHabitacionesTab] = useState<'tipos' | 'pisos'>('tipos')
  const [eventosTab, setEventosTab] = useState<'tipos' | 'espacios'>('tipos')

  const [isCreating, setIsCreating] = useState(false)
  const [newDeptName, setNewDeptName] = useState('')
  const [editingId, setEditingId] = useState<number | string | null>(null)
  const [editingName, setEditingName] = useState('')
  const [deletingId, setDeletingId] = useState<number | string | null>(null)

  const [isCreatingAmenity, setIsCreatingAmenity] = useState(false)
  const [newAmenityName, setNewAmenityName] = useState('')
  const [editingAmenityId, setEditingAmenityId] = useState<number | string | null>(null)
  const [editingAmenityName, setEditingAmenityName] = useState('')
  const [deletingAmenityId, setDeletingAmenityId] = useState<number | string | null>(null)

  const [isCreatingRoom, setIsCreatingRoom] = useState(false)
  const [newRoomName, setNewRoomName] = useState('')
  const [editingRoomId, setEditingRoomId] = useState<number | string | null>(null)
  const [editingRoomName, setEditingRoomName] = useState('')
  const [deletingRoomId, setDeletingRoomId] = useState<number | string | null>(null)

  const [isCreatingFloor, setIsCreatingFloor] = useState(false)
  const [newFloorName, setNewFloorName] = useState('')
  const [editingFloorId, setEditingFloorId] = useState<number | string | null>(null)
  const [editingFloorName, setEditingFloorName] = useState('')
  const [deletingFloorId, setDeletingFloorId] = useState<number | string | null>(null)

  const [isCreatingShift, setIsCreatingShift] = useState(false)
  const [newShiftName, setNewShiftName] = useState('')
  const [editingShiftId, setEditingShiftId] = useState<number | string | null>(null)
  const [editingShiftName, setEditingShiftName] = useState('')
  const [deletingShiftId, setDeletingShiftId] = useState<number | string | null>(null)

  const [isCreatingEventType, setIsCreatingEventType] = useState(false)
  const [newEventTypeName, setNewEventTypeName] = useState('')
  const [editingEventTypeId, setEditingEventTypeId] = useState<number | string | null>(null)
  const [editingEventTypeName, setEditingEventTypeName] = useState('')
  const [deletingEventTypeId, setDeletingEventTypeId] = useState<number | string | null>(null)

  const [isCreatingEventSpace, setIsCreatingEventSpace] = useState(false)
  const [newEventSpaceName, setNewEventSpaceName] = useState('')
  const [editingEventSpaceId, setEditingEventSpaceId] = useState<number | string | null>(null)
  const [editingEventSpaceName, setEditingEventSpaceName] = useState('')
  const [deletingEventSpaceId, setDeletingEventSpaceId] = useState<number | string | null>(null)

  const [isCreatingRecommendation, setIsCreatingRecommendation] = useState(false)
  const [newRecommendationName, setNewRecommendationName] = useState('')
  const [editingRecommendationId, setEditingRecommendationId] = useState<number | string | null>(null)
  const [editingRecommendationName, setEditingRecommendationName] = useState('')
  const [deletingRecommendationId, setDeletingRecommendationId] = useState<number | string | null>(null)

  const [isCreatingClientCategory, setIsCreatingClientCategory] = useState(false)
  const [newClientCategoryName, setNewClientCategoryName] = useState('')
  const [editingClientCategoryId, setEditingClientCategoryId] = useState<number | string | null>(null)
  const [editingClientCategoryName, setEditingClientCategoryName] = useState('')
  const [deletingClientCategoryId, setDeletingClientCategoryId] = useState<number | string | null>(null)

  const filterItems = (items: SettingsItem[]) =>
    items.filter((item) => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = searchStatus === 'all' || (searchStatus === 'activo' ? item.active : !item.active)
      return matchesSearch && matchesStatus
    })

  const filteredDepartments = filterItems(departments)
  const filteredAmenities = filterItems(amenities)
  const filteredRoomTypes = filterItems(roomTypes)
  const filteredFloors = filterItems(floors)
  const filteredShifts = filterItems(shifts)
  const filteredEventTypes = filterItems(eventTypes)
  const filteredEventSpaces = filterItems(eventSpaces)
  const filteredRecommendations = filterItems(recommendationCategories)
  const filteredClientCategories = filterItems(clientCategories)

  const noop = () => {}
  const noopId = (_id: number | string) => {}
  const noopIdName = (_id: number | string, _name: string) => {}

  const handleSaveNewDepartment = async () => {
    if (!newDeptName.trim()) return
    try {
      await createDepartment({ name: newDeptName.trim() }).unwrap()
      setNewDeptName('')
      setIsCreating(false)
    } catch {
      // Error handled by RTK Query
    }
  }
  const handleSaveEdit = async () => {
    if (!editingName.trim() || editingId == null) return
    try {
      await updateDepartment({ id: String(editingId), payload: { name: editingName.trim() } }).unwrap()
      setEditingId(null)
      setEditingName('')
    } catch {
      // Error handled by RTK Query
    }
  }
  const deleteDepartment = async (id: number | string) => {
    try {
      await deleteDepartmentApi(String(id)).unwrap()
      setDeletingId(null)
    } catch {
      // Error handled by RTK Query
    }
  }

  const handleSaveNewAmenity = async () => {
    if (!newAmenityName.trim()) return
    try {
      await createFacilityType({ name: newAmenityName.trim() }).unwrap()
      setNewAmenityName('')
      setIsCreatingAmenity(false)
    } catch {
      // Error handled by RTK Query
    }
  }
  const handleSaveAmenityEdit = async () => {
    if (!editingAmenityName.trim() || editingAmenityId == null) return
    try {
      await updateFacilityType({ id: String(editingAmenityId), payload: { name: editingAmenityName.trim() } }).unwrap()
      setEditingAmenityId(null)
      setEditingAmenityName('')
    } catch {
      // Error handled by RTK Query
    }
  }
  const deleteAmenity = async (id: number | string) => {
    try {
      await deleteFacilityType(String(id)).unwrap()
      setDeletingAmenityId(null)
    } catch {
      // Error handled by RTK Query
    }
  }

  const handleSaveNewRoomType = async () => {
    if (!newRoomName.trim()) return
    try {
      await createRoomType({ name: newRoomName.trim() }).unwrap()
      setNewRoomName('')
      setIsCreatingRoom(false)
    } catch {
      // Error handled by RTK Query
    }
  }
  const handleSaveRoomEdit = async () => {
    if (!editingRoomName.trim() || editingRoomId == null) return
    try {
      await updateRoomType({ id: String(editingRoomId), payload: { name: editingRoomName.trim() } }).unwrap()
      setEditingRoomId(null)
      setEditingRoomName('')
    } catch {
      // Error handled by RTK Query
    }
  }
  const deleteRoomType = async (id: number | string) => {
    try {
      await deleteRoomTypeApi(String(id)).unwrap()
      setDeletingRoomId(null)
    } catch {
      // Error handled by RTK Query
    }
  }

  const handleSaveNewEventType = async () => {
    if (!newEventTypeName.trim()) return
    try {
      await createEventCategory({ name: newEventTypeName.trim() }).unwrap()
      setNewEventTypeName('')
      setIsCreatingEventType(false)
    } catch {
      // Error handled by RTK Query
    }
  }
  const handleSaveEventTypeEdit = async () => {
    if (!editingEventTypeName.trim() || editingEventTypeId == null) return
    try {
      await updateEventCategory({ id: String(editingEventTypeId), payload: { name: editingEventTypeName.trim() } }).unwrap()
      setEditingEventTypeId(null)
      setEditingEventTypeName('')
    } catch {
      // Error handled by RTK Query
    }
  }
  const deleteEventType = async (id: number | string) => {
    try {
      await deleteEventCategoryApi(String(id)).unwrap()
      setDeletingEventTypeId(null)
    } catch {
      // Error handled by RTK Query
    }
  }

  const toggleDepartment = (id: number | string) => {
    const item = departments.find((d) => d.id === id || d.id === String(id))
    if (!item) return
    updateDepartment({ id: String(id), payload: { active: !item.active } }).catch(() => {})
  }
  const toggleAmenity = (id: number | string) => {
    const item = amenities.find((a) => a.id === id || a.id === String(id))
    if (!item) return
    updateFacilityType({ id: String(id), payload: { active: !item.active } }).catch(() => {})
  }
  const toggleRoomType = (id: number | string) => {
    const item = roomTypes.find((r) => r.id === id || r.id === String(id))
    if (!item) return
    updateRoomType({ id: String(id), payload: { active: !item.active } }).catch(() => {})
  }
  const toggleEventType = (id: number | string) => {
    const item = eventTypes.find((e) => e.id === id || e.id === String(id))
    if (!item) return
    updateEventCategory({ id: String(id), payload: { active: !item.active } }).catch(() => {})
  }

  return (
    <SettingsView
      selectedCard={selectedCard}
      setSelectedCard={setSelectedCard}
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
      searchStatus={searchStatus}
      setSearchStatus={setSearchStatus}
      habitacionesTab={habitacionesTab}
      setHabitacionesTab={setHabitacionesTab}
      eventosTab={eventosTab}
      setEventosTab={setEventosTab}
      filteredDepartments={filteredDepartments}
      departments={departments}
      isCreating={isCreating}
      setIsCreating={setIsCreating}
      newDeptName={newDeptName}
      setNewDeptName={setNewDeptName}
      editingId={editingId}
      editingName={editingName}
      setEditingName={setEditingName}
      deletingId={deletingId}
      toggleDepartment={toggleDepartment}
      deleteDepartment={deleteDepartment}
      handleDeleteClick={setDeletingId}
      handleSaveNewDepartment={handleSaveNewDepartment}
      handleEditStart={(id, name) => {
        setEditingId(id)
        setEditingName(name)
      }}
      handleSaveEdit={handleSaveEdit}
      handleCancelEdit={() => {
        setEditingId(null)
        setEditingName('')
      }}
      setDeletingId={setDeletingId}
      filteredAmenities={filteredAmenities}
      amenities={amenities}
      isCreatingAmenity={isCreatingAmenity}
      setIsCreatingAmenity={setIsCreatingAmenity}
      newAmenityName={newAmenityName}
      setNewAmenityName={setNewAmenityName}
      editingAmenityId={editingAmenityId}
      editingAmenityName={editingAmenityName}
      setEditingAmenityName={setEditingAmenityName}
      deletingAmenityId={deletingAmenityId}
      toggleAmenity={toggleAmenity}
      deleteAmenity={deleteAmenity}
      handleDeleteAmenityClick={setDeletingAmenityId}
      handleSaveNewAmenity={handleSaveNewAmenity}
      handleEditAmenityStart={(id, name) => {
        setEditingAmenityId(id)
        setEditingAmenityName(name)
      }}
      handleSaveAmenityEdit={handleSaveAmenityEdit}
      handleCancelAmenityEdit={() => {
        setEditingAmenityId(null)
        setEditingAmenityName('')
      }}
      setDeletingAmenityId={setDeletingAmenityId}
      filteredRoomTypes={filteredRoomTypes}
      roomTypes={roomTypes}
      isCreatingRoom={isCreatingRoom}
      setIsCreatingRoom={setIsCreatingRoom}
      newRoomName={newRoomName}
      setNewRoomName={setNewRoomName}
      editingRoomId={editingRoomId}
      editingRoomName={editingRoomName}
      setEditingRoomName={setEditingRoomName}
      deletingRoomId={deletingRoomId}
      toggleRoomType={toggleRoomType}
      deleteRoomType={deleteRoomType}
      handleDeleteRoomClick={setDeletingRoomId}
      handleSaveNewRoomType={handleSaveNewRoomType}
      handleEditRoomStart={(id, name) => {
        setEditingRoomId(id)
        setEditingRoomName(name)
      }}
      handleSaveRoomEdit={handleSaveRoomEdit}
      handleCancelRoomEdit={() => {
        setEditingRoomId(null)
        setEditingRoomName('')
      }}
      setDeletingRoomId={setDeletingRoomId}
      filteredFloors={filteredFloors}
      floors={floors}
      isCreatingFloor={isCreatingFloor}
      setIsCreatingFloor={setIsCreatingFloor}
      newFloorName={newFloorName}
      setNewFloorName={setNewFloorName}
      editingFloorId={editingFloorId}
      editingFloorName={editingFloorName}
      setEditingFloorName={setEditingFloorName}
      deletingFloorId={deletingFloorId}
      toggleFloor={noopId}
      deleteFloor={noopId}
      handleDeleteFloorClick={noopId}
      handleSaveNewFloor={noop}
      handleEditFloorStart={noopIdName}
      handleSaveFloorEdit={noop}
      handleCancelFloorEdit={noop}
      setDeletingFloorId={setDeletingFloorId}
      filteredShifts={filteredShifts}
      shifts={shifts}
      isCreatingShift={isCreatingShift}
      setIsCreatingShift={setIsCreatingShift}
      newShiftName={newShiftName}
      setNewShiftName={setNewShiftName}
      editingShiftId={editingShiftId}
      editingShiftName={editingShiftName}
      setEditingShiftName={setEditingShiftName}
      deletingShiftId={deletingShiftId}
      toggleShift={noopId}
      deleteShift={noopId}
      handleDeleteShiftClick={noopId}
      handleSaveNewShift={noop}
      handleEditShiftStart={noopIdName}
      handleSaveShiftEdit={noop}
      handleCancelShiftEdit={noop}
      setDeletingShiftId={setDeletingShiftId}
      filteredEventTypes={filteredEventTypes}
      eventTypes={eventTypes}
      isCreatingEventType={isCreatingEventType}
      setIsCreatingEventType={setIsCreatingEventType}
      newEventTypeName={newEventTypeName}
      setNewEventTypeName={setNewEventTypeName}
      editingEventTypeId={editingEventTypeId}
      editingEventTypeName={editingEventTypeName}
      setEditingEventTypeName={setEditingEventTypeName}
      deletingEventTypeId={deletingEventTypeId}
      toggleEventType={toggleEventType}
      deleteEventType={deleteEventType}
      handleDeleteEventTypeClick={setDeletingEventTypeId}
      handleSaveNewEventType={handleSaveNewEventType}
      handleEditEventTypeStart={(id, name) => {
        setEditingEventTypeId(id)
        setEditingEventTypeName(name)
      }}
      handleSaveEventTypeEdit={handleSaveEventTypeEdit}
      handleCancelEventTypeEdit={() => {
        setEditingEventTypeId(null)
        setEditingEventTypeName('')
      }}
      setDeletingEventTypeId={setDeletingEventTypeId}
      filteredEventSpaces={filteredEventSpaces}
      eventSpaces={eventSpaces}
      isCreatingEventSpace={isCreatingEventSpace}
      setIsCreatingEventSpace={setIsCreatingEventSpace}
      newEventSpaceName={newEventSpaceName}
      setNewEventSpaceName={setNewEventSpaceName}
      editingEventSpaceId={editingEventSpaceId}
      editingEventSpaceName={editingEventSpaceName}
      setEditingEventSpaceName={setEditingEventSpaceName}
      deletingEventSpaceId={deletingEventSpaceId}
      toggleEventSpace={noopId}
      deleteEventSpace={noopId}
      handleDeleteEventSpaceClick={noopId}
      handleSaveNewEventSpace={noop}
      handleEditEventSpaceStart={noopIdName}
      handleSaveEventSpaceEdit={noop}
      handleCancelEventSpaceEdit={noop}
      setDeletingEventSpaceId={setDeletingEventSpaceId}
      filteredRecommendations={filteredRecommendations}
      recommendationCategories={recommendationCategories}
      isCreatingRecommendation={isCreatingRecommendation}
      setIsCreatingRecommendation={setIsCreatingRecommendation}
      newRecommendationName={newRecommendationName}
      setNewRecommendationName={setNewRecommendationName}
      editingRecommendationId={editingRecommendationId}
      editingRecommendationName={editingRecommendationName}
      setEditingRecommendationName={setEditingRecommendationName}
      deletingRecommendationId={deletingRecommendationId}
      toggleRecommendation={noopId}
      deleteRecommendation={noopId}
      handleDeleteRecommendationClick={noopId}
      handleSaveNewRecommendation={noop}
      handleEditRecommendationStart={noopIdName}
      handleSaveRecommendationEdit={noop}
      handleCancelRecommendationEdit={noop}
      setDeletingRecommendationId={setDeletingRecommendationId}
      filteredClientCategories={filteredClientCategories}
      clientCategories={clientCategories}
      isCreatingClientCategory={isCreatingClientCategory}
      setIsCreatingClientCategory={setIsCreatingClientCategory}
      newClientCategoryName={newClientCategoryName}
      setNewClientCategoryName={setNewClientCategoryName}
      editingClientCategoryId={editingClientCategoryId}
      editingClientCategoryName={editingClientCategoryName}
      setEditingClientCategoryName={setEditingClientCategoryName}
      deletingClientCategoryId={deletingClientCategoryId}
      toggleClientCategory={noopId}
      deleteClientCategory={noopId}
      handleDeleteClientCategoryClick={noopId}
      handleSaveNewClientCategory={noop}
      handleEditClientCategoryStart={noopIdName}
      handleSaveClientCategoryEdit={noop}
      handleCancelClientCategoryEdit={noop}
      setDeletingClientCategoryId={setDeletingClientCategoryId}
    />
  )
}
