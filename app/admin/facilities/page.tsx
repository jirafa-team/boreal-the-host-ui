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
import { Plus, Dumbbell, Waves, Sparkles, Video, Coffee, UtensilsCrossed, LayoutGrid, Clock, Users, Building2, Calendar as CalendarIcon, ChevronLeft, ChevronRight, Calendar } from "lucide-react"
import { useLanguage } from "@/lib/i18n-context"
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
  const { t, language } = useLanguage()
  const [facilities, setFacilities] = React.useState<Facility[]>(mockFacilities)
  const [bookings, setBookings] = React.useState<Booking[]>(mockBookings)
  const [viewMode, setViewMode] = React.useState<"list" | "timeline">("list")
  const [selectedDate, setSelectedDate] = React.useState(new Date().toISOString().split('T')[0])
  const [currentDate, setCurrentDate] = React.useState(new Date())
  const [timelineMode, setTimelineMode] = React.useState<"week" | "month">("week")
  const [newBooking, setNewBooking] = React.useState({
    facilityId: "",
    clientName: "",
    clientRoom: "",
    time: "",
    duration: 60,
    people: 1,
  })
  })
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [addFacilityOpen, setAddFacilityOpen] = React.useState(false)
  const [editingFacility, setEditingFacility] = React.useState<Facility | null>(null)
  const [editDialogOpen, setEditDialogOpen] = React.useState(false)
  const [clientSuggestions, setClientSuggestions] = React.useState<string[]>([])
  const [showClientSuggestions, setShowClientSuggestions] = React.useState(false)
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

  const handleClientNameChange = (value: string) => {
    setNewBooking({ ...newBooking, clientName: value })
    if (value.length > 0) {
      const uniqueClients = Array.from(new Set(bookings.map((b) => b.clientName)))
      const filtered = uniqueClients.filter((client) =>
        client.toLowerCase().includes(value.toLowerCase())
      )
      setClientSuggestions(filtered)
      setShowClientSuggestions(true)
    } else {
      setShowClientSuggestions(false)
    }
  }

  const handleSelectClient = (clientName: string) => {
    setNewBooking({ ...newBooking, clientName })
    setShowClientSuggestions(false)
    // Auto-fill room based on client
    const clientBooking = bookings.find((b) => b.clientName === clientName)
    if (clientBooking) {
      setNewBooking((prev) => ({ ...prev, clientRoom: clientBooking.clientRoom }))
    }
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
      setNewBooking({ facilityId: "", clientName: "", clientRoom: "", time: "", duration: 60, people: 1 })
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

  // Get current occupancy percentage for a facility (based on current time)
  const getCurrentOccupancy = (facilityId: string): { occupancyPercent: number; currentBookings: Booking[] } => {
    const now = new Date()
    const currentHour = now.getHours()
    const currentMinute = now.getMinutes()
    const currentTimeInHours = currentHour + currentMinute / 60
    
    const facility = facilities.find((f) => f.id === facilityId)
    if (!facility) return { occupancyPercent: 0, currentBookings: [] }
    
    const currentBookings = bookings.filter((b) => {
      if (b.facilityId !== facilityId) return false
      const bookingStart = parseInt(b.time.split(":")[0]) + parseInt(b.time.split(":")[1] || "0") / 60
      const bookingEnd = bookingStart + b.duration / 60
      return currentTimeInHours >= bookingStart && currentTimeInHours < bookingEnd
    })
    
    const occupancyPercent = Math.round((currentBookings.length / facility.capacity) * 100)
    return { occupancyPercent, currentBookings }
  }

  // Determine occupancy color
  const getOccupancyColor = (percent: number): string => {
    if (percent === 0) return "text-gray-500"
    if (percent <= 33) return "text-green-600"
    if (percent <= 66) return "text-amber-600"
    return "text-red-600"
  }

  const getOccupancyBgColor = (percent: number): string => {
    if (percent === 0) return "bg-gray-100"
    if (percent <= 33) return "bg-green-100"
    if (percent <= 66) return "bg-amber-100"
    return "bg-red-100"
  }

  // Determine if facility is multi-party (gym, pool, spa) or single-party (conference room)
  const isMultiPartyFacility = (facilityType: string): boolean => {
    return ["fitness", "recreation", "wellness", "dining"].includes(facilityType)
  }

  // Convert between ISO date format (yyyy-MM-dd) and locale-specific format
  const convertISOToLocaleFormat = (isoDate: string): string => {
    const [year, month, day] = isoDate.split('-')
    if (language === 'es' || language === 'pt') {
      return `${day}/${month}/${year}` // dd/mm/yyyy
    }
    return `${month}/${day}/${year}` // mm/dd/yyyy
  }

  const navigateDate = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate)
    if (timelineMode === "week") {
      newDate.setDate(newDate.getDate() + (direction === "next" ? 7 : -7))
    } else {
      newDate.setMonth(newDate.getMonth() + (direction === "next" ? 1 : -1))
    }
    setCurrentDate(newDate)
  }

  return (
    <>
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-10">
        <div className="px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Gestión de Amenities</h1>
              <p className="text-sm text-muted-foreground">Administra los amenities y espacios del hotel</p>
            </div>
            <div className="flex gap-4 items-center ml-auto">
              {/* View Mode Toggle */}
              <div className="inline-flex h-10 items-center rounded-lg bg-gray-100 p-1 border border-gray-200">
                <button
                  onClick={() => setViewMode("list")}
                  className={`px-5 py-2 rounded-md font-medium text-sm transition-all ${
                    viewMode === "list"
                      ? "text-white shadow-md"
                      : "text-gray-700 hover:text-gray-900"
                  }`}
                  style={viewMode === "list" ? { backgroundColor: "#394a63" } : {}}
                >
                  Lista
                </button>
                <button
                  onClick={() => setViewMode("timeline")}
                  className={`px-5 py-2 rounded-md font-medium text-sm transition-all ${
                    viewMode === "timeline"
                      ? "text-white shadow-md"
                      : "text-gray-700 hover:text-gray-900"
                  }`}
                  style={viewMode === "timeline" ? { backgroundColor: "#394a63" } : {}}
                >
                  Timeline
                </button>
              </div>
              <Dialog open={addFacilityOpen} onOpenChange={setAddFacilityOpen}>
                <DialogTrigger asChild>
                  <button 
                    className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/80 text-white shadow-md hover:shadow-lg transition-all duration-300 hover:scale-110 group relative"
                    title="Agregar amenity"
                  >
                    <div className="relative flex items-center justify-center">
                      <Building2 className="w-5 h-5" />
                      <span className="absolute text-base font-bold -bottom-0.5 -right-0.5 text-white drop-shadow-lg">+</span>
                    </div>
                    <span className="absolute top-full mt-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                      Agregar Amenity
                    </span>
                  </button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle className="text-xl">Agregar Nuevo Amenity</DialogTitle>
                    <DialogDescription>Configure un nuevo amenity o espacio para el hotel</DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleAddFacility} className="space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-sm font-medium">Nombre del Amenity</Label>
                      <Input id="name" name="name" placeholder="ej: Gimnasio Premium" className="h-10 px-3" required />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Tipo de Amenity</Label>
                      <Select name="type" required>
                        <SelectTrigger className="h-10">
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
                    <div className="space-y-2">
                      <Label htmlFor="capacity" className="text-sm font-medium">Capacidad Máxima</Label>
                      <Input id="capacity" name="capacity" type="number" placeholder="ej: 20" className="h-10 px-3" required />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label htmlFor="startTime" className="text-sm font-medium">Hora de Apertura</Label>
                        <Input id="startTime" name="startTime" type="time" className="h-10 px-3" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="endTime" className="text-sm font-medium">Hora de Cierre</Label>
                        <Input id="endTime" name="endTime" type="time" className="h-10 px-3" required />
                      </div>
                    </div>
                    <Button type="submit" className="w-full h-10 font-medium">
                      Agregar Amenity
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <button 
                    className="relative group w-10 h-10 rounded-full bg-primary hover:bg-primary/90 text-white flex items-center justify-center transition-all shadow-md hover:shadow-lg"
                    title="Agregar reserva"
                  >
                    <div className="relative">
                      <CalendarIcon className="w-5 h-5" />
                      <span className="absolute -top-1 -right-1 bg-primary text-white text-xs font-bold w-4 h-4 rounded-full flex items-center justify-center" style={{fontSize: '10px'}}>+</span>
                    </div>
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-gray-900 text-white text-xs rounded pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      Nueva Reserva
                    </div>
                  </button>
                </DialogTrigger>
                <DialogContent className="max-w-lg">
                  <DialogHeader>
                    <DialogTitle className="text-lg">Nueva Reserva Manual</DialogTitle>
                    <DialogDescription>Crea una reserva de facility para un cliente</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-5">
                    {/* Facility Selection */}
                    <div>
                      <Label htmlFor="facility" className="text-sm font-medium mb-2 block">Facility</Label>
                      <Select
                        value={newBooking.facilityId}
                        onValueChange={(value) => setNewBooking({ ...newBooking, facilityId: value })}
                      >
                        <SelectTrigger className="h-11">
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

                    {/* Client Name with Autocomplete */}
                    <div>
                      <Label htmlFor="clientName" className="text-sm font-medium mb-2 block">Nombre del Cliente</Label>
                      <div className="relative">
                        <Input
                          id="clientName"
                          value={newBooking.clientName}
                          onChange={(e) => handleClientNameChange(e.target.value)}
                          placeholder="Comenzar a escribir nombre..."
                          className="h-11"
                        />
                        {showClientSuggestions && clientSuggestions.length > 0 && (
                          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-50">
                            {clientSuggestions.map((client) => (
                              <button
                                key={client}
                                onClick={() => handleSelectClient(client)}
                                className="w-full text-left px-3 py-2 hover:bg-gray-100 border-b last:border-b-0 text-sm"
                              >
                                {client}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Room (Auto-filled) */}
                    <div>
                      <Label htmlFor="clientRoom" className="text-sm font-medium mb-2 block">Habitación</Label>
                      <Input
                        id="clientRoom"
                        value={newBooking.clientRoom}
                        onChange={(e) => setNewBooking({ ...newBooking, clientRoom: e.target.value })}
                        placeholder="Auto-rellenada según cliente"
                        className="h-11 bg-gray-50"
                      />
                    </div>

                    {/* Number of People */}
                    <div>
                      <Label className="text-sm font-medium mb-2 block">Cantidad de Personas</Label>
                      <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
                        <button
                          onClick={() => setNewBooking({ ...newBooking, people: Math.max(1, newBooking.people - 1) })}
                          className="w-9 h-9 rounded-lg bg-white border border-gray-300 flex items-center justify-center hover:bg-gray-100 font-semibold"
                        >
                          −
                        </button>
                        <span className="text-lg font-bold w-12 text-center">{newBooking.people}</span>
                        <button
                          onClick={() => setNewBooking({ ...newBooking, people: newBooking.people + 1 })}
                          className="w-9 h-9 rounded-lg bg-white border border-gray-300 flex items-center justify-center hover:bg-gray-100 font-semibold"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Start Time */}
                    <div>
                      <Label htmlFor="time" className="text-sm font-medium mb-2 block">Hora de Inicio</Label>
                      <Select
                        value={newBooking.time}
                        onValueChange={(value) => setNewBooking({ ...newBooking, time: value })}
                      >
                        <SelectTrigger className="h-11">
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

                    {/* Duration */}
                    <div>
                      <Label htmlFor="duration" className="text-sm font-medium mb-2 block">Duración</Label>
                      <Select
                        value={newBooking.duration.toString()}
                        onValueChange={(value) => setNewBooking({ ...newBooking, duration: Number.parseInt(value) })}
                      >
                        <SelectTrigger className="h-11">
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

                    <Button onClick={handleAddBooking} className="w-full h-11 font-medium">
                      Crear Reserva
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </header>

      <div className="p-8 max-w-[1600px] mx-auto">
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
          <>
            {/* Date Filter for List View */}
            <div className="mb-6 p-4 bg-white rounded-lg border border-gray-200">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-foreground">
                  {language === 'es' || language === 'pt' ? 'Fecha:' : 'Date:'}
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                  <div className="pointer-events-none flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg bg-white w-40">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{convertISOToLocaleFormat(selectedDate)}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {facilities.map((facility) => {
              const Icon = facility.icon
              const facilityBookings = bookings.filter((b) => b.facilityId === facility.id)
              return (
                <Card key={facility.id} className="p-6 hover:shadow-lg transition-shadow relative">
                  <div className="flex items-start gap-4 mb-4">
                    <div className={`${facility.color} p-3 rounded-lg shrink-0`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{facility.name}</h3>
                      <p className="text-sm text-muted-foreground capitalize">{facility.type}</p>
                    </div>
                  </div>

                  {/* Top Right Corner - Time Slot and Capacity */}
                  <div className="absolute top-6 right-6 space-y-2 flex flex-col items-end">
                    {/* Time Slot - Elegant Dark Pink Chip */}
                    <Badge className="bg-sky-100 hover:bg-sky-200 text-black text-xs font-bold px-3 py-1.5 shrink-0 border-sky-200">
                      <Clock className="w-3 h-3 mr-1" />
                      {facility.startTime} - {facility.endTime}
                    </Badge>

                    {/* Capacity with Person Icon */}
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium text-foreground">
                        {facility.capacity}
                      </span>
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
          </>
        )}

        {/* Timeline View */}
        {viewMode === "timeline" && (
          <>
            {/* Timeline Mode Toggle & Date Navigation */}
            <div className="mb-6 flex gap-2 justify-between items-center flex-wrap">
              <div className="flex items-center gap-3">
                <span className={`text-sm font-medium ${timelineMode === "week" ? "text-foreground" : "text-muted-foreground"}`}>
                  Semana
                </span>
                <button
                  onClick={() => setTimelineMode(timelineMode === "week" ? "month" : "week")}
                  className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                    timelineMode === "month"
                      ? "bg-lime-600"
                      : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                      timelineMode === "month" ? "translate-x-7" : "translate-x-1"
                    }`}
                  />
                </button>
                <span className={`text-sm font-medium ${timelineMode === "month" ? "text-foreground" : "text-muted-foreground"}`}>
                  Mes
                </span>
              </div>

              {/* Date Navigation for Timeline */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => navigateDate("prev")}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  title={language === 'es' || language === 'pt' ? "Fecha anterior" : "Previous date"}
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <div className="relative">
                  <input
                    type="date"
                    value={currentDate.toISOString().split('T')[0]}
                    onChange={(e) => setCurrentDate(new Date(e.target.value))}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                  <div className="pointer-events-none flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg bg-white w-40">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{convertISOToLocaleFormat(currentDate.toISOString().split('T')[0])}</span>
                  </div>
                </div>
                <button
                  onClick={() => navigateDate("next")}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  title={language === 'es' || language === 'pt' ? "Fecha siguiente" : "Next date"}
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

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
          </>
        )}
      </div>
    </>
  )
}
