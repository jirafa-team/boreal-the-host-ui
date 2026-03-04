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
import { Plus, Dumbbell, Waves, Sparkles, Video, Coffee, UtensilsCrossed, Edit2, Trash2 } from "lucide-react"
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
  const { t } = useLanguage()
  const [facilities, setFacilities] = React.useState<Facility[]>(mockFacilities)
  const [bookings, setBookings] = React.useState<Booking[]>(mockBookings)
  const [addFacilityOpen, setAddFacilityOpen] = React.useState(false)
  const [editingFacility, setEditingFacility] = React.useState<Facility | null>(null)
  const [editDialogOpen, setEditDialogOpen] = React.useState(false)
  const [selectedSlotBookings, setSelectedSlotBookings] = React.useState<Booking[]>([])
  const [bookingsDetailOpen, setBookingsDetailOpen] = React.useState(false)

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
    ;(e.target as HTMLFormElement).reset()
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

  const handleDeleteFacility = (facilityId: string) => {
    setFacilities(facilities.filter((f) => f.id !== facilityId))
  }

  const getBookingsForFacility = (facilityId: string): Booking[] => {
    return bookings.filter((b) => b.facilityId === facilityId)
  }



  const handleShowBookingsDetail = (facilityId: string) => {
    const facilityBookings = getBookingsForFacility(facilityId)
    setSelectedSlotBookings(facilityBookings)
    setBookingsDetailOpen(true)
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
            <Dialog open={addFacilityOpen} onOpenChange={setAddFacilityOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  {t("admin.addAmenity")}
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-xl">{t("admin.addNewAmenity")}</DialogTitle>
                  <DialogDescription>{t("admin.configureNewAmenity")}</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleAddFacility} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium">
                      {t("admin.amenityName")}
                    </Label>
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
                    <Label htmlFor="capacity" className="text-sm font-medium">
                      {t("admin.maxCapacity")}
                    </Label>
                    <Input id="capacity" name="capacity" type="number" placeholder="ej: 20" className="h-10 px-3" required />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="startTime" className="text-sm font-medium">
                        {t("admin.openingTime")}
                      </Label>
                      <Input id="startTime" name="startTime" type="time" className="h-10 px-3" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="endTime" className="text-sm font-medium">
                        {t("admin.closingTime")}
                      </Label>
                      <Input id="endTime" name="endTime" type="time" className="h-10 px-3" required />
                    </div>
                  </div>
                  <Button type="submit" className="w-full h-10 font-medium">
                    {t("admin.addAmenity")}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      <div className="p-8 max-w-[1400px] mx-auto">
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
              <DialogTitle>Participantes</DialogTitle>
              <DialogDescription>Listado de reservas para esta instalación</DialogDescription>
            </DialogHeader>
            <div className="space-y-3 max-h-[400px] overflow-y-auto">
              {selectedSlotBookings.length > 0 ? (
                selectedSlotBookings.map((booking) => (
                  <Card key={`${booking.facilityId}-${booking.clientName}`} className="p-4">
                    <div className="space-y-2">
                      <p className="font-semibold text-sm">{booking.clientName}</p>
                      <div className="text-xs text-muted-foreground space-y-1">
                        <p>Habitación: {booking.clientRoom}</p>
                        <p>Hora: {booking.time}</p>
                        <p>Duración: {booking.duration} minutos</p>
                        <Badge
                          variant={booking.status === "confirmed" ? "default" : "secondary"}
                          className={booking.status === "confirmed" ? "bg-green-600" : "bg-amber-600"}
                        >
                          {booking.status === "confirmed" ? "Confirmada" : "Pendiente"}
                        </Badge>
                      </div>
                    </div>
                  </Card>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">Sin reservas</p>
              )}
            </div>
          </DialogContent>
        </Dialog>

        {/* Facilities Grid */}
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {facilities.map((facility) => {
            const Icon = facility.icon

            return (
              <Card key={facility.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className={`h-24 ${facility.color} flex items-center justify-center`}>
                  <Icon className="w-12 h-12 text-white" />
                </div>
                <div className="p-5 space-y-4">
                  <div>
                    <h3 className="font-bold text-lg text-foreground">{facility.name}</h3>
                    <p className="text-sm text-muted-foreground capitalize">{facility.type}</p>
                  </div>

                  {/* Details */}
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="bg-muted p-2 rounded">
                      <p className="text-muted-foreground text-xs">Apertura</p>
                      <p className="font-semibold">{facility.startTime}</p>
                    </div>
                    <div className="bg-muted p-2 rounded">
                      <p className="text-muted-foreground text-xs">Cierre</p>
                      <p className="font-semibold">{facility.endTime}</p>
                    </div>
                    <div className="bg-muted p-2 rounded">
                      <p className="text-muted-foreground text-xs">Capacidad</p>
                      <p className="font-semibold">{facility.capacity}</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleEditFacility(facility)}
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="text-destructive hover:text-destructive"
                      onClick={() => handleDeleteFacility(facility.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>

        {facilities.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16">
            <p className="text-lg font-medium text-muted-foreground">No hay amenities registrados</p>
            <p className="text-sm text-muted-foreground">Crea uno nuevo para comenzar</p>
          </div>
        )}
      </div>
    </>
  )
}
