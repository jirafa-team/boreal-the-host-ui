"use client"

import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Calendar, Clock, MapPin, Users, Edit, Trash2, Mail } from 'lucide-react'
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

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
}

export default function EventDetailPage() {
  const params = useParams()
  const router = useRouter()
  const eventId = Number(params.id)

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
        {/* Main Content */}
        <div className="space-y-6">
          {/* Event Image */}
          <Card className="overflow-hidden">
            <img src={event.image || "/placeholder.svg"} alt={event.name} className="w-full h-64 object-cover" />
          </Card>

          {/* Event Details */}
          <Card className="p-6">
            <h2 className="text-xl font-bold text-foreground mb-4">Detalles del Evento</h2>

            <div className="space-y-4 mb-6">
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

            <div className="border-t pt-4">
              <h3 className="font-semibold text-foreground mb-2">Descripción</h3>
              <p className="text-muted-foreground leading-relaxed">{event.description}</p>
            </div>
          </Card>
        </div>

        {/* Attendees List - Full Width */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-foreground">Clientes Registrados</h2>
            <Button variant="outline" size="sm" className="gap-2 bg-transparent">
              <Mail className="w-4 h-4" />
              Enviar Email a Todos
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {attendees.map((attendee) => (
              <Card key={attendee.id} className="p-4 hover:bg-accent/50 transition-colors">
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={attendee.avatar || "/placeholder.svg"} />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {attendee.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-foreground text-sm">{attendee.name}</p>
                        {attendee.vip && (
                          <Badge variant="secondary" className="text-xs">
                            VIP
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">{attendee.email}</p>
                    </div>
                  </div>

                  <div className="text-xs space-y-1">
                    <p className="text-muted-foreground">Habitación <span className="font-medium text-foreground">{attendee.room}</span></p>
                    <p className="text-muted-foreground">Reg. {attendee.registeredAt}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
