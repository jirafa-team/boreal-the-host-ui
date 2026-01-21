"use client"

import { Badge } from "@/components/ui/badge"
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

import React from "react"

type Facility = {
  id: string
  name: string
  type: string
  capacity: number
  icon: typeof Dumbbell
  color: string
  startTime: string
  endTime: string
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
  { id: "1", name: "Gimnasio", type: "fitness", capacity: 15, icon: Dumbbell, color: "bg-orange-500", startTime: "06:00", endTime: "22:00" },
  { id: "2", name: "Piscina", type: "recreation", capacity: 30, icon: Waves, color: "bg-blue-500", startTime: "08:00", endTime: "20:00" },
  { id: "3", name: "Spa", type: "wellness", capacity: 8, icon: Sparkles, color: "bg-purple-500", startTime: "09:00", endTime: "21:00" },
  { id: "4", name: "Sala de Conferencias A", type: "business", capacity: 50, icon: Video, color: "bg-teal-500", startTime: "07:00", endTime: "23:00" },
  { id: "5", name: "Sala de Conferencias B", type: "business", capacity: 25, icon: Video, color: "bg-cyan-500", startTime: "07:00", endTime: "23:00" },
  { id: "6", name: "Cafetería", type: "dining", capacity: 40, icon: Coffee, color: "bg-amber-500", startTime: "06:30", endTime: "23:00" },
  { id: "7", name: "Restaurante Premium", type: "dining", capacity: 60, icon: UtensilsCrossed, color: "bg-rose-500", startTime: "12:00", endTime: "23:30" },
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
  const [facilities, setFacilities] = React.useState<Facility[]>(mockFacilities)
  const [bookings, setBookings] = React.useState<Booking[]>(mockBookings)
  const [viewMode, setViewMode] = React.useState<"list" | "timeline">("timeline")
  const [newBooking, setNewBooking] = React.useState({
    facilityId: "",
    clientName: "",
    clientRoom: "",
    time: "",
    duration: 60,
  })
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [addFacilityOpen, setAddFacilityOpen] = React.useState(false)
  const [editingFacility, setEditingFacility] = React.useState<Facility | null>(null)
  const [editDialogOpen, setEditDialogOpen] = React.useState(false)
  const [selectedSlotBookings, setSelectedSlotBookings] = React.useState<Booking[]>([])
  const [bookingsDetailOpen, setBookingsDetailOpen] = React.useState(false)

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
      startTime: formData.get("startTime") as string,
      endTime: formData.get("endTime") as string,
      icon: Dumbbell,
      color: "bg-gray-500",
    }
    setFacilities([...facilities, newFacility])
    setAddFacilityOpen(false)
  }

  const handleEditFacility = (facility: Facility) => {
    setEditingFacility(facility)
    setEditDialogOpen(true)
  }

  const handleSaveEdit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!editingFacility) return
    const formData = new FormData(e.currentTarget)
    const updatedFacility: Facility = {
      ...editingFacility,
      name: formData.get("name") as string,
      type: formData.get("type") as string,
      capacity: Number.parseInt(formData.get("capacity") as string),
      startTime: formData.get("startTime") as string,
      endTime: formData.get("endTime") as string,
    }
    setFacilities(facilities.map((f) => (f.id === editingFacility.id ? updatedFacility : f)))
    setEditDialogOpen(false)
    setEditingFacility(null)
  }

  // Get all bookings for a facility at a specific time slot
  const getBookingsAtSlot = (facilityId: string, timeSlot: string): Booking[] => {
    return bookings.filter((b) => {
      if (b.facilityId !== facilityId) return false
      const bookingStart = parseInt(b.time.split(":")[0])
      const bookingEnd = bookingStart + b.duration / 60
      const slotTime = parseInt(timeSlot.split(":")[0])
      return slotTime >= bookingStart && slotTime < bookingEnd
    })
  }

  // Get occupancy percentage for a facility at a time slot
  const getOccupancyPercentage = (facilityId: string, timeSlot: string): number => {
    const facility = facilities.find((f) => f.id === facilityId)
    if (!facility) return 0
    const slotBookings = getBookingsAtSlot(facilityId, timeSlot)
    return Math.round((slotBookings.length / facility.capacity) * 100)
  }

  // Show bookings detail modal
  const handleShowBookingsDetail = (bookingsList: Booking[]) => {
    setSelectedSlotBookings(bookingsList)
    setBookingsDetailOpen(true)
  }

  // Determine if facility is multi-party (gym, pool, spa) or single-party (conference room)
  const isMultiPartyFacility = (facilityType: string): boolean => {
    return ["fitness", "recreation", "wellness", "dining"].includes(facilityType)
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
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="startTime">Hora de Apertura</Label>
                    <Input id="startTime" name="startTime" type="time" required />
                  </div>
                  <div>
                    <Label htmlFor="endTime">Hora de Cierre</Label>
                    <Input id="endTime" name="endTime" type="time" required />
                  </div>
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

      {/* Edit Facility Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Facility</DialogTitle>
            <DialogDescription>Actualiza los detalles del servicio o espacio</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSaveEdit} className="space-y-4">
            <div>
              <Label htmlFor="edit-name">Nombre</Label>
              <Input id="edit-name" name="name" defaultValue={editingFacility?.name} required />
            </div>
            <div>
              <Label htmlFor="edit-type">Tipo</Label>
              <Select name="type" defaultValue={editingFacility?.type} required>
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
              <Label htmlFor="edit-capacity">Capacidad</Label>
              <Input id="edit-capacity" name="capacity" type="number" defaultValue={editingFacility?.capacity} required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-startTime">Hora de Apertura</Label>
                <Input id="edit-startTime" name="startTime" type="time" defaultValue={editingFacility?.startTime} required />
              </div>
              <div>
                <Label htmlFor="edit-endTime">Hora de Cierre</Label>
                <Input id="edit-endTime" name="endTime" type="time" defaultValue={editingFacility?.endTime} required />
              </div>
            </div>
            <Button type="submit" className="w-full">
              Guardar Cambios
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Bookings Detail Dialog */}
      <Dialog open={bookingsDetailOpen} onOpenChange={setBookingsDetailOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Participantes del horario</DialogTitle>
            <DialogDescription>Listado de todos los usuarios reservados en este horario</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 max-h-[400px] overflow-y-auto">
            {selectedSlotBookings.length > 0 ? (
              <>
                <div className="bg-muted p-3 rounded-lg">
                  <p className="text-sm font-medium">
                    {selectedSlotBookings.length} de {facilities.find((f) => f.id === selectedSlotBookings[0]?.facilityId)?.capacity || 0} lugares ocupados
                  </p>
                  <div className="w-full bg-background rounded-full h-2 mt-2">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        (selectedSlotBookings.length / (facilities.find((f) => f.id === selectedSlotBookings[0]?.facilityId)?.capacity || 1)) * 100 > 80
                          ? "bg-red-500"
                          : (selectedSlotBookings.length / (facilities.find((f) => f.id === selectedSlotBookings[0]?.facilityId)?.capacity || 1)) * 100 > 50
                            ? "bg-amber-500"
                            : "bg-green-500"
                      }`}
                      style={{
                        width: `${(selectedSlotBookings.length / (facilities.find((f) => f.id === selectedSlotBookings[0]?.facilityId)?.capacity || 1)) * 100}%`,
                      }}
                    />
                  </div>
                </div>
                {selectedSlotBookings.map((booking, idx) => (
                  <Card key={idx} className="p-3">
                    <p className="font-semibold text-sm">{booking.clientName}</p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground mt-2">
                      <span>Habitación {booking.clientRoom}</span>
                      <Badge className={booking.status === "confirmed" ? "bg-green-600" : "bg-amber-600"}>
                        {booking.status === "confirmed" ? "Confirmado" : "Pendiente"}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {booking.time} - {booking.duration / 60}h
                    </p>
                  </Card>
                ))}
              </>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">No hay participantes en este horario</p>
            )}
          </div>
        </DialogContent>
      </Dialog>
      {viewMode === "list" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {facilities.map((facility) => {
            const Icon = facility.icon
            const facilityBookings = bookings.filter((b) => b.facilityId === facility.id)
            return (
              <Card key={facility.id} className="p-6 hover:shadow-lg transition-shadow relative">
                <div className="absolute top-6 right-6 space-y-2">
                  <div className="bg-primary text-primary-foreground p-3 rounded-lg text-sm font-semibold">
                    Capacidad: {facility.capacity}
                  </div>
                  <div className="bg-primary/80 text-primary-foreground p-3 rounded-lg text-sm font-medium">
                    {facility.startTime} - {facility.endTime}
                  </div>
                </div>

                <div className="flex items-start gap-4 mb-4">
                  <div className={`${facility.color} p-3 rounded-lg shrink-0`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{facility.name}</h3>
                    <p className="text-sm text-muted-foreground capitalize">{facility.type}</p>
                  </div>
                </div>
                <Button
                  onClick={() => handleEditFacility(facility)}
                  className="w-full px-3 py-2 text-sm font-medium rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                >
                  Editar
                </Button>
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
                    <div className="w-64 p-4 border-r border-border flex items-center gap-3 shrink-0 group relative">
                      <div className={`${facility.color} p-2 rounded-lg shrink-0`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm truncate">{facility.name}</p>
                        <p className="text-xs text-muted-foreground capitalize">{facility.type}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">Cap. {facility.capacity}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{facility.startTime} - {facility.endTime}</p>
                      </div>
                      <Button
                        onClick={() => handleEditFacility(facility)}
                        className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity px-2 py-1 text-xs rounded bg-primary/10 text-primary hover:bg-primary/20"
                      >
                        Editar
                      </Button>
                    </div>

                    <div className="flex">
                      {timeSlots.map((slot) => {
                        const bookingAtStart = isBookingStart(facility.id, slot)
                        const booking = getBookingForSlot(facility.id, slot)
                        const slotBookings = getBookingsAtSlot(facility.id, slot)
                        const occupancy = getOccupancyPercentage(facility.id, slot)

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
                                onClick={() => slotBookings.length > 0 && handleShowBookingsDetail(slotBookings)}
                              >
                                {/* Multi-party facilities show only capacity info */}
                                {isMultiPartyFacility(facility.type) ? (
                                  <div className="flex flex-col items-center justify-center gap-2">
                                    <p className="text-lg font-bold text-foreground">
                                      {slotBookings.length}/{facility.capacity}
                                    </p>
                                    <p className="text-[10px] text-muted-foreground">
                                      Ocupación: {occupancy}%
                                    </p>
                                  </div>
                                ) : (
                                  <>
                                    <p className="text-sm font-bold truncate text-foreground">
                                      {slotBookings.length > 1 ? `${slotBookings.length} participantes` : bookingAtStart.clientName}
                                    </p>
                                    <p className="text-[10px] text-muted-foreground truncate">
                                      {slotBookings.length > 1 ? `Ocupación: ${occupancy}%` : `Hab. ${bookingAtStart.clientRoom}`}
                                    </p>
                                    <div className="text-[10px] text-muted-foreground font-medium mt-0.5 flex items-center gap-2">
                                      <span>{bookingAtStart.duration / 60}h</span>
                                      {slotBookings.length > 0 && (
                                        <span className="text-xs px-1.5 py-0.5 rounded bg-primary/20 text-primary">
                                          {slotBookings.length}/{facility.capacity}
                                        </span>
                                      )}
                                    </div>
                                  </>
                                )}
                                
                                {/* Barra de ocupación */}
                                {slotBookings.length > 0 && (
                                  <div className="mt-2 w-full bg-black/10 rounded-full h-1.5">
                                    <div
                                      className={`h-1.5 rounded-full transition-all ${
                                        occupancy > 80
                                          ? "bg-red-500"
                                          : occupancy > 50
                                            ? "bg-amber-500"
                                            : "bg-green-500"
                                      }`}
                                      style={{ width: `${occupancy}%` }}
                                    />
                                  </div>
                                )}
                              </div>

                              {/* Tooltip mejorado */}
                              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-20">
                                <div className="bg-popover border border-border rounded-lg shadow-xl p-4 min-w-[280px]">
                                  <p className="font-bold text-sm mb-3">Detalles del horario {slot}</p>
                                  {slotBookings.length > 0 ? (
                                    <div className="space-y-2">
                                      <p className="text-xs text-muted-foreground">
                                        <span className="font-medium">Ocupación:</span> {slotBookings.length}/{facility.capacity} ({occupancy}%)
                                      </p>
                                      {slotBookings.length <= 3 ? (
                                        <div className="space-y-2">
                                          {slotBookings.map((b, idx) => (
                                            <div key={idx} className="text-xs text-muted-foreground border-t border-border pt-2">
                                              <p className="font-medium text-foreground">{b.clientName}</p>
                                              <p>Hab. {b.clientRoom}</p>
                                            </div>
                                          ))}
                                        </div>
                                      ) : (
                                        <Button
                                          onClick={() => handleShowBookingsDetail(slotBookings)}
                                          className="mt-2 text-xs text-primary hover:underline font-medium"
                                        >
                                          Ver los {slotBookings.length} participantes →
                                        </Button>
                                      )}
                                    </div>
                                  ) : (
                                    <p className="text-xs text-muted-foreground">Sin reservas</p>
                                  )}
                                </div>
                              </div>
                            </div>
                          )
                        }
                        // Si hay una reserva que cubre este slot pero no empieza aquí, mostrar barra de ocupación
                        else if (booking) {
                          const slotBookingsAtTime = getBookingsAtSlot(facility.id, slot)
                          const occupancyAtTime = getOccupancyPercentage(facility.id, slot)
                          
                          if (slotBookingsAtTime.length > 0) {
                            return (
                              <div
                                key={slot}
                                className="w-32 border-r border-border p-2 shrink-0 min-h-[88px] flex items-center justify-center cursor-pointer hover:bg-primary/5 transition-colors"
                                onClick={() => handleShowBookingsDetail(slotBookingsAtTime)}
                              >
                                <div className="w-full space-y-2">
                                  <p className="text-xs font-medium text-foreground text-center">
                                    {slotBookingsAtTime.length}/{facility.capacity}
                                  </p>
                                  <div className="w-full bg-black/10 rounded-full h-2">
                                    <div
                                      className={`h-2 rounded-full transition-all ${
                                        occupancyAtTime > 80
                                          ? "bg-red-500"
                                          : occupancyAtTime > 50
                                            ? "bg-amber-500"
                                            : "bg-green-500"
                                      }`}
                                      style={{ width: `${occupancyAtTime}%` }}
                                    />
                                  </div>
                                </div>
                              </div>
                            )
                          }
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
