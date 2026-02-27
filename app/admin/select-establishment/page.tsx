'use client'

import { useRouter } from 'next/navigation'
import { useDispatch, useSelector } from 'react-redux'
import { useMemo, useState } from 'react'
import { setCurrentOrganization } from '@/features/organization/slices/organizationSlice'
import { updateUser, useGetUserContextsQuery } from '@/features/auth/slices/authSlice'
import type { RootState } from '@/store/store'
import { useLanguage } from '@/lib/i18n-context'
import { Users, ArrowRight, Search, Home } from 'lucide-react'
import type { ContextDto } from '@/interfaces/auth/ContextDto'
import { ROUTES } from '@/shared/types/routes'

const cardColors = [
  'linear-gradient(135deg, rgb(37, 99, 235), rgb(29, 78, 216))',
  'linear-gradient(135deg, rgb(34, 197, 94), rgb(22, 163, 74))',
  'linear-gradient(135deg, rgb(168, 85, 247), rgb(147, 51, 234))',
  '#e07204',
]

const mockEstablishments = [
  { id: 1, name: 'Hotel Central', alias: 'HC', members: 24, image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-ZLayOs5KXWob6A0IspenQ4rnkxAIam.png', color: cardColors[0], occupancy: 75 },
  { id: 2, name: 'Resort Playa', alias: 'RP', members: 18, image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-mrtDKpDEpjY5hMBVvi8vNx4TOTH4y7.png', color: cardColors[1], occupancy: 60 },
  { id: 3, name: 'Boutique Hotel', alias: 'BH', members: 12, image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-9bjUummRceyN2U8e69b3oeZ3nvuEwB.png', color: cardColors[2], occupancy: 71 },
  { id: 4, name: 'Hotel Executive', alias: 'HE', members: 31, image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-G11mqeawI8yeHZ2P6eu1GGRh3obJWg.png', color: cardColors[3], occupancy: 67 },
]

function getTargetRouteByRole(roleName: string, organizationId: string): string {
  const lower = roleName.toLowerCase()
  if (lower.includes('staff')) return '/staff/tasks'
  if (lower.includes('system')) return '/system/organizations'
  return ROUTES.HOME(organizationId)
}

export default function SelectEstablishmentPage() {
  const router = useRouter()
  const dispatch = useDispatch()
  const { t } = useLanguage()
  const [searchTerm, setSearchTerm] = useState('')
  const [clickedId, setClickedId] = useState<string | number | null>(null)

  const dataSource = useSelector((state: RootState) => state.dataSource.dataSource)
  const isApiMode = dataSource === 'api'

  const { data: contexts, isLoading, isFetching, error } = useGetUserContextsQuery(undefined, {
    skip: !isApiMode,
    refetchOnMountOrArgChange: true,
  })

  const filteredContexts = useMemo(() => {
    if (!isApiMode || !contexts) return []
    if (!searchTerm.trim()) return contexts
    const lower = searchTerm.toLowerCase().trim()
    return contexts.filter(
      (c: ContextDto) =>
        c.organizationName?.toLowerCase().includes(lower) ||
        c.organizationAlias?.toLowerCase().includes(lower)
    )
  }, [isApiMode, contexts, searchTerm])

  const filteredMock = useMemo(
    () =>
      mockEstablishments.filter((e) =>
        e.name.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [searchTerm]
  )

  const handleAccessContext = (context: ContextDto, index: number) => {
    setClickedId(context.organizationId)
    dispatch(
      updateUser({
        role: context.roleName,
        currentOrganization: {
          id: context.organizationId,
          name: context.organizationName,
          alias: context.organizationAlias,
          localCurrency: context.organizationCurrency ?? null,
          logoUrl: context.organizationLogoUrl ?? null,
          modules: context.modules ?? [],
        },
      })
    )
    dispatch(setCurrentOrganization(context.organizationId))
    const target = getTargetRouteByRole(context.roleName, context.organizationId)
    setTimeout(() => router.push(target), 600)
  }

  const handleSelectMock = (id: number, name: string, alias: string) => {
    setClickedId(id)
    dispatch(setCurrentOrganization(String(id)))
    dispatch(
      updateUser({
        role: null,
        currentOrganization: { id: String(id), name, alias },
      })
    )
    setTimeout(() => router.push(ROUTES.HOME(String(id))), 600)
  }

  // ----- API mode: loading / error / content -----
  if (isApiMode) {
    if (isLoading || isFetching) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8 flex items-center justify-center">
          <div className="text-center">
            <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Cargando establecimientos...</p>
          </div>
        </div>
      )
    }

    if (error) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-md p-6 max-w-md text-center">
            <p className="text-red-600 font-medium">Error al cargar los establecimientos.</p>
            <p className="text-gray-500 text-sm mt-2">Inténtalo de nuevo más tarde.</p>
          </div>
        </div>
      )
    }

    const list = filteredContexts as ContextDto[]
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
        <div className="max-w-4xl mx-auto mb-12 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Seleccionar Hospedaje</h1>
          <p className="text-gray-600 text-lg mb-8">Elige un establecimiento para continuar</p>
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

        <div className="max-w-7xl mx-auto">
          {list.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {list.map((context, index) => (
                <button
                  key={`${context.organizationId}-${context.roleId}`}
                  onClick={() => handleAccessContext(context, index)}
                  className="group relative overflow-hidden rounded-lg bg-white shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 flex flex-col"
                >
                  <div className="relative h-40 overflow-hidden bg-gray-200">
                    {context.organizationLogoUrl ? (
                      <img
                        src={context.organizationLogoUrl}
                        alt={context.organizationName}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-300 text-gray-500 text-2xl font-bold">
                        {context.organizationAlias || context.organizationName.slice(0, 2)}
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-colors duration-300" />
                  </div>
                  <div
                    className="relative p-4 flex-1 flex flex-col justify-between"
                    style={{ background: cardColors[index % cardColors.length] }}
                  >
                    <div className="absolute inset-0 opacity-10">
                      <div className="absolute top-0 right-0 w-20 h-20 bg-white rounded-full -mr-8 -mt-8" />
                    </div>
                    <div className="relative">
                      <h3 className="text-base font-bold text-white mb-3">{context.organizationName}</h3>
                      <div className="flex items-center justify-between text-xs text-white/90 mb-2">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          <span>{context.members} miembros</span>
                        </div>
                        <span className="text-white/90">{context.roleName}</span>
                      </div>
                      <p className="text-xs text-white/80">{context.lastAccess}</p>
                    </div>
                    <div className={`flex transition-all duration-[2500ms] ease-out ${clickedId === context.organizationId ? 'justify-end' : 'justify-start'}`}>
                      <div
                        role="button"
                        tabIndex={0}
                        onClick={(e) => {
                          e.stopPropagation()
                          handleAccessContext(context, index)
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.stopPropagation()
                            handleAccessContext(context, index)
                          }
                        }}
                        className={`w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all duration-[2500ms] ease-out group/btn hover:scale-110 cursor-pointer ${clickedId === context.organizationId ? '[transform:rotate(1080deg)]' : ''}`}
                      >
                        {clickedId === context.organizationId ? (
                          <Home className="w-4 h-4 text-white" />
                        ) : (
                          <ArrowRight className="w-4 h-4 text-white group-hover/btn:translate-x-0.5 transition-transform duration-300" />
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                {searchTerm.trim()
                  ? `No se encontraron establecimientos que coincidan con "${searchTerm}"`
                  : 'No tienes acceso a ningún establecimiento.'}
              </p>
            </div>
          )}
        </div>
      </div>
    )
  }

  // ----- Mock mode -----
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-4xl mx-auto mb-12 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Seleccionar Hospedaje</h1>
        <p className="text-gray-600 text-lg mb-8">Elige un establecimiento para continuar</p>
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

      <div className="max-w-7xl mx-auto">
        {filteredMock.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredMock.map((establishment, index) => (
              <button
                key={establishment.id}
                onClick={() => handleSelectMock(establishment.id, establishment.name, establishment.alias)}
                className="group relative overflow-hidden rounded-lg bg-white shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 flex flex-col"
              >
                <div className="relative h-40 overflow-hidden bg-gray-200">
                  <img
                    src={establishment.image || '/placeholder.svg'}
                    alt={establishment.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-colors duration-300" />
                </div>
                <div className="relative p-4 flex-1 flex flex-col justify-between" style={{ background: establishment.color }}>
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-white rounded-full -mr-8 -mt-8" />
                  </div>
                  <div className="relative">
                    <h3 className="text-base font-bold text-white mb-3">{establishment.name}</h3>
                    <div className="flex items-center gap-2 text-xs text-white/90 mb-4 pb-4 border-b border-white/20">
                      <Users className="w-4 h-4" />
                      <span>{establishment.members} miembros</span>
                    </div>
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-white/80">Ocupación</span>
                        <span className="text-xs font-semibold text-white">{establishment.occupancy}%</span>
                      </div>
                      <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-white rounded-full transition-all duration-300"
                          style={{ width: `${establishment.occupancy}%` }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className={`flex transition-all duration-[2500ms] ease-out ${clickedId === establishment.id ? 'justify-end' : 'justify-start'}`}>
                    <div
                      role="button"
                      tabIndex={0}
                      onClick={(e) => {
                        e.stopPropagation()
                        handleSelectMock(establishment.id, establishment.name, establishment.alias)
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.stopPropagation()
                          handleSelectMock(establishment.id, establishment.name, establishment.alias)
                        }
                      }}
                      className={`w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all duration-[2500ms] ease-out group/btn hover:scale-110 cursor-pointer ${clickedId === establishment.id ? '[transform:rotate(1080deg)]' : ''}`}
                    >
                      {clickedId === establishment.id ? (
                        <Home className="w-4 h-4 text-white" />
                      ) : (
                        <ArrowRight className="w-4 h-4 text-white group-hover/btn:translate-x-0.5 transition-transform duration-300" />
                      )}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No se encontraron establecimientos que coincidan con &quot;{searchTerm}&quot;
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
