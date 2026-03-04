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
    // No longer needed - removed with timeline
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
              <h1 className="text-2xl font-bold text-foreground">{t("admin.amenitiesManagement")}</h1>
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
              </div>
                <DialogTrigger asChild>
                  <button 
                    className="flex items-center justify-center w-10 h-10 rounded-full text-white shadow-md hover:shadow-lg transition-all duration-300 hover:scale-110 group relative"
                    style={{ backgroundColor: "#1557F6" }}
                    title={t("admin.addAmenity")}
              >
                <div className="relative flex items-center justify-center">
                  <Plus className="w-5 h-5" />
                  <span className="absolute text-base font-bold -bottom-0.5 -right-0.5 text-white drop-shadow-lg">+</span>
                </div>
                <span className="absolute top-full mt-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                  {t("admin.addAmenity")}
                </span>
                  </button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle className="text-xl">{t("admin.addNewAmenity")}</DialogTitle>
                    <DialogDescription>{t("admin.configureNewAmenity")}</DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleAddFacility} className="space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-sm font-medium">{t("admin.amenityName")}</Label>
                      <Input id="name" name="name" placeholder="ej: Gimnasio Premium" className="h-10 px-3" required />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">{t("admin.amenityType")}</Label>
                      <Select name="type" required>
                        <SelectTrigger className="h-10">
                          <SelectValue placeholder={t("admin.selectType")} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="fitness">Fitness</SelectItem>
                          <SelectItem value="recreation">{t("admin.recreation")}</SelectItem>
                          <SelectItem value="wellness">{t("admin.wellness")}</SelectItem>
                          <SelectItem value="business">{t("admin.business")}</SelectItem>
                          <SelectItem value="dining">{t("admin.dining")}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="capacity" className="text-sm font-medium">{t("admin.maxCapacity")}</Label>
                      <Input id="capacity" name="capacity" type="number" placeholder="ej: 20" className="h-10 px-3" required />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label htmlFor="startTime" className="text-sm font-medium">{t("admin.openingTime")}</Label>
                        <Input id="startTime" name="startTime" type="time" className="h-10 px-3" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="endTime" className="text-sm font-medium">{t("admin.closingTime")}</Label>
                        <Input id="endTime" name="endTime" type="time" className="h-10 px-3" required />
                      </div>
                    </div>
                    <Button type="submit" className="w-full h-10 font-medium">
                      {t("admin.addAmenity")}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="p-8 max-w-[1600px] mx-auto">
        {/* Edit Facility Dialog */}
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{t("admin.editFacility")}</DialogTitle>
              <DialogDescription>{t("admin.updateFacilityDetails")}</DialogDescription>
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
                    <Label htmlFor="edit-capacity">{t("admin.capacity")}</Label>
                <Input id="edit-capacity" name="capacity" type="number" defaultValue={editingFacility?.capacity} required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="edit-startTime">{t("admin.openingTime")}</Label>
                  <Input id="edit-startTime" name="startTime" type="time" defaultValue={editingFacility?.startTime} required />
                </div>
                <div>
                    <Label htmlFor="edit-endTime">{t("admin.closingTime")}</Label>
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
        {/* List View */}
        <div>
              <Label htmlFor="facility-name" className="text-sm font-medium">{t("admin.amenityName")}</Label>
              <Input
                id="facility-name"
                value={newFacility.name}
                onChange={(e) => setNewFacility({ ...newFacility, name: e.target.value })}
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="facility-type" className="text-sm font-medium">{t("admin.type")}</Label>
              <Select value={newFacility.type} onValueChange={(value) => setNewFacility({ ...newFacility, type: value as FacilityType })}>
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gym">{t("admin.gym")}</SelectItem>
                  <SelectItem value="pool">{t("admin.pool")}</SelectItem>
                  <SelectItem value="spa">{t("admin.spa")}</SelectItem>
                  <SelectItem value="restaurant">{t("admin.restaurant")}</SelectItem>
                  <SelectItem value="lounge">{t("admin.lounge")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="facility-capacity" className="text-sm font-medium">{t("admin.capacity")}</Label>
              <Input
                id="facility-capacity"
                type="number"
                value={newFacility.capacity}
                onChange={(e) => setNewFacility({ ...newFacility, capacity: Number.parseInt(e.target.value) })}
                className="mt-2"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="start-time" className="text-sm font-medium">{t("admin.startTime")}</Label>
                <Input
                  id="start-time"
                  type="time"
                  value={newFacility.startTime}
                  onChange={(e) => setNewFacility({ ...newFacility, startTime: e.target.value })}
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="end-time" className="text-sm font-medium">{t("admin.endTime")}</Label>
                <Input
                  id="end-time"
                  type="time"
                  value={newFacility.endTime}
                  onChange={(e) => setNewFacility({ ...newFacility, endTime: e.target.value })}
                  className="mt-2"
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setAddFacilityOpen(false)}>
              {t("admin.cancel")}
            </Button>
            <Button onClick={handleAddFacility}>
              {t("admin.add")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Facility Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{t("admin.editAmenity")}</DialogTitle>
          </DialogHeader>
          {editingFacility && (
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="edit-name" className="text-sm font-medium">{t("admin.amenityName")}</Label>
                <Input
                  id="edit-name"
                  value={editingFacility.name}
                  onChange={(e) => setEditingFacility({ ...editingFacility, name: e.target.value })}
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="edit-type" className="text-sm font-medium">{t("admin.type")}</Label>
                <Select value={editingFacility.type} onValueChange={(value) => setEditingFacility({ ...editingFacility, type: value as FacilityType })}>
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gym">{t("admin.gym")}</SelectItem>
                    <SelectItem value="pool">{t("admin.pool")}</SelectItem>
                    <SelectItem value="spa">{t("admin.spa")}</SelectItem>
                    <SelectItem value="restaurant">{t("admin.restaurant")}</SelectItem>
                    <SelectItem value="lounge">{t("admin.lounge")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-capacity" className="text-sm font-medium">{t("admin.capacity")}</Label>
                <Input
                  id="edit-capacity"
                  type="number"
                  value={editingFacility.capacity}
                  onChange={(e) => setEditingFacility({ ...editingFacility, capacity: Number.parseInt(e.target.value) })}
                  className="mt-2"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="edit-start-time" className="text-sm font-medium">{t("admin.startTime")}</Label>
                  <Input
                    id="edit-start-time"
                    type="time"
                    value={editingFacility.startTime}
                    onChange={(e) => setEditingFacility({ ...editingFacility, startTime: e.target.value })}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-end-time" className="text-sm font-medium">{t("admin.endTime")}</Label>
                  <Input
                    id="edit-end-time"
                    type="time"
                    value={editingFacility.endTime}
                    onChange={(e) => setEditingFacility({ ...editingFacility, endTime: e.target.value })}
                    className="mt-2"
                  />
                </div>
              </div>
            </div>
          )}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              {t("admin.cancel")}
            </Button>
            <Button onClick={handleEditFacilityUpdate}>
              {t("admin.update")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Bookings Detail Dialog */}
      <Dialog open={bookingsDetailOpen} onOpenChange={setBookingsDetailOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{t("admin.bookings")}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {selectedBookings.map((booking) => (
              <Card key={booking.id} className="p-4">
                <div className="space-y-2">
                  <p className="font-semibold text-sm">{booking.clientName}</p>
                  <div className="text-xs text-muted-foreground space-y-1">
                    <p>{t("admin.room")}: {booking.clientRoom}</p>
                    <p>{t("admin.startTime")}: {booking.time}</p>
                    <p>{t("admin.duration")}: {booking.duration} {t("admin.minutes")}</p>
                    <p className={`font-medium ${booking.status === "confirmed" ? "text-green-600" : "text-amber-600"}`}>
                      {booking.status === "confirmed" ? t("admin.confirmed") : t("admin.pending")}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
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
