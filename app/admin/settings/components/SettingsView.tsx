'use client'

import { Hotel, Building2, Users, Sparkles } from 'lucide-react'
import type { SettingsViewProps } from './types'
import { DepartamentosSection } from './sections/DepartamentosSection'
import { AmenitiesSection } from './sections/AmenitiesSection'
import { HabitacionesSection } from './sections/HabitacionesSection'
import { PersonalSection } from './sections/PersonalSection'
import { EventosSection } from './sections/EventosSection'
import { RecomendacionesSection } from './sections/RecomendacionesSection'
import { ClientesSection } from './sections/ClientesSection'

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
  const { selectedCard, setSelectedCard } = props

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
                    className={`group relative overflow-hidden rounded-lg p-3 text-white shadow-md hover:shadow-lg transition-all duration-300 w-full text-left h-16 flex items-center justify-start ${isSelected ? 'scale-110 hover:scale-110' : 'opacity-50 hover:scale-105 hover:opacity-75'}`}
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
            {selectedCard === 'Departamentos' && <DepartamentosSection {...props} />}
            {selectedCard === 'Amenities' && <AmenitiesSection {...props} />}
            {selectedCard === 'Habitaciones' && <HabitacionesSection {...props} />}
            {selectedCard === 'Personal' && <PersonalSection {...props} />}
            {selectedCard === 'Eventos' && <EventosSection {...props} />}
            {selectedCard === 'Recomendaciones' && <RecomendacionesSection {...props} />}
            {selectedCard === 'Clientes' && <ClientesSection {...props} />}

            {!['Departamentos', 'Amenities', 'Habitaciones', 'Personal', 'Eventos', 'Recomendaciones', 'Clientes'].includes(selectedCard) && (
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
