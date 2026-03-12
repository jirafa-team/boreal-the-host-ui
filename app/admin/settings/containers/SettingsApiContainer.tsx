'use client'

import { useState } from 'react'
import { SettingsView } from '../components/SettingsView'
import { useSettingsApi } from '@/hooks/use-settings-taxonomy'

export function SettingsApiContainer() {

  const {
    departments,
    amenities,
    roomTypes,
    eventTypes,
    filterItems,
    createDepartmentHandler,
    updateDepartmentHandler,
    deleteDepartmentHandler,
    createAmenityHandler,
    updateAmenityHandler,
    deleteAmenityHandler,
    createRoomTypeHandler,
    updateRoomTypeHandler,
    deleteRoomTypeHandler,
    createEventTypeHandler,
    updateEventTypeHandler,
    deleteEventTypeHandler,
  } = useSettingsApi()

  const [selectedCard, setSelectedCard] = useState('Departamentos')
  const [searchTerm, setSearchTerm] = useState('')
  const [searchStatus, setSearchStatus] = useState('all')
  const [habitacionesTab, setHabitacionesTab] = useState<'tipos' | 'pisos'>('tipos')
  const [eventosTab, setEventosTab] = useState<'tipos' | 'espacios'>('tipos')

  // Departments UI state
  const [isCreating, setIsCreating] = useState(false)
  const [newDeptName, setNewDeptName] = useState('')
  const [editingId, setEditingId] = useState<number | string | null>(null)
  const [editingName, setEditingName] = useState('')
  const [deletingId, setDeletingId] = useState<number | string | null>(null)

  // Amenities UI state
  const [isCreatingAmenity, setIsCreatingAmenity] = useState(false)
  const [newAmenityName, setNewAmenityName] = useState('')
  const [editingAmenityId, setEditingAmenityId] = useState<number | string | null>(null)
  const [editingAmenityName, setEditingAmenityName] = useState('')
  const [deletingAmenityId, setDeletingAmenityId] = useState<number | string | null>(null)

  // Room types UI state
  const [isCreatingRoom, setIsCreatingRoom] = useState(false)
  const [newRoomName, setNewRoomName] = useState('')
  const [editingRoomId, setEditingRoomId] = useState<number | string | null>(null)
  const [editingRoomName, setEditingRoomName] = useState('')
  const [deletingRoomId, setDeletingRoomId] = useState<number | string | null>(null)

  // Event types UI state
  const [isCreatingEventType, setIsCreatingEventType] = useState(false)
  const [newEventTypeName, setNewEventTypeName] = useState('')
  const [editingEventTypeId, setEditingEventTypeId] = useState<number | string | null>(null)
  const [editingEventTypeName, setEditingEventTypeName] = useState('')
  const [deletingEventTypeId, setDeletingEventTypeId] = useState<number | string | null>(null)

  // Local-only state (no API yet)
  const [floors, setFloors] = useState<{ id: number; name: string; description: string; status: string; active: boolean }[]>([])
  const [isCreatingFloor, setIsCreatingFloor] = useState(false)
  const [newFloorName, setNewFloorName] = useState('')
  const [editingFloorId, setEditingFloorId] = useState<number | string | null>(null)
  const [editingFloorName, setEditingFloorName] = useState('')
  const [deletingFloorId, setDeletingFloorId] = useState<number | string | null>(null)

  const [shifts, setShifts] = useState<{ id: number; name: string; description: string; status: string; active: boolean }[]>([])
  const [isCreatingShift, setIsCreatingShift] = useState(false)
  const [newShiftName, setNewShiftName] = useState('')
  const [editingShiftId, setEditingShiftId] = useState<number | string | null>(null)
  const [editingShiftName, setEditingShiftName] = useState('')
  const [deletingShiftId, setDeletingShiftId] = useState<number | string | null>(null)

  const [eventSpaces, setEventSpaces] = useState<{ id: number; name: string; description: string; status: string; active: boolean }[]>([])
  const [isCreatingEventSpace, setIsCreatingEventSpace] = useState(false)
  const [newEventSpaceName, setNewEventSpaceName] = useState('')
  const [editingEventSpaceId, setEditingEventSpaceId] = useState<number | string | null>(null)
  const [editingEventSpaceName, setEditingEventSpaceName] = useState('')
  const [deletingEventSpaceId, setDeletingEventSpaceId] = useState<number | string | null>(null)

  const [recommendationCategories, setRecommendationCategories] = useState<{ id: number; name: string; description: string; status: string; active: boolean }[]>([])
  const [isCreatingRecommendation, setIsCreatingRecommendation] = useState(false)
  const [newRecommendationName, setNewRecommendationName] = useState('')
  const [editingRecommendationId, setEditingRecommendationId] = useState<number | string | null>(null)
  const [editingRecommendationName, setEditingRecommendationName] = useState('')
  const [deletingRecommendationId, setDeletingRecommendationId] = useState<number | string | null>(null)

  // Filtered lists
  const filteredDepartments = filterItems(departments, searchTerm, searchStatus)
  const filteredAmenities = filterItems(amenities, searchTerm, searchStatus)
  const filteredRoomTypes = filterItems(roomTypes, searchTerm, searchStatus)
  const filteredEventTypes = filterItems(eventTypes, searchTerm, searchStatus)
  const filteredFloors = filterItems(floors, searchTerm, searchStatus)
  const filteredShifts = filterItems(shifts, searchTerm, searchStatus)
  const filteredEventSpaces = filterItems(eventSpaces, searchTerm, searchStatus)
  const filteredRecommendations = filterItems(recommendationCategories, searchTerm, searchStatus)

  // Department handlers
  const handleSaveNewDepartment = async () => {
    if (newDeptName.trim()) {
      await createDepartmentHandler(newDeptName.trim())
      setNewDeptName('')
      setIsCreating(false)
    }
  }

  const handleEditStart = (id: number | string, name: string) => {
    setEditingId(id)
    setEditingName(name)
  }

  const handleSaveEdit = async () => {
    if (editingName.trim() && editingId !== null) {
      await updateDepartmentHandler(editingId as string, { name: editingName })
      setEditingId(null)
      setEditingName('')
    }
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditingName('')
  }

  const handleDeleteClick = (id: number | string) => {
    setDeletingId(id)
  }

  const deleteDepartment = async (id: number | string) => {
    await deleteDepartmentHandler(id as string)
    setDeletingId(null)
  }

  const toggleDepartment = async (id: number | string) => {
    const dept = departments.find(d => d.id === id)
    if (dept) {
      await updateDepartmentHandler(id as string, { active: !dept.active })
    }
  }

  // Amenity handlers
  const handleSaveNewAmenity = async () => {
    if (newAmenityName.trim()) {
      await createAmenityHandler(newAmenityName.trim())
      setNewAmenityName('')
      setIsCreatingAmenity(false)
    }
  }

  const handleEditAmenityStart = (id: number | string, name: string) => {
    setEditingAmenityId(id)
    setEditingAmenityName(name)
  }

  const handleSaveAmenityEdit = async () => {
    if (editingAmenityName.trim() && editingAmenityId !== null) {
      await updateAmenityHandler(editingAmenityId as string, { name: editingAmenityName })
      setEditingAmenityId(null)
      setEditingAmenityName('')
    }
  }

  const handleCancelAmenityEdit = () => {
    setEditingAmenityId(null)
    setEditingAmenityName('')
  }

  const handleDeleteAmenityClick = (id: number | string) => {
    setDeletingAmenityId(id)
  }

  const deleteAmenity = async (id: number | string) => {
    await deleteAmenityHandler(id as string)
    setDeletingAmenityId(null)
  }

  const toggleAmenity = async (id: number | string) => {
    const amenity = amenities.find(a => a.id === id)
    if (amenity) {
      await updateAmenityHandler(id as string, { active: !amenity.active })
    }
  }

  // Room type handlers
  const handleSaveNewRoomType = async () => {
    if (newRoomName.trim()) {
      await createRoomTypeHandler(newRoomName.trim())
      setNewRoomName('')
      setIsCreatingRoom(false)
    }
  }

  const handleEditRoomStart = (id: number | string, name: string) => {
    setEditingRoomId(id)
    setEditingRoomName(name)
  }

  const handleSaveRoomEdit = async () => {
    if (editingRoomName.trim() && editingRoomId !== null) {
      await updateRoomTypeHandler(editingRoomId as string, { name: editingRoomName })
      setEditingRoomId(null)
      setEditingRoomName('')
    }
  }

  const handleCancelRoomEdit = () => {
    setEditingRoomId(null)
    setEditingRoomName('')
  }

  const handleDeleteRoomClick = (id: number | string) => {
    setDeletingRoomId(id)
  }

  const deleteRoomType = async (id: number | string) => {
    await deleteRoomTypeHandler(id as string)
    setDeletingRoomId(null)
  }

  const toggleRoomType = async (id: number | string) => {
    const room = roomTypes.find(r => r.id === id)
    if (room) {
      await updateRoomTypeHandler(id as string, { active: !room.active })
    }
  }

  // Event type handlers
  const handleSaveNewEventType = async () => {
    if (newEventTypeName.trim()) {
      await createEventTypeHandler(newEventTypeName.trim())
      setNewEventTypeName('')
      setIsCreatingEventType(false)
    }
  }

  const handleEditEventTypeStart = (id: number | string, name: string) => {
    setEditingEventTypeId(id)
    setEditingEventTypeName(name)
  }

  const handleSaveEventTypeEdit = async () => {
    if (editingEventTypeName.trim() && editingEventTypeId !== null) {
      await updateEventTypeHandler(editingEventTypeId as string, { name: editingEventTypeName })
      setEditingEventTypeId(null)
      setEditingEventTypeName('')
    }
  }

  const handleCancelEventTypeEdit = () => {
    setEditingEventTypeId(null)
    setEditingEventTypeName('')
  }

  const handleDeleteEventTypeClick = (id: number | string) => {
    setDeletingEventTypeId(id)
  }

  const deleteEventType = async (id: number | string) => {
    await deleteEventTypeHandler(id as string)
    setDeletingEventTypeId(null)
  }

  const toggleEventType = async (id: number | string) => {
    const eventType = eventTypes.find(e => e.id === id)
    if (eventType) {
      await updateEventTypeHandler(id as string, { active: !eventType.active })
    }
  }

  // Floor handlers (local only)
  const handleSaveNewFloor = () => {
    if (newFloorName.trim()) {
      const newId = Math.max(...floors.map(f => f.id), 0) + 1
      setFloors([{ id: newId, name: newFloorName, description: '', status: 'Activo', active: true }, ...floors])
      setNewFloorName('')
      setIsCreatingFloor(false)
    }
  }
  const handleEditFloorStart = (id: number | string, name: string) => { setEditingFloorId(id); setEditingFloorName(name) }
  const handleSaveFloorEdit = () => {
    if (editingFloorName.trim() && editingFloorId !== null) {
      setFloors(floors.map(f => f.id === editingFloorId ? { ...f, name: editingFloorName } : f))
      setEditingFloorId(null); setEditingFloorName('')
    }
  }
  const handleCancelFloorEdit = () => { setEditingFloorId(null); setEditingFloorName('') }
  const handleDeleteFloorClick = (id: number | string) => { setDeletingFloorId(id) }
  const deleteFloor = (id: number | string) => { setFloors(floors.filter(f => f.id !== id)); setDeletingFloorId(null) }
  const toggleFloor = (id: number | string) => { setFloors(floors.map(f => f.id === id ? { ...f, active: !f.active, status: !f.active ? 'Activo' : 'Inactivo' } : f)) }

  // Shift handlers (local only)
  const handleSaveNewShift = () => {
    if (newShiftName.trim()) {
      const newId = Math.max(...shifts.map(s => s.id), 0) + 1
      setShifts([{ id: newId, name: newShiftName, description: '', status: 'Activo', active: true }, ...shifts])
      setNewShiftName('')
      setIsCreatingShift(false)
    }
  }
  const handleEditShiftStart = (id: number | string, name: string) => { setEditingShiftId(id); setEditingShiftName(name) }
  const handleSaveShiftEdit = () => {
    if (editingShiftName.trim() && editingShiftId !== null) {
      setShifts(shifts.map(s => s.id === editingShiftId ? { ...s, name: editingShiftName } : s))
      setEditingShiftId(null); setEditingShiftName('')
    }
  }
  const handleCancelShiftEdit = () => { setEditingShiftId(null); setEditingShiftName('') }
  const handleDeleteShiftClick = (id: number | string) => { setDeletingShiftId(id) }
  const deleteShift = (id: number | string) => { setShifts(shifts.filter(s => s.id !== id)); setDeletingShiftId(null) }
  const toggleShift = (id: number | string) => { setShifts(shifts.map(s => s.id === id ? { ...s, active: !s.active, status: !s.active ? 'Activo' : 'Inactivo' } : s)) }

  // Event space handlers (local only)
  const handleSaveNewEventSpace = () => {
    if (newEventSpaceName.trim()) {
      const newId = Math.max(...eventSpaces.map(e => e.id), 0) + 1
      setEventSpaces([{ id: newId, name: newEventSpaceName, description: '', status: 'Activo', active: true }, ...eventSpaces])
      setNewEventSpaceName('')
      setIsCreatingEventSpace(false)
    }
  }
  const handleEditEventSpaceStart = (id: number | string, name: string) => { setEditingEventSpaceId(id); setEditingEventSpaceName(name) }
  const handleSaveEventSpaceEdit = () => {
    if (editingEventSpaceName.trim() && editingEventSpaceId !== null) {
      setEventSpaces(eventSpaces.map(e => e.id === editingEventSpaceId ? { ...e, name: editingEventSpaceName } : e))
      setEditingEventSpaceId(null); setEditingEventSpaceName('')
    }
  }
  const handleCancelEventSpaceEdit = () => { setEditingEventSpaceId(null); setEditingEventSpaceName('') }
  const handleDeleteEventSpaceClick = (id: number | string) => { setDeletingEventSpaceId(id) }
  const deleteEventSpace = (id: number | string) => { setEventSpaces(eventSpaces.filter(e => e.id !== id)); setDeletingEventSpaceId(null) }
  const toggleEventSpace = (id: number | string) => { setEventSpaces(eventSpaces.map(e => e.id === id ? { ...e, active: !e.active, status: !e.active ? 'Activo' : 'Inactivo' } : e)) }

  // Recommendation handlers (local only)
  const handleSaveNewRecommendation = () => {
    if (newRecommendationName.trim()) {
      const newId = Math.max(...recommendationCategories.map(r => r.id), 0) + 1
      setRecommendationCategories([{ id: newId, name: newRecommendationName, description: '', status: 'Activo', active: true }, ...recommendationCategories])
      setNewRecommendationName('')
      setIsCreatingRecommendation(false)
    }
  }
  const handleEditRecommendationStart = (id: number | string, name: string) => { setEditingRecommendationId(id); setEditingRecommendationName(name) }
  const handleSaveRecommendationEdit = () => {
    if (editingRecommendationName.trim() && editingRecommendationId !== null) {
      setRecommendationCategories(recommendationCategories.map(r => r.id === editingRecommendationId ? { ...r, name: editingRecommendationName } : r))
      setEditingRecommendationId(null); setEditingRecommendationName('')
    }
  }
  const handleCancelRecommendationEdit = () => { setEditingRecommendationId(null); setEditingRecommendationName('') }
  const handleDeleteRecommendationClick = (id: number | string) => { setDeletingRecommendationId(id) }
  const deleteRecommendation = (id: number | string) => { setRecommendationCategories(recommendationCategories.filter(r => r.id !== id)); setDeletingRecommendationId(null) }
  const toggleRecommendation = (id: number | string) => { setRecommendationCategories(recommendationCategories.map(r => r.id === id ? { ...r, active: !r.active, status: !r.active ? 'Activo' : 'Inactivo' } : r)) }

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
      setDeletingId={setDeletingId}
      toggleDepartment={toggleDepartment}
      deleteDepartment={deleteDepartment}
      handleDeleteClick={handleDeleteClick}
      handleSaveNewDepartment={handleSaveNewDepartment}
      handleEditStart={handleEditStart}
      handleSaveEdit={handleSaveEdit}
      handleCancelEdit={handleCancelEdit}

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
      setDeletingAmenityId={setDeletingAmenityId}
      toggleAmenity={toggleAmenity}
      deleteAmenity={deleteAmenity}
      handleDeleteAmenityClick={handleDeleteAmenityClick}
      handleSaveNewAmenity={handleSaveNewAmenity}
      handleEditAmenityStart={handleEditAmenityStart}
      handleSaveAmenityEdit={handleSaveAmenityEdit}
      handleCancelAmenityEdit={handleCancelAmenityEdit}

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
      setDeletingRoomId={setDeletingRoomId}
      toggleRoomType={toggleRoomType}
      deleteRoomType={deleteRoomType}
      handleDeleteRoomClick={handleDeleteRoomClick}
      handleSaveNewRoomType={handleSaveNewRoomType}
      handleEditRoomStart={handleEditRoomStart}
      handleSaveRoomEdit={handleSaveRoomEdit}
      handleCancelRoomEdit={handleCancelRoomEdit}

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
      setDeletingFloorId={setDeletingFloorId}
      toggleFloor={toggleFloor}
      deleteFloor={deleteFloor}
      handleDeleteFloorClick={handleDeleteFloorClick}
      handleSaveNewFloor={handleSaveNewFloor}
      handleEditFloorStart={handleEditFloorStart}
      handleSaveFloorEdit={handleSaveFloorEdit}
      handleCancelFloorEdit={handleCancelFloorEdit}

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
      setDeletingShiftId={setDeletingShiftId}
      toggleShift={toggleShift}
      deleteShift={deleteShift}
      handleDeleteShiftClick={handleDeleteShiftClick}
      handleSaveNewShift={handleSaveNewShift}
      handleEditShiftStart={handleEditShiftStart}
      handleSaveShiftEdit={handleSaveShiftEdit}
      handleCancelShiftEdit={handleCancelShiftEdit}

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
      setDeletingEventTypeId={setDeletingEventTypeId}
      toggleEventType={toggleEventType}
      deleteEventType={deleteEventType}
      handleDeleteEventTypeClick={handleDeleteEventTypeClick}
      handleSaveNewEventType={handleSaveNewEventType}
      handleEditEventTypeStart={handleEditEventTypeStart}
      handleSaveEventTypeEdit={handleSaveEventTypeEdit}
      handleCancelEventTypeEdit={handleCancelEventTypeEdit}

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
      setDeletingEventSpaceId={setDeletingEventSpaceId}
      toggleEventSpace={toggleEventSpace}
      deleteEventSpace={deleteEventSpace}
      handleDeleteEventSpaceClick={handleDeleteEventSpaceClick}
      handleSaveNewEventSpace={handleSaveNewEventSpace}
      handleEditEventSpaceStart={handleEditEventSpaceStart}
      handleSaveEventSpaceEdit={handleSaveEventSpaceEdit}
      handleCancelEventSpaceEdit={handleCancelEventSpaceEdit}

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
      setDeletingRecommendationId={setDeletingRecommendationId}
      toggleRecommendation={toggleRecommendation}
      deleteRecommendation={deleteRecommendation}
      handleDeleteRecommendationClick={handleDeleteRecommendationClick}
      handleSaveNewRecommendation={handleSaveNewRecommendation}
      handleEditRecommendationStart={handleEditRecommendationStart}
      handleSaveRecommendationEdit={handleSaveRecommendationEdit}
      handleCancelRecommendationEdit={handleCancelRecommendationEdit}
    />
  )
}
