'use client'

import { useRouter } from 'next/navigation'
import { useLanguage } from '@/lib/i18n-context'
import { Users, ArrowRight, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

export default function SelectEstablishmentPage() {
  const router = useRouter()
  const { t } = useLanguage()
  const [searchTerm, setSearchTerm] = useState('')

  // Colores personalizados para cada establecimiento (degradados similares a las cards del home)
  const cardColors = [
    'linear-gradient(135deg, rgb(37, 99, 235), rgb(29, 78, 216))', // Azul
    'linear-gradient(135deg, rgb(34, 197, 94), rgb(22, 163, 74))', // Verde
    'linear-gradient(135deg, rgb(168, 85, 247), rgb(147, 51, 234))', // Púrpura
    'linear-gradient(135deg, rgb(239, 68, 68), rgb(220, 38, 38))', // Rojo
  ]

  // Mock data - en un proyecto real, esto vendría de una API
  const establishments = [
    {
      id: 1,
      name: 'Hotel Central',
      members: 24,
      image: '/images/hotel-room-balcony-with-city-view-and-comfortable.jpg',
      color: cardColors[0],
    },
    {
      id: 2,
      name: 'Resort Playa',
      members: 18,
      image: '/images/luxury-deluxe-hotel-room-with-king-bed-and-modern.jpg',
      color: cardColors[1],
    },
    {
      id: 3,
      name: 'Boutique Hotel',
      members: 12,
      image: '/images/hotel-interior-map-modern.jpg',
      color: cardColors[2],
    },
    {
      id: 4,
      name: 'Hotel Executive',
      members: 31,
      image: '/images/conference-room.jpg',
      color: cardColors[3],
    },
  ]

  // Filtrar establecimientos según el término de búsqueda
  const filteredEstablishments = establishments.filter((establishment) =>
    establishment.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleSelectEstablishment = (establishmentId: number) => {
    router.push('/admin/home')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      {/* Header - Centered */}
      <div className="max-w-4xl mx-auto mb-12 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Seleccionar Hospedaje
        </h1>
        <p className="text-gray-600 text-lg mb-8">
          Elige un establecimiento para continuar
        </p>

        {/* Search Bar */}
        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar establecimiento..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-200 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
          />
        </div>
      </div>

      {/* Establishments Grid */}
      <div className="max-w-7xl mx-auto">
        {filteredEstablishments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredEstablishments.map((establishment) => (
              <button
                key={establishment.id}
                onClick={() => handleSelectEstablishment(establishment.id)}
                className="group relative overflow-hidden rounded-lg bg-white shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 flex flex-col"
              >
                {/* Image Container */}
                <div className="relative h-40 overflow-hidden bg-gray-200">
                  <img
                    src={establishment.image || "/placeholder.svg"}
                    alt={establishment.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-colors duration-300" />
                </div>

                {/* Name Section with Color Background */}
                <div className="relative p-4 flex-1" style={{ background: establishment.color }}>
                  {/* Decorative Circle */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-white rounded-full -mr-8 -mt-8"></div>
                  </div>

                  {/* Content */}
                  <div className="relative">
                    <h3 className="text-base font-bold text-white mb-2">
                      {establishment.name}
                    </h3>
                    <div className="flex items-center gap-1 text-white/90 text-xs">
                      <Users className="w-4 h-4" />
                      <span>{establishment.members} {t('common.members') || 'miembros'}</span>
                    </div>
                  </div>
                </div>

                {/* Action Footer */}
                <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 group-hover:bg-gray-100 transition-colors duration-300">
                  <div className="flex items-center justify-between text-xs font-semibold text-gray-700 group-hover:text-gray-900 transition-colors">
                    <span>{t('common.access') || 'Acceder'}</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform duration-300" />
                  </div>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No se encontraron establecimientos que coincidan con "{searchTerm}"
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
