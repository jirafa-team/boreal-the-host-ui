export interface SettingsItem {
  id: number | string
  name: string
  description?: string
  status: string
  active: boolean
}

export type SettingsCardLabel =
  | 'Departamentos'
  | 'Amenities'
  | 'Habitaciones'
  | 'Personal'
  | 'Eventos'
  | 'Recomendaciones'
  | 'Clientes'

export type HabitacionesTab = 'tipos' | 'pisos'
export type EventosTab = 'tipos' | 'espacios'

export interface SettingsViewProps {
  selectedCard: string
  setSelectedCard: (card: string) => void
  searchTerm: string
  setSearchTerm: (v: string) => void
  searchStatus: string
  setSearchStatus: (v: string) => void
  habitacionesTab: HabitacionesTab
  setHabitacionesTab: (t: HabitacionesTab) => void
  eventosTab: EventosTab
  setEventosTab: (t: EventosTab) => void
  filteredDepartments: SettingsItem[]
  departments: SettingsItem[]
  isCreating: boolean
  setIsCreating: (v: boolean) => void
  newDeptName: string
  setNewDeptName: (v: string) => void
  editingId: number | string | null
  editingName: string
  setEditingName: (v: string) => void
  deletingId: number | string | null
  toggleDepartment: (id: number | string) => void
  deleteDepartment: (id: number | string) => void
  handleDeleteClick: (id: number | string) => void
  handleSaveNewDepartment: () => void
  handleEditStart: (id: number | string, name: string) => void
  handleSaveEdit: () => void
  handleCancelEdit: () => void
  setDeletingId: (id: number | string | null) => void
  filteredAmenities: SettingsItem[]
  amenities: SettingsItem[]
  isCreatingAmenity: boolean
  setIsCreatingAmenity: (v: boolean) => void
  newAmenityName: string
  setNewAmenityName: (v: string) => void
  editingAmenityId: number | string | null
  editingAmenityName: string
  setEditingAmenityName: (v: string) => void
  deletingAmenityId: number | string | null
  toggleAmenity: (id: number | string) => void
  deleteAmenity: (id: number | string) => void
  handleDeleteAmenityClick: (id: number | string) => void
  handleSaveNewAmenity: () => void
  handleEditAmenityStart: (id: number | string, name: string) => void
  handleSaveAmenityEdit: () => void
  handleCancelAmenityEdit: () => void
  setDeletingAmenityId: (id: number | string | null) => void
  filteredRoomTypes: SettingsItem[]
  roomTypes: SettingsItem[]
  isCreatingRoom: boolean
  setIsCreatingRoom: (v: boolean) => void
  newRoomName: string
  setNewRoomName: (v: string) => void
  editingRoomId: number | string | null
  editingRoomName: string
  setEditingRoomName: (v: string) => void
  deletingRoomId: number | string | null
  toggleRoomType: (id: number | string) => void
  deleteRoomType: (id: number | string) => void
  handleDeleteRoomClick: (id: number | string) => void
  handleSaveNewRoomType: () => void
  handleEditRoomStart: (id: number | string, name: string) => void
  handleSaveRoomEdit: () => void
  handleCancelRoomEdit: () => void
  setDeletingRoomId: (id: number | string | null) => void
  filteredFloors: SettingsItem[]
  floors: SettingsItem[]
  isCreatingFloor: boolean
  setIsCreatingFloor: (v: boolean) => void
  newFloorName: string
  setNewFloorName: (v: string) => void
  editingFloorId: number | string | null
  editingFloorName: string
  setEditingFloorName: (v: string) => void
  deletingFloorId: number | string | null
  toggleFloor: (id: number | string) => void
  deleteFloor: (id: number | string) => void
  handleDeleteFloorClick: (id: number | string) => void
  handleSaveNewFloor: () => void
  handleEditFloorStart: (id: number | string, name: string) => void
  handleSaveFloorEdit: () => void
  handleCancelFloorEdit: () => void
  setDeletingFloorId: (id: number | string | null) => void
  filteredShifts: SettingsItem[]
  shifts: SettingsItem[]
  isCreatingShift: boolean
  setIsCreatingShift: (v: boolean) => void
  newShiftName: string
  setNewShiftName: (v: string) => void
  editingShiftId: number | string | null
  editingShiftName: string
  setEditingShiftName: (v: string) => void
  deletingShiftId: number | string | null
  toggleShift: (id: number | string) => void
  deleteShift: (id: number | string) => void
  handleDeleteShiftClick: (id: number | string) => void
  handleSaveNewShift: () => void
  handleEditShiftStart: (id: number | string, name: string) => void
  handleSaveShiftEdit: () => void
  handleCancelShiftEdit: () => void
  setDeletingShiftId: (id: number | string | null) => void
  filteredEventTypes: SettingsItem[]
  eventTypes: SettingsItem[]
  isCreatingEventType: boolean
  setIsCreatingEventType: (v: boolean) => void
  newEventTypeName: string
  setNewEventTypeName: (v: string) => void
  editingEventTypeId: number | string | null
  editingEventTypeName: string
  setEditingEventTypeName: (v: string) => void
  deletingEventTypeId: number | string | null
  toggleEventType: (id: number | string) => void
  deleteEventType: (id: number | string) => void
  handleDeleteEventTypeClick: (id: number | string) => void
  handleSaveNewEventType: () => void
  handleEditEventTypeStart: (id: number | string, name: string) => void
  handleSaveEventTypeEdit: () => void
  handleCancelEventTypeEdit: () => void
  setDeletingEventTypeId: (id: number | string | null) => void
  filteredEventSpaces: SettingsItem[]
  eventSpaces: SettingsItem[]
  isCreatingEventSpace: boolean
  setIsCreatingEventSpace: (v: boolean) => void
  newEventSpaceName: string
  setNewEventSpaceName: (v: string) => void
  editingEventSpaceId: number | string | null
  editingEventSpaceName: string
  setEditingEventSpaceName: (v: string) => void
  deletingEventSpaceId: number | string | null
  toggleEventSpace: (id: number | string) => void
  deleteEventSpace: (id: number | string) => void
  handleDeleteEventSpaceClick: (id: number | string) => void
  handleSaveNewEventSpace: () => void
  handleEditEventSpaceStart: (id: number | string, name: string) => void
  handleSaveEventSpaceEdit: () => void
  handleCancelEventSpaceEdit: () => void
  setDeletingEventSpaceId: (id: number | string | null) => void
  filteredRecommendations: SettingsItem[]
  recommendationCategories: SettingsItem[]
  isCreatingRecommendation: boolean
  setIsCreatingRecommendation: (v: boolean) => void
  newRecommendationName: string
  setNewRecommendationName: (v: string) => void
  editingRecommendationId: number | string | null
  editingRecommendationName: string
  setEditingRecommendationName: (v: string) => void
  deletingRecommendationId: number | string | null
  toggleRecommendation: (id: number | string) => void
  deleteRecommendation: (id: number | string) => void
  handleDeleteRecommendationClick: (id: number | string) => void
  handleSaveNewRecommendation: () => void
  handleEditRecommendationStart: (id: number | string, name: string) => void
  handleSaveRecommendationEdit: () => void
  handleCancelRecommendationEdit: () => void
  setDeletingRecommendationId: (id: number | string | null) => void
  filteredClientCategories: SettingsItem[]
  clientCategories: SettingsItem[]
  isCreatingClientCategory: boolean
  setIsCreatingClientCategory: (v: boolean) => void
  newClientCategoryName: string
  setNewClientCategoryName: (v: string) => void
  editingClientCategoryId: number | string | null
  editingClientCategoryName: string
  setEditingClientCategoryName: (v: string) => void
  deletingClientCategoryId: number | string | null
  toggleClientCategory: (id: number | string) => void
  deleteClientCategory: (id: number | string) => void
  handleDeleteClientCategoryClick: (id: number | string) => void
  handleSaveNewClientCategory: () => void
  handleEditClientCategoryStart: (id: number | string, name: string) => void
  handleSaveClientCategoryEdit: () => void
  handleCancelClientCategoryEdit: () => void
  setDeletingClientCategoryId: (id: number | string | null) => void
}
