'use client'

import { Users, Edit2, Trash2 } from 'lucide-react'
import type { SettingsViewProps } from '../types'

type Props = Pick<SettingsViewProps,
  | 'searchTerm' | 'setSearchTerm' | 'searchStatus' | 'setSearchStatus'
  | 'filteredClientCategories' | 'clientCategories'
  | 'isCreatingClientCategory' | 'setIsCreatingClientCategory'
  | 'newClientCategoryName' | 'setNewClientCategoryName'
  | 'editingClientCategoryId' | 'editingClientCategoryName' | 'setEditingClientCategoryName' | 'deletingClientCategoryId'
  | 'toggleClientCategory' | 'deleteClientCategory' | 'handleDeleteClientCategoryClick'
  | 'handleSaveNewClientCategory' | 'handleEditClientCategoryStart' | 'handleSaveClientCategoryEdit'
  | 'handleCancelClientCategoryEdit' | 'setDeletingClientCategoryId'
>

export function ClientesSection({
  searchTerm, setSearchTerm, searchStatus, setSearchStatus,
  filteredClientCategories: filteredClientCategoriesProp,
  clientCategories: clientCategoriesProp,
  isCreatingClientCategory, setIsCreatingClientCategory,
  newClientCategoryName, setNewClientCategoryName,
  editingClientCategoryId, editingClientCategoryName, setEditingClientCategoryName, deletingClientCategoryId,
  toggleClientCategory, deleteClientCategory, handleDeleteClientCategoryClick,
  handleSaveNewClientCategory, handleEditClientCategoryStart, handleSaveClientCategoryEdit,
  handleCancelClientCategoryEdit, setDeletingClientCategoryId,
}: Props) {
  const clientCategories = clientCategoriesProp ?? []
  const filteredClientCategories = filteredClientCategoriesProp ?? []

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Clientes</h2>
          <button
            onClick={() => { setIsCreatingClientCategory?.(true); setNewClientCategoryName?.('') }}
            className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-violet-600 to-violet-700 text-white shadow-md hover:shadow-lg transition-all duration-300 hover:scale-110 group relative"
            title="Añadir Categoría"
          >
            <div className="relative flex items-center justify-center">
              <Users className="w-5 h-5" />
              <span className="absolute text-lg font-bold -bottom-1 -right-0.5 text-white drop-shadow-lg">+</span>
            </div>
            <span className="absolute bottom-full mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
              Añadir Categoría
            </span>
          </button>
        </div>

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
                onChange={(e) => setNewClientCategoryName?.(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSaveNewClientCategory?.()}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                autoFocus
              />
              <button onClick={() => handleSaveNewClientCategory?.()} className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors font-medium">Guardar</button>
              <button onClick={() => { setIsCreatingClientCategory?.(false); setNewClientCategoryName?.('') }} className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-medium">Cancelar</button>
            </div>
          )}
          {filteredClientCategories.map((category) => (
            <div key={category.id}>
              {editingClientCategoryId === category.id ? (
                <div className="flex items-center gap-4 p-4 border-2 border-violet-500 rounded-lg bg-violet-50">
                  <input
                    type="text"
                    value={editingClientCategoryName}
                    onChange={(e) => setEditingClientCategoryName?.(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSaveClientCategoryEdit?.()}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                    autoFocus
                  />
                  <button onClick={() => handleSaveClientCategoryEdit?.()} className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors font-medium">Guardar</button>
                  <button onClick={() => handleCancelClientCategoryEdit?.()} className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-medium">Cancelar</button>
                </div>
              ) : (
                <div className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{category.name}</h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${category.active ? 'bg-violet-100 text-violet-800' : 'bg-gray-100 text-gray-800'}`}>
                        {category.status}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggleClientCategory?.(category.id)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${category.active ? 'bg-violet-500' : 'bg-gray-300'}`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${category.active ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                    <button onClick={() => handleEditClientCategoryStart?.(category.id, category.name)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button onClick={() => handleDeleteClientCategoryClick?.(category.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {deletingClientCategoryId != undefined && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm mx-4">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Confirmar eliminación</h3>
            <p className="text-gray-600 mb-4">¿Está seguro de que desea eliminar la siguiente categoría?</p>
            {deletingClientCategoryId && clientCategories.find(c => c.id === deletingClientCategoryId) && (
              <div className="mb-6 p-4 bg-gray-100 rounded-lg">
                <p className="text-gray-900 font-semibold mb-2">
                  {clientCategories.find(c => c.id === deletingClientCategoryId)?.name}
                </p>
                <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${clientCategories.find(c => c.id === deletingClientCategoryId)?.active ? 'bg-violet-100 text-violet-800' : 'bg-gray-100 text-gray-800'}`}>
                  {clientCategories.find(c => c.id === deletingClientCategoryId)?.status}
                </span>
              </div>
            )}
            <div className="flex gap-3 justify-end">
              <button onClick={() => setDeletingClientCategoryId?.(null)} className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-medium">Cancelar</button>
              <button onClick={() => deletingClientCategoryId && deleteClientCategory?.(deletingClientCategoryId)} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium">Eliminar</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
