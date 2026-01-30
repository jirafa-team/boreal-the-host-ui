"use client"

import { CheckCircle2, Star, Mail, Phone, MapPin, Eye, Clock, CreditCard, Utensils, Sparkles, Dumbbell, Droplets, ShoppingBag, ArrowLeft, Calendar, Edit2, BookOpen, History, CalendarDays, DoorOpen, LogOut, DollarSign } from "lucide-react"
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
      checkIn: "2025-01-10",
      checkOut: "2025-01-15",
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
  const [activeTab, setActiveTab] = useState<"current" | "history" | "events">("current")

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
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-foreground">Detalles del Cliente</h1>
            <p className="text-muted-foreground mt-1">Información completa y historial</p>
          </div>
        </div>
        <Button size="icon" className="h-10 w-10 rounded-full shadow-lg hover:shadow-xl transition-shadow">
          <Mail className="w-5 h-5" />
        </Button>
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
                <div className="flex gap-1 -mt-4">
                  <div className="bg-blue-50 rounded-lg px-3 py-1.5 border border-blue-200 flex flex-col items-center justify-center min-w-[70px]">
                    <p className="text-2xl font-bold text-blue-600 mb-0.5">{clientDetails.totalVisits}</p>
                    <p className="text-gray-600 text-xs">Total Visitas</p>
                  </div>
                  <div className="bg-purple-50 rounded-lg px-3 py-1.5 border border-purple-200 flex flex-col items-center justify-center min-w-[70px]">
                    <p className="text-2xl font-bold text-purple-600 mb-0.5">{clientDetails.totalSpent}</p>
                    <p className="text-gray-600 text-xs">Total Gastado</p>
                  </div>
                  <div className="bg-amber-50 rounded-lg px-3 py-1.5 border border-amber-200 flex flex-col items-center justify-center min-w-[70px]">
                    <div className="flex items-center justify-center gap-0.5">
                      <p className="text-2xl font-bold text-amber-600">{clientDetails.averageRating}</p>
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

      {/* View Tabs - Dashboard Style */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setActiveTab("current")}
          className={`group relative overflow-hidden rounded-lg px-5 py-2 text-white transition-all duration-300 text-xs font-medium ${
            activeTab === "current"
              ? "bg-gradient-to-br from-blue-600 to-blue-700 shadow-lg scale-105 ring-2 ring-white ring-opacity-50"
              : "bg-gradient-to-br from-blue-600 to-blue-700 opacity-60 hover:opacity-75 shadow-sm hover:shadow-md hover:scale-105"
          }`}
        >
          <div className="absolute top-0 right-0 w-12 h-12 bg-white opacity-10 rounded-full -mr-6 -mt-6"></div>
          <BookOpen className="w-4 h-4 inline mr-2 relative z-10" />
          <span className="relative z-10">Reserva Actual</span>
        </button>
        <button
          onClick={() => setActiveTab("history")}
          className={`group relative overflow-hidden rounded-lg px-5 py-2 text-white transition-all duration-300 text-xs font-medium ${
            activeTab === "history"
              ? "bg-gradient-to-br from-purple-600 to-purple-700 shadow-lg scale-105 ring-2 ring-white ring-opacity-50"
              : "bg-gradient-to-br from-purple-600 to-purple-700 opacity-60 hover:opacity-75 shadow-sm hover:shadow-md hover:scale-105"
          }`}
        >
          <div className="absolute top-0 right-0 w-12 h-12 bg-white opacity-10 rounded-full -mr-6 -mt-6"></div>
          <History className="w-4 h-4 inline mr-2 relative z-10" />
          <span className="relative z-10">Histórico</span>
        </button>
        <button
          onClick={() => setActiveTab("events")}
          className={`group relative overflow-hidden rounded-lg px-5 py-2 text-white transition-all duration-300 text-xs font-medium ${
            activeTab === "events"
              ? "bg-gradient-to-br from-orange-600 to-orange-700 shadow-lg scale-105 ring-2 ring-white ring-opacity-50"
              : "bg-gradient-to-br from-orange-600 to-orange-700 opacity-60 hover:opacity-75 shadow-sm hover:shadow-md hover:scale-105"
          }`}
        >
          <div className="absolute top-0 right-0 w-12 h-12 bg-white opacity-10 rounded-full -mr-6 -mt-6"></div>
          <CalendarDays className="w-4 h-4 inline mr-2 relative z-10" />
          <span className="relative z-10">Eventos</span>
        </button>
      </div>

      {/* Current Reservation */}
      {activeTab === "current" && clientDetails.currentReservation && (
        <div className="grid grid-cols-2 gap-4">
          {/* Left side - Current Reservation */}
          <Card className="border-l-4 border-l-green-500">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Reserva Actual</span>
                {getStatusBadge(clientDetails.currentReservation.status)}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <DoorOpen className="w-5 h-5 text-green-600 flex-shrink-0" />
                <span className="text-sm text-muted-foreground">Habitación:</span>
                <span className="font-semibold text-foreground">{clientDetails.currentReservation.room} - {clientDetails.currentReservation.roomType}</span>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-blue-600 flex-shrink-0" />
                <span className="text-sm text-muted-foreground">Check-in:</span>
                <span className="font-semibold text-foreground">
                  {new Date(clientDetails.currentReservation.checkIn).toLocaleDateString("es-ES", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <LogOut className="w-5 h-5 text-orange-600 flex-shrink-0" />
                <span className="text-sm text-muted-foreground">Check-out:</span>
                <span className="font-semibold text-foreground">
                  {new Date(clientDetails.currentReservation.checkOut).toLocaleDateString("es-ES", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>
              <div className="flex items-center gap-3 pt-2 border-t">
                <Badge className="bg-red-100 text-red-800 border-0">
                  <DollarSign className="w-3 h-3 mr-1" />
                  Saldo: ${clientDetails.currentReservation.totalCost}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Right side - Current Events */}
          <Card className="border-l-4 border-l-orange-500">
            <CardHeader>
              <CardTitle>Eventos Próximos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {clientDetails.registeredEvents
                  .filter((event) => {
                    const eventDate = new Date(event.date)
                    const checkIn = new Date(clientDetails.currentReservation.checkIn)
                    const checkOut = new Date(clientDetails.currentReservation.checkOut)
                    return eventDate >= checkIn && eventDate <= checkOut
                  })
                  .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                  .map((event) => (
                    <div key={event.id} className="p-2.5 rounded-lg border bg-card hover:bg-accent transition-colors">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-foreground text-sm truncate">{event.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(event.date).toLocaleDateString("es-ES", { day: "2-digit", month: "short" })} • {event.time}
                          </p>
                        </div>
                        {event.price > 0 && (
                          <p className="text-sm font-semibold text-foreground flex-shrink-0">${event.price}</p>
                        )}
                      </div>
                    </div>
                  ))}
                {clientDetails.registeredEvents.filter((event) => {
                  const eventDate = new Date(event.date)
                  const checkIn = new Date(clientDetails.currentReservation.checkIn)
                  const checkOut = new Date(clientDetails.currentReservation.checkOut)
                  return eventDate >= checkIn && eventDate <= checkOut
                }).length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">No hay eventos próximos</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Orders During Current Reservation */}
      {activeTab === "current" && clientDetails.currentReservation && (
        <Card>
          <CardHeader>
            <CardTitle>Pedidos Durante la Reserva</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Fecha</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Categoría</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Descripción</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Estado</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Pago</th>
                    <th className="text-right py-3 px-4 font-semibold text-foreground">Monto</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { date: "2025-01-11", category: "Room Service", description: "Desayuno completo + Café", amount: 45, status: "Entregado", paid: true },
                    { date: "2025-01-11", category: "Spa", description: "Masaje relajante (60 min)", amount: 120, status: "Completado", paid: true },
                    { date: "2025-01-12", category: "Room Service", description: "Almuerzo ejecutivo", amount: 65, status: "Entregado", paid: true },
                    { date: "2025-01-12", category: "Bar", description: "Botella de vino tinto", amount: 85, status: "Entregado", paid: false },
                    { date: "2025-01-13", category: "Restaurante", description: "Cena gourmet para 2", amount: 180, status: "Entregado", paid: false },
                    { date: "2025-01-13", category: "Evento", description: "Cena de Gala de Año Nuevo", amount: 150, status: "En preparación", paid: false },
                    { date: "2025-01-14", category: "Spa", description: "Tratamiento facial premium", amount: 95, status: "Pendiente", paid: false },
                  ].map((order, idx) => {
                    const getStatusBadgeOrder = (status: string) => {
                      const statusConfig: Record<string, { className: string }> = {
                        "Entregado": { className: "bg-green-100 text-green-800" },
                        "Completado": { className: "bg-green-100 text-green-800" },
                        "En preparación": { className: "bg-blue-100 text-blue-800" },
                        "Pendiente": { className: "bg-yellow-100 text-yellow-800" },
                      }
                      const config = statusConfig[status] || { className: "bg-gray-100 text-gray-800" }
                      return <span className={`text-xs px-2 py-1 rounded ${config.className}`}>{status}</span>
                    }

                    return (
                      <tr key={idx} className="border-b border-border/50 hover:bg-accent/50 transition-colors">
                        <td className="py-3 px-4 text-sm text-muted-foreground">{new Date(order.date).toLocaleDateString("es-ES", { day: "2-digit", month: "short" })}</td>
                        <td className="py-3 px-4 text-sm font-medium text-foreground">{order.category}</td>
                        <td className="py-3 px-4 text-sm text-foreground">{order.description}</td>
                        <td className="py-3 px-4 text-sm">{getStatusBadgeOrder(order.status)}</td>
                        <td className="py-3 px-4 text-sm">
                          <Badge className={order.paid ? "bg-green-100 text-green-800 border-0" : "bg-red-100 text-red-800 border-0"}>
                            {order.paid ? "Pagado" : "Pendiente"}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-sm font-semibold text-right text-foreground">${order.amount}</td>
                      </tr>
                    )
                  })}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-border bg-accent/20">
                    <td colSpan={5} className="py-3 px-4 text-sm font-semibold text-foreground">Saldo Pendiente:</td>
                    <td className="py-3 px-4 text-sm font-bold text-right text-red-800">
                      ${[
                        { paid: true, amount: 45 },
                        { paid: true, amount: 120 },
                        { paid: true, amount: 65 },
                        { paid: false, amount: 85 },
                        { paid: false, amount: 180 },
                        { paid: false, amount: 150 },
                        { paid: false, amount: 95 },
                      ].reduce((sum, order) => sum + (order.paid ? 0 : order.amount), 0)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
      {activeTab === "history" && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Historial de Reservas</CardTitle>
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
                      </div>
                    </div>
                  </div>
                ))}
                {clientDetails.previousReservations.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">No hay reservas anteriores</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Events */}
      {activeTab === "events" && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Eventos Inscritos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {clientDetails.registeredEvents.map((event) => (
                  <div key={event.id} className="p-4 rounded-lg border bg-card hover:shadow-sm transition-shadow">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <p className="font-semibold text-foreground">{event.name}</p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(event.date).toLocaleDateString("es-ES", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {event.time}
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {event.location}
                          </div>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        {getStatusBadge(event.status)}
                        {event.price > 0 && (
                          <p className="text-sm font-semibold text-foreground mt-2">${event.price}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {clientDetails.registeredEvents.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">No hay eventos inscritos</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button variant="outline" className="flex-1 bg-transparent">
          <CreditCard className="w-4 h-4 mr-2" />
          Ver Facturación
        </Button>
      </div>
    </div>
  )
}
