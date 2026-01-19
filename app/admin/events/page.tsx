"use client"

import { useState } from "react"
import { Calendar, Plus, Search, MapPin, Clock, Edit, Trash2, Eye } from 'lucide-react'
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { useRouter } from 'next/navigation'

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

export default function EventsManagement() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [events, setEvents] = useState<Event[]>([
    {
      id: 1,
      name: "Conferencia Anual Q1",
      description: "Presentación de resultados del primer trimestre y estrategias futuras",
      date: "2024-11-13",
      time: "10:00",
      location: "Salón Principal",
      capacity: 200,
      registered: 142,
      category: "conference",
      status: "upcoming",
    },
    {
      id: 2,
      name: "Cena de Gala",
      description: "Cena formal con menú de autor y música en vivo",
      date: "2024-11-14",
      time: "20:00",
      location: "Restaurante",
      capacity: 80,
      registered: 65,
      category: "dining",
      status: "upcoming",
    },
    {
      id: 3,
      name: "Workshop de Innovación",
      description: "Taller práctico sobre nuevas tecnologías y metodologías ágiles",
      date: "2024-11-15",
      time: "14:00",
      location: "Sala de Conferencias B",
      capacity: 50,
      registered: 28,
      category: "workshop",
      status: "upcoming",
    },
  ])

  const [newEvent, setNewEvent] = useState({
    name: "",
    description: "",
    date: "",
    time: "",
    location: "",
    capacity: "",
    category: "conference" as Event["category"],
  })

  const handleCreateEvent = () => {
    const event: Event = {
      id: events.length + 1,
      name: newEvent.name,
      description: newEvent.description,
      date: newEvent.date,
      time: newEvent.time,
      location: newEvent.location,
      capacity: Number.parseInt(newEvent.capacity),
      registered: 0,
      category: newEvent.category,
      status: "upcoming",
    }
    setEvents([...events, event])
    setCreateDialogOpen(false)
    setNewEvent({
      name: "",
      description: "",
      date: "",
      time: "",
      location: "",
      capacity: "",
      category: "conference",
    })
  }

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

  const filteredEvents = events.filter(
    (event) =>
      event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-3xl font-bold text-foreground">Gestión de Eventos</h1>
          <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Crear Evento
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Crear Nuevo Evento</DialogTitle>
                <DialogDescription>Completa los datos del evento que será visible para los clientes</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre del Evento</Label>
                  <Input
                    id="name"
                    placeholder="Ej: Conferencia Anual 2024"
                    value={newEvent.name}
                    onChange={(e) => setNewEvent({ ...newEvent, name: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descripción</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe el evento..."
                    value={newEvent.description}
                    onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Fecha</Label>
                    <Input
                      id="date"
                      type="date"
                      value={newEvent.date}
                      onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="time">Hora</Label>
                    <Input
                      id="time"
                      type="time"
                      value={newEvent.time}
                      onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Ubicación</Label>
                  <Input
                    id="location"
                    placeholder="Ej: Salón Principal"
                    value={newEvent.location}
                    onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="capacity">Capacidad</Label>
                    <Input
                      id="capacity"
                      type="number"
                      placeholder="100"
                      value={newEvent.capacity}
                      onChange={(e) => setNewEvent({ ...newEvent, capacity: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Categoría</Label>
                    <Select
                      value={newEvent.category}
                      onValueChange={(value) => setNewEvent({ ...newEvent, category: value as Event["category"] })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="conference">Conferencia</SelectItem>
                        <SelectItem value="workshop">Workshop</SelectItem>
                        <SelectItem value="social">Social</SelectItem>
                        <SelectItem value="dining">Gastronomía</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <Button onClick={handleCreateEvent} className="w-full" size="lg">
                Crear Evento
              </Button>
            </DialogContent>
          </Dialog>
        </div>
        <p className="text-muted-foreground">Gestiona los eventos visibles para todos los clientes del hotel</p>
      </div>

      <Card className="p-6 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar eventos por nombre o ubicación..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredEvents.map((event) => {
          const occupancyPercent = Math.round((event.registered / event.capacity) * 100)
          const isNearCapacity = occupancyPercent >= 80

          return (
            <Card key={event.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-3 h-3 rounded-full ${getCategoryColor(event.category)}`} />
                    <Badge variant="outline" className="text-xs">
                      {getCategoryLabel(event.category)}
                    </Badge>
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-1">{event.name}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">{event.description}</p>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {new Date(event.date).toLocaleDateString("es-ES", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>{event.time}</span>
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span>{event.location}</span>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Ocupación</span>
                  <span className={`font-semibold ${isNearCapacity ? "text-orange-600" : "text-foreground"}`}>
                    {event.registered} / {event.capacity} ({occupancyPercent}%)
                  </span>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all ${isNearCapacity ? "bg-orange-500" : "bg-primary"}`}
                    style={{ width: `${occupancyPercent}%` }}
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 gap-2 bg-transparent"
                  onClick={() => router.push(`/admin/events/${event.id}`)}
                >
                  <Eye className="w-4 h-4" />
                  Ver Detalles
                </Button>
                <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 text-destructive hover:text-destructive bg-transparent"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          )
        })}
      </div>

      {filteredEvents.length === 0 && (
        <Card className="p-12 text-center">
          <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No se encontraron eventos</h3>
          <p className="text-sm text-muted-foreground">Intenta con otro término de búsqueda</p>
        </Card>
      )}
    </div>
  )
}
