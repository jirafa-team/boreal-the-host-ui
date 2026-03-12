'use client'

import { Calendar, Edit2, Trash2 } from 'lucide-react'
import type { SettingsViewProps } from '../types'

type Props = Pick<SettingsViewProps,
  | 'searchTerm' | 'setSearchTerm' | 'searchStatus' | 'setSearchStatus'
  | 'eventosTab' | 'setEventosTab'
  | 'filteredEventTypes' | 'eventTypes'
  | 'isCreatingEventType' | 'setIsCreatingEventType'
  | 'newEventTypeName' | 'setNewEventTypeName'
  | 'editingEventTypeId' | 'editingEventTypeName' | 'setEditingEventTypeName' | 'deletingEventTypeId'
  | 'toggleEventType' | 'deleteEventType' | 'handleDeleteEventTypeClick'
  | 'handleSaveNewEventType' | 'handleEditEventTypeStart' | 'handleSaveEventTypeEdit'
  | 'handleCancelEventTypeEdit' | 'setDeletingEventTypeId'
  | 'filteredEventSpaces' | 'eventSpaces'
  | 'isCreatingEventSpace' | 'setIsCreatingEventSpace'
  | 'newEventSpaceName' | 'setNewEventSpaceName'
  | 'editingEventSpaceId' | 'editingEventSpaceName' | 'setEditingEventSpaceName' | 'deletingEventSpaceId'
  | 'toggleEventSpace' | 'deleteEventSpace' | 'handleDeleteEventSpaceClick'
  | 'handleSaveNewEventSpace' | 'handleEditEventSpaceStart' | 'handleSaveEventSpaceEdit'
  | 'handleCancelEventSpaceEdit' | 'setDeletingEventSpaceId'
>

