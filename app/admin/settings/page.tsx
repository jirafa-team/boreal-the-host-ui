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
} from 'lucide-react'

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

  return (
    <div className="flex-1 overflow-auto bg-gray-50">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Configuración</h1>
          <p className="text-gray-600 mt-1">Personaliza valores del sistema</p>
        </div>

        {/* Left Column: Settings Cards */}
        <div className="max-w-[240px]">
          <div className="space-y-3">
            {settingsCards.map((card) => {
              const Icon = card.icon
              return (
                <button
                  key={card.label}
                  onClick={() => router.push('#')}
                  className="group relative overflow-hidden rounded-lg p-3 text-white shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 w-full text-left h-16 flex items-center justify-start"
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
      </div>
    </div>
  )
}
