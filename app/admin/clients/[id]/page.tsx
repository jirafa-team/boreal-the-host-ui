"use client"

import { CheckCircle2, Star, Mail, Phone, MapPin, Eye, Clock, CreditCard, Utensils, Sparkles, Dumbbell, Droplets, ShoppingBag, ArrowLeft, Calendar, Edit2 } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import Image from "next/image"

// Mock data - In production this would come from API/database
const clientDetails = {
  id: "1",
  name: "Martín Rodríguez",
  email: "martin.rodriguez@gmail.com",
  phone: "+54 11 4567-8910",
  nationality: "Argentina",
  city: "Buenos Aires",
  vip: true,
  category: "VIP" as const,
  memberSince: "2023-03-20",
  totalVisits: 12,
  totalSpent: 8750,
  averageRating: 4.9,
  avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
  currentReservation: {
    room: "501",
    checkIn: "2025-01-10",
    checkOut: "2025-01-15",
    status: "checked-in",
    guests: 2,
    roomType: "Suite Deluxe",
    totalCost: 1450,
  },
  previousReservations: [
    {
      id: "res-6",
      room: "701",
      roomType: "Penthouse",
      checkIn: "2024-12-20",
      checkOut: "2024-12-28",
      guests: 3,
      totalCost: 2340,
      status: "completed",
      rating: 5,
      purchases: [
        {
          category: "Room Service",
          items: ["Asado para 3", "Vino Malbec Catena Zapata", "Postre Dulce de Leche"],
          total: 280,
        },
        { category: "Spa", items: ["Masaje de Piedras Calientes", "Tratamiento Facial"], total: 180 },
        { category: "Gimnasio", items: ["3 sesiones de entrenamiento personal"], total: 150 },
      ],
      activities: ["Asistió a cena de gala", "Reservó excursión a viñedos", "Utilizó servicio de taxi 4 veces"],
    },
    {
      id: "res-5",
      room: "405",
      roomType: "Suite Junior",
      checkIn: "2024-10-15",
      checkOut: "2024-10-22",
      guests: 2,
      totalCost: 1680,
      status: "completed",
      rating: 5,
      purchases: [
        { category: "Room Service", items: ["Desayuno continental x7", "Cena ejecutiva x4"], total: 420 },
        { category: "Bar", items: ["Fernet Branca", "Cerveza Quilmes x6", "Aperitivos"], total: 95 },
        { category: "Piscina", items: ["Reserva cabana premium x2"], total: 120 },
      ],
      activities: [
        "Participó en workshop de cocina",
        "Reservó gimnasio diariamente",
        "Utilizó servicio de limpieza extra",
      ],
    },
    {
      id: "res-4",
      room: "302",
      roomType: "Doble Superior",
      checkIn: "2024-07-08",
      checkOut: "2024-07-14",
      guests: 2,
      totalCost: 980,
      status: "completed",
      rating: 5,
      purchases: [
        { category: "Room Service", items: ["Milanesas napolitanas", "Empanadas salteñas x12", "Helado"], total: 165 },
        { category: "Spa", items: ["Masaje relajante pareja"], total: 200 },
      ],
      activities: ["Asistió a evento de tango", "Utilizó piscina", "Pidió recomendaciones gastronómicas"],
    },
    {
      id: "res-3",
      room: "501",
      roomType: "Suite Deluxe",
      checkIn: "2024-04-12",
      checkOut: "2024-04-18",
      guests: 2,
      totalCost: 1540,
      status: "completed",
      rating: 5,
      purchases: [
        {
          category: "Room Service",
          items: ["Desayunos completos x6", "Picada argentina", "Bife de chorizo x2"],
          total: 380,
        },
        { category: "Minibar", items: ["Bebidas variadas", "Snacks"], total: 75 },
        { category: "Gimnasio", items: ["Reservas semanales"], total: 0 },
      ],
      activities: ["Celebró aniversario", "Pidió decoración especial en habitación", "Tour por la ciudad"],
    },
    {
      id: "res-2",
      room: "204",
      roomType: "Doble Estándar",
      checkIn: "2023-11-03",
      checkOut: "2023-11-09",
      guests: 2,
      totalCost: 840,
      status: "completed",
      rating: 5,
      purchases: [
        { category: "Room Service", items: ["Mate cocido y medialunas x5", "Cena parrilla x2"], total: 195 },
        { category: "Lavandería", items: ["Servicio express"], total: 45 },
      ],
      activities: ["Utilizó taxi al aeropuerto", "Pidió late checkout", "Asistió a desayuno buffet"],
    },
    {
      id: "res-1",
      room: "103",
      roomType: "Individual Standard",
      checkIn: "2023-06-15",
      checkOut: "2023-06-20",
      guests: 1,
      totalCost: 630,
      status: "completed",
      rating: 4,
      purchases: [
        { category: "Room Service", items: ["Desayuno americano x4", "Sandwich club x2"], total: 120 },
        { category: "Bar", items: ["Cafés y alfajores"], total: 35 },
      ],
      activities: ["Primera visita", "Reuniones de trabajo", "Utilizó wifi premium"],
    },
  ],
  registeredEvents: [
    {
      id: "evt-1",
      name: "Cena de Gala de Año Nuevo",
      date: "2025-01-14",
      time: "20:00",
      location: "Salón Principal",
      status: "confirmed",
      attendees: 2,
      price: 150,
    },
    {
      id: "evt-2",
      name: "Workshop de Cocina Mediterránea",
      date: "2025-01-12",
      time: "10:00",
      location: "Cocina del Chef",
      status: "confirmed",
      attendees: 2,
      price: 80,
    },
    {
      id: "evt-3",
      name: "Sesión de Yoga al Amanecer",
      date: "2025-01-11",
      time: "07:00",
      location: "Terraza",
      status: "completed",
      attendees: 2,
      price: 0,
    },
  ],
  notes:
    "Cliente frecuente de Argentina (Buenos Aires). Prefiere habitaciones con vista y le gusta la gastronomía local. Celebra su aniversario en abril. Solicita siempre mate y medialunas en desayuno. Cliente muy cordial y genera excelentes relaciones con el personal.",
}

