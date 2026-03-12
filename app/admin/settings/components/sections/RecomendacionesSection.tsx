'use client'

import { Compass, Edit2, Trash2 } from 'lucide-react'
import type { SettingsViewProps } from '../types'

type Props = Pick<SettingsViewProps,
  | 'searchTerm' | 'setSearchTerm' | 'searchStatus' | 'setSearchStatus'
  | 'filteredRecommendations' | 'recommendationCategories'
  | 'isCreatingRecommendation' | 'setIsCreatingRecommendation'
  | 'newRecommendationName' | 'setNewRecommendationName'
  | 'editingRecommendationId' | 'editingRecommendationName' | 'setEditingRecommendationName' | 'deletingRecommendationId'
  | 'toggleRecommendation' | 'deleteRecommendation' | 'handleDeleteRecommendationClick'
  | 'handleSaveNewRecommendation' | 'handleEditRecommendationStart' | 'handleSaveRecommendationEdit'
  | 'handleCancelRecommendationEdit' | 'setDeletingRecommendationId'
>

export function RecomendacionesSection({
  searchTerm, setSearchTerm, searchStatus, setSearchStatus,
  filteredRecommendations, recommendationCategories,
  isCreatingRecommendation, setIsCreatingRecommendation,
  newRecommendationName, setNewRecommendationName,
  editingRecommendationId, editingRecommendationName, setEditingRecommendationName, deletingRecommendationId,
  toggleRecommendation, deleteRecommendation, handleDeleteRecommendationClick,
  handleSaveNewRecommendation, handleEditRecommendationStart, handleSaveRecommendationEdit,
  handleCancelRecommendationEdit, setDeletingRecommendationId,
}: Props) {
  return (
    <>
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Recomendaciones</h2>
          <button
            onClick={() => { setIsCreatingRecommendation(true); setNewRecommendationName('') }}
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
              <button onClick={handleSaveNewRecommendation} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium">Guardar</button>
              <button onClick={() => { setIsCreatingRecommendation(false); setNewRecommendationName('') }} className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-medium">Cancelar</button>
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
                  <button onClick={handleSaveRecommendationEdit} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium">Guardar</button>
                  <button onClick={handleCancelRecommendationEdit} className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-medium">Cancelar</button>
                </div>
              ) : (
                <div className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{recommendation.name}</h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${recommendation.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {recommendation.status}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggleRecommendation(recommendation.id)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${recommendation.active ? 'bg-green-500' : 'bg-gray-300'}`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${recommendation.active ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                    <button onClick={() => handleEditRecommendationStart(recommendation.id, recommendation.name)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button onClick={() => handleDeleteRecommendationClick(recommendation.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {deletingRecommendationId !== null && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm mx-4">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Confirmar eliminación</h3>
            <p className="text-gray-600 mb-4">¿Está seguro de que desea eliminar la siguiente categoría?</p>
            {deletingRecommendationId && recommendationCategories.find(r => r.id === deletingRecommendationId) && (
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="space-y-2">
                  <p className="text-sm text-gray-600"><span className="font-semibold">Nombre:</span> {recommendationCategories.find(r => r.id === deletingRecommendationId)?.name}</p>
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold">Estado:</span>
                    <span className={`ml-2 px-2 py-0.5 text-xs font-medium rounded-full ${recommendationCategories.find(r => r.id === deletingRecommendationId)?.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {recommendationCategories.find(r => r.id === deletingRecommendationId)?.status}
                    </span>
                  </p>
                </div>
              </div>
            )}
            <div className="flex gap-3 justify-end">
              <button onClick={() => setDeletingRecommendationId(null)} className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-medium">Cancelar</button>
              <button onClick={() => deletingRecommendationId && deleteRecommendation(deletingRecommendationId)} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium">Eliminar</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
