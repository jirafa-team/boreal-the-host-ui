'use client'

import { Hotel, Edit2, Trash2 } from 'lucide-react'
import type { SettingsViewProps } from '../types'

type Props = Pick<SettingsViewProps,
  | 'searchTerm' | 'setSearchTerm' | 'searchStatus' | 'setSearchStatus'
  | 'habitacionesTab' | 'setHabitacionesTab'
  | 'filteredRoomTypes' | 'roomTypes'
  | 'isCreatingRoom' | 'setIsCreatingRoom'
  | 'newRoomName' | 'setNewRoomName'
  | 'editingRoomId' | 'editingRoomName' | 'setEditingRoomName' | 'deletingRoomId'
  | 'toggleRoomType' | 'deleteRoomType' | 'handleDeleteRoomClick'
  | 'handleSaveNewRoomType' | 'handleEditRoomStart' | 'handleSaveRoomEdit'
  | 'handleCancelRoomEdit' | 'setDeletingRoomId'
  | 'filteredFloors' | 'floors'
  | 'isCreatingFloor' | 'setIsCreatingFloor'
  | 'newFloorName' | 'setNewFloorName'
  | 'editingFloorId' | 'editingFloorName' | 'setEditingFloorName' | 'deletingFloorId'
  | 'toggleFloor' | 'deleteFloor' | 'handleDeleteFloorClick'
  | 'handleSaveNewFloor' | 'handleEditFloorStart' | 'handleSaveFloorEdit'
  | 'handleCancelFloorEdit' | 'setDeletingFloorId'
>

export function HabitacionesSection({
  searchTerm, setSearchTerm, searchStatus, setSearchStatus,
  habitacionesTab, setHabitacionesTab,
  filteredRoomTypes, roomTypes,
  isCreatingRoom, setIsCreatingRoom,
  newRoomName, setNewRoomName,
  editingRoomId, editingRoomName, setEditingRoomName, deletingRoomId,
  toggleRoomType, deleteRoomType, handleDeleteRoomClick,
  handleSaveNewRoomType, handleEditRoomStart, handleSaveRoomEdit,
  handleCancelRoomEdit, setDeletingRoomId,
  filteredFloors, floors,
  isCreatingFloor, setIsCreatingFloor,
  newFloorName, setNewFloorName,
  editingFloorId, editingFloorName, setEditingFloorName, deletingFloorId,
  toggleFloor, deleteFloor, handleDeleteFloorClick,
  handleSaveNewFloor, handleEditFloorStart, handleSaveFloorEdit,
  handleCancelFloorEdit, setDeletingFloorId,
}: Props) {
  return (
    <>
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Habitaciones</h2>
          <div className="flex gap-3">
            <button
              onClick={() => setHabitacionesTab('tipos')}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${habitacionesTab === 'tipos' ? 'bg-indigo-600 text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              Tipo
            </button>
            <button
              onClick={() => setHabitacionesTab('pisos')}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${habitacionesTab === 'pisos' ? 'bg-indigo-600 text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              Piso/Sector
            </button>
          </div>
          <button
            onClick={() => {
              if (habitacionesTab === 'tipos') { setIsCreatingRoom(true); setNewRoomName('') }
              else { setIsCreatingFloor(true); setNewFloorName('') }
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
                <button onClick={handleSaveNewRoomType} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium">Guardar</button>
                <button onClick={() => { setIsCreatingRoom(false); setNewRoomName('') }} className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-medium">Cancelar</button>
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
                    <button onClick={handleSaveRoomEdit} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium">Guardar</button>
                    <button onClick={handleCancelRoomEdit} className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-medium">Cancelar</button>
                  </div>
                ) : (
                  <div className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{room.name}</h3>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${room.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                          {room.status}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => toggleRoomType(room.id)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${room.active ? 'bg-green-500' : 'bg-gray-300'}`}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${room.active ? 'translate-x-6' : 'translate-x-1'}`} />
                      </button>
                      <button onClick={() => handleEditRoomStart(room.id, room.name)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Edit2 className="w-5 h-5" />
                      </button>
                      <button onClick={() => handleDeleteRoomClick(room.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

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
                <button onClick={handleSaveNewFloor} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium">Guardar</button>
                <button onClick={() => { setIsCreatingFloor(false); setNewFloorName('') }} className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-medium">Cancelar</button>
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
                    <button onClick={handleSaveFloorEdit} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium">Guardar</button>
                    <button onClick={handleCancelFloorEdit} className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-medium">Cancelar</button>
                  </div>
                ) : (
                  <div className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{floor.name}</h3>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${floor.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                          {floor.status}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => toggleFloor(floor.id)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${floor.active ? 'bg-green-500' : 'bg-gray-300'}`}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${floor.active ? 'translate-x-6' : 'translate-x-1'}`} />
                      </button>
                      <button onClick={() => handleEditFloorStart(floor.id, floor.name)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Edit2 className="w-5 h-5" />
                      </button>
                      <button onClick={() => handleDeleteFloorClick(floor.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
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

      {deletingRoomId !== null && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm mx-4">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Confirmar eliminación</h3>
            <p className="text-gray-600 mb-4">¿Está seguro de que desea eliminar el siguiente tipo de habitación?</p>
            {deletingRoomId && roomTypes.find(r => r.id === deletingRoomId) && (
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="space-y-2">
                  <p className="text-sm text-gray-600"><span className="font-semibold">Nombre:</span> {roomTypes.find(r => r.id === deletingRoomId)?.name}</p>
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold">Estado:</span>
                    <span className={`ml-2 px-2 py-0.5 text-xs font-medium rounded-full ${roomTypes.find(r => r.id === deletingRoomId)?.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {roomTypes.find(r => r.id === deletingRoomId)?.status}
                    </span>
                  </p>
                </div>
              </div>
            )}
            <div className="flex gap-3 justify-end">
              <button onClick={() => setDeletingRoomId(null)} className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-medium">Cancelar</button>
              <button onClick={() => deletingRoomId && deleteRoomType(deletingRoomId)} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium">Eliminar</button>
            </div>
          </div>
        </div>
      )}

      {deletingFloorId !== null && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm mx-4">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Confirmar eliminación</h3>
            <p className="text-gray-600 mb-4">¿Está seguro de que desea eliminar el siguiente piso/sector?</p>
            {deletingFloorId && floors.find(f => f.id === deletingFloorId) && (
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="space-y-2">
                  <p className="text-sm text-gray-600"><span className="font-semibold">Nombre:</span> {floors.find(f => f.id === deletingFloorId)?.name}</p>
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold">Estado:</span>
                    <span className={`ml-2 px-2 py-0.5 text-xs font-medium rounded-full ${floors.find(f => f.id === deletingFloorId)?.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {floors.find(f => f.id === deletingFloorId)?.status}
                    </span>
                  </p>
                </div>
              </div>
            )}
            <div className="flex gap-3 justify-end">
              <button onClick={() => setDeletingFloorId(null)} className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-medium">Cancelar</button>
              <button onClick={() => deletingFloorId && deleteFloor(deletingFloorId)} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium">Eliminar</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