export default function ClientDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [selectedReservation, setSelectedReservation] = useState<any>(null)

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "checked-in":
        return (
          <Badge className="bg-green-500/10 text-green-600 border-green-500/20">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Check-in
          </Badge>
        )
      case "completed":
        return (
          <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/20">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Completada
          </Badge>
        )
      case "confirmed":
        return (
          <Badge className="bg-green-500/10 text-green-600 border-green-500/20">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Confirmado
          </Badge>
        )
      default:
        return <Badge>{status}</Badge>
    }
  }

  const getClientTierBadge = (category: string) => {
    const categoryConfig = {
      Basic: {
        className: "bg-blue-100 text-blue-800",
        label: "Basic"
      },
      Preferred: {
        className: "bg-gray-100 text-gray-800",
        label: "Preferred"
      },
      Elite: {
        className: "bg-yellow-100 text-yellow-800",
        label: "Elite"
      },
      VIP: {
        className: "bg-black text-white",
        label: "VIP"
      }
    }

    const config = categoryConfig[category as keyof typeof categoryConfig] || categoryConfig.Basic

    return (
      <Badge className={`${config.className} border-0`}>
        {config.label}
      </Badge>
    )
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Room Service":
        return <Utensils className="w-4 h-4" />
      case "Spa":
        return <Sparkles className="w-4 h-4" />
      case "Gimnasio":
        return <Dumbbell className="w-4 h-4" />
      case "Piscina":
        return <Droplets className="w-4 h-4" />
      case "Bar":
      case "Minibar":
        return <ShoppingBag className="w-4 h-4" />
      default:
        return <ShoppingBag className="w-4 h-4" />
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header with Back Button */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-foreground">Detalles del Cliente</h1>
          <p className="text-muted-foreground mt-1">Información completa y historial</p>
        </div>
      </div>

      {/* Client Header Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start gap-6 mb-6">
            <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-background shadow-lg">
              <Image
                src={clientDetails.avatar || "/placeholder.svg"}
                alt={clientDetails.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-2xl font-bold text-foreground">{clientDetails.name}</h2>
                    {getClientTierBadge(clientDetails.category)}
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                          <Edit2 className="w-4 h-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Editar Perfil del Cliente</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 mt-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="text-sm font-medium">Nombre</label>
                              <input type="text" defaultValue={clientDetails.name} className="w-full mt-1 px-3 py-2 border rounded-lg" />
                            </div>
                            <div>
                              <label className="text-sm font-medium">Email</label>
                              <input type="email" defaultValue={clientDetails.email} className="w-full mt-1 px-3 py-2 border rounded-lg" />
                            </div>
                            <div>
                              <label className="text-sm font-medium">Teléfono</label>
                              <input type="tel" defaultValue={clientDetails.phone} className="w-full mt-1 px-3 py-2 border rounded-lg" />
                            </div>
                            <div>
                              <label className="text-sm font-medium">Ciudad</label>
                              <input type="text" defaultValue={clientDetails.city} className="w-full mt-1 px-3 py-2 border rounded-lg" />
                            </div>
                          </div>
                          <div>
                            <label className="text-sm font-medium">Preferencias</label>
                            <textarea defaultValue={clientDetails.notes} className="w-full mt-1 px-3 py-2 border rounded-lg h-32" />
                          </div>
                          <div className="flex gap-3 justify-end">
                            <Button variant="outline">Cancelar</Button>
                            <Button>Guardar Cambios</Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Mail className="w-4 h-4" />
                      {clientDetails.email}
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="w-4 h-4" />
                      {clientDetails.phone}
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      {clientDetails.city}, {clientDetails.nationality}
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      Miembro desde{" "}
                      {new Date(clientDetails.memberSince).toLocaleDateString("es-ES", {
                        month: "long",
                        year: "numeric",
                      })}
                    </div>
                  </div>
                </div>

                {/* KPIs - Dashboard Style */}
                <div className="flex gap-1.5 -mt-4">
                  <div className="bg-blue-50 rounded-lg px-4 py-2 border border-blue-200 flex flex-col items-center justify-center min-w-[83px]">
                    <p className="text-3xl font-bold text-blue-600 mb-0.5">{clientDetails.totalVisits}</p>
                    <p className="text-gray-600 text-xs">Total Visitas</p>
                  </div>
                  <div className="bg-purple-50 rounded-lg px-4 py-2 border border-purple-200 flex flex-col items-center justify-center min-w-[83px]">
                    <p className="text-3xl font-bold text-purple-600 mb-0.5">{clientDetails.totalSpent}</p>
                    <p className="text-gray-600 text-xs">Total Gastado</p>
                  </div>
                  <div className="bg-amber-50 rounded-lg px-4 py-2 border border-amber-200 flex flex-col items-center justify-center min-w-[83px]">
                    <div className="flex items-center justify-center gap-0.5">
                      <p className="text-3xl font-bold text-amber-600">{clientDetails.averageRating}</p>
                      <Star className="w-3 h-3 fill-amber-500 text-amber-500 mt-0.5" />
                    </div>
                    <p className="text-gray-600 text-xs mt-0.5">Valoración</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Preferences Section */}
          <div className="pt-6 border-t">
            <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-pink-500" />
              Preferencias del Cliente
            </h3>
            <p className="text-sm text-muted-foreground italic">{clientDetails.notes}</p>
          </div>
        </CardContent>
      </Card>

      {/* Current Reservation */}
      {clientDetails.currentReservation && (
        <Card className="border-l-4 border-l-green-500">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Reserva Actual</span>
              {getStatusBadge(clientDetails.currentReservation.status)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Habitación</p>
                <p className="text-lg font-semibold text-foreground">{clientDetails.currentReservation.room}</p>
                <p className="text-sm text-muted-foreground">{clientDetails.currentReservation.roomType}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Check-in</p>
                <p className="text-lg font-semibold text-foreground">
                  {new Date(clientDetails.currentReservation.checkIn).toLocaleDateString("es-ES", {
                    day: "2-digit",
                    month: "short",
                  })}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Check-out</p>
                <p className="text-lg font-semibold text-foreground">
                  {new Date(clientDetails.currentReservation.checkOut).toLocaleDateString("es-ES", {
                    day: "2-digit",
                    month: "short",
                  })}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total</p>
                <p className="text-lg font-semibold text-foreground">${clientDetails.currentReservation.totalCost}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tabs for History */}
      <Tabs defaultValue="reservations" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="reservations">Historial de Reservas</TabsTrigger>
          <TabsTrigger value="events">Eventos Inscritos</TabsTrigger>
        </TabsList>

        <TabsContent value="reservations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Reservas Anteriores</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {clientDetails.previousReservations.map((reservation) => (
                  <div key={reservation.id} className="p-5 rounded-lg border bg-card hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 rounded bg-primary/10 flex items-center justify-center">
                          <span className="text-lg font-bold text-primary">{reservation.room}</span>
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">{reservation.roomType}</p>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {new Date(reservation.checkIn).toLocaleDateString("es-ES", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              })}
                            </div>
                            <span>→</span>
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {new Date(reservation.checkOut).toLocaleDateString("es-ES", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              })}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-foreground text-lg">${reservation.totalCost}</p>
                        <div className="flex items-center gap-1 mt-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={`rating-star-${i}`}
                              className={`w-3 h-3 ${
                                i < reservation.rating ? "fill-amber-500 text-amber-500" : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t mt-3">
                      <div className="text-sm text-muted-foreground">
                        {reservation.guests} {reservation.guests === 1 ? "huésped" : "huéspedes"}
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(reservation.status)}
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" onClick={() => setSelectedReservation(reservation)}>
                              <Eye className="w-4 h-4 mr-2" />
                              Ver Detalle
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Detalle de Reserva - Habitación {reservation.room}</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 mt-4">
                              {reservation.purchases && reservation.purchases.length > 0 && (
                                <div className="space-y-2">
                                  <h4 className="text-sm font-semibold text-foreground">Compras realizadas:</h4>
                                  {reservation.purchases.map((purchase, idx) => (
                                    <div key={idx} className="bg-muted/30 p-3 rounded-lg">
                                      <div className="flex items-start justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                          {getCategoryIcon(purchase.category)}
                                          <span className="text-sm font-medium text-foreground">
                                            {purchase.category}
                                          </span>
                                        </div>
                                        <span className="text-sm font-semibold text-foreground">${purchase.total}</span>
                                      </div>
                                      <ul className="text-xs text-muted-foreground space-y-1 ml-6">
                                        {purchase.items.map((item, itemIdx) => (
                                          <li key={`purchase-item-${purchase.category}-${itemIdx}`}>• {item}</li>
                                        ))}
                                      </ul>
                                    </div>
                                  ))}
                                  <div className="flex justify-end pt-2 border-t">
                                    <span className="text-sm font-semibold text-foreground">
                                      Total extras: ${reservation.purchases.reduce((sum, p) => sum + p.total, 0)}
                                    </span>
                                  </div>
                                </div>
                              )}

                              {reservation.activities && reservation.activities.length > 0 && (
                                <div className="pt-3 border-t">
                                  <h4 className="text-sm font-semibold text-foreground mb-2">Actividades:</h4>
                                  <ul className="text-sm text-muted-foreground space-y-1">
                                    {reservation.activities.map((activity, idx) => (
                                      <li key={`activity-${idx}-${activity.substring(0, 10)}`} className="flex items-start gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                        {activity}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="events" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Eventos Registrados</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {clientDetails.registeredEvents.map((event) => (
                  <div key={event.id} className="p-4 rounded-lg border bg-card hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-foreground mb-2">{event.name}</h4>
                        <div className="space-y-1 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            {new Date(event.date).toLocaleDateString("es-ES", {
                              day: "2-digit",
                              month: "long",
                              year: "numeric",
                            })}
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            {event.time}
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            {event.location}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        {event.price > 0 && <p className="font-bold text-foreground mb-2">${event.price}</p>}
                        {getStatusBadge(event.status)}
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t">
                      <div className="text-sm text-muted-foreground">
                        {event.attendees} {event.attendees === 1 ? "asistente" : "asistentes"}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button className="flex-1">
          <Mail className="w-4 h-4 mr-2" />
          Enviar Email
        </Button>
        <Button variant="outline" className="flex-1 bg-transparent">
          <CreditCard className="w-4 h-4 mr-2" />
          Ver Facturación
        </Button>
      </div>
    </div>
  )
}
