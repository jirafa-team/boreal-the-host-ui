"use client"

import { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import type { RootState } from "@/store/store"
import {
  Home, Calendar, Bell, User, MapPin, Clock, Utensils, ShoppingBag,
  Coffee, Crown, ChevronRight, MessageCircle, Sparkles, Car, Pizza,
  Dumbbell, Waves, UtensilsCrossed, Users, CalendarDays,
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { ClientApiContainer } from "./containers/ClientApiContainer"
import { ClientMockContainer } from "./containers/ClientMockContainer"
import type { ClientType, ClientUserData, FacilityItem, FacilitySlot, ClientEvent } from "./types"

export type { ClientType, ClientUserData }

export default function ClientPage() {
  const dataSource = useSelector((state: RootState) => state.dataSource.dataSource)
  if (dataSource === "api") return <ClientApiContainer />
  return <ClientMockContainer />
}

export function ClientExperienceView({
  userData,
  clientType,
  organizationId,
  facilities = [],
  mockSlots = {},
  events = [],
  onFacilitySelect,
  apiSlots = [],
  slotsLoading = false,
  onCreateBooking,
  confirmedBookings = {},
}: {
  userData: ClientUserData
  clientType: ClientType
  organizationId?: string
  facilities?: FacilityItem[]
  mockSlots?: Record<string, FacilitySlot[]>
  events?: ClientEvent[]
  onFacilitySelect?: (id: string | null) => void
  apiSlots?: FacilitySlot[]
  slotsLoading?: boolean
  onCreateBooking?: (facilityId: string, slotId: string, people: number) => Promise<void>
  confirmedBookings?: Record<string, string>
}) {
  const router = useRouter()
  const dataSource = useSelector((state: RootState) => state.dataSource.dataSource)

  const isVIP = clientType === "vip"
  const isFutureReservation = clientType === "future"

  const [activeTab, setActiveTab] = useState<"inicio" | "ordenes" | "eventos" | "avisos" | "perfil" | "calendario">("inicio")
  const [localSelectedFacilityId, setLocalSelectedFacilityId] = useState<string | null>(null)
  const [activeFacilityDialog, setActiveFacilityDialog] = useState<string | null>(null)
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null)
  const [facilityPeople, setFacilityPeople] = useState(1)
  const [selectedTimes, setSelectedTimes] = useState<Record<string, string>>({})
  const [timeRemaining, setTimeRemaining] = useState({ hours: 0, minutes: 0, seconds: 0 })

  const handleFacilitySelect = (id: string | null) => {
    if (dataSource === "api") {
      onFacilitySelect?.(id)
    } else {
      setLocalSelectedFacilityId(id)
    }
  }

  const getSlotsForFacility = (facilityId: string): FacilitySlot[] => {
    if (dataSource === "api") return apiSlots
    return mockSlots[facilityId] ?? []
  }

  const roomServiceOrders = [
    { id: 1, date: "15 Ene 2025 - 20:30", items: "Desayuno Continental, Café Latte", total: "€15.50", status: "Entregado" },
    { id: 2, date: "16 Ene 2025 - 14:15", items: "Hamburguesa Premium, Coca-Cola", total: "€18.00", status: "Entregado" },
    { id: 3, date: "16 Ene 2025 - 19:45", items: "Ensalada César, Agua Mineral", total: "€16.50", status: "En Preparación" },
  ]

  useEffect(() => {
    const calculateTimeRemaining = () => {
      const now = new Date()
      const tomorrow = new Date(now)
      tomorrow.setDate(tomorrow.getDate() + 1)
      tomorrow.setHours(8, 0, 0, 0)
      const diff = tomorrow.getTime() - now.getTime()
      if (diff > 0) {
        setTimeRemaining({
          hours: Math.floor(diff / (1000 * 60 * 60)),
          minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((diff % (1000 * 60)) / 1000),
        })
      }
    }
    calculateTimeRemaining()
    const interval = setInterval(calculateTimeRemaining, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* HEADER */}
      <div className="p-4 text-white sticky top-0 z-10 relative overflow-hidden" style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #581c87 100%)" }}>
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400 rounded-full mix-blend-screen filter blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-400 rounded-full mix-blend-screen filter blur-3xl"></div>
        </div>
        <div className="flex items-center justify-between gap-4 flex-wrap relative z-10">
          <div className="flex-1 relative z-10">
            <h1 className="text-3xl font-bold">Hola, {userData.name}</h1>
            {!isFutureReservation && (
              <p className="text-sm opacity-90 mt-2 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Habitación {userData.room} · {userData.roomType}
              </p>
            )}
          </div>
          {!isFutureReservation && (
            <div className="flex items-center gap-4 bg-white/15 backdrop-blur-sm rounded-full px-4 py-2.5 border border-white/20 relative z-10">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-white" />
                <div className="text-center">
                  <p className="text-xs opacity-80 font-medium">Check-out</p>
                  <p className="text-sm font-bold text-white">{userData.checkOut}</p>
                </div>
              </div>
              <div className="w-px h-8 bg-white/20"></div>
              <div className="flex items-center gap-3">
                <div className="text-center">
                  <p className="text-2xl font-bold text-white">{userData.nights}</p>
                  <p className="text-xs opacity-80 font-medium">noches</p>
                </div>
                <Button size="sm" className="bg-violet-800 text-white hover:bg-violet-900 font-semibold px-3 h-8 rounded-full">
                  Extender
                </Button>
              </div>
            </div>
          )}
          <div style={{ background: "linear-gradient(135deg, #6f65d0 0%, #67f1d0 100%)" }} className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg p-[2px] relative z-10">
            <div className="w-full h-full bg-[#233b64] rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-white">{userData.initials}</span>
            </div>
          </div>
        </div>
      </div>

      {/* FUTURE VIEW */}
      {isFutureReservation ? (
        <div className="p-4 pb-20 flex-1">
          <div className="p-[1px] rounded-2xl" style={{ background: "linear-gradient(135deg, #6f65d0, #67f1d0)" }}>
            <Card className="p-8 rounded-2xl text-center" style={{ backgroundColor: "#233b64" }}>
              <div className="mb-8">
                <h3 className="text-3xl font-bold text-white mb-4">Tu Próxima Estancia</h3>
                <div className="inline-block bg-white/10 px-4 py-2 rounded-lg">
                  <p className="text-sm text-white/90">Check-in</p>
                  <p className="text-lg font-semibold text-white">{userData.checkIn}</p>
                </div>
              </div>
              <div className="mb-8 py-6 border-y border-white/20">
                <p className="text-8xl font-bold text-white mb-3" style={{ lineHeight: 1 }}>{userData.daysUntilCheckIn}</p>
                <p className="text-xl text-white/90 font-medium">días para tu llegada</p>
              </div>
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="bg-white/10 rounded-xl p-4">
                  <p className="text-3xl font-bold text-white mb-1">{userData.nights}</p>
                  <p className="text-sm text-white/80">Noches</p>
                </div>
                <div className="bg-white/10 rounded-xl p-4">
                  <p className="text-lg font-semibold text-white mb-1">{userData.room}</p>
                  <p className="text-sm text-white/80">Habitación</p>
                </div>
                <div className="bg-white/10 rounded-xl p-4">
                  <p className="text-base font-semibold text-white mb-1">{userData.roomType}</p>
                  <p className="text-xs text-white/80">Tipo</p>
                </div>
              </div>
              <div className="mt-6">
                <Link href="/client/reservation-details">
                  <Button size="lg" className="w-full bg-gradient-to-r from-[#6f65d0] to-[#67f1d0] text-white border-0 hover:opacity-90">
                    Ver Detalles de Reserva
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        </div>
      ) : (
        <main className="flex-1 pb-20 pt-4 px-4 max-w-2xl mx-auto w-full">
          <main className="pb-24 px-4 pt-6">

            {activeTab === "inicio" && (
              <div className="space-y-6">

                {/* Countdown */}
                <div className="px-4 pt-4">
                  <div className="relative overflow-hidden rounded-xl p-4 text-white" style={{ background: "linear-gradient(135deg, #581c87 0%, #6d28d9 50%, #0369a1 100%)" }}>
                    <div className="absolute inset-0 opacity-20 pointer-events-none">
                      <div className="absolute top-0 right-0 w-96 h-96 bg-violet-300 rounded-full mix-blend-screen filter blur-3xl"></div>
                      <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-300 rounded-full mix-blend-screen filter blur-3xl"></div>
                    </div>
                    <div className="relative z-10">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="h-5 w-5" />
                        <p className="text-sm font-medium">Próxima Actividad</p>
                      </div>
                      <p className="text-lg font-semibold mb-3">Desayuno - 8:00 AM</p>
                      <div className="flex gap-3 justify-center">
                        <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 text-center min-w-[70px]">
                          <p className="text-2xl font-bold">{String(timeRemaining.hours).padStart(2, "0")}</p>
                          <p className="text-xs opacity-90">Horas</p>
                        </div>
                        <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 text-center min-w-[70px]">
                          <p className="text-2xl font-bold">{String(timeRemaining.minutes).padStart(2, "0")}</p>
                          <p className="text-xs opacity-90">Minutos</p>
                        </div>
                        <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 text-center min-w-[70px]">
                          <p className="text-2xl font-bold">{String(timeRemaining.seconds).padStart(2, "0")}</p>
                          <p className="text-xs opacity-90">Segundos</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Servicios Destacados */}
                <div className="px-4 pt-4">
                  <h3 className="text-2xl font-bold text-black px-1 mb-3">Servicios Destacados</h3>
                  <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory scrollbar-hide">
                    {[
                      { name: "Room Service", time: "24/7", image: "/images/untitled-20design-20-283-29.png" },
                      { name: "Taxi", time: "24/7", image: "/luxury-taxi-car-service.jpg" },
                      { name: "Cabalgata", time: "8AM - 6PM", image: "/horse-riding-tour.jpg" },
                      { name: "Spa & Masajes", time: "9AM - 9PM", image: "/luxury-spa-massage.png" },
                      { name: "Tour Ciudad", time: "10AM - 5PM", image: "/city-tour-bus.jpg" },
                    ].map((service) => (
                      <div key={service.name} className="min-w-[264px] snap-start relative rounded-lg overflow-hidden">
                        <img src={service.image || "/placeholder.svg"} alt={service.name} className="w-full h-40 object-cover" />
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                          <p className="text-white font-semibold">{service.name}</p>
                          <p className="text-white/90 text-sm">{service.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Room Service Card */}
                <div className="px-4 pt-4 pb-4 bg-white">
                  <Card className="relative overflow-hidden cursor-pointer hover:shadow-lg transition-all h-32" onClick={() => { }}>
                    <Image src="/club-sandwich.jpg" alt="Room Service" fill className="object-cover" loading="eager" />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40" />
                    <div className="absolute inset-0 flex items-center justify-between px-6">
                      <div className="flex items-center gap-4">
                        <div className="bg-white/20 backdrop-blur-sm p-3 rounded-full">
                          <Utensils className="w-8 h-8 text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-white mb-2">Ordenar Comida</h3>
                          <div className="inline-flex items-center gap-1.5 bg-[#773CCA] text-white text-xs px-3 py-1 rounded-full">
                            <Clock className="w-3 h-3" />
                            <span>Room Service disponible 24/7</span>
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="w-8 h-8 text-white" />
                    </div>
                  </Card>
                </div>

                {/* Reserva de Facilities */}
                <div className="px-4 pt-4 pb-2 bg-white">
                  <h2 className="text-2xl font-bold text-black">Reserva</h2>
                </div>

                <div className="px-4 pb-4 bg-white">
                  <div className="grid grid-cols-2 gap-3">
                    {facilities.map((facility) => {
                      const isConfirmed = !!confirmedBookings[facility.id]
                      return (
                        <Dialog
                          key={facility.id}
                          open={activeFacilityDialog === facility.id}
                          onOpenChange={(open) => {
                            if (isConfirmed) return  // bloqueado si ya tiene reserva
                            if (open) {
                              handleFacilitySelect(facility.id)
                              setActiveFacilityDialog(facility.id)
                            } else {
                              setActiveFacilityDialog(null)
                            }
                          }}
                        >
                          <DialogTrigger asChild>
                            <Card className={`overflow-hidden flex flex-col p-0 transition-all ${isConfirmed ? "cursor-default opacity-90" : "cursor-pointer hover:shadow-lg"
                              }`}>
                              <div className="h-32 relative">
                                <img
                                  src={facility.image || "/placeholder.svg"}
                                  alt={facility.name}
                                  className="w-full h-full object-cover block"
                                />
                                <div className="text-white text-xs font-medium px-2 py-1 rounded-full shadow-sm absolute top-2 right-2" style={{ backgroundColor: "#773CCA" }}>
                                  {facility.openTime} - {facility.closeTime}
                                </div>
                                {isConfirmed && (
                                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                                    <span className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                                      ✓ Reservado
                                    </span>
                                  </div>
                                )}
                              </div>
                              <div className="bg-white text-black flex flex-col gap-2 p-3">
                                <p className="text-lg font-bold">{facility.name}</p>
                                {isConfirmed ? (
                                  <div className="text-white text-xs font-medium px-3 py-1 rounded-full flex items-center gap-1 w-fit bg-green-500">
                                    ✓ {confirmedBookings[facility.id]}
                                  </div>
                                ) : selectedTimes[facility.id] ? (
                                  <div className="text-white text-xs font-medium px-3 py-1 rounded-full w-fit" style={{ backgroundColor: "#11AFBF" }}>
                                    {selectedTimes[facility.id]}
                                  </div>
                                ) : (
                                  <div className="text-white text-xs font-medium px-3 py-1 rounded-full flex items-center gap-1 w-fit" style={{ backgroundColor: "#11AFBF" }}>
                                    <Clock className="w-3.5 h-3.5" />
                                    Sin reservar
                                  </div>
                                )}
                              </div>
                            </Card>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                              <DialogTitle>Reservar {facility.name}</DialogTitle>
                              <DialogDescription>Selecciona el horario para {facility.name.toLowerCase()}</DialogDescription>
                            </DialogHeader>
                            <div className="bg-gray-100 rounded-lg p-4 mb-4">
                              <div className="flex items-center justify-between">
                                <span className="font-medium text-gray-700">Personas</span>
                                <div className="flex items-center gap-4">
                                  <button
                                    disabled={facilityPeople === 1}
                                    onClick={() => setFacilityPeople(Math.max(1, facilityPeople - 1))}
                                    className="w-10 h-10 rounded-full bg-white border border-gray-300 flex items-center justify-center font-bold text-lg hover:bg-gray-50 disabled:opacity-50"
                                  >
                                    −
                                  </button>
                                  <span className="text-xl font-semibold w-6 text-center">{facilityPeople}</span>
                                  <button
                                    disabled={facilityPeople === userData.roomCapacity}
                                    onClick={() => setFacilityPeople(Math.min(userData.roomCapacity, facilityPeople + 1))}
                                    className="w-10 h-10 rounded-full bg-white border border-gray-300 flex items-center justify-center font-bold text-lg hover:bg-gray-50 disabled:opacity-50"
                                  >
                                    +
                                  </button>
                                </div>
                              </div>
                            </div>
                            {slotsLoading && dataSource === "api" ? (
                              <p className="text-center text-sm text-muted-foreground py-4">Cargando horarios...</p>
                            ) : (
                              <div className="space-y-2 py-2">
                                {getSlotsForFacility(facility.id).map((slot) => {
                                  const parseUTCTime = (iso: string) => {
                                    const match = iso.match(/T(\d{2}):(\d{2})/)
                                    return match ? `${match[1]}:${match[2]}` : "??:??"
                                  }
                                  const timeLabel = `${parseUTCTime(slot.startAt)} - ${parseUTCTime(slot.endAt)}`
                                  const percent = slot.occupationPercentage
                                  const color = percent <= 33 ? "text-green-600" : percent <= 66 ? "text-amber-600" : "text-red-600"
                                  const bgColor = percent <= 33 ? "bg-green-100" : percent <= 66 ? "bg-amber-100" : "bg-red-100"
                                  return (
                                    <div
                                      key={slot.id}
                                      className="flex items-center justify-between p-3 rounded-lg hover:bg-accent cursor-pointer"
                                      onClick={() => {
                                        setSelectedTimes((prev) => ({ ...prev, [facility.id]: timeLabel }))
                                        setSelectedSlotId(slot.id)
                                      }}
                                    >
                                      <div className="flex items-center gap-3">
                                        <input type="radio" readOnly checked={selectedTimes[facility.id] === timeLabel} className="cursor-pointer" />
                                        <span className="font-medium">{timeLabel}</span>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <div className={`flex items-center gap-1.5 px-2 py-1 rounded ${bgColor}`}>
                                          <Users className={`w-3.5 h-3.5 ${color}`} />
                                          <span className={`text-xs font-semibold ${color}`}>{slot.currentOccupancy}/{slot.capacity}</span>
                                        </div>
                                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${bgColor} ${color}`}>
                                          {percent}%
                                        </span>
                                      </div>
                                    </div>
                                  )
                                })}
                                {getSlotsForFacility(facility.id).length === 0 && (
                                  <p className="text-center text-sm text-muted-foreground py-4">No hay horarios disponibles</p>
                                )}
                              </div>
                            )}
                            <Button
                              className="w-full mt-2"
                              size="lg"
                              disabled={!selectedSlotId}
                              onClick={async () => {
                                if (!selectedSlotId || !onCreateBooking) return
                                await onCreateBooking(facility.id, selectedSlotId, facilityPeople)
                                setActiveFacilityDialog(null)
                              }}
                            >
                              Confirmar Reserva
                            </Button>
                          </DialogContent>
                        </Dialog>
                      )
                    })}
                  </div>
                </div>

                {/* Ayuda */}
                <div className="px-4 pb-4">
                  <Card className="relative overflow-hidden cursor-pointer hover:shadow-lg transition-shadow">
                    <Image src="/hotel-concierge-help-desk.jpg" alt="Asistencia" fill className="object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-r from-red-900/70 to-red-700/50" />
                    <div className="relative h-full flex items-center justify-between p-5">
                      <div className="flex items-center gap-4">
                        <div className="bg-white/20 backdrop-blur-sm p-3 rounded-full">
                          <MessageCircle className="w-8 h-8 text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-white mb-2">¿Necesitas Ayuda?</h3>
                          <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full">
                            <span>Estamos aquí para ti</span>
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="w-8 h-8 text-white" />
                    </div>
                  </Card>
                </div>
              </div>
            )}

            {activeTab === "eventos" && (
              <div className="pb-24 px-4 pt-6">
                <h2 className="text-2xl font-bold mb-4">Eventos del Hotel</h2>
                <div className="space-y-4">
                  {events.map((event) => {
                    const eventDate = new Date(event.date)
                    const day = eventDate.getDate()
                    const month = eventDate.toLocaleDateString("es-ES", { month: "short" }).toUpperCase()
                    return (
                      <Link key={event.id} href={`/client/event/${event.id}`}>
                        <Card className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow">
                          <div className="relative h-48">
                            <Image src={event.image || "/placeholder.svg"} alt={event.name} fill className="object-cover" />
                            <div className={`absolute inset-0 bg-gradient-to-br ${event.gradient} opacity-50`} />
                            <div className="absolute top-3 right-3">
                              {event.registered ? (
                                <Badge className="bg-white/90 text-[#773CCA] hover:bg-white shadow-lg">✓ Registrado</Badge>
                              ) : (
                                <Badge className="bg-white/90 text-gray-700 hover:bg-white shadow-lg">Disponible</Badge>
                              )}
                            </div>
                            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                              <h3 className="text-xl font-bold text-white mb-1">{event.name}</h3>
                              <p className="text-sm text-white/90 line-clamp-1">{event.description}</p>
                            </div>
                          </div>
                          <div className="p-4 space-y-3">
                            <div className="flex items-center gap-4">
                              <div className="bg-gradient-to-br from-[#11AFBE] to-[#773CCA] rounded-xl p-3 text-white text-center min-w-[60px]">
                                <p className="text-xs font-semibold uppercase">{month}</p>
                                <p className="text-2xl font-bold leading-none">{day}</p>
                              </div>
                              <div className="space-y-1">
                                <div className="flex items-center gap-1.5 text-gray-600">
                                  <Clock className="w-4 h-4" />
                                  <span className="text-sm font-medium">{event.time}</span>
                                  <span className="text-xs text-gray-400">• {event.duration}</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-gray-600">
                                  <MapPin className="w-4 h-4" />
                                  <span className="text-sm">{event.location}</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                              <div className="flex items-center gap-2">
                                <div className="flex -space-x-2">
                                  {[1, 2, 3].map((i) => (
                                    <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 border-2 border-white flex items-center justify-center text-white text-xs font-semibold">
                                      {String.fromCharCode(64 + i)}
                                    </div>
                                  ))}
                                </div>
                                <span className="text-xs text-gray-500 font-medium">{event.attendees} asistentes</span>
                              </div>
                              <Button size="sm" className="bg-gradient-to-r from-[#11AFBE] to-[#773CCA] text-white hover:opacity-90" onClick={(e) => { e.preventDefault(); e.stopPropagation() }}>
                                {event.registered ? "Ver detalles" : "Registrarse"}
                              </Button>
                            </div>
                          </div>
                        </Card>
                      </Link>
                    )
                  })}
                </div>
              </div>
            )}

            {activeTab === "avisos" && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-foreground">Notificaciones</h2>
                <div className="space-y-3">
                  {[
                    { title: "Bienvenida", message: "Gracias por hospedarte con nosotros", time: "Hace 1 día", read: true },
                    { title: "Nuevo evento disponible", message: "Workshop de Innovación - 15 Nov", time: "Hace 2 horas", read: false },
                  ].map((notif, idx) => (
                    <Card key={idx} className={`p-4 ${!notif.read ? "bg-primary/5 border-primary/20" : ""}`}>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-foreground text-sm">{notif.title}</h4>
                          <p className="text-sm text-muted-foreground mt-1">{notif.message}</p>
                          <p className="text-xs text-muted-foreground mt-2">{notif.time}</p>
                        </div>
                        {!notif.read && <div className="w-2 h-2 bg-destructive rounded-full shrink-0 mt-1" />}
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "perfil" && (
              <div className="p-4">
                <div className="space-y-4">
                  <h2 className="text-xl font-bold text-foreground">Mi Perfil</h2>
                  <Card className="p-6">
                    <div className="text-center mb-6">
                      <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-3">
                        <span className="text-2xl font-bold text-primary-foreground">{userData.initials}</span>
                      </div>
                      <h3 className="font-semibold text-foreground">{userData.fullName}</h3>
                      <p className="text-sm text-muted-foreground">{userData.email}</p>
                      {isVIP && (
                        <div className="mt-2 inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
                          <Crown className="w-3 h-3" />
                          Cliente VIP
                        </div>
                      )}
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between py-3 border-b border-border">
                        <span className="text-sm text-muted-foreground">Habitación</span>
                        <span className="text-sm font-medium text-foreground">{userData.room} - {userData.roomType}</span>
                      </div>
                      <div className="flex justify-between py-3 border-b border-border">
                        <span className="text-sm text-muted-foreground">Check-in</span>
                        <span className="text-sm font-medium text-foreground">{userData.checkIn}</span>
                      </div>
                      <div className="flex justify-between py-3 border-b border-border">
                        <span className="text-sm text-muted-foreground">Check-out</span>
                        <span className="text-sm font-medium text-foreground">{userData.checkOut}</span>
                      </div>
                      <div className="flex justify-between py-3">
                        <span className="text-sm text-muted-foreground">Teléfono</span>
                        <span className="text-sm font-medium text-foreground">{userData.phone}</span>
                      </div>
                    </div>
                    <Button variant="outline" className="w-full mt-6 bg-transparent">Editar Perfil</Button>
                    <Button variant="destructive" className="w-full mt-3" onClick={() => router.push("/")}>Cerrar Sesión</Button>
                  </Card>
                </div>
              </div>
            )}

            {activeTab === "ordenes" && (
              <div className="pb-24 px-4 pt-6 space-y-4">
                <h2 className="text-2xl font-bold mb-4">Mis Órdenes</h2>
                <Card className="relative overflow-hidden cursor-pointer hover:shadow-lg transition-all h-32" onClick={() => { }}>
                  <Image src="/club-sandwich.jpg" alt="Room Service" fill className="object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40" />
                  <div className="absolute inset-0 flex items-center justify-between px-6">
                    <div className="flex items-center gap-4">
                      <div className="bg-white/20 backdrop-blur-sm p-3 rounded-full">
                        <Utensils className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white mb-2">Ordenar Comida</h3>
                        <div className="inline-flex items-center gap-1.5 bg-[#773CCA] text-white text-xs px-3 py-1 rounded-full">
                          <Clock className="w-3 h-3" />
                          <span>Room Service disponible 24/7</span>
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="w-8 h-8 text-white" />
                  </div>
                </Card>
                <div className="bg-white rounded-lg p-4 shadow-sm border border-orange-200">
                  <div className="flex items-start gap-3">
                    <div className="bg-[#773CCA] p-2.5 rounded-full">
                      <Pizza className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-1">
                        <h4 className="font-semibold text-gray-900">Pizza Margherita</h4>
                        <span className="inline-flex items-center gap-1 bg-amber-500 text-white text-xs px-2 py-0.5 rounded-full font-medium">
                          <Clock className="w-3 h-3" />
                          En preparación
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">Tamaño: Grande • Extra queso</p>
                      <div className="bg-white/60 rounded-lg px-3 py-2 border border-orange-300">
                        <p className="text-sm font-medium text-gray-900 text-center">Llega entre 19:30 - 19:50</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-foreground mt-4">Historial de Solicitudes</h3>
                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="flex gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#6f65d0] to-[#67f1d0] flex items-center justify-center flex-shrink-0">
                        <Sparkles className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <p className="text-base font-semibold text-gray-900 leading-tight">Masaje Relajante 60 min</p>
                          <span className="text-base font-bold text-[#11AFBF] whitespace-nowrap">$85.00</span>
                        </div>
                        <p className="text-xs text-gray-500 mb-2">Hoy, 15:00 - Spa</p>
                        <Badge className="text-xs bg-green-100 text-green-700 hover:bg-green-100">Completado</Badge>
                      </div>
                    </div>
                  </div>
                  {roomServiceOrders.map((order) => (
                    <div key={order.id} className="bg-white rounded-xl p-4 shadow-sm">
                      <div className="flex gap-3">
                        <div className="w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center flex-shrink-0">
                          <Utensils className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <p className="text-base font-semibold text-gray-900 leading-tight">{order.items}</p>
                            <span className="text-base font-bold text-[#11AFBF] whitespace-nowrap">{order.total}</span>
                          </div>
                          <p className="text-xs text-gray-500 mb-2">{order.date}</p>
                          <Badge className={`text-xs ${order.status === "Entregado" ? "bg-green-100 text-green-700 hover:bg-green-100" : "bg-yellow-100 text-yellow-700 hover:bg-yellow-100"}`}>
                            {order.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="flex gap-3">
                      <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                        <Car className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <p className="text-base font-semibold text-gray-900 leading-tight">Taxi al Aeropuerto</p>
                          <span className="text-base font-bold text-[#11AFBF] whitespace-nowrap">$45.00</span>
                        </div>
                        <p className="text-xs text-gray-500 mb-2">Ayer, 06:30</p>
                        <Badge className="text-xs bg-green-100 text-green-700 hover:bg-green-100">Completado</Badge>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="flex gap-3">
                      <div className="w-12 h-12 rounded-full bg-teal-500 flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <p className="text-base font-semibold text-gray-900 leading-tight">Tour de Cabalgata - 2 personas</p>
                          <span className="text-base font-bold text-[#11AFBF] whitespace-nowrap">$120.00</span>
                        </div>
                        <p className="text-xs text-gray-500 mb-2">15 Dic, 14:00</p>
                        <Badge className="text-xs bg-green-100 text-green-700 hover:bg-green-100">Completado</Badge>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-[#11AFBF] rounded-xl p-4 mt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-base font-bold text-white">Total Acumulado</span>
                    <span className="text-2xl font-bold text-white">
                      €{(roomServiceOrders.reduce((sum, o) => sum + Number.parseFloat(o.total.replace(/[€$]/g, "")), 0) + 45 + 120 + 22).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "calendario" && (
              <div className="space-y-6 px-4 pb-24">
                <h2 className="text-2xl font-bold text-foreground">Mi Agenda</h2>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-6 bg-[#11AFBF] rounded-full" />
                    <h3 className="text-lg font-semibold">Hoy - {new Date().toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long" })}</h3>
                  </div>
                  <div className="space-y-2">
                    {[
                      { time: "08:00", icon: <Coffee className="w-5 h-5 text-[#773CCA]" />, title: "Desayuno", sub: "Restaurante Principal", badge: "Confirmado", badgeColor: "bg-[#11AFBF]" },
                      { time: "10:00", icon: <Sparkles className="w-5 h-5 text-[#773CCA]" />, title: "Servicio de Limpieza", sub: "Habitación 305", badge: "Programado", badgeColor: "bg-[#11AFBF]" },
                      { time: "18:00", icon: <Dumbbell className="w-5 h-5 text-[#773CCA]" />, title: "Gimnasio", sub: "Centro de Fitness - Piso 2", badge: "Reservado", badgeColor: "bg-[#11AFBF]" },
                    ].map((item) => (
                      <div key={item.time} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                        <div className="flex gap-3">
                          <span className="text-sm font-semibold text-[#773CCA] w-12 shrink-0">{item.time}</span>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">{item.icon}<h4 className="font-semibold">{item.title}</h4></div>
                            <p className="text-sm text-muted-foreground">{item.sub}</p>
                            <span className={`inline-block mt-2 px-3 py-1 text-xs font-medium ${item.badgeColor} text-white rounded-full`}>{item.badge}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                    <div className="bg-white rounded-xl p-4 shadow-sm border-2 border-orange-300">
                      <div className="flex gap-3">
                        <span className="text-sm font-semibold text-orange-600 w-12 shrink-0">19:30</span>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1"><UtensilsCrossed className="w-5 h-5 text-orange-600" /><h4 className="font-semibold">Pizza Margherita</h4></div>
                          <p className="text-sm text-muted-foreground">Room Service - Entrega a habitación</p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="inline-block px-3 py-1 text-xs font-medium bg-yellow-500 text-white rounded-full">En Preparación</span>
                            <span className="text-xs text-orange-600 font-medium">Llega: 19:30 - 19:50</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-6 bg-gray-400 rounded-full" />
                    <h3 className="text-lg font-semibold">Mañana - {new Date(Date.now() + 86400000).toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long" })}</h3>
                  </div>
                  <div className="space-y-2">
                    {[
                      { time: "08:00", icon: <Coffee className="w-5 h-5 text-[#773CCA]" />, title: "Desayuno", sub: "Restaurante Principal", badge: "Confirmado", badgeColor: "bg-[#11AFBF]" },
                      { time: "10:00", icon: <Users className="w-5 h-5 text-[#773CCA]" />, title: "Conferencia Anual Q1", sub: "Salón Principal - 4 horas", badge: "Registrado", badgeColor: "bg-[#773CCA]" },
                      { time: "15:00", icon: <Waves className="w-5 h-5 text-[#773CCA]" />, title: "Piscina", sub: "Terraza - Piso 8", badge: "Reservado", badgeColor: "bg-[#11AFBF]" },
                    ].map((item) => (
                      <div key={item.time} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                        <div className="flex gap-3">
                          <span className="text-sm font-semibold text-[#773CCA] w-12 shrink-0">{item.time}</span>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">{item.icon}<h4 className="font-semibold">{item.title}</h4></div>
                            <p className="text-sm text-muted-foreground">{item.sub}</p>
                            <span className={`inline-block mt-2 px-3 py-1 text-xs font-medium ${item.badgeColor} text-white rounded-full`}>{item.badge}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </main>
        </main>
      )}

      {/* NAV */}
      <nav className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-lg border-t border-border shadow-lg">
        <div className="flex items-center justify-around px-2 py-2">
          <button onClick={() => setActiveTab("inicio")} className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${activeTab === "inicio" ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground"}`}>
            <Home className="w-5 h-5" />
            <span className="text-xs font-medium">Inicio</span>
          </button>
          <button onClick={() => setActiveTab("perfil")} className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${activeTab === "perfil" ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground"}`}>
            <User className="w-5 h-5" />
            <span className="text-xs font-medium">Perfil</span>
          </button>
          <button onClick={() => setActiveTab("calendario")} className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${activeTab === "calendario" ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground"}`}>
            <CalendarDays className="w-5 h-5" />
            <span className="text-xs font-medium">Agenda</span>
          </button>
        </div>
      </nav>
    </div>
  )
}