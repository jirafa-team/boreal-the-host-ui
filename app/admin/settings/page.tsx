'use client'

import { useRouter } from 'next/navigation'
import { useLanguage } from '@/lib/i18n-context'
import {
  Hotel,
  Building2,
  Users,
  Sparkles,
  Calendar,
  Compass,
  ArrowRight,
  Trash2,
  Edit2,
} from 'lucide-react'
import { useState } from 'react'

const gradientColors: { [key: string]: string } = {
  'from-purple-600 to-purple-700': 'linear-gradient(135deg, rgb(147, 51, 234), rgb(126, 34, 206))',
  'from-indigo-600 to-indigo-700': 'linear-gradient(135deg, rgb(79, 70, 229), rgb(67, 56, 202))',
  'from-orange-600 to-orange-700': 'linear-gradient(135deg, rgb(234, 88, 12), rgb(194, 65, 12))',
  'from-pink-600 to-pink-700': 'linear-gradient(135deg, rgb(236, 72, 153), rgb(219, 39, 119))',
  'from-red-600 to-red-700': 'linear-gradient(135deg, rgb(220, 38, 38), rgb(185, 28, 28))',
  'from-yellow-600 to-yellow-700': 'linear-gradient(135deg, rgb(202, 138, 4), rgb(161, 98, 7))',
}

export default function SettingsPage() {
  const router = useRouter()
  const { t } = useLanguage()
  const [selectedCard, setSelectedCard] = useState('Departamentos')
  const [searchTerm, setSearchTerm] = useState('')
  const [searchStatus, setSearchStatus] = useState('all')
  const [isCreating, setIsCreating] = useState(false)
  const [newDeptName, setNewDeptName] = useState('')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editingName, setEditingName] = useState('')
  const [departments, setDepartments] = useState([
    { id: 1, name: 'Limpieza', description: 'Departamento de limpieza y mantenimiento de espacios', status: 'Activo', active: true },
    { id: 2, name: 'Mantenimiento', description: 'Departamento de reparación y mantenimiento técnico', status: 'Activo', active: true },
    { id: 3, name: 'Seguridad', description: 'Departamento de seguridad y vigilancia', status: 'Inactivo', active: false },
    { id: 4, name: 'Recepción', description: 'Departamento de recepción y administración', status: 'Activo', active: true },
    { id: 5, name: 'Servicio', description: 'Departamento de servicios al huésped', status: 'Activo', active: true },
  ])

  const toggleDepartment = (id: number) => {
    setDepartments(departments.map(dept =>
      dept.id === id ? { ...dept, active: !dept.active, status: !dept.active ? 'Activo' : 'Inactivo' } : dept
    ))
  }

  const deleteDepartment = (id: number) => {
    setDepartments(departments.filter(dept => dept.id !== id))
  }

  const handleSaveNewDepartment = () => {
    if (newDeptName.trim()) {
      const newId = Math.max(...departments.map(d => d.id), 0) + 1
      setDepartments([{
        id: newId,
        name: newDeptName,
        description: 'Descripción del nuevo departamento',
        status: 'Activo',
        active: true
      }, ...departments])
      setNewDeptName('')
      setIsCreating(false)
    }
  }

  const handleEditStart = (id: number, name: string) => {
    setEditingId(id)
    setEditingName(name)
  }

  const handleSaveEdit = () => {
    if (editingName.trim() && editingId !== null) {
      setDepartments(departments.map(dept =>
        dept.id === editingId ? { ...dept, name: editingName } : dept
      ))
      setEditingId(null)
      setEditingName('')
    }
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditingName('')
  }

  const filteredDepartments = departments.filter(dept => {
    const matchesSearch = dept.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = searchStatus === 'all' || (searchStatus === 'activo' ? dept.active : !dept.active)
    return matchesSearch && matchesStatus
  })

  const settingsCards = [
    {
      label: 'Departamentos',
      icon: Hotel,
      color: 'from-purple-600 to-purple-700',
    },
    {
      label: 'Amenities',
      icon: Building2,
      color: 'from-orange-600 to-orange-700',
    },
    {
      label: 'Habitaciones',
      icon: Hotel,
      color: 'from-indigo-600 to-indigo-700',
    },
    {
      label: 'Personal',
      icon: Sparkles,
      color: 'from-pink-600 to-pink-700',
    },
    {
      label: 'Eventos',
      icon: Calendar,
      color: 'from-red-600 to-red-700',
    },
    {
      label: 'Recomendaciones',
      icon: Compass,
      color: 'from-yellow-600 to-yellow-700',
    },
  ]

  const departmentsData = [
    { id: 1, name: 'Limpieza', description: 'Departamento de limpieza y mantenimiento de espacios', status: 'Activo', active: true },
    { id: 2, name: 'Mantenimiento', description: 'Departamento de reparación y mantenimiento técnico', status: 'Activo', active: true },
    { id: 3, name: 'Seguridad', description: 'Departamento de seguridad y vigilancia', status: 'Inactivo', active: false },
    { id: 4, name: 'Recepción', description: 'Departamento de recepción y administración', status: 'Activo', active: true },
    { id: 5, name: 'Servicio', description: 'Departamento de servicios al huésped', status: 'Activo', active: true },
  ]

  return (
    <div className="flex-1 overflow-auto bg-gray-50">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Configuración</h1>
          <p className="text-gray-600 mt-1">Personaliza valores del sistema</p>
        </div>

        {/* Main Layout: Left Sidebar + Right Content */}
        <div className="flex gap-24">
          {/* Left Column: Settings Cards */}
          <div className="max-w-[240px]">
            <div className="space-y-3">
              {settingsCards.map((card) => {
                const Icon = card.icon
                const isSelected = selectedCard === card.label
                return (
                  <button
                    key={card.label}
                    onClick={() => setSelectedCard(card.label)}
                    className={`group relative overflow-hidden rounded-lg p-3 text-white shadow-md hover:shadow-lg transition-all duration-300 w-full text-left h-16 flex items-center justify-start ${
                      isSelected
                        ? 'scale-110 hover:scale-110'
                        : 'opacity-50 hover:scale-105 hover:opacity-75'
                    }`}
                    style={{
                      background: gradientColors[card.color],
                    }}
                  >
                    <div className="absolute inset-0 opacity-10">
                      <div className="absolute top-0 right-0 w-20 h-20 bg-white rounded-full -mr-8 -mt-8"></div>
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

          {/* Right Column: Content Area */}
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
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                department.active
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}>
                                {department.status}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            {/* Edit Button */}
                            <button
                              onClick={() => handleEditStart(department.id, department.name)}
                              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            >
                              <Edit2 className="w-5 h-5" />
                            </button>
                            {/* Toggle Switch */}
                            <button
                              onClick={() => toggleDepartment(department.id)}
                              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                department.active ? 'bg-green-500' : 'bg-gray-300'
                              }`}
                            >
                              <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                  department.active ? 'translate-x-6' : 'translate-x-1'
                                }`}
                              />
                            </button>
                            {/* Delete Button */}
                            <button
                              onClick={() => deleteDepartment(department.id)}
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

            {selectedCard !== 'Departamentos' && (
              <div className="bg-white rounded-lg shadow-sm p-6 flex items-center justify-center h-64">
                <p className="text-gray-400">Selecciona una opción para ver su configuración</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
