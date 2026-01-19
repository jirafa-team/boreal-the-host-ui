"use client"

import type React from "react"

import { useState } from "react"
import { ArrowLeft, Plus, Calendar, Clock, MapPin, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface Event {
  id: string
  title: string
  date: string
  time: string
  location: string
  capacity: number
  attendees: number
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([
    {
      id: "1",
      title: "Conferencia Q1 2024",
      date: "2024-03-15",
      time: "10:00",
      location: "Salón Principal",
      capacity: 100,
      attendees: 78,
    },
    {
      id: "2",
      title: "Cena de Gala",
      date: "2024-03-20",
      time: "20:00",
      location: "Restaurante",
      capacity: 50,
      attendees: 45,
    },
  ])
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    time: "",
    location: "",
    capacity: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newEvent: Event = {
      id: Date.now().toString(),
      title: formData.title,
      date: formData.date,
      time: formData.time,
      location: formData.location,
      capacity: Number.parseInt(formData.capacity),
      attendees: 0,
    }
    setEvents([...events, newEvent])
    setFormData({ title: "", date: "", time: "", location: "", capacity: "" })
    setShowForm(false)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card border-b border-border">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => window.history.back()}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-lg font-semibold text-foreground">Eventos</h1>
              <p className="text-xs text-muted-foreground">{events.length} eventos activos</p>
            </div>
          </div>
          <Button size="icon" onClick={() => setShowForm(!showForm)}>
            <Plus className="w-5 h-5" />
          </Button>
        </div>
      </header>

      {/* Create Form */}
      {showForm && (
        <div className="p-4 bg-muted border-b border-border">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="title" className="text-sm text-foreground">
                Título del Evento
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                className="mt-1"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="date" className="text-sm text-foreground">
                  Fecha
                </Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="time" className="text-sm text-foreground">
                  Hora
                </Label>
                <Input
                  id="time"
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  required
                  className="mt-1"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="location" className="text-sm text-foreground">
                Ubicación
              </Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                required
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="capacity" className="text-sm text-foreground">
                Capacidad
              </Label>
              <Input
                id="capacity"
                type="number"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                required
                className="mt-1"
              />
            </div>
            <div className="flex gap-2">
              <Button type="submit" className="flex-1">
                Crear Evento
              </Button>
              <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                Cancelar
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Events List */}
      <div className="p-4 space-y-3">
        {events.map((event) => (
          <Card key={event.id} className="p-4">
            <h3 className="font-semibold text-foreground mb-3">{event.title}</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>
                  {new Date(event.date).toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" })}
                </span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>{event.time}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span>{event.location}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Users className="w-4 h-4" />
                <span>
                  {event.attendees} / {event.capacity} asistentes
                </span>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-border">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Ocupación</span>
                <span className="font-medium text-foreground">
                  {Math.round((event.attendees / event.capacity) * 100)}%
                </span>
              </div>
              <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-primary" style={{ width: `${(event.attendees / event.capacity) * 100}%` }} />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
