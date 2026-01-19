"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Dumbbell, Waves, Sparkles, Video, Coffee, UtensilsCrossed, LayoutGrid, Clock } from "lucide-react"

type Facility = {
  id: string
  name: string
  type: string
  capacity: number
  icon: typeof Dumbbell
  color: string
}

type Booking = {
  facilityId: string
  clientName: string
  clientRoom: string
  time: string
  duration: number
  status: "confirmed" | "pending"
}

const mockFacilities: Facility[] = [
  { id: "1", name: "Gimnasio", type: "fitness", capacity: 15, icon: Dumbbell, color: "bg-orange-500" },
  { id: "2", name: "Piscina", type: "recreation", capacity: 30, icon: Waves, color: "bg-blue-500" },
  { id: "3", name: "Spa", type: "wellness", capacity: 8, icon: Sparkles, color: "bg-purple-500" },
  { id: "4", name: "Sala de Conferencias A", type: "business", capacity: 50, icon: Video, color: "bg-teal-500" },
  { id: "5", name: "Sala de Conferencias B", type: "business", capacity: 25, icon: Video, color: "bg-cyan-500" },
  { id: "6", name: "Cafetería", type: "dining", capacity: 40, icon: Coffee, color: "bg-amber-500" },
  { id: "7", name: "Restaurante Premium", type: "dining", capacity: 60, icon: UtensilsCrossed, color: "bg-rose-500" },
]

const mockBookings: Booking[] = [
  { facilityId: "1", clientName: "Juan Pérez", clientRoom: "301", time: "08:00", duration: 60, status: "confirmed" },
  { facilityId: "1", clientName: "María García", clientRoom: "205", time: "10:00", duration: 60, status: "confirmed" },
  { facilityId: "2", clientName: "Carlos López", clientRoom: "412", time: "09:00", duration: 120, status: "confirmed" },
  { facilityId: "2", clientName: "Ana Martínez", clientRoom: "308", time: "14:00", duration: 60, status: "pending" },
  { facilityId: "3", clientName: "Laura Sánchez", clientRoom: "501", time: "11:00", duration: 60, status: "confirmed" },
  {
    facilityId: "4",
    clientName: "Empresa Tech Corp",
    clientRoom: "N/A",
    time: "09:00",
    duration: 180,
    status: "confirmed",
  },
]

