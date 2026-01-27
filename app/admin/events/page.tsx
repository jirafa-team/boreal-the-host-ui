"use client"

import { useState } from "react"
import { Calendar, Plus, Search, MapPin, Clock, Edit, Trash2, Eye, Users, CalendarPlus } from "lucide-react"
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
import { useRouter } from "next/navigation"
import { useLanguage } from "@/lib/i18n-context"

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

type Person = {
  id: number
  name: string
  email: string
  phone: string
  room: string
  checkIn: string
  checkOut: string
  status: "checked-in" | "reserved" | "checked-out"
}

export default function EventsManagement() {
  const router = useRouter()
  const { t } = useLanguage()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedLocation, setSelectedLocation] = useState("")
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [addPeopleDialogOpen, setAddPeopleDialogOpen] = useState(false)
  const [addPeopleSearchQuery, setAddPeopleSearchQuery] = useState("")
  const [selectedEventForPeople, setSelectedEventForPeople] = useState<Event | null>(null)

  const [availablePeople] = useState<Person[]>([
    {
      id: 1,
      name: "Carlos Mendoza",
      email: "carlos.mendoza@email.com",
      phone: "+34 612 345 678",
      room: "501",
      checkIn: "2025-01-10",
      checkOut: "2025-01-15",
      status: "checked-in",
    },
    {
      id: 2,
      name: "María García",
      email: "maria.garcia@email.com",
      phone: "+34 698 765 432",
      room: "302",
      checkIn: "2025-01-12",
      checkOut: "2025-01-14",
      status: "checked-in",
    },
    {
      id: 3,
      name: "John Smith",
      email: "john.smith@email.com",
      phone: "+1 555 123 4567",
      room: "204",
      checkIn: "2025-01-08",
      checkOut: "2025-01-18",
      status: "checked-in",
    },
    {
      id: 4,
      name: "Sophie Dubois",
      email: "sophie.dubois@email.com",
      phone: "+33 6 12 34 56 78",
      room: "405",
      checkIn: "2025-01-15",
      checkOut: "2025-01-20",
      status: "reserved",
    },
    {
      id: 5,
      name: "Marco Rossi",
      email: "marco.rossi@email.com",
      phone: "+39 333 123 4567",
      room: "103",
      checkIn: "2025-01-09",
      checkOut: "2025-01-16",
      status: "checked-in",
    },
  ])
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

  const [dateFilter, setDateFilter] = useState({
    start: "",
    end: "",
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
      conference: t("admin.categoryConference"),
      workshop: t("admin.categoryWorkshop"),
      social: t("admin.categorySocial"),
      dining: t("admin.categoryDining"),
    }
    return labels[category]
  }

  const filteredEvents = events.filter(
    (event) => {
      const matchesSearch = 
        event.name.toLowerCase().includes(searchQuery.toLowerCase())
      
      const matchesDate = !selectedDate || event.date === selectedDate
      
      const matchesLocation = !selectedLocation || selectedLocation === "all" || event.location === selectedLocation
      
      return matchesSearch && matchesDate && matchesLocation
    }
  )

  return (
    <div className="p-8">
      {/* Sticky Navigation Bar with rounded borders */}
      <div className="sticky top-4 z-40 mx-4">
        <div className="bg-white rounded-lg shadow-lg border border-gray-200">
          <div className="px-8 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-foreground">{t("admin.eventsTitle")}</h1>
                <p className="text-sm text-muted-foreground">Gestiona y organiza todos los eventos del hotel</p>
              </div>
              <div className="flex gap-4 items-center ml-auto">
                {/* Create Event Button */}
                <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
                  <DialogTrigger asChild>
                    <button 
                      className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-red-600 to-red-700 text-white shadow-md hover:shadow-lg transition-all duration-300 hover:scale-110 group relative"
                      title="Crear evento"
                    >
                      <CalendarPlus className="w-5 h-5" />
                      <span className="absolute top-full mt-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                        Crear Evento
                      </span>
                    </button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>{t("admin.createEvent")}</DialogTitle>
                      <DialogDescription>{t("admin.completeEventData")}</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">{t("admin.eventName")}</Label>
                        <Input
                          id="name"
                          placeholder={t("admin.eventNamePlaceholder")}
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
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Events Content */}
      <div className="mt-8">
        <Card className="p-6 mb-6">
          <div className="flex gap-4 items-end">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar eventos por nombre..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex-1">
              <Label htmlFor="date-filter" className="text-xs mb-1 block">Fecha</Label>
              <Input
                id="date-filter"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>
            
            <div className="flex-1">
              <Label htmlFor="location-filter" className="text-xs mb-1 block">Ubicación</Label>
              <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                <SelectTrigger id="location-filter">
                  <SelectValue placeholder="Seleccionar ubicación" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  {Array.from(new Set(events.map((e) => e.location))).map((location) => (
                    <SelectItem key={location} value={location}>
                      {location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {(selectedDate || selectedLocation) && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  setSelectedDate("")
                  setSelectedLocation("")
                }}
              >
                Limpiar
              </Button>
            )}
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => {
            const occupancyPercent = Math.round((event.registered / event.capacity) * 100)
            const isNearCapacity = occupancyPercent >= 80

            return (
              <Card key={event.id} className="p-6 hover:shadow-lg transition-shadow flex flex-col overflow-hidden">
                {/* Chips de ubicación y fecha/hora en la parte superior */}
                <div className="flex gap-2 mb-4 flex-wrap">
                  <Badge className="bg-amber-700 hover:bg-amber-800 text-white text-xs gap-1.5 flex items-center font-bold">
                    <MapPin className="w-3.5 h-3.5" />
                    {event.location}
                  </Badge>
                  <Badge className="bg-sky-100 hover:bg-sky-200 text-black text-xs font-bold gap-1.5 flex items-center border-sky-200">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(event.date).toLocaleDateString("es-ES", {
                      month: "short",
                      day: "numeric",
                    })}
                    <span className="text-black/70">•</span>
                    <Clock className="w-3.5 h-3.5" />
                    {event.time}
                  </Badge>
                </div>

                {/* Header con nombre y descripción */}
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-foreground">{event.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{event.description}</p>
                </div>

                {/* Ocupación */}
                <div className="space-y-2 mb-4 flex-grow">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Ocupación</span>
                    <span className={`font-semibold ${isNearCapacity ? "text-orange-600" : "text-foreground"}`}>
                      {event.registered}/{event.capacity} ({occupancyPercent}%)
                    </span>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all ${isNearCapacity ? "bg-orange-500" : "bg-primary"}`}
                      style={{ width: `${occupancyPercent}%` }}
                    />
                  </div>
                </div>

                {/* Botones de acción */}
                <div className="flex gap-2 mt-auto flex-col">
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="flex-1 gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg"
                      onClick={() => router.push(`/admin/events/${event.id}`)}
                    >
                      <Eye className="w-4 h-4" />
                      Ver Detalles
                    </Button>
                    <Button
                      size="sm"
                      className="flex-1 gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg"
                      onClick={() => {
                        setSelectedEventForPeople(event)
                        setAddPeopleDialogOpen(true)
                      }}
                    >
                      <Users className="w-4 h-4" />
                      Agregar Personas
                    </Button>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 gap-2 bg-transparent"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 gap-2 text-destructive hover:text-destructive bg-transparent"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
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

        {/* Modal para agregar personas al evento */}
        <Dialog open={addPeopleDialogOpen} onOpenChange={setAddPeopleDialogOpen}>
          <DialogContent className="sm:max-w-md max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Agregar Personas al Evento</DialogTitle>
              <DialogDescription>
                {selectedEventForPeople && `Evento: ${selectedEventForPeople.name}`}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              {/* Buscador */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nombre, email o habitación..."
                  className="pl-10"
                  value={addPeopleSearchQuery}
                  onChange={(e) => setAddPeopleSearchQuery(e.target.value)}
                />
              </div>

              {/* Lista de personas */}
              <div className="space-y-2 max-h-[50vh] overflow-y-auto">
                {availablePeople
                  .filter((person) =>
                    person.name.toLowerCase().includes(addPeopleSearchQuery.toLowerCase()) ||
                    person.email.toLowerCase().includes(addPeopleSearchQuery.toLowerCase()) ||
                    person.room.includes(addPeopleSearchQuery)
                  )
                  .map((person) => (
                    <Card
                      key={person.id}
                      className="p-3 cursor-pointer hover:bg-primary/5 transition-colors border"
                      onClick={() => {
                        alert(`${person.name} ha sido agregado al evento`)
                        setAddPeopleDialogOpen(false)
                        setAddPeopleSearchQuery("")
                      }}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm text-foreground">{person.name}</p>
                          <p className="text-xs text-muted-foreground">{person.email}</p>
                          <div className="flex gap-2 mt-1 flex-wrap">
                            <Badge variant="outline" className="text-xs">
                              Hab. {person.room}
                            </Badge>
                            <Badge
                              variant="secondary"
                              className={`text-xs ${
                                person.status === "checked-in"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-blue-100 text-blue-800"
                              }`}
                            >
                              {person.status === "checked-in" ? "Hospedado" : "Reservado"}
                            </Badge>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          className="gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white shrink-0"
                          onClick={(e) => {
                            e.stopPropagation()
                            alert(`${person.name} ha sido agregado al evento`)
                            setAddPeopleDialogOpen(false)
                            setAddPeopleSearchQuery("")
                          }}
                        >
                          <Plus className="w-3 h-3" />
                          Agregar
                        </Button>
                      </div>
                    </Card>
                  ))}
              </div>

              {availablePeople.filter((person) =>
                person.name.toLowerCase().includes(addPeopleSearchQuery.toLowerCase()) ||
                person.email.toLowerCase().includes(addPeopleSearchQuery.toLowerCase())
              ).length === 0 && (
                <div className="text-center py-6">
                  <p className="text-sm text-muted-foreground">No se encontraron personas</p>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
