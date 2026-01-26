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

  // Mock data - en un proyecto real, esto vendría de una API
  const establishments = [
    {
      id: 1,
      name: 'Hotel Central',
      members: 24,
      image: '/images/hotel-room-balcony-with-city-view-and-comfortable.jpg',
    },
    {
      id: 2,
      name: 'Resort Playa',
      members: 18,
      image: '/images/luxury-deluxe-hotel-room-with-king-bed-and-modern.jpg',
    },
    {
      id: 3,
      name: 'Boutique Hotel',
      members: 12,
      image: '/images/hotel-interior-map-modern.jpg',
    },
    {
      id: 4,
      name: 'Hotel Executive',
      members: 31,
      image: '/images/conference-room.jpg',
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
                className="group relative overflow-hidden rounded-2xl bg-white shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
              >
                {/* Image Container */}
                <div className="relative h-48 overflow-hidden bg-gradient-to-br from-cyan-400 to-blue-500">
                  <img
                    src={establishment.image || "/placeholder.svg"}
                    alt={establishment.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300" />
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                  {/* Name */}
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-cyan-600 group-hover:to-blue-600 transition-all duration-300">
                      {establishment.name}
                    </h3>
                  </div>

                  {/* Members Count */}
                  <div className="flex items-center gap-2 text-gray-600">
                    <Users className="w-5 h-5 text-cyan-500" />
                    <span className="text-sm font-medium">
                      {establishment.members} {t('common.members') || 'miembros'}
                    </span>
                  </div>

                  {/* Action Button */}
                  <div className="pt-2 border-t border-gray-100">
                    <div className="flex items-center justify-between text-sm font-semibold text-gray-700 group-hover:text-cyan-600 transition-colors duration-300">
                      <span>{t('common.access') || 'Acceder'}</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                    </div>
                  </div>
                </div>

                {/* Hover Gradient Border */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none" />
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