export default function FacilitiesPage() {
  const [facilities, setFacilities] = useState<Facility[]>(mockFacilities)
  const [bookings, setBookings] = useState<Booking[]>(mockBookings)
  const [viewMode, setViewMode] = useState<"list" | "timeline">("timeline")
  const [newBooking, setNewBooking] = useState({
    facilityId: "",
    clientName: "",
    clientRoom: "",
    time: "",
    duration: 60,
  })
  const [dialogOpen, setDialogOpen] = useState(false)
  const [addFacilityOpen, setAddFacilityOpen] = useState(false)

  const timeSlots = Array.from({ length: 17 }, (_, i) => {
    const hour = i + 7
    return `${hour.toString().padStart(2, "0")}:00`
  })

  const getBookingForSlot = (facilityId: string, time: string) => {
    return bookings.find((booking) => {
      const bookingStartHour = Number.parseInt(booking.time.split(":")[0])
      const bookingStartMinute = Number.parseInt(booking.time.split(":")[1] || "0")
      const bookingDurationHours = booking.duration / 60
      const slotHour = Number.parseInt(time.split(":")[0])

      // Verificar si este slot está dentro del rango de la reserva
      const slotInHours = slotHour
      const bookingStartInHours = bookingStartHour + bookingStartMinute / 60
      const bookingEndInHours = bookingStartInHours + bookingDurationHours

      return booking.facilityId === facilityId && slotInHours >= bookingStartInHours && slotInHours < bookingEndInHours
    })
  }

  const getBookingSpan = (booking: Booking) => {
    return booking.duration / 60
  }

  const isBookingStart = (facilityId: string, time: string) => {
    const booking = bookings.find((b) => b.facilityId === facilityId && b.time === time)
    return booking
  }

  const handleAddBooking = () => {
    if (newBooking.facilityId && newBooking.clientName && newBooking.time) {
      setBookings([
        ...bookings,
        {
          ...newBooking,
          status: "confirmed",
        },
      ])
      setNewBooking({ facilityId: "", clientName: "", clientRoom: "", time: "", duration: 60 })
      setDialogOpen(false)
    }
  }

  const handleAddFacility = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const newFacility: Facility = {
      id: (facilities.length + 1).toString(),
      name: formData.get("name") as string,
      type: formData.get("type") as string,
      capacity: Number.parseInt(formData.get("capacity") as string),
      icon: Dumbbell,
      color: "bg-gray-500",
    }
    setFacilities([...facilities, newFacility])
    setAddFacilityOpen(false)
  }

  return (
    <div className="p-8 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-1">Gestión de Facilities</h1>
          <p className="text-muted-foreground">Administra los servicios y espacios del hotel</p>
        </div>
        <div className="flex gap-2">
          <Button variant={viewMode === "list" ? "default" : "outline"} onClick={() => setViewMode("list")} size="sm">
            <LayoutGrid className="w-4 h-4 mr-2" />
            Lista
          </Button>
          <Button
            variant={viewMode === "timeline" ? "default" : "outline"}
            onClick={() => setViewMode("timeline")}
            size="sm"
          >
            <Clock className="w-4 h-4 mr-2" />
            Timeline
          </Button>
          <Dialog open={addFacilityOpen} onOpenChange={setAddFacilityOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Agregar Facility
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Agregar Nueva Facility</DialogTitle>
                <DialogDescription>Configure un nuevo servicio o espacio para el hotel</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddFacility} className="space-y-4">
                <div>
                  <Label htmlFor="name">Nombre</Label>
                  <Input id="name" name="name" placeholder="Ej: Gimnasio" required />
                </div>
                <div>
                  <Label htmlFor="type">Tipo</Label>
                  <Select name="type" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fitness">Fitness</SelectItem>
                      <SelectItem value="recreation">Recreación</SelectItem>
                      <SelectItem value="wellness">Bienestar</SelectItem>
                      <SelectItem value="business">Negocios</SelectItem>
                      <SelectItem value="dining">Gastronomía</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="capacity">Capacidad</Label>
                  <Input id="capacity" name="capacity" type="number" placeholder="15" required />
                </div>
                <Button type="submit" className="w-full">
                  Agregar Facility
                </Button>
              </form>
            </DialogContent>
          </Dialog>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Nueva Reserva
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Nueva Reserva Manual</DialogTitle>
                <DialogDescription>Crea una reserva de facility para un cliente</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="facility">Facility</Label>
                  <Select
                    value={newBooking.facilityId}
                    onValueChange={(value) => setNewBooking({ ...newBooking, facilityId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar facility" />
                    </SelectTrigger>
                    <SelectContent>
                      {facilities.map((facility) => (
                        <SelectItem key={facility.id} value={facility.id}>
                          {facility.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="clientName">Nombre del Cliente</Label>
                  <Input
                    id="clientName"
                    value={newBooking.clientName}
                    onChange={(e) => setNewBooking({ ...newBooking, clientName: e.target.value })}
                    placeholder="Juan Pérez"
                  />
                </div>
                <div>
                  <Label htmlFor="clientRoom">Habitación</Label>
                  <Input
                    id="clientRoom"
                    value={newBooking.clientRoom}
                    onChange={(e) => setNewBooking({ ...newBooking, clientRoom: e.target.value })}
                    placeholder="301"
                  />
                </div>
                <div>
                  <Label htmlFor="time">Hora de Inicio</Label>
                  <Select
                    value={newBooking.time}
                    onValueChange={(value) => setNewBooking({ ...newBooking, time: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar hora" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.map((slot) => (
                        <SelectItem key={slot} value={slot}>
                          {slot}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="duration">Duración (minutos)</Label>
                  <Select
                    value={newBooking.duration.toString()}
                    onValueChange={(value) => setNewBooking({ ...newBooking, duration: Number.parseInt(value) })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="60">1 hora</SelectItem>
                      <SelectItem value="120">2 horas</SelectItem>
                      <SelectItem value="180">3 horas</SelectItem>
                      <SelectItem value="240">4 horas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleAddBooking} className="w-full">
                  Crear Reserva
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* List View */}
      {viewMode === "list" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {facilities.map((facility) => {
            const Icon = facility.icon
            const facilityBookings = bookings.filter((b) => b.facilityId === facility.id)
            return (
              <Card key={facility.id} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-4">
                  <div className={`${facility.color} p-3 rounded-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{facility.name}</h3>
                    <p className="text-sm text-muted-foreground capitalize mb-3">{facility.type}</p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Capacidad: {facility.capacity}</span>
                      <span className="font-medium">{facilityBookings.length} reservas hoy</span>
                    </div>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      )}

      {/* Timeline View */}
      {viewMode === "timeline" && (
        <div className="bg-card rounded-lg border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <div style={{ width: "fit-content", minWidth: "100%" }}>
              {/* Header con horas */}
              <div className="flex border-b border-border bg-muted/50 sticky top-0 z-10">
                <div className="w-64 p-4 font-semibold border-r border-border bg-muted/50 shrink-0">Facility</div>
                {timeSlots.map((slot) => (
                  <div key={slot} className="w-32 p-3 text-center text-sm font-medium border-r border-border shrink-0">
                    {slot}
                  </div>
                ))}
              </div>

              {/* Filas de facilities */}
              {facilities.map((facility, idx) => {
                const Icon = facility.icon
                return (
                  <div key={facility.id} className={`flex ${idx % 2 === 0 ? "bg-background" : "bg-muted/30"}`}>
                    {/* Info de facility */}
                    <div className="w-64 p-4 border-r border-border flex items-center gap-3 shrink-0">
                      <div className={`${facility.color} p-2 rounded-lg shrink-0`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm truncate">{facility.name}</p>
                        <p className="text-xs text-muted-foreground capitalize">{facility.type}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">Cap. {facility.capacity}</p>
                      </div>
                    </div>

                    <div className="flex">
                      {timeSlots.map((slot) => {
                        const bookingAtStart = isBookingStart(facility.id, slot)
                        const booking = getBookingForSlot(facility.id, slot)

                        // Si hay una reserva que empieza en este slot
                        if (bookingAtStart) {
                          const durationHours = bookingAtStart.duration / 60
                          const widthInColumns = durationHours

                          return (
                            <div
                              key={slot}
                              className="relative border-r border-border group shrink-0"
                              style={{ width: `${widthInColumns * 128}px` }}
                            >
                              <div
                                className={`absolute inset-2 rounded-lg ${
                                  bookingAtStart.status === "confirmed"
                                    ? "bg-gradient-to-br from-green-500/30 to-green-600/20 border-2 border-green-500"
                                    : "bg-gradient-to-br from-amber-500/30 to-amber-600/20 border-2 border-amber-500"
                                } p-3 flex flex-col justify-center hover:shadow-lg transition-all cursor-pointer hover:scale-[1.02] min-h-[72px]`}
                              >
                                <p className="text-sm font-bold truncate text-foreground">
                                  {bookingAtStart.clientName}
                                </p>
                                <p className="text-[10px] text-muted-foreground truncate">
                                  Hab. {bookingAtStart.clientRoom}
                                </p>
                                <p className="text-[10px] text-muted-foreground font-medium mt-0.5">
                                  {bookingAtStart.duration / 60}h
                                </p>
                              </div>

                              {/* Tooltip mejorado */}
                              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-20">
                                <div className="bg-popover border border-border rounded-lg shadow-xl p-4 min-w-[220px]">
                                  <p className="font-bold text-sm mb-2">{bookingAtStart.clientName}</p>
                                  <div className="space-y-1">
                                    <p className="text-xs text-muted-foreground flex items-center gap-2">
                                      <span className="font-medium">Habitación:</span> {bookingAtStart.clientRoom}
                                    </p>
                                    <p className="text-xs text-muted-foreground flex items-center gap-2">
                                      <span className="font-medium">Hora:</span> {bookingAtStart.time}
                                    </p>
                                    <p className="text-xs text-muted-foreground flex items-center gap-2">
                                      <span className="font-medium">Duración:</span> {bookingAtStart.duration / 60}{" "}
                                      hora(s)
                                    </p>
                                  </div>
                                  <div className="mt-2 pt-2 border-t border-border">
                                    <p
                                      className={`text-xs font-semibold ${
                                        bookingAtStart.status === "confirmed" ? "text-green-600" : "text-amber-600"
                                      }`}
                                    >
                                      {bookingAtStart.status === "confirmed" ? "✓ Confirmada" : "⏳ Pendiente"}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )
                        }
                        // Si hay una reserva que cubre este slot pero no empieza aquí, no renderizar nada
                        else if (booking) {
                          return null
                        }
                        // Slot libre
                        else {
                          return (
                            <div
                              key={slot}
                              className="w-32 border-r border-border p-2 shrink-0 min-h-[88px] flex items-center"
                            >
                              <div className="w-full border-2 border-dashed border-muted-foreground/20 rounded-md h-16 flex items-center justify-center hover:border-primary/30 hover:bg-primary/5 transition-colors cursor-pointer">
                                <span className="text-xs text-muted-foreground/50 font-medium">Libre</span>
                              </div>
                            </div>
                          )
                        }
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