export function EventosSection({
  searchTerm, setSearchTerm, searchStatus, setSearchStatus,
  eventosTab, setEventosTab,
  filteredEventTypes, eventTypes,
  isCreatingEventType, setIsCreatingEventType,
  newEventTypeName, setNewEventTypeName,
  editingEventTypeId, editingEventTypeName, setEditingEventTypeName, deletingEventTypeId,
  toggleEventType, deleteEventType, handleDeleteEventTypeClick,
  handleSaveNewEventType, handleEditEventTypeStart, handleSaveEventTypeEdit,
  handleCancelEventTypeEdit, setDeletingEventTypeId,
  filteredEventSpaces, eventSpaces,
  isCreatingEventSpace, setIsCreatingEventSpace,
  newEventSpaceName, setNewEventSpaceName,
  editingEventSpaceId, editingEventSpaceName, setEditingEventSpaceName, deletingEventSpaceId,
  toggleEventSpace, deleteEventSpace, handleDeleteEventSpaceClick,
  handleSaveNewEventSpace, handleEditEventSpaceStart, handleSaveEventSpaceEdit,
  handleCancelEventSpaceEdit, setDeletingEventSpaceId,
}: Props) {
  return (
    <>
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Eventos</h2>
          <div className="flex gap-3">
            <button
              onClick={() => setEventosTab('tipos')}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${eventosTab === 'tipos' ? 'bg-red-600 text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              Tipo
            </button>
            <button
              onClick={() => setEventosTab('espacios')}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${eventosTab === 'espacios' ? 'bg-red-600 text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              Espacios
            </button>
          </div>
          <button
            onClick={() => {
              if (eventosTab === 'tipos') { setIsCreatingEventType(true); setNewEventTypeName('') }
              else { setIsCreatingEventSpace(true); setNewEventSpaceName('') }
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

        <div className="mb-6 flex gap-3">
          <input
            type="text"
            placeholder="Buscar por nombre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          <select
            value={searchStatus}
            onChange={(e) => setSearchStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="all">Todos los estados</option>
            <option value="activo">Activo</option>
            <option value="inactivo">Inactivo</option>
          </select>
        </div>

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
                <button onClick={handleSaveNewEventType} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium">Guardar</button>
                <button onClick={() => { setIsCreatingEventType(false); setNewEventTypeName('') }} className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-medium">Cancelar</button>
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
                    <button onClick={handleSaveEventTypeEdit} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium">Guardar</button>
                    <button onClick={handleCancelEventTypeEdit} className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-medium">Cancelar</button>
                  </div>
                ) : (
                  <div className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{eventType.name}</h3>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${eventType.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                          {eventType.status}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => toggleEventType(eventType.id)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${eventType.active ? 'bg-green-500' : 'bg-gray-300'}`}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${eventType.active ? 'translate-x-6' : 'translate-x-1'}`} />
                      </button>
                      <button onClick={() => handleEditEventTypeStart(eventType.id, eventType.name)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Edit2 className="w-5 h-5" />
                      </button>
                      <button onClick={() => handleDeleteEventTypeClick(eventType.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

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
                <button onClick={handleSaveNewEventSpace} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium">Guardar</button>
                <button onClick={() => { setIsCreatingEventSpace(false); setNewEventSpaceName('') }} className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-medium">Cancelar</button>
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
                    <button onClick={handleSaveEventSpaceEdit} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium">Guardar</button>
                    <button onClick={handleCancelEventSpaceEdit} className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-medium">Cancelar</button>
                  </div>
                ) : (
                  <div className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{eventSpace.name}</h3>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${eventSpace.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                          {eventSpace.status}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => toggleEventSpace(eventSpace.id)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${eventSpace.active ? 'bg-green-500' : 'bg-gray-300'}`}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${eventSpace.active ? 'translate-x-6' : 'translate-x-1'}`} />
                      </button>
                      <button onClick={() => handleEditEventSpaceStart(eventSpace.id, eventSpace.name)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Edit2 className="w-5 h-5" />
                      </button>
                      <button onClick={() => handleDeleteEventSpaceClick(eventSpace.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
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

      {deletingEventTypeId !== null && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm mx-4">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Confirmar eliminación</h3>
            <p className="text-gray-600 mb-4">¿Está seguro de que desea eliminar el siguiente tipo de evento?</p>
            {deletingEventTypeId && eventTypes.find(e => e.id === deletingEventTypeId) && (
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="space-y-2">
                  <p className="text-sm text-gray-600"><span className="font-semibold">Nombre:</span> {eventTypes.find(e => e.id === deletingEventTypeId)?.name}</p>
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold">Estado:</span>
                    <span className={`ml-2 px-2 py-0.5 text-xs font-medium rounded-full ${eventTypes.find(e => e.id === deletingEventTypeId)?.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {eventTypes.find(e => e.id === deletingEventTypeId)?.status}
                    </span>
                  </p>
                </div>
              </div>
            )}
            <div className="flex gap-3 justify-end">
              <button onClick={() => setDeletingEventTypeId(null)} className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-medium">Cancelar</button>
              <button onClick={() => deletingEventTypeId && deleteEventType(deletingEventTypeId)} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium">Eliminar</button>
            </div>
          </div>
        </div>
      )}

      {deletingEventSpaceId !== null && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm mx-4">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Confirmar eliminación</h3>
            <p className="text-gray-600 mb-4">¿Está seguro de que desea eliminar el siguiente espacio?</p>
            {deletingEventSpaceId && eventSpaces.find(e => e.id === deletingEventSpaceId) && (
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="space-y-2">
                  <p className="text-sm text-gray-600"><span className="font-semibold">Nombre:</span> {eventSpaces.find(e => e.id === deletingEventSpaceId)?.name}</p>
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold">Estado:</span>
                    <span className={`ml-2 px-2 py-0.5 text-xs font-medium rounded-full ${eventSpaces.find(e => e.id === deletingEventSpaceId)?.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {eventSpaces.find(e => e.id === deletingEventSpaceId)?.status}
                    </span>
                  </p>
                </div>
              </div>
            )}
            <div className="flex gap-3 justify-end">
              <button onClick={() => setDeletingEventSpaceId(null)} className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-medium">Cancelar</button>
              <button onClick={() => deletingEventSpaceId && deleteEventSpace(deletingEventSpaceId)} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium">Eliminar</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
