'use client'

import {
  Hotel,
  Building2,
  Users,
  Sparkles,
  Calendar,
  Compass,
  Edit2,
  Clock,
  Trash2,
} from 'lucide-react'
import type { SettingsViewProps } from './types'

const gradientColors: { [key: string]: string } = {
  'from-purple-600 to-purple-700': 'linear-gradient(135deg, rgb(147, 51, 234), rgb(126, 34, 206))',
  'from-indigo-600 to-indigo-700': 'linear-gradient(135deg, rgb(79, 70, 229), rgb(67, 56, 202))',
  'from-orange-600 to-orange-700': 'linear-gradient(135deg, rgb(234, 88, 12), rgb(194, 65, 12))',
  'from-pink-600 to-pink-700': 'linear-gradient(135deg, rgb(236, 72, 153), rgb(219, 39, 119))',
  'from-red-600 to-red-700': 'linear-gradient(135deg, rgb(220, 38, 38), rgb(185, 28, 28))',
  'from-yellow-600 to-yellow-700': 'linear-gradient(135deg, rgb(202, 138, 4), rgb(161, 98, 7))',
  'from-green-600 to-green-700': 'linear-gradient(135deg, #5b9f00, #4a7f00)',
  'from-violet-custom to-violet-custom': 'linear-gradient(135deg, #7d1efa, #6d0ee6)',
}

const settingsCards = [
  { label: 'Departamentos', icon: Hotel, color: 'from-purple-600 to-purple-700' },
  { label: 'Amenities', icon: Building2, color: 'from-orange-600 to-orange-700' },
  { label: 'Habitaciones', icon: Hotel, color: 'from-indigo-600 to-indigo-700' },
  { label: 'Personal', icon: Sparkles, color: 'from-pink-600 to-pink-700' },
  { label: 'Clientes', icon: Users, color: 'from-violet-custom to-violet-custom' },
]

