"use client"

import { useParams, useRouter } from 'next/navigation'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { ArrowLeft, Calendar, Clock, MapPin, Users, Edit, Trash2, Mail, Search, Plus, X, UserPlus, MailPlus } from 'lucide-react'
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import React, { useState } from 'react'
import Loading from './loading'

type Event = {
  id: number
  name: string
  description: string
  date: string
  time: string
  location: string
  capacity: number
  registered: number
  category: "conference" | "workshop" | "social" | "dining"
  status: "upcoming" | "ongoing" | "completed"
  image?: string
}

type Attendee = {
  id: number
  name: string
  email: string
  room: string
  checkIn: string
  checkOut: string
  registeredAt: string
  avatar?: string
  vip: boolean
  type: "hospedado" | "historico" | "invitado"
}

export default function EventDetailPage() {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const eventId = Number(params.id)
  const [searchQuery, setSearchQuery] = useState("")
  const [addGuestDialogOpen, setAddGuestDialogOpen] = useState(false)
  const [addGuestSearchQuery, setAddGuestSearchQuery] = useState("")

  // Mock data - En producción vendría de una API
  const event: Event = {
    id: eventId,
    name: "Conferencia Anual Q1",
    description:
      "Presentación de resultados del primer trimestre y estrategias futuras para el próximo año. Incluye sesiones de networking, presentaciones de ejecutivos y panel de discusión sobre tendencias del sector. Un evento imperdible para todos los interesados en el crecimiento de la organización.",
    date: "2024-11-13",
    time: "10:00",
    location: "Salón Principal",
    capacity: 200,
    registered: 142,
    category: "conference",
    status: "upcoming",
    image: "/conference-room-professional.jpg",
  }

  const attendees: Attendee[] = [
    {
      id: 1,
      name: "María González",
      email: "maria.gonzalez@email.com",
      room: "302",
      checkIn: "2024-11-12",
      checkOut: "2024-11-15",
      registeredAt: "2024-11-10 14:30",
      vip: true,
      type: "hospedado",
    },
    {
      id: 2,
      name: "Carlos Rodríguez",
      email: "carlos.rodriguez@email.com",
      room: "215",
      checkIn: "2024-11-11",
      checkOut: "2024-11-14",
      registeredAt: "2024-11-09 09:15",
      vip: false,
      type: "hospedado",
    },
    {
      id: 3,
      name: "Ana Martínez",
      email: "ana.martinez@email.com",
      room: "401",
      checkIn: "2024-11-12",
      checkOut: "2024-11-16",
      registeredAt: "2024-11-08 16:45",
      vip: true,
      type: "hospedado",
    },
    {
      id: 4,
      name: "Luis Fernández",
      email: "luis.fernandez@email.com",
      room: "103",
      checkIn: "2024-11-11",
      checkOut: "2024-11-13",
      registeredAt: "2024-11-10 11:20",
      vip: false,
      type: "historico",
    },
    {
      id: 5,
      name: "Isabel Torres",
      email: "isabel.torres@email.com",
      room: "508",
      checkIn: "2024-11-12",
      checkOut: "2024-11-15",
      registeredAt: "2024-11-09 13:00",
      vip: true,
      type: "invitado",
    },
  ]

  // Mock available guests to add
  const availableGuests: Attendee[] = [
    {
      id: 6,
      name: "Pedro Sánchez",
      email: "pedro.sanchez@email.com",
      room: "204",
      checkIn: "2024-11-13",
      checkOut: "2024-11-17",
      registeredAt: "",
      vip: false,
    },
    {
      id: 7,
      name: "Laura Gómez",
      email: "laura.gomez@email.com",
      room: "506",
      checkIn: "2024-11-11",
      checkOut: "2024-11-14",
      registeredAt: "",
      vip: true,
    },
    {
      id: 8,
      name: "David López",
      email: "david.lopez@email.com",
      room: "305",
      checkIn: "2024-11-12",
      checkOut: "2024-11-16",
      registeredAt: "",
      vip: false,
    },
  ]

  const getCategoryColor = (category: Event["category"]) => {
    const colors = {
      conference: "bg-blue-500",
      workshop: "bg-purple-500",
      social: "bg-green-500",
      dining: "bg-orange-500",
    }
    return colors[category]
  }

  const getCategoryLabel = (category: Event["category"]) => {
    const labels = {
      conference: "Conferencia",
      workshop: "Workshop",
      social: "Social",
      dining: "Gastronomía",
    }
    return labels[category]
  }

  const occupancyPercent = Math.round((event.registered / event.capacity) * 100)
  const isNearCapacity = occupancyPercent >= 80

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-6">
        <Button variant="ghost" onClick={() => router.back()} className="mb-4 gap-2">
          <ArrowLeft className="w-4 h-4" />
          Volver a Eventos
        </Button>

        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className={`w-3 h-3 rounded-full ${getCategoryColor(event.category)}`} />
              <Badge variant="outline">{getCategoryLabel(event.category)}</Badge>
              <Badge variant={event.status === "upcoming" ? "default" : "secondary"}>
                {event.status === "upcoming" ? "Próximo" : "Completado"}
              </Badge>
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">{event.name}</h1>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-2 bg-transparent">
              <Edit className="w-4 h-4" />
              Editar
            </Button>
            <Button variant="outline" size="sm" className="gap-2 text-destructive hover:text-destructive bg-transparent">
              <Trash2 className="w-4 h-4" />
              Eliminar
            </Button>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* Main Content - Image and Details Side by Side */}
        <div className="grid grid-cols-2 gap-6">
          {/* Event Image - 50% width */}
          <Card className="overflow-hidden h-fit">
            <img src={event.image || "/placeholder.svg"} alt={event.name} className="w-full h-80 object-cover" />
          </Card>

          {/* Event Details - 50% width */}
          <Card className="p-6">
            <h2 className="text-xl font-bold text-foreground mb-4">Detalles del Evento</h2>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Fecha</p>
                  <p className="font-medium text-foreground">
                    {new Date(event.date).toLocaleDateString("es-ES", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Hora</p>
                  <p className="font-medium text-foreground">{event.time}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Ubicación</p>
                  <p className="font-medium text-foreground">{event.location}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Capacidad</p>
                  <p className="font-medium text-foreground">
                    {event.registered} / {event.capacity} registrados ({occupancyPercent}%)
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Description - Full Width */}
        <Card className="p-6">
          <h3 className="text-xl font-bold text-foreground mb-4">Descripción</h3>
          <p className="text-muted-foreground leading-relaxed">{event.description}</p>
        </Card>

        {/* Attendees List - Full Width */}
        <Card className="p-6">
          <div className="space-y-4">
            {/* Header with search and add button */}
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <h2 className="text-xl font-bold text-foreground">Clientes Registrados</h2>
              <div className="flex gap-2">
                <div className="relative flex-1 min-w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar cliente..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <button
                  className="relative group w-10 h-10 rounded-full bg-primary hover:bg-primary/90 text-white flex items-center justify-center transition-all shadow-md hover:shadow-lg"
                  title="Agregar cliente"
                  onClick={() => setAddGuestDialogOpen(true)}
                >
                  <UserPlus className="w-5 h-5" />
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-gray-900 text-white text-xs rounded pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    Agregar Cliente
                  </div>
                </button>
                <button
                  className="relative group w-10 h-10 rounded-full bg-primary hover:bg-primary/90 text-white flex items-center justify-center transition-all shadow-md hover:shadow-lg"
                  title="Enviar email"
                >
                  <MailPlus className="w-5 h-5" />
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-gray-900 text-white text-xs rounded pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    Email a Todos
                  </div>
                </button>
              </div>
            </div>

            {/* Attendees Grid - 5 columns */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {attendees
                .filter((attendee) =>
                  attendee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  attendee.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  attendee.room.includes(searchQuery)
                )
                .map((attendee) => {
                  const typeConfig = {
                    hospedado: { bg: "bg-blue-500", text: "text-white", label: "Hospedado", icon: "🏨" },
                    historico: { bg: "bg-purple-500", text: "text-white", label: "Histórico", icon: "📋" },
                    invitado: { bg: "bg-emerald-500", text: "text-white", label: "Invitado", icon: "🎫" },
                  }
                  const config = typeConfig[attendee.type]

                  return (
                    <Card
                      key={attendee.id}
                      className={`p-2 hover:shadow-md transition-all border flex flex-col relative h-full`}
                    >
                      <div className="flex items-start justify-between gap-1">
                        <Avatar className="h-10 w-10 flex-shrink-0">
                          <AvatarImage src={attendee.avatar || "/placeholder.svg"} alt={attendee.name} />
                          <AvatarFallback className="bg-blue-600 text-white font-bold text-sm">
                            {attendee.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        {attendee.vip && (
                          <Badge className="bg-amber-500 text-white text-xs font-bold px-1 h-5 flex-shrink-0">
                            VIP
                          </Badge>
                        )}
                      </div>

                      <div className="mt-1 min-h-0 flex-1">
                        <p className="font-semibold text-xs text-foreground line-clamp-1 leading-none">{attendee.name}</p>
                        <p className="text-xs text-muted-foreground line-clamp-1 leading-none">{attendee.email}</p>
                      </div>

                      <Badge className={`${config.bg} ${config.text} text-xs font-medium text-center mt-1`}>
                        {config.label}
                      </Badge>

                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute bottom-2 right-2 h-6 w-6 p-0 hover:bg-destructive/10 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </Card>
                  )
                })}
            </div>
            {attendees.filter((attendee) =>
              attendee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              attendee.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
              attendee.room.includes(searchQuery)
            ).length === 0 && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No se encontraron clientes</p>
              </div>
            )}
          </div>
        </Card>

        {/* Modal para agregar clientes */}
        <Suspense fallback={<Loading />}>
          <Dialog open={addGuestDialogOpen} onOpenChange={setAddGuestDialogOpen}>
            <DialogContent className="sm:max-w-md max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Agregar Cliente al Evento</DialogTitle>
                <DialogDescription>
                  Selecciona un cliente hospedado para agregarlo a este evento
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                {/* Buscador */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar cliente..."
                    className="pl-10"
                    value={addGuestSearchQuery}
                    onChange={(e) => setAddGuestSearchQuery(e.target.value)}
                  />
                </div>

                {/* Lista de clientes disponibles */}
                <div className="space-y-2 max-h-[50vh] overflow-y-auto">
                  {availableGuests
                    .filter((guest) =>
                      guest.name.toLowerCase().includes(addGuestSearchQuery.toLowerCase()) ||
                      guest.email.toLowerCase().includes(addGuestSearchQuery.toLowerCase()) ||
                      guest.room.includes(addGuestSearchQuery)
                    )
                    .map((guest) => (
                      <Card
                        key={guest.id}
                        className="p-3 cursor-pointer hover:bg-primary/5 transition-colors border"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-sm text-foreground">{guest.name}</p>
                            <p className="text-xs text-muted-foreground">{guest.email}</p>
                            <div className="flex gap-2 mt-1">
                              <Badge variant="outline" className="text-xs">
                                Hab. {guest.room}
                              </Badge>
                              {guest.vip && (
                                <Badge className="bg-amber-500 text-white text-xs">VIP</Badge>
                              )}
                            </div>
                          </div>
                          <Button
                            size="sm"
                            className="gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white shrink-0"
                            onClick={() => {
                              alert(`${guest.name} ha sido agregado al evento`)
                              setAddGuestDialogOpen(false)
                              setAddGuestSearchQuery("")
                            }}
                          >
                            <Plus className="w-3 h-3" />
                            Agregar
                          </Button>
                        </div>
                      </Card>
                    ))}
                </div>

                {availableGuests.filter((guest) =>
                  guest.name.toLowerCase().includes(addGuestSearchQuery.toLowerCase()) ||
                  guest.email.toLowerCase().includes(addGuestSearchQuery.toLowerCase()) ||
                  guest.room.includes(addGuestSearchQuery)
                ).length === 0 && (
                  <div className="text-center py-6">
                    <p className="text-sm text-muted-foreground">No se encontraron clientes disponibles</p>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </Suspense>
      </div>
    </div>
  )
}