export function SettingsView(props: SettingsViewProps) {
  const {
    selectedCard,
    setSelectedCard,
    searchTerm,
    setSearchTerm,
    searchStatus,
    setSearchStatus,
    habitacionesTab,
    setHabitacionesTab,
    eventosTab,
    setEventosTab,
    filteredDepartments,
    departments,
    isCreating,
    setIsCreating,
    newDeptName,
    setNewDeptName,
    editingId,
    editingName,
    setEditingName,
    deletingId,
    toggleDepartment,
    deleteDepartment,
    handleDeleteClick,
    handleSaveNewDepartment,
    handleEditStart,
    handleSaveEdit,
    handleCancelEdit,
    setDeletingId,
    filteredAmenities,
    amenities,
    isCreatingAmenity,
    setIsCreatingAmenity,
    newAmenityName,
    setNewAmenityName,
    editingAmenityId,
    editingAmenityName,
    setEditingAmenityName,
    deletingAmenityId,
    toggleAmenity,
    deleteAmenity,
    handleDeleteAmenityClick,
    handleSaveNewAmenity,
    handleEditAmenityStart,
    handleSaveAmenityEdit,
    handleCancelAmenityEdit,
    setDeletingAmenityId,
    filteredRoomTypes,
    roomTypes,
    isCreatingRoom,
    setIsCreatingRoom,
    newRoomName,
    setNewRoomName,
    editingRoomId,
    editingRoomName,
    setEditingRoomName,
    deletingRoomId,
    toggleRoomType,
    deleteRoomType,
    handleDeleteRoomClick,
    handleSaveNewRoomType,
    handleEditRoomStart,
    handleSaveRoomEdit,
    handleCancelRoomEdit,
    setDeletingRoomId,
    filteredFloors,
    floors,
    isCreatingFloor,
    setIsCreatingFloor,
    newFloorName,
    setNewFloorName,
    editingFloorId,
    editingFloorName,
    setEditingFloorName,
    deletingFloorId,
    toggleFloor,
    deleteFloor,
    handleDeleteFloorClick,
    handleSaveNewFloor,
    handleEditFloorStart,
    handleSaveFloorEdit,
    handleCancelFloorEdit,
    setDeletingFloorId,
    filteredShifts,
    shifts,
    isCreatingShift,
    setIsCreatingShift,
    newShiftName,
    setNewShiftName,
    editingShiftId,
    editingShiftName,
    setEditingShiftName,
    deletingShiftId,
    toggleShift,
    deleteShift,
    handleDeleteShiftClick,
    handleSaveNewShift,
    handleEditShiftStart,
    handleSaveShiftEdit,
    handleCancelShiftEdit,
    setDeletingShiftId,
    filteredEventTypes,
    eventTypes,
    isCreatingEventType,
    setIsCreatingEventType,
    newEventTypeName,
    setNewEventTypeName,
    editingEventTypeId,
    editingEventTypeName,
    setEditingEventTypeName,
    deletingEventTypeId,
    toggleEventType,
    deleteEventType,
    handleDeleteEventTypeClick,
    handleSaveNewEventType,
    handleEditEventTypeStart,
    handleSaveEventTypeEdit,
    handleCancelEventTypeEdit,
    setDeletingEventTypeId,
    filteredEventSpaces,
    eventSpaces,
    isCreatingEventSpace,
    setIsCreatingEventSpace,
    newEventSpaceName,
    setNewEventSpaceName,
    editingEventSpaceId,
    editingEventSpaceName,
    setEditingEventSpaceName,
    deletingEventSpaceId,
    toggleEventSpace,
    deleteEventSpace,
    handleDeleteEventSpaceClick,
    handleSaveNewEventSpace,
    handleEditEventSpaceStart,
    handleSaveEventSpaceEdit,
    handleCancelEventSpaceEdit,
    setDeletingEventSpaceId,
    filteredRecommendations,
    recommendationCategories,
    isCreatingRecommendation,
    setIsCreatingRecommendation,
    newRecommendationName,
    setNewRecommendationName,
    editingRecommendationId,
    editingRecommendationName,
    setEditingRecommendationName,
    deletingRecommendationId,
    toggleRecommendation,
    deleteRecommendation,
    handleDeleteRecommendationClick,
    handleSaveNewRecommendation,
    handleEditRecommendationStart,
    handleSaveRecommendationEdit,
    handleCancelRecommendationEdit,
    setDeletingRecommendationId,
    filteredClientCategories,
    clientCategories,
    isCreatingClientCategory,
    setIsCreatingClientCategory,
    newClientCategoryName,
    setNewClientCategoryName,
    editingClientCategoryId,
    editingClientCategoryName,
    setEditingClientCategoryName,
    deletingClientCategoryId,
    toggleClientCategory,
    deleteClientCategory,
    handleDeleteClientCategoryClick,
    handleSaveNewClientCategory,
    handleEditClientCategoryStart,
    handleSaveClientCategoryEdit,
    handleCancelClientCategoryEdit,
    setDeletingClientCategoryId,
  } = props

  return (
    <div className="flex-1 overflow-auto bg-gray-50">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Configuración</h1>
          <p className="text-gray-600 mt-1">Personaliza valores del sistema</p>
        </div>
        <div className="flex gap-24">
          <div className="max-w-[240px]">
            <div className="space-y-3">
              {settingsCards.map((card) => {
                const Icon = card.icon
                const isSelected = selectedCard === card.label
                return (
                  <button
                    key={card.label}
                    onClick={() => setSelectedCard(card.label)}
                    className={`group relative overflow-hidden rounded-lg p-3 text-white shadow-md hover:shadow-lg transition-all duration-300 w-full text-left h-16 flex items-center justify-start ${isSelected ? 'scale-110 hover:scale-110' : 'opacity-50 hover:scale-105 hover:opacity-75'
                      }`}
                    style={{ background: gradientColors[card.color] }}
                  >
                    <div className="absolute inset-0 opacity-10">
                      <div className="absolute top-0 right-0 w-20 h-20 bg-white rounded-full -mr-8 -mt-8" />
                    </div>
                    <div className="relative flex items-center gap-3">
                      <Icon className="w-5 h-5 flex-shrink-0" />
                      <p className="text-sm font-medium">{card.label}</p>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
          <div className="flex-1">
            {selectedCard === 'Departamentos' && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">{selectedCard}</h2>
                  <button
                    onClick={() => {
                      setIsCreating(true)
                      setNewDeptName('')
                    }}
                    className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-purple-700 text-white shadow-md hover:shadow-lg transition-all duration-300 hover:scale-110 group relative"
                    title="Añadir Departamento"
                  >
                    <div className="relative flex items-center justify-center">
                      <Hotel className="w-5 h-5" />
                      <span className="absolute text-lg font-bold -bottom-1 -right-0.5 text-white drop-shadow-lg">+</span>
                    </div>
                    <span className="absolute bottom-full mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                      Añadir Departamento
                    </span>
                  </button>
                </div>

                {/* Search Section */}
                <div className="mb-6 flex gap-3">
                  <input
                    type="text"
                    placeholder="Buscar por nombre..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <select
                    value={searchStatus}
                    onChange={(e) => setSearchStatus(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">Todos los estados</option>
                    <option value="activo">Activo</option>
                    <option value="inactivo">Inactivo</option>
                  </select>
                </div>

                <div className="space-y-3">
                  {isCreating && (
                    <div className="flex items-center gap-4 p-4 border-2 border-purple-500 rounded-lg bg-purple-50">
                      <input
                        type="text"
                        placeholder="Nombre del departamento..."
                        value={newDeptName}
                        onChange={(e) => setNewDeptName(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSaveNewDepartment()}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        autoFocus
                      />
                      <button
                        onClick={handleSaveNewDepartment}
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
                      >
                        Guardar
                      </button>
                      <button
                        onClick={() => {
                          setIsCreating(false)
                          setNewDeptName('')
                        }}
                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-medium"
                      >
                        Cancelar
                      </button>
                    </div>
                  )}
                  {filteredDepartments.map((department) => (
                    <div key={department.id}>
                      {editingId === department.id ? (
                        <div className="flex items-center gap-4 p-4 border-2 border-purple-500 rounded-lg bg-purple-50">
                          <input
                            type="text"
                            value={editingName}
                            onChange={(e) => setEditingName(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSaveEdit()}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                            autoFocus
                          />
                          <button
                            onClick={handleSaveEdit}
                            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
                          >
                            Guardar
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-medium"
                          >
                            Cancelar
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="text-lg font-semibold text-gray-900">{department.name}</h3>
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${department.active
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-gray-100 text-gray-800'
                                }`}>
                                {department.status}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            {/* Toggle Switch */}
                            <button
                              onClick={() => toggleDepartment(department.id)}
                              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${department.active ? 'bg-green-500' : 'bg-gray-300'
                                }`}
                            >
                              <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${department.active ? 'translate-x-6' : 'translate-x-1'
                                  }`}
                              />
                            </button>
                            {/* Edit Button */}
                            <button
                              onClick={() => handleEditStart(department.id, department.name)}
                              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            >
                              <Edit2 className="w-5 h-5" />
                            </button>
                            {/* Delete Button */}
                            <button
                              onClick={() => handleDeleteClick(department.id)}
                              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedCard !== 'Departamentos' && selectedCard !== 'Amenities' && selectedCard !== 'Habitaciones' && selectedCard !== 'Personal' && selectedCard !== 'Eventos' && selectedCard !== 'Recomendaciones' && selectedCard !== 'Clientes' && (
              <div className="bg-white rounded-lg shadow-sm p-6 flex items-center justify-center h-64">
                <p className="text-gray-400">Selecciona una opción para ver su configuración</p>
              </div>
            )}

            {selectedCard === 'Amenities' && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">{selectedCard}</h2>
                  <button
                    onClick={() => {
                      setIsCreatingAmenity(true)
                      setNewAmenityName('')
                    }}
                    className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-orange-600 to-orange-700 text-white shadow-md hover:shadow-lg transition-all duration-300 hover:scale-110 group relative"
                    title="Añadir Amenity"
                  >
                    <div className="relative flex items-center justify-center">
                      <Building2 className="w-5 h-5" />
                      <span className="absolute text-lg font-bold -bottom-1 -right-0.5 text-white drop-shadow-lg">+</span>
                    </div>
                    <span className="absolute bottom-full mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                      Añadir Amenity
                    </span>
                  </button>
                </div>

                {/* Search Section */}
                <div className="mb-6 flex gap-3">
                  <input
                    type="text"
                    placeholder="Buscar por nombre..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  <select
                    value={searchStatus}
                    onChange={(e) => setSearchStatus(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="all">Todos los estados</option>
                    <option value="activo">Activo</option>
                    <option value="inactivo">Inactivo</option>
                  </select>
                </div>

                <div className="space-y-3">
                  {isCreatingAmenity && (
                    <div className="flex items-center gap-4 p-4 border-2 border-orange-500 rounded-lg bg-orange-50">
                      <input
                        type="text"
                        placeholder="Nombre del amenity..."
                        value={newAmenityName}
                        onChange={(e) => setNewAmenityName(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSaveNewAmenity()}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        autoFocus
                      />
                      <button
                        onClick={handleSaveNewAmenity}
                        className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium"
                      >
                        Guardar
                      </button>
                      <button
                        onClick={() => {
                          setIsCreatingAmenity(false)
                          setNewAmenityName('')
                        }}
                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-medium"
                      >
                        Cancelar
                      </button>
                    </div>
                  )}
                  {filteredAmenities.map((amenity) => (
                    <div key={amenity.id}>
                      {editingAmenityId === amenity.id ? (
                        <div className="flex items-center gap-4 p-4 border-2 border-orange-500 rounded-lg bg-orange-50">
                          <input
                            type="text"
                            value={editingAmenityName}
                            onChange={(e) => setEditingAmenityName(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSaveAmenityEdit()}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                            autoFocus
                          />
                          <button
                            onClick={handleSaveAmenityEdit}
                            className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium"
                          >
                            Guardar
                          </button>
                          <button
                            onClick={handleCancelAmenityEdit}
                            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-medium"
                          >
                            Cancelar
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="text-lg font-semibold text-gray-900">{amenity.name}</h3>
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${amenity.active
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-gray-100 text-gray-800'
                                }`}>
                                {amenity.status}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            {/* Toggle Switch */}
                            <button
                              onClick={() => toggleAmenity(amenity.id)}
                              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${amenity.active ? 'bg-green-500' : 'bg-gray-300'
                                }`}
                            >
                              <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${amenity.active ? 'translate-x-6' : 'translate-x-1'
                                  }`}
                              />
                            </button>
                            {/* Edit Button */}
                            <button
                              onClick={() => handleEditAmenityStart(amenity.id, amenity.name)}
                              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            >
                              <Edit2 className="w-5 h-5" />
                            </button>
                            {/* Delete Button */}
                            <button
                              onClick={() => handleDeleteAmenityClick(amenity.id)}
                              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedCard === 'Personal' && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">{selectedCard}</h2>
                  <button
                    onClick={() => {
                      setIsCreatingShift(true)
                      setNewShiftName('')
                    }}
                    className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-pink-600 to-pink-700 text-white shadow-md hover:shadow-lg transition-all duration-300 hover:scale-110 group relative"
                    title="Añadir Turno"
                  >
                    <div className="relative flex items-center justify-center">
                      <Clock className="w-5 h-5" />
                      <span className="absolute text-lg font-bold -bottom-1 -right-0.5 text-white drop-shadow-lg">+</span>
                    </div>
                    <span className="absolute bottom-full mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                      Añadir Turno
                    </span>
                  </button>
                </div>

                {/* Search Section */}
                <div className="mb-6 flex gap-3">
                  <input
                    type="text"
                    placeholder="Buscar por nombre..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <select
                    value={searchStatus}
                    onChange={(e) => setSearchStatus(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="all">Todos los estados</option>
                    <option value="activo">Activo</option>
                    <option value="inactivo">Inactivo</option>
                  </select>
                </div>

                <div className="space-y-3">
                  {isCreatingShift && (
                    <div className="flex items-center gap-4 p-4 border-2 border-pink-500 rounded-lg bg-pink-50">
                      <input
                        type="text"
                        placeholder="Nombre del turno..."
                        value={newShiftName}
                        onChange={(e) => setNewShiftName(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSaveNewShift()}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                        autoFocus
                      />
                      <button
                        onClick={handleSaveNewShift}
                        className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors font-medium"
                      >
                        Guardar
                      </button>
                      <button
                        onClick={() => {
                          setIsCreatingShift(false)
                          setNewShiftName('')
                        }}
                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-medium"
                      >
                        Cancelar
                      </button>
                    </div>
                  )}
                  {filteredShifts.map((shift) => (
                    <div key={shift.id}>
                      {editingShiftId === shift.id ? (
                        <div className="flex items-center gap-4 p-4 border-2 border-pink-500 rounded-lg bg-pink-50">
                          <input
                            type="text"
                            value={editingShiftName}
                            onChange={(e) => setEditingShiftName(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSaveShiftEdit()}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                            autoFocus
                          />
                          <button
                            onClick={handleSaveShiftEdit}
                            className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors font-medium"
                          >
                            Guardar
                          </button>
                          <button
                            onClick={handleCancelShiftEdit}
                            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-medium"
                          >
                            Cancelar
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="text-lg font-semibold text-gray-900">{shift.name}</h3>
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${shift.active
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-gray-100 text-gray-800'
                                }`}>
                                {shift.status}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600">{shift.description}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            {/* Toggle Switch */}
                            <button
                              onClick={() => toggleShift(shift.id)}
                              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${shift.active ? 'bg-green-500' : 'bg-gray-300'
                                }`}
                            >
                              <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${shift.active ? 'translate-x-6' : 'translate-x-1'
                                  }`}
                              />
                            </button>
                            {/* Edit Button */}
                            <button
                              onClick={() => handleEditShiftStart(shift.id, shift.name)}
                              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            >
                              <Edit2 className="w-5 h-5" />
                            </button>
                            {/* Delete Button */}
                            <button
                              onClick={() => handleDeleteShiftClick(shift.id)}
                              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedCard === 'Eventos' && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">{selectedCard}</h2>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setEventosTab('tipos')}
                      className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${eventosTab === 'tipos'
                          ? 'bg-red-600 text-white shadow-md'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                      Tipo
                    </button>
                    <button
                      onClick={() => setEventosTab('espacios')}
                      className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${eventosTab === 'espacios'
                          ? 'bg-red-600 text-white shadow-md'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                      Espacios
                    </button>
                  </div>
                  <button
                    onClick={() => {
                      if (eventosTab === 'tipos') {
                        setIsCreatingEventType(true)
                        setNewEventTypeName('')
                      } else {
                        setIsCreatingEventSpace(true)
                        setNewEventSpaceName('')
                      }
                    }}
                    className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-red-600 to-red-700 text-white shadow-md hover:shadow-lg transition-all duration-300 hover:scale-110 group relative"
                    title="Añadir"
                  >
                    <div className="relative flex items-center justify-center">
                      <Calendar className="w-5 h-5" />
                      <span className="absolute text-lg font-bold -bottom-1 -right-0.5 text-white drop-shadow-lg">+</span>
                    </div>
                    <span className="absolute bottom-full mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                      Añadir
                    </span>
                  </button>
                </div>

                {/* Search Section */}
                <div className="mb-6 flex gap-3">
                  <input
                    type="text"
                    placeholder="Buscar por nombre..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <select
                    value={searchStatus}
                    onChange={(e) => setSearchStatus(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="all">Todos los estados</option>
                    <option value="activo">Activo</option>
                    <option value="inactivo">Inactivo</option>
                  </select>
                </div>

                {/* TIPOS TAB */}
                {eventosTab === 'tipos' && (
                  <div className="space-y-3">
                    {isCreatingEventType && (
                      <div className="flex items-center gap-4 p-4 border-2 border-red-500 rounded-lg bg-red-50">
                        <input
                          type="text"
                          placeholder="Nombre del tipo de evento..."
                          value={newEventTypeName}
                          onChange={(e) => setNewEventTypeName(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleSaveNewEventType()}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                          autoFocus
                        />
                        <button
                          onClick={handleSaveNewEventType}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                        >
                          Guardar
                        </button>
                        <button
                          onClick={() => {
                            setIsCreatingEventType(false)
                            setNewEventTypeName('')
                          }}
                          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-medium"
                        >
                          Cancelar
                        </button>
                      </div>
                    )}
                    {filteredEventTypes.map((eventType) => (
                      <div key={eventType.id}>
                        {editingEventTypeId === eventType.id ? (
                          <div className="flex items-center gap-4 p-4 border-2 border-red-500 rounded-lg bg-red-50">
                            <input
                              type="text"
                              value={editingEventTypeName}
                              onChange={(e) => setEditingEventTypeName(e.target.value)}
                              onKeyPress={(e) => e.key === 'Enter' && handleSaveEventTypeEdit()}
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                              autoFocus
                            />
                            <button
                              onClick={handleSaveEventTypeEdit}
                              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                            >
                              Guardar
                            </button>
                            <button
                              onClick={handleCancelEventTypeEdit}
                              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-medium"
                            >
                              Cancelar
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className="text-lg font-semibold text-gray-900">{eventType.name}</h3>
                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${eventType.active
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-gray-100 text-gray-800'
                                  }`}>
                                  {eventType.status}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              {/* Toggle Switch */}
                              <button
                                onClick={() => toggleEventType(eventType.id)}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${eventType.active ? 'bg-green-500' : 'bg-gray-300'
                                  }`}
                              >
                                <span
                                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${eventType.active ? 'translate-x-6' : 'translate-x-1'
                                    }`}
                                />
                              </button>
                              {/* Edit Button */}
                              <button
                                onClick={() => handleEditEventTypeStart(eventType.id, eventType.name)}
                                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              >
                                <Edit2 className="w-5 h-5" />
                              </button>
                              {/* Delete Button */}
                              <button
                                onClick={() => handleDeleteEventTypeClick(eventType.id)}
                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* ESPACIOS TAB */}
                {eventosTab === 'espacios' && (
                  <div className="space-y-3">
                    {isCreatingEventSpace && (
                      <div className="flex items-center gap-4 p-4 border-2 border-red-500 rounded-lg bg-red-50">
                        <input
                          type="text"
                          placeholder="Nombre del espacio..."
                          value={newEventSpaceName}
                          onChange={(e) => setNewEventSpaceName(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleSaveNewEventSpace()}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                          autoFocus
                        />
                        <button
                          onClick={handleSaveNewEventSpace}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                        >
                          Guardar
                        </button>
                        <button
                          onClick={() => {
                            setIsCreatingEventSpace(false)
                            setNewEventSpaceName('')
                          }}
                          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-medium"
                        >
                          Cancelar
                        </button>
                      </div>
                    )}
                    {filteredEventSpaces.map((eventSpace) => (
                      <div key={eventSpace.id}>
                        {editingEventSpaceId === eventSpace.id ? (
                          <div className="flex items-center gap-4 p-4 border-2 border-red-500 rounded-lg bg-red-50">
                            <input
                              type="text"
                              value={editingEventSpaceName}
                              onChange={(e) => setEditingEventSpaceName(e.target.value)}
                              onKeyPress={(e) => e.key === 'Enter' && handleSaveEventSpaceEdit()}
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                              autoFocus
                            />
                            <button
                              onClick={handleSaveEventSpaceEdit}
                              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                            >
                              Guardar
                            </button>
                            <button
                              onClick={handleCancelEventSpaceEdit}
                              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-medium"
                            >
                              Cancelar
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className="text-lg font-semibold text-gray-900">{eventSpace.name}</h3>
                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${eventSpace.active
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-gray-100 text-gray-800'
                                  }`}>
                                  {eventSpace.status}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              {/* Toggle Switch */}
                              <button
                                onClick={() => toggleEventSpace(eventSpace.id)}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${eventSpace.active ? 'bg-green-500' : 'bg-gray-300'
                                  }`}
                              >
                                <span
                                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${eventSpace.active ? 'translate-x-6' : 'translate-x-1'
                                    }`}
                                />
                              </button>
                              {/* Edit Button */}
                              <button
                                onClick={() => handleEditEventSpaceStart(eventSpace.id, eventSpace.name)}
                                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              >
                                <Edit2 className="w-5 h-5" />
                              </button>
                              {/* Delete Button */}
                              <button
                                onClick={() => handleDeleteEventSpaceClick(eventSpace.id)}
                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {selectedCard === 'Habitaciones' && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">{selectedCard}</h2>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setHabitacionesTab('tipos')}
                      className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${habitacionesTab === 'tipos'
                          ? 'bg-indigo-600 text-white shadow-md'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                      Tipo
                    </button>
                    <button
                      onClick={() => setHabitacionesTab('pisos')}
                      className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${habitacionesTab === 'pisos'
                          ? 'bg-indigo-600 text-white shadow-md'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                      Piso/Sector
                    </button>
                  </div>
                  <button
                    onClick={() => {
                      if (habitacionesTab === 'tipos') {
                        setIsCreatingRoom(true)
                        setNewRoomName('')
                      } else {
                        setIsCreatingFloor(true)
                        setNewFloorName('')
                      }
                    }}
                    className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-indigo-600 to-indigo-700 text-white shadow-md hover:shadow-lg transition-all duration-300 hover:scale-110 group relative"
                    title="Añadir"
                  >
                    <div className="relative flex items-center justify-center">
                      <Hotel className="w-5 h-5" />
                      <span className="absolute text-lg font-bold -bottom-1 -right-0.5 text-white drop-shadow-lg">+</span>
                    </div>
                    <span className="absolute bottom-full mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                      Añadir
                    </span>
                  </button>
                </div>

                {/* Search Section */}
                <div className="mb-6 flex gap-3">
                  <input
                    type="text"
                    placeholder="Buscar por nombre..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <select
                    value={searchStatus}
                    onChange={(e) => setSearchStatus(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="all">Todos los estados</option>
                    <option value="activo">Activo</option>
                    <option value="inactivo">Inactivo</option>
                  </select>
                </div>

                {/* TIPOS TAB */}
                {habitacionesTab === 'tipos' && (
                  <div className="space-y-3">
                    {isCreatingRoom && (
                      <div className="flex items-center gap-4 p-4 border-2 border-indigo-500 rounded-lg bg-indigo-50">
                        <input
                          type="text"
                          placeholder="Nombre del tipo de habitación..."
                          value={newRoomName}
                          onChange={(e) => setNewRoomName(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleSaveNewRoomType()}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          autoFocus
                        />
                        <button
                          onClick={handleSaveNewRoomType}
                          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                        >
                          Guardar
                        </button>
                        <button
                          onClick={() => {
                            setIsCreatingRoom(false)
                            setNewRoomName('')
                          }}
                          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-medium"
                        >
                          Cancelar
                        </button>
                      </div>
                    )}
                    {filteredRoomTypes.map((room) => (
                      <div key={room.id}>
                        {editingRoomId === room.id ? (
                          <div className="flex items-center gap-4 p-4 border-2 border-indigo-500 rounded-lg bg-indigo-50">
                            <input
                              type="text"
                              value={editingRoomName}
                              onChange={(e) => setEditingRoomName(e.target.value)}
                              onKeyPress={(e) => e.key === 'Enter' && handleSaveRoomEdit()}
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                              autoFocus
                            />
                            <button
                              onClick={handleSaveRoomEdit}
                              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                            >
                              Guardar
                            </button>
                            <button
                              onClick={handleCancelRoomEdit}
                              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-medium"
                            >
                              Cancelar
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className="text-lg font-semibold text-gray-900">{room.name}</h3>
                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${room.active
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-gray-100 text-gray-800'
                                  }`}>
                                  {room.status}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              {/* Toggle Switch */}
                              <button
                                onClick={() => toggleRoomType(room.id)}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${room.active ? 'bg-green-500' : 'bg-gray-300'
                                  }`}
                              >
                                <span
                                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${room.active ? 'translate-x-6' : 'translate-x-1'
                                    }`}
                                />
                              </button>
                              {/* Edit Button */}
                              <button
                                onClick={() => handleEditRoomStart(room.id, room.name)}
                                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              >
                                <Edit2 className="w-5 h-5" />
                              </button>
                              {/* Delete Button */}
                              <button
                                onClick={() => handleDeleteRoomClick(room.id)}
                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* PISOS TAB */}
                {habitacionesTab === 'pisos' && (
                  <div className="space-y-3">
                    {isCreatingFloor && (
                      <div className="flex items-center gap-4 p-4 border-2 border-indigo-500 rounded-lg bg-indigo-50">
                        <input
                          type="text"
                          placeholder="Nombre del piso/sector..."
                          value={newFloorName}
                          onChange={(e) => setNewFloorName(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleSaveNewFloor()}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          autoFocus
                        />
                        <button
                          onClick={handleSaveNewFloor}
                          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                        >
                          Guardar
                        </button>
                        <button
                          onClick={() => {
                            setIsCreatingFloor(false)
                            setNewFloorName('')
                          }}
                          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-medium"
                        >
                          Cancelar
                        </button>
                      </div>
                    )}
                    {filteredFloors.map((floor) => (
                      <div key={floor.id}>
                        {editingFloorId === floor.id ? (
                          <div className="flex items-center gap-4 p-4 border-2 border-indigo-500 rounded-lg bg-indigo-50">
                            <input
                              type="text"
                              value={editingFloorName}
                              onChange={(e) => setEditingFloorName(e.target.value)}
                              onKeyPress={(e) => e.key === 'Enter' && handleSaveFloorEdit()}
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                              autoFocus
                            />
                            <button
                              onClick={handleSaveFloorEdit}
                              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                            >
                              Guardar
                            </button>
                            <button
                              onClick={handleCancelFloorEdit}
                              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-medium"
                            >
                              Cancelar
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className="text-lg font-semibold text-gray-900">{floor.name}</h3>
                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${floor.active
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-gray-100 text-gray-800'
                                  }`}>
                                  {floor.status}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              {/* Toggle Switch */}
                              <button
                                onClick={() => toggleFloor(floor.id)}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${floor.active ? 'bg-green-500' : 'bg-gray-300'
                                  }`}
                              >
                                <span
                                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${floor.active ? 'translate-x-6' : 'translate-x-1'
                                    }`}
                                />
                              </button>
                              {/* Edit Button */}
                              <button
                                onClick={() => handleEditFloorStart(floor.id, floor.name)}
                                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              >
                                <Edit2 className="w-5 h-5" />
                              </button>
                              {/* Delete Button */}
                              <button
                                onClick={() => handleDeleteFloorClick(floor.id)}
                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Delete Confirmation Modal */}
            {deletingId !== null && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm mx-4">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Confirmar eliminación</h3>
                  <p className="text-gray-600 mb-4">
                    ¿Está seguro de que desea eliminar el siguiente departamento?
                  </p>

                  {deletingId && departments.find(d => d.id === deletingId) && (
                    <div className="bg-gray-50 rounded-lg p-4 mb-6">
                      <div className="space-y-2">
                        <p className="text-sm text-gray-600">
                          <span className="font-semibold">Nombre:</span> {departments.find(d => d.id === deletingId)?.name}
                        </p>
                        <p className="text-sm text-gray-600">
                          <span className="font-semibold">Estado:</span>
                          <span className={`ml-2 px-2 py-0.5 text-xs font-medium rounded-full ${departments.find(d => d.id === deletingId)?.active
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                            }`}>
                            {departments.find(d => d.id === deletingId)?.status}
                          </span>
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-3 justify-end">
                    <button
                      onClick={() => setDeletingId(null)}
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-medium"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={() => deletingId && deleteDepartment(deletingId)}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Delete Confirmation Modal for Amenities */}
            {deletingAmenityId !== null && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm mx-4">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Confirmar eliminación</h3>
                  <p className="text-gray-600 mb-4">
                    ¿Está seguro de que desea eliminar el siguiente amenity?
                  </p>

                  {deletingAmenityId && amenities.find(a => a.id === deletingAmenityId) && (
                    <div className="bg-gray-50 rounded-lg p-4 mb-6">
                      <div className="space-y-2">
                        <p className="text-sm text-gray-600">
                          <span className="font-semibold">Nombre:</span> {amenities.find(a => a.id === deletingAmenityId)?.name}
                        </p>
                        <p className="text-sm text-gray-600">
                          <span className="font-semibold">Estado:</span>
                          <span className={`ml-2 px-2 py-0.5 text-xs font-medium rounded-full ${amenities.find(a => a.id === deletingAmenityId)?.active
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                            }`}>
                            {amenities.find(a => a.id === deletingAmenityId)?.status}
                          </span>
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-3 justify-end">
                    <button
                      onClick={() => setDeletingAmenityId(null)}
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-medium"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={() => deletingAmenityId && deleteAmenity(deletingAmenityId)}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Delete Confirmation Modal for Room Types */}
            {deletingRoomId !== null && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm mx-4">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Confirmar eliminación</h3>
                  <p className="text-gray-600 mb-4">
                    ¿Está seguro de que desea eliminar el siguiente tipo de habitación?
                  </p>

                  {deletingRoomId && roomTypes.find(r => r.id === deletingRoomId) && (
                    <div className="bg-gray-50 rounded-lg p-4 mb-6">
                      <div className="space-y-2">
                        <p className="text-sm text-gray-600">
                          <span className="font-semibold">Nombre:</span> {roomTypes.find(r => r.id === deletingRoomId)?.name}
                        </p>
                        <p className="text-sm text-gray-600">
                          <span className="font-semibold">Estado:</span>
                          <span className={`ml-2 px-2 py-0.5 text-xs font-medium rounded-full ${roomTypes.find(r => r.id === deletingRoomId)?.active
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                            }`}>
                            {roomTypes.find(r => r.id === deletingRoomId)?.status}
                          </span>
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-3 justify-end">
                    <button
                      onClick={() => setDeletingRoomId(null)}
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-medium"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={() => deletingRoomId && deleteRoomType(deletingRoomId)}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Delete Confirmation Modal for Floors */}
            {deletingFloorId !== null && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm mx-4">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Confirmar eliminación</h3>
                  <p className="text-gray-600 mb-4">
                    ¿Está seguro de que desea eliminar el siguiente piso/sector?
                  </p>

                  {deletingFloorId && floors.find(f => f.id === deletingFloorId) && (
                    <div className="bg-gray-50 rounded-lg p-4 mb-6">
                      <div className="space-y-2">
                        <p className="text-sm text-gray-600">
                          <span className="font-semibold">Nombre:</span> {floors.find(f => f.id === deletingFloorId)?.name}
                        </p>
                        <p className="text-sm text-gray-600">
                          <span className="font-semibold">Estado:</span>
                          <span className={`ml-2 px-2 py-0.5 text-xs font-medium rounded-full ${floors.find(f => f.id === deletingFloorId)?.active
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                            }`}>
                            {floors.find(f => f.id === deletingFloorId)?.status}
                          </span>
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-3 justify-end">
                    <button
                      onClick={() => setDeletingFloorId(null)}
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-medium"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={() => deletingFloorId && deleteFloor(deletingFloorId)}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Delete Confirmation Modal for Shifts */}
            {deletingShiftId !== null && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm mx-4">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Confirmar eliminación</h3>
                  <p className="text-gray-600 mb-4">
                    ¿Está seguro de que desea eliminar el siguiente turno?
                  </p>

                  {deletingShiftId && shifts.find(s => s.id === deletingShiftId) && (
                    <div className="bg-gray-50 rounded-lg p-4 mb-6">
                      <div className="space-y-2">
                        <p className="text-sm text-gray-600">
                          <span className="font-semibold">Nombre:</span> {shifts.find(s => s.id === deletingShiftId)?.name}
                        </p>
                        <p className="text-sm text-gray-600">
                          <span className="font-semibold">Horario:</span> {shifts.find(s => s.id === deletingShiftId)?.description}
                        </p>
                        <p className="text-sm text-gray-600">
                          <span className="font-semibold">Estado:</span>
                          <span className={`ml-2 px-2 py-0.5 text-xs font-medium rounded-full ${shifts.find(s => s.id === deletingShiftId)?.active
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                            }`}>
                            {shifts.find(s => s.id === deletingShiftId)?.status}
                          </span>
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-3 justify-end">
                    <button
                      onClick={() => setDeletingShiftId(null)}
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-medium"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={() => deletingShiftId && deleteShift(deletingShiftId)}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Delete Confirmation Modal for Event Types */}
            {deletingEventTypeId !== null && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm mx-4">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Confirmar eliminación</h3>
                  <p className="text-gray-600 mb-4">
                    ¿Está seguro de que desea eliminar el siguiente tipo de evento?
                  </p>

                  {deletingEventTypeId && eventTypes.find(e => e.id === deletingEventTypeId) && (
                    <div className="bg-gray-50 rounded-lg p-4 mb-6">
                      <div className="space-y-2">
                        <p className="text-sm text-gray-600">
                          <span className="font-semibold">Nombre:</span> {eventTypes.find(e => e.id === deletingEventTypeId)?.name}
                        </p>
                        <p className="text-sm text-gray-600">
                          <span className="font-semibold">Estado:</span>
                          <span className={`ml-2 px-2 py-0.5 text-xs font-medium rounded-full ${eventTypes.find(e => e.id === deletingEventTypeId)?.active
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                            }`}>
                            {eventTypes.find(e => e.id === deletingEventTypeId)?.status}
                          </span>
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-3 justify-end">
                    <button
                      onClick={() => setDeletingEventTypeId(null)}
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-medium"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={() => deletingEventTypeId && deleteEventType(deletingEventTypeId)}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Delete Confirmation Modal for Event Spaces */}
            {deletingEventSpaceId !== null && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm mx-4">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Confirmar eliminación</h3>
                  <p className="text-gray-600 mb-4">
                    ¿Está seguro de que desea eliminar el siguiente espacio?
                  </p>

                  {deletingEventSpaceId && eventSpaces.find(e => e.id === deletingEventSpaceId) && (
                    <div className="bg-gray-50 rounded-lg p-4 mb-6">
                      <div className="space-y-2">
                        <p className="text-sm text-gray-600">
                          <span className="font-semibold">Nombre:</span> {eventSpaces.find(e => e.id === deletingEventSpaceId)?.name}
                        </p>
                        <p className="text-sm text-gray-600">
                          <span className="font-semibold">Estado:</span>
                          <span className={`ml-2 px-2 py-0.5 text-xs font-medium rounded-full ${eventSpaces.find(e => e.id === deletingEventSpaceId)?.active
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                            }`}>
                            {eventSpaces.find(e => e.id === deletingEventSpaceId)?.status}
                          </span>
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-3 justify-end">
                    <button
                      onClick={() => setDeletingEventSpaceId(null)}
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-medium"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={() => deletingEventSpaceId && deleteEventSpace(deletingEventSpaceId)}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            )}

            {selectedCard === 'Recomendaciones' && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">{selectedCard}</h2>
                  <button
                    onClick={() => {
                      setIsCreatingRecommendation(true)
                      setNewRecommendationName('')
                    }}
                    className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-green-600 to-green-700 text-white shadow-md hover:shadow-lg transition-all duration-300 hover:scale-110 group relative"
                    title="Añadir Categoría"
                  >
                    <div className="relative flex items-center justify-center">
                      <Compass className="w-5 h-5" />
                      <span className="absolute text-lg font-bold -bottom-1 -right-0.5 text-white drop-shadow-lg">+</span>
                    </div>
                    <span className="absolute bottom-full mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                      Añadir Categoría
                    </span>
                  </button>
                </div>

                {/* Search Section */}
                <div className="mb-6 flex gap-3">
                  <input
                    type="text"
                    placeholder="Buscar por nombre..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <select
                    value={searchStatus}
                    onChange={(e) => setSearchStatus(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="all">Todos los estados</option>
                    <option value="activo">Activo</option>
                    <option value="inactivo">Inactivo</option>
                  </select>
                </div>

                <div className="space-y-3">
                  {isCreatingRecommendation && (
                    <div className="flex items-center gap-4 p-4 border-2 border-green-500 rounded-lg bg-green-50">
                      <input
                        type="text"
                        placeholder="Nombre de la categoría..."
                        value={newRecommendationName}
                        onChange={(e) => setNewRecommendationName(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSaveNewRecommendation()}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        autoFocus
                      />
                      <button
                        onClick={handleSaveNewRecommendation}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                      >
                        Guardar
                      </button>
                      <button
                        onClick={() => {
                          setIsCreatingRecommendation(false)
                          setNewRecommendationName('')
                        }}
                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-medium"
                      >
                        Cancelar
                      </button>
                    </div>
                  )}
                  {filteredRecommendations.map((recommendation) => (
                    <div key={recommendation.id}>
                      {editingRecommendationId === recommendation.id ? (
                        <div className="flex items-center gap-4 p-4 border-2 border-green-500 rounded-lg bg-green-50">
                          <input
                            type="text"
                            value={editingRecommendationName}
                            onChange={(e) => setEditingRecommendationName(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSaveRecommendationEdit()}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            autoFocus
                          />
                          <button
                            onClick={handleSaveRecommendationEdit}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                          >
                            Guardar
                          </button>
                          <button
                            onClick={handleCancelRecommendationEdit}
                            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-medium"
                          >
                            Cancelar
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="text-lg font-semibold text-gray-900">{recommendation.name}</h3>
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${recommendation.active
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-gray-100 text-gray-800'
                                }`}>
                                {recommendation.status}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            {/* Toggle Switch */}
                            <button
                              onClick={() => toggleRecommendation(recommendation.id)}
                              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${recommendation.active ? 'bg-green-500' : 'bg-gray-300'
                                }`}
                            >
                              <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${recommendation.active ? 'translate-x-6' : 'translate-x-1'
                                  }`}
                              />
                            </button>
                            {/* Edit Button */}
                            <button
                              onClick={() => handleEditRecommendationStart(recommendation.id, recommendation.name)}
                              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            >
                              <Edit2 className="w-5 h-5" />
                            </button>
                            {/* Delete Button */}
                            <button
                              onClick={() => handleDeleteRecommendationClick(recommendation.id)}
                              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Delete Confirmation Modal for Recommendations */}
            {deletingRecommendationId !== null && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm mx-4">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Confirmar eliminación</h3>
                  <p className="text-gray-600 mb-4">
                    ¿Está seguro de que desea eliminar la siguiente categoría?
                  </p>

                  {deletingRecommendationId && recommendationCategories.find(r => r.id === deletingRecommendationId) && (
                    <div className="bg-gray-50 rounded-lg p-4 mb-6">
                      <div className="space-y-2">
                        <p className="text-sm text-gray-600">
                          <span className="font-semibold">Nombre:</span> {recommendationCategories.find(r => r.id === deletingRecommendationId)?.name}
                        </p>
                        <p className="text-sm text-gray-600">
                          <span className="font-semibold">Estado:</span>
                          <span className={`ml-2 px-2 py-0.5 text-xs font-medium rounded-full ${recommendationCategories.find(r => r.id === deletingRecommendationId)?.active
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                            }`}>
                            {recommendationCategories.find(r => r.id === deletingRecommendationId)?.status}
                          </span>
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-3 justify-end">
                    <button
                      onClick={() => setDeletingRecommendationId(null)}
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-medium"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={() => deletingRecommendationId && deleteRecommendation(deletingRecommendationId)}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            )}

            {selectedCard === 'Clientes' && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                {/* Search Section */}
                <div className="mb-6 flex gap-3">
                  <input
                    type="text"
                    placeholder="Buscar por nombre..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                  />
                  <select
                    value={searchStatus}
                    onChange={(e) => setSearchStatus(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                  >
                    <option value="all">Todos los estados</option>
                    <option value="activo">Activo</option>
                    <option value="inactivo">Inactivo</option>
                  </select>
                </div>

                <div className="space-y-3">
                  {isCreatingClientCategory && (
                    <div className="flex items-center gap-4 p-4 border-2 border-violet-500 rounded-lg bg-violet-50">
                      <input
                        type="text"
                        placeholder="Nombre de la categoría..."
                        value={newClientCategoryName}
                        onChange={(e) => setNewClientCategoryName(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSaveNewClientCategory()}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                        autoFocus
                      />
                      <button
                        onClick={handleSaveNewClientCategory}
                        className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors font-medium"
                      >
                        Guardar
                      </button>
                      <button
                        onClick={() => {
                          setIsCreatingClientCategory(false)
                          setNewClientCategoryName('')
                        }}
                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-medium"
                      >
                        Cancelar
                      </button>
                    </div>
                  )}
                  {filteredClientCategories.map((category) => (
                    <div key={category.id}>
                      {editingClientCategoryId === category.id ? (
                        <div className="flex items-center gap-4 p-4 border-2 border-violet-500 rounded-lg bg-violet-50">
                          <input
                            type="text"
                            value={editingClientCategoryName}
                            onChange={(e) => setEditingClientCategoryName(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSaveClientCategoryEdit()}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                            autoFocus
                          />
                          <button
                            onClick={handleSaveClientCategoryEdit}
                            className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors font-medium"
                          >
                            Guardar
                          </button>
                          <button
                            onClick={handleCancelClientCategoryEdit}
                            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-medium"
                          >
                            Cancelar
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="text-lg font-semibold text-gray-900">{category.name}</h3>
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${category.active
                                  ? 'bg-violet-100 text-violet-800'
                                  : 'bg-gray-100 text-gray-800'
                                }`}>
                                {category.status}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            {/* Toggle Switch */}
                            <button
                              onClick={() => toggleClientCategory(category.id)}
                              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${category.active ? 'bg-violet-500' : 'bg-gray-300'
                                }`}
                            >
                              <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${category.active ? 'translate-x-6' : 'translate-x-1'
                                  }`}
                              />
                            </button>
                            {/* Edit Button */}
                            <button
                              onClick={() => handleEditClientCategoryStart(category.id, category.name)}
                              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            >
                              <Edit2 className="w-5 h-5" />
                            </button>
                            {/* Delete Button */}
                            <button
                              onClick={() => handleDeleteClientCategoryClick(category.id)}
                              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Delete Confirmation Modal for Client Categories */}
            {deletingClientCategoryId !== null && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm mx-4">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Confirmar eliminación</h3>
                  <p className="text-gray-600 mb-4">
                    ¿Está seguro de que desea eliminar la siguiente categoría?
                  </p>
                  {clientCategories.find(c => c.id === deletingClientCategoryId) && (
                    <div className="mb-6 p-4 bg-gray-100 rounded-lg">
                      <p className="text-gray-900 font-semibold mb-2">
                        {clientCategories.find(c => c.id === deletingClientCategoryId)?.name}
                      </p>
                      <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${clientCategories.find(c => c.id === deletingClientCategoryId)?.active
                          ? 'bg-violet-100 text-violet-800'
                          : 'bg-gray-100 text-gray-800'
                        }`}>
                        {clientCategories.find(c => c.id === deletingClientCategoryId)?.status}
                      </span>
                    </div>
                  )}

                  <div className="flex gap-3 justify-end">
                    <button
                      onClick={() => setDeletingClientCategoryId(null)}
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-medium"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={() => deletingClientCategoryId && deleteClientCategory(deletingClientCategoryId)}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
