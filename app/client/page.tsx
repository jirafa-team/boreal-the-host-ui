"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import {
  Home,
  Calendar,
  Bell,
  User,
  MapPin,
  Clock,
  Utensils,
  ShoppingBag,
  Coffee,
  Crown,
  ChevronRight,
  AlertCircle,
  MessageCircle,
  Sparkles,
  Car,
  Pizza,
  Dumbbell,
  Waves,
  UtensilsCrossed,
  Users,
  CalendarDays,
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"

const mockEvents = [
  {
    id: 1,
    name: "Conferencia Anual Q1",
    description: "Presentación de resultados del primer trimestre y estrategias futuras",
    date: "2024-11-13",
    time: "10:00",
    location: "Salón Principal",
    category: "conference",
    registered: true,
    image: "/business-conference-presentation.jpg",
    attendees: 45,
    duration: "2 horas",
    color: "from-blue-500 to-purple-600",
    gradient: "from-blue-500 to-purple-600",
  },
  {
    id: 2,
    name: "Cena de Gala",
    description: "Cena formal con menú de autor y música en vivo",
    date: "2024-11-14",
    time: "20:00",
    location: "Restaurante",
    category: "dining",
    registered: false,
    image: "/elegant-gala-dinner-restaurant.jpg",
    attendees: 60,
    duration: "3 horas",
    color: "from-amber-500 to-red-600",
    gradient: "from-amber-500 to-red-600",
  },
  {
    id: 3,
    name: "Workshop de Innovación",
    description: "Taller práctico sobre nuevas tecnologías y metodologías ágiles",
    date: "2024-11-15",
    time: "14:00",
    location: "Sala de Conferencias B",
    category: "workshop",
    registered: false,
    image: "/innovation-technology-workshop.jpg",
    attendees: 30,
    duration: "4 horas",
    color: "from-green-500 to-teal-600",
    gradient: "from-green-500 to-teal-600",
  },
]

const clientEvents = [
  {
    id: 1,
    name: "Conferencia Anual Q1",
    description: "Presentación de resultados del primer trimestre y estrategias futuras",
    date: "2024-11-13",
    time: "10:00",
    location: "Salón Principal",
    category: "conference",
    registered: true,
    image: "/business-conference-presentation.jpg",
    attendees: 45,
    duration: "2 horas",
    color: "from-blue-500 to-purple-600",
    gradient: "from-blue-500 to-purple-600",
  },
  {
    id: 2,
    name: "Cena de Gala",
    description: "Cena formal con menú de autor y música en vivo",
    date: "2024-11-14",
    time: "20:00",
    location: "Restaurante",
    category: "dining",
    registered: false,
    image: "/elegant-gala-dinner-restaurant.jpg",
    attendees: 60,
    duration: "3 horas",
    color: "from-amber-500 to-red-600",
    gradient: "from-amber-500 to-red-600",
  },
  {
    id: 3,
    name: "Workshop de Innovación",
    description: "Taller práctico sobre nuevas tecnologías y metodologías ágiles",
    date: "2024-11-15",
    time: "14:00",
    location: "Sala de Conferencias B",
    category: "workshop",
    registered: false,
    image: "/innovation-technology-workshop.jpg",
    attendees: 30,
    duration: "4 horas",
    color: "from-green-500 to-teal-600",
    gradient: "from-green-500 to-teal-600",
  },
]

export default function ClientPage({ searchParams }: { searchParams: { type?: string } }) {
  const searchParamsHook = useSearchParams()
  const clientType = searchParams.type || "normal"
  const router = useRouter()

  const futureUserData = {
    name: "Ana",
    fullName: "Ana García",
    initials: "AG",
    email: "ana.garcia@email.com",
    room: "305",
    roomType: "Deluxe",
    phone: "+54 11 4567 8901",
    checkIn: "5 Dic 2024",
    checkOut: "10 Dic 2024",
    nights: 5,
    daysUntilCheckIn: 18,
  }

  const vipUserData = {
    name: "Isabella",
    fullName: "Isabella Von Habsburg",
    initials: "IV",
    email: "isabella.von.habsburg@luxury.com",
    room: "Penthouse 901",
    roomType: "Presidential Suite",
    phone: "+41 79 555 1234",
    checkIn: "20 Nov 2024",
    checkOut: "28 Nov 2024",
    nights: 7,
  }

  const normalUserData = {
    name: "Carlos",
    fullName: "Carlos Martínez",
    initials: "CM",
    email: "carlos.martinez@email.com",
    room: "204",
    roomType: "Suite Premium",
    phone: "+34 612 345 678",
    checkIn: "12 Nov 2024",
    checkOut: "15 Nov 2024",
    nights: 3,
  }

  const userData = clientType === "vip" ? vipUserData : clientType === "future" ? futureUserData : normalUserData

  const isVIP = clientType === "vip"
  const isFutureReservation = clientType === "future"

  const [activeTab, setActiveTab] = useState<"inicio" | "ordenes" | "eventos" | "avisos" | "perfil" | "calendario">(
    "inicio",
  )
  const [breakfastTime, setBreakfastTime] = useState("8:00 AM")
  const [cleaningTime, setCleaningTime] = useState("")
  const [cleaningReserved, setCleaningReserved] = useState(false)
  const [roomServiceDialog, setRoomServiceDialog] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [gymTime, setGymTime] = useState("")
  const [poolTime, setPoolTime] = useState("")
  const [showGymDialog, setShowGymDialog] = useState(false)
  const [poolDialogOpen, setPoolDialogOpen] = useState(false)

  const [showTaxiDialog, setShowTaxiDialog] = useState(false)
  const [taxiDestination, setTaxiDestination] = useState("")
  const [taxiDateTime, setTaxiDateTime] = useState("")
  const [showBreakfastDialog, setShowBreakfastDialog] = useState(false)
  const [cleaningDialogOpen, setCleaningDialogOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<number | null>(null)

  const [timeRemaining, setTimeRemaining] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  const roomServiceOrders = [
    {
      id: 1,
      date: "15 Ene 2025 - 20:30",
      items: "Desayuno Continental, Café Latte",
      total: "€15.50",
      status: "Entregado",
    },
    {
      id: 2,
      date: "16 Ene 2025 - 14:15",
      items: "Hamburguesa Premium, Coca-Cola",
      total: "€18.00",
      status: "Entregado",
    },
    {
      id: 3,
      date: "16 Ene 2025 - 19:45",
      items: "Ensalada César, Agua Mineral",
      total: "€16.50",
      status: "En Preparación",
    },
  ]

  const roomServiceCategories = [
    { id: "breakfast", name: "Desayuno", icon: Coffee, color: "bg-amber-500" },
    { id: "lunch", name: "Almuerzo", icon: Utensils, color: "bg-orange-500" },
    { id: "dinner", name: "Cena", icon: Utensils, color: "bg-red-500" },
    { id: "drinks", name: "Bebidas", icon: ShoppingBag, color: "bg-blue-500" },
    { id: "snacks", name: "Snacks", icon: ShoppingBag, color: "bg-green-500" },
  ]

  const menuItems = {
    breakfast: [
      { name: "Desayuno Continental", price: "€12", description: "Café, zumo, croissant, tostadas" },
      { name: "Desayuno Americano", price: "€18", description: "Huevos, bacon, salchichas, tostadas" },
      { name: "Desayuno Saludable", price: "€15", description: "Yogurt, frutas, granola, smoothie" },
    ],
    lunch: [
      { name: "Ensalada César", price: "€14", description: "Pollo, lechuga romana, parmesano" },
      { name: "Hamburguesa Premium", price: "€16", description: "Carne angus, queso, papas fritas" },
      { name: "Pasta Carbonara", price: "€15", description: "Pasta fresca, panceta, parmesano" },
    ],
    drinks: [
      { name: "Vino Tinto", price: "€8", description: "Copa de vino de la casa" },
      { name: "Cerveza", price: "€5", description: "Cerveza local o importada" },
      { name: "Cóctel Especial", price: "€12", description: "Cóctel del día" },
    ],
  }

  const cityRecommendations = [
    {
      name: "Museo Nacional",
      category: "Cultura",
      distance: "1.2 km",
      description: "Arte contemporáneo y exposiciones históricas",
      rating: "4.8",
    },
    {
      name: "Restaurante La Pérgola",
      category: "Gastronomía",
      distance: "800 m",
      description: "Cocina mediterránea con estrella Michelin",
      rating: "4.9",
    },
    {
      name: "Parque Central",
      category: "Naturaleza",
      distance: "2.5 km",
      description: "Amplias zonas verdes y lago artificial",
      rating: "4.7",
    },
    {
      name: "Teatro Principal",
      category: "Entretenimiento",
      distance: "1.5 km",
      description: "Espectáculos y obras de teatro en vivo",
      rating: "4.6",
    },
  ]

  useEffect(() => {
    const calculateTimeRemaining = () => {
      const now = new Date()
      const tomorrow = new Date(now)
      tomorrow.setDate(tomorrow.getDate() + 1)
      tomorrow.setHours(8, 0, 0, 0)

      const diff = tomorrow.getTime() - now.getTime()

      if (diff > 0) {
        const hours = Math.floor(diff / (1000 * 60 * 60))
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((diff % (1000 * 60)) / 1000)

        setTimeRemaining({ hours, minutes, seconds })
      }
    }

    calculateTimeRemaining()
    const interval = setInterval(calculateTimeRemaining, 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="p-4 text-white sticky top-0 z-10" style={{ backgroundColor: "#11AFBE" }}>
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex-1">
            <h1 className="text-3xl font-bold">Hola, {userData.name}</h1>
            {!isFutureReservation && (
              <p className="text-sm opacity-90 mt-2 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Habitación {userData.room} · {userData.roomType}
              </p>
            )}
          </div>
          
          {/* Tu Estancia Chip */}
          {!isFutureReservation && (
            <div className="flex items-center gap-4 bg-white/15 backdrop-blur-sm rounded-full px-4 py-2.5 border border-white/20">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-white" />
                <div className="text-center">
                  <p className="text-xs opacity-80 font-medium">Check-out</p>
                  <p className="text-sm font-bold text-white">{userData.checkOut}</p>
                </div>
              </div>
              <div className="w-px h-8 bg-white/20"></div>
              <div className="flex items-center gap-3">
                <div className="text-center">
                  <p className="text-2xl font-bold text-white">{userData.nights}</p>
                  <p className="text-xs opacity-80 font-medium">noches</p>
                </div>
                <Button
                  size="sm"
                  className="bg-violet-800 text-white hover:bg-violet-900 font-semibold px-3 h-8 rounded-full"
                >
                  Extender
                </Button>
              </div>
            </div>
          )}
          
          <div
            style={{ background: "linear-gradient(135deg, #6f65d0 0%, #67f1d0 100%)" }}
            className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg p-[2px]"
          >
            <div className="w-full h-full bg-[#233b64] rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-white">{userData.initials}</span>
            </div>
          </div>
        </div>
      </div>
      {isFutureReservation ? (
        <div className="p-4 pb-20 flex-1">
          <div className="p-[1px] rounded-2xl" style={{ background: "linear-gradient(135deg, #6f65d0, #67f1d0)" }}>
            <Card className="p-8 rounded-2xl text-center" style={{ backgroundColor: "#233b64" }}>
              <div className="mb-8">
                <h3 className="text-3xl font-bold text-white mb-4">Tu Próxima Estancia</h3>
                <div className="inline-block bg-white/10 px-4 py-2 rounded-lg">
                  <p className="text-sm text-white/90">Check-in</p>
                  <p className="text-lg font-semibold text-white">{userData.checkIn}</p>
                </div>
              </div>

              <div className="mb-8 py-6 border-y border-white/20">
                <p className="text-8xl font-bold text-white mb-3" style={{ lineHeight: 1 }}>
                  {userData.daysUntilCheckIn}
                </p>
                <p className="text-xl text-white/90 font-medium">días para tu llegada</p>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="bg-white/10 rounded-xl p-4">
                  <p className="text-3xl font-bold text-white mb-1">{userData.nights}</p>
                  <p className="text-sm text-white/80">Noches</p>
                </div>
                <div className="bg-white/10 rounded-xl p-4">
                  <p className="text-lg font-semibold text-white mb-1">{userData.room}</p>
                  <p className="text-sm text-white/80">Habitación</p>
                </div>
                <div className="bg-white/10 rounded-xl p-4">
                  <p className="text-base font-semibold text-white mb-1">{userData.roomType}</p>
                  <p className="text-xs text-white/80">Tipo</p>
                </div>
              </div>

              <div className="mt-6">
                <Link href="/client/reservation-details">
                  <Button
                    size="lg"
                    className="w-full bg-gradient-to-r from-[#6f65d0] to-[#67f1d0] text-white border-0 hover:opacity-90"
                  >
                    Ver Detalles de Reserva
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        </div>
      ) : (
        <main className="flex-1 pb-20 pt-4 px-4 max-w-2xl mx-auto w-full">
          <main className="pb-24 px-4 pt-6">
            {activeTab === "inicio" && (
              <div className="space-y-6">
                <div className="px-4 pt-4">
                  <div className="bg-gradient-to-r from-[#773CCA] to-[#11AFBE] rounded-xl p-4 text-white">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="h-5 w-5" />
                      <p className="text-sm font-medium">Próxima Actividad</p>
                    </div>
                    <p className="text-lg font-semibold mb-3">Desayuno - 8:00 AM</p>
                    <div className="flex gap-3 justify-center">
                      <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 text-center min-w-[70px]">
                        <p className="text-2xl font-bold">{String(timeRemaining.hours).padStart(2, "0")}</p>
                        <p className="text-xs opacity-90">Horas</p>
                      </div>
                      <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 text-center min-w-[70px]">
                        <p className="text-2xl font-bold">{String(timeRemaining.minutes).padStart(2, "0")}</p>
                        <p className="text-xs opacity-90">Minutos</p>
                      </div>
                      <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 text-center min-w-[70px]">
                        <p className="text-2xl font-bold">{String(timeRemaining.seconds).padStart(2, "0")}</p>
                        <p className="text-xs opacity-90">Segundos</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="px-4 pt-4">
                  <h3 className="text-2xl font-bold text-black px-1 mb-3">Servicios Destacados</h3>
                  <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory scrollbar-hide">
                    {[
                      { name: "Room Service", time: "24/7", image: "/images/untitled-20design-20-283-29.png" },
                      { name: "Taxi", time: "24/7", image: "/luxury-taxi-car-service.jpg" },
                      { name: "Cabalgata", time: "8AM - 6PM", image: "/horse-riding-tour.jpg" },
                      { name: "Spa & Masajes", time: "9AM - 9PM", image: "/luxury-spa-massage.png" },
                      { name: "Tour Ciudad", time: "10AM - 5PM", image: "/city-tour-bus.jpg" },
                    ].map((service) => (
                      <div key={service.name} className="min-w-[264px] snap-start relative rounded-lg overflow-hidden">
                        <img
                          src={service.image || "/placeholder.svg"}
                          alt={service.name}
                          className="w-full h-40 object-cover"
                        />
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                          <p className="text-white font-semibold">{service.name}</p>
                          <p className="text-white/90 text-sm">{service.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="px-4 pt-4 pb-4 bg-white">
                  <Card
                    className="relative overflow-hidden cursor-pointer hover:shadow-lg transition-all h-32"
                    onClick={() => {}} // DISABLED - Room Service functionality temporarily hidden
                  >
                    <Image src="/club-sandwich.jpg" alt="Room Service" fill className="object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40" />
                    <div className="absolute inset-0 flex items-center justify-between px-6">
                      <div className="flex items-center gap-4">
                        <div className="bg-white/20 backdrop-blur-sm p-3 rounded-full">
                          <Utensils className="w-8 h-8 text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-white mb-2">Ordenar Comida</h3>
                          <div className="inline-flex items-center gap-1.5 bg-[#773CCA] text-white text-xs px-3 py-1 rounded-full">
                            <Clock className="w-3 h-3" />
                            <span>Room Service disponible 24/7</span>
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="w-8 h-8 text-white" />
                    </div>
                  </Card>
                </div>

                {/* HIDDEN - Room service order Pizza Margherita temporarily disabled
                <div className="mx-4 bg-white rounded-lg shadow-sm border border-orange-300 p-4">
                  <div className="mb-3">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-semibold text-gray-900">Pizza Margherita</h4>
                      <span className="inline-flex items-center gap-1 bg-amber-500 text-white text-xs px-2 py-0.5 rounded-full font-medium">
                        <Clock className="w-3 h-3" />
                        En preparación
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">Tamaño: Grande • Extra queso</p>
                    <div className="flex justify-center">
                      <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#11AFBE] to-[#773CCA] text-white text-sm px-4 py-2 rounded-full font-semibold">
                        <Clock className="w-4 h-4" />
                        Llega entre 19:30 - 19:50
                      </div>
                    </div>
                  </div>
                </div>
                */}

                <div className="px-4 pt-4 pb-2 bg-white">
                  <h2 className="text-2xl font-bold text-black">Reserva</h2>
                </div>

                <div className="px-4 pb-4 bg-white">
                  <div className="grid grid-cols-2 gap-3">
                    <Dialog open={showBreakfastDialog} onOpenChange={setShowBreakfastDialog}>
                      <DialogTrigger asChild>
                        <Card className="overflow-hidden flex flex-col p-0 cursor-pointer hover:shadow-lg transition-all">
                          <div className="h-32 relative">
                            <img
                              src="/images/hotel-breakfast-buffet.jpg"
                              alt="Desayuno"
                              className="w-full h-full object-cover block"
                            />
                            <div
                              className="text-white text-xs font-medium px-2 py-1 rounded-full shadow-sm absolute top-2 right-2"
                              style={{ backgroundColor: "#773CCA" }}
                            >
                              7AM - 11AM
                            </div>
                          </div>
                          <div className="bg-white text-black flex flex-col gap-2 p-3">
                            <p className="text-lg font-bold">Desayuno</p>
                            {breakfastTime ? (
                              <div className="flex items-center gap-2">
                                <div
                                  className="text-white text-xs font-medium px-3 py-1 rounded-full"
                                  style={{ backgroundColor: "#11AFBF" }}
                                >
                                  {breakfastTime}
                                </div>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2">
                                <div
                                  className="text-white text-xs font-medium px-3 py-1 rounded-full flex items-center gap-1"
                                  style={{ backgroundColor: "#11AFBF" }}
                                >
                                  <Clock className="w-3.5 h-3.5" />
                                  Sin reservar
                                </div>
                              </div>
                            )}
                          </div>
                        </Card>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Selecciona tu horario de desayuno</DialogTitle>
                          <DialogDescription>Elige el horario que más te convenga</DialogDescription>
                        </DialogHeader>
                        <div className="grid grid-cols-2 gap-3 py-4">
                          {[
                            "7:00 AM",
                            "7:30 AM",
                            "8:00 AM",
                            "8:30 AM",
                            "9:00 AM",
                            "9:30 AM",
                            "10:00 AM",
                            "10:30 AM",
                          ].map((time) => (
                            <Button
                              key={time}
                              variant={breakfastTime === time ? "default" : "outline"}
                              onClick={() => {
                                setBreakfastTime(time)
                                setShowBreakfastDialog(false)
                              }}
                              className="h-12"
                            >
                              {time}
                            </Button>
                          ))}
                        </div>
                      </DialogContent>
                    </Dialog>

                    <Dialog open={cleaningDialogOpen} onOpenChange={setCleaningDialogOpen}>
                      <DialogTrigger asChild>
                        <Card className="overflow-hidden flex flex-col p-0 cursor-pointer hover:shadow-lg transition-all">
                          <div className="h-32 relative">
                            <img
                              src="/images/hotel-room-cleaning.jpg"
                              alt="Limpieza"
                              className="w-full h-full object-cover block"
                            />
                            <div
                              className="text-white text-xs font-medium px-2 py-1 rounded-full shadow-sm absolute top-2 right-2"
                              style={{ backgroundColor: "#773CCA" }}
                            >
                              9AM - 5PM
                            </div>
                          </div>
                          <div className="bg-white text-black flex flex-col gap-2 p-3">
                            <p className="text-lg font-bold">Limpieza</p>
                            {cleaningTime ? (
                              <div className="flex items-center gap-2">
                                <div className="bg-gradient-to-r from-[#6f65d0] to-[#67f1d0] text-white text-xs font-medium px-3 py-1 rounded-full">
                                  {cleaningTime}
                                </div>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2">
                                <div
                                  className="text-white text-xs font-medium px-3 py-1 rounded-full flex items-center gap-1"
                                  style={{ backgroundColor: "#11AFBF" }}
                                >
                                  <Clock className="w-3.5 h-3.5" />
                                  Sin reservar
                                </div>
                              </div>
                            )}
                          </div>
                        </Card>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle>Servicio de Limpieza</DialogTitle>
                          <DialogDescription>
                            Selecciona el horario preferido para la limpieza de tu habitación
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <RadioGroup value={cleaningTime} onValueChange={setCleaningTime}>
                            {[
                              "9:00 AM",
                              "10:00 AM",
                              "11:00 AM",
                              "12:00 PM",
                              "1:00 PM",
                              "2:00 PM",
                              "3:00 PM",
                              "No hoy",
                            ].map((time) => (
                              <div
                                key={time}
                                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-accent cursor-pointer"
                              >
                                <RadioGroupItem value={time} id={`clean-${time}`} />
                                <Label htmlFor={`clean-${time}`} className="flex-1 cursor-pointer font-medium">
                                  {time}
                                </Label>
                              </div>
                            ))}
                          </RadioGroup>
                        </div>
                        <Button
                          className="w-full"
                          size="lg"
                          onClick={() => {
                            setCleaningReserved(true)
                            setCleaningDialogOpen(false)
                          }}
                        >
                          Confirmar Horario
                        </Button>
                      </DialogContent>
                    </Dialog>

                    <Dialog open={showGymDialog} onOpenChange={setShowGymDialog}>
                      <DialogTrigger asChild>
                        <Card className="overflow-hidden flex flex-col p-0 cursor-pointer hover:shadow-lg transition-all">
                          <div className="h-32 relative">
                            <img
                              src="/images/modern-hotel-gym.jpg"
                              alt="Gimnasio"
                              className="w-full h-full object-cover block"
                            />
                            <div
                              className="text-white text-xs font-medium px-2 py-1 rounded-full shadow-sm absolute top-2 right-2"
                              style={{ backgroundColor: "#773CCA" }}
                            >
                              6AM - 11PM
                            </div>
                          </div>
                          <div className="bg-white text-black flex flex-col gap-2 p-3">
                            <p className="text-lg font-bold">Gimnasio</p>
                            {gymTime ? (
                              <div className="flex items-center gap-2">
                                <div className="bg-gradient-to-r from-[#6f65d0] to-[#67f1d0] text-white text-xs font-medium px-3 py-1 rounded-full">
                                  {gymTime}
                                </div>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2">
                                <div
                                  className="text-white text-xs font-medium px-3 py-1 rounded-full flex items-center gap-1"
                                  style={{ backgroundColor: "#11AFBF" }}
                                >
                                  <Clock className="w-3.5 h-3.5" />
                                  Sin reservar
                                </div>
                              </div>
                            )}
                          </div>
                        </Card>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle>Reservar Gimnasio</DialogTitle>
                          <DialogDescription>Selecciona el horario para tu sesión de entrenamiento</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <RadioGroup value={gymTime} onValueChange={setGymTime}>
                            {[
                              "6:00 AM",
                              "7:00 AM",
                              "8:00 AM",
                              "9:00 AM",
                              "5:00 PM",
                              "6:00 PM",
                              "7:00 PM",
                              "8:00 PM",
                            ].map((time) => (
                              <div
                                key={time}
                                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-accent cursor-pointer"
                              >
                                <RadioGroupItem value={time} id={`gym-${time}`} />
                                <Label htmlFor={`gym-${time}`} className="flex-1 cursor-pointer font-medium">
                                  {time}
                                </Label>
                                <Badge variant="secondary" className="text-xs">
                                  Disponible
                                </Badge>
                              </div>
                            ))}
                          </RadioGroup>
                        </div>
                        <Button className="w-full" size="lg" onClick={() => setShowGymDialog(false)}>
                          Confirmar Reserva
                        </Button>
                      </DialogContent>
                    </Dialog>

                    <Dialog open={poolDialogOpen} onOpenChange={setPoolDialogOpen}>
                      <DialogTrigger asChild>
                        <Card className="overflow-hidden flex flex-col p-0 cursor-pointer hover:shadow-lg transition-all">
                          <div className="h-32 relative">
                            <img
                              src="/images/luxury-hotel-pool.jpg"
                              alt="Piscina"
                              className="w-full h-full object-cover block"
                            />
                            <div
                              className="text-white text-xs font-medium px-2 py-1 rounded-full shadow-sm absolute top-2 right-2"
                              style={{ backgroundColor: "#773CCA" }}
                            >
                              9AM - 7PM
                            </div>
                          </div>
                          <div className="bg-white text-black flex flex-col gap-2 p-3">
                            <p className="text-lg font-bold">Piscina</p>
                            {poolTime ? (
                              <div className="flex items-center gap-2">
                                <div className="bg-gradient-to-r from-[#6f65d0] to-[#67f1d0] text-white text-xs font-medium px-3 py-1 rounded-full">
                                  {poolTime}
                                </div>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2">
                                <div
                                  className="text-white text-xs font-medium px-3 py-1 rounded-full flex items-center gap-1"
                                  style={{ backgroundColor: "#11AFBF" }}
                                >
                                  <Clock className="w-3.5 h-3.5" />
                                  Sin reservar
                                </div>
                              </div>
                            )}
                          </div>
                        </Card>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle>Reservar Piscina</DialogTitle>
                          <DialogDescription>Selecciona el horario para disfrutar de la piscina</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <RadioGroup value={poolTime} onValueChange={setPoolTime}>
                            {[
                              "9:00 AM",
                              "10:00 AM",
                              "11:00 AM",
                              "12:00 PM",
                              "3:00 PM",
                              "4:00 PM",
                              "5:00 PM",
                              "6:00 PM",
                            ].map((time) => (
                              <div
                                key={time}
                                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-accent cursor-pointer"
                              >
                                <RadioGroupItem value={time} id={`pool-${time}`} />
                                <Label htmlFor={`pool-${time}`} className="flex-1 cursor-pointer font-medium">
                                  {time}
                                </Label>
                                <Badge variant="secondary" className="text-xs">
                                  Disponible
                                </Badge>
                              </div>
                            ))}
                          </RadioGroup>
                        </div>
                        <Button className="w-full" size="lg" onClick={() => setPoolDialogOpen(false)}>
                          Confirmar Reserva
                        </Button>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>

                <div className="px-4 pb-4">
                  <Card
                    className="relative overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                    onClick={() => router.push("/client/help-form")}
                  >
                    <Image src="/hotel-concierge-help-desk.jpg" alt="Asistencia" fill className="object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#11AFBF]/95 to-[#11AFBF]/80" />
                    <div className="relative h-full flex items-center justify-between p-5">
                      <div className="flex items-center gap-4">
                        <div className="bg-white/20 backdrop-blur-sm p-3 rounded-full">
                          <MessageCircle className="w-8 h-8 text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-white mb-2">¿Necesitas Ayuda?</h3>
                          <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full">
                            <span>Estamos aquí para ti</span>
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="w-8 h-8 text-white" />
                    </div>
                  </Card>
                </div>

                <div className="px-4 pt-4 pb-4 bg-white">
                  <Card
                    className="relative overflow-hidden cursor-pointer hover:shadow-lg transition-all h-32"
                    onClick={() => {
                      router.push("/client/support")
                    }}
                  >
                    <Image src="/hotel-concierge-help-desk.jpg" alt="Ayuda y Soporte" fill className="object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-r from-red-900/70 to-red-700/50" />
                    <div className="absolute inset-0 flex items-center justify-between px-6">
                      <div className="flex items-center gap-4">
                        <div className="bg-white/20 backdrop-blur-sm p-3 rounded-full">
                          <AlertCircle className="w-8 h-8 text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-white mb-2">Reportar Inconveniente</h3>
                          <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full">
                            <span>Solicitar ayuda directa</span>
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="w-8 h-8 text-white" />
                    </div>
                  </Card>
                </div>

                <div className="px-4 pt-4 pb-2 bg-white">
                  <h2 className="text-2xl font-bold text-black">Ciudad</h2>
                </div>

                <div className="px-4 pb-4 bg-white">
                  <div className="grid grid-cols-2 gap-3">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Card className="relative overflow-hidden cursor-pointer hover:shadow-lg transition-all h-40">
                          <Image
                            src="/hotel-interior-map-modern.jpg"
                            alt="Mapa del Hotel"
                            fill
                            className="object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                          <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                            <p className="text-sm font-bold">Mapa</p>
                            <p className="text-xs opacity-90">Hotel</p>
                          </div>
                        </Card>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Mapa del Hotel</DialogTitle>
                          <DialogDescription>Explora las instalaciones y servicios del hotel</DialogDescription>
                        </DialogHeader>
                        <div className="py-4">
                          <div className="bg-muted rounded-lg p-8 min-h-[400px] relative overflow-hidden">
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="text-center space-y-6 w-full px-6">
                                <div className="bg-background rounded-xl p-4 shadow-md">
                                  <h4 className="font-bold text-sm mb-3">Planta Baja</h4>
                                  <div className="grid grid-cols-3 gap-2 text-xs">
                                    <div className="bg-blue-100 dark:bg-blue-950 p-2 rounded">Recepción</div>
                                    <div className="bg-orange-100 dark:bg-orange-950 p-2 rounded">Restaurante</div>
                                    <div className="bg-green-100 dark:bg-green-950 p-2 rounded">Lobby</div>
                                  </div>
                                </div>

                                <div className="bg-background rounded-xl p-4 shadow-md">
                                  <h4 className="font-bold text-sm mb-3">Primer Piso</h4>
                                  <div className="grid grid-cols-3 gap-2 text-xs">
                                    <div className="bg-red-100 dark:bg-red-950 p-2 rounded">Gimnasio</div>
                                    <div className="bg-cyan-100 dark:bg-cyan-950 p-2 rounded">Piscina</div>
                                    <div className="bg-purple-100 dark:bg-purple-950 p-2 rounded">Spa</div>
                                  </div>
                                </div>

                                <div className="bg-background rounded-xl p-4 shadow-md">
                                  <h4 className="font-bold text-sm mb-3">Pisos 2-5</h4>
                                  <div className="grid grid-cols-2 gap-2 text-xs">
                                    <div className="bg-primary/10 p-2 rounded">Habitaciones</div>
                                    <div className="bg-primary/20 p-2 rounded border-2 border-primary">
                                      Tu Habitación (204)
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>

                    <Link href="/client/recommendations">
                      <Card className="relative overflow-hidden cursor-pointer hover:shadow-lg transition-all h-40">
                        <Image
                          src="/beautiful-city-landmarks-attractions.jpg"
                          alt="Visitas Ciudad"
                          fill
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                          <p className="text-sm font-bold">Visitas</p>
                          <p className="text-xs opacity-90">Ciudad</p>
                        </div>
                      </Card>
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "eventos" && (
              <div className="pb-24 px-4 pt-6">
                <h2 className="text-2xl font-bold mb-4">Eventos del Hotel</h2>
                <div className="space-y-4">
                  {clientEvents.map((event) => {
                    const eventDate = new Date(event.date)
                    const day = eventDate.getDate()
                    const month = eventDate.toLocaleDateString("es-ES", { month: "short" }).toUpperCase()

                    return (
                      <Link key={event.id} href={`/client/event/${event.id}`}>
                        <Card className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow">
                          <div className="relative h-48">
                            <Image
                              src={event.image || "/placeholder.svg"}
                              alt={event.name}
                              fill
                              className="object-cover"
                            />
                            <div className={`absolute inset-0 bg-gradient-to-br ${event.gradient} opacity-50`} />
                            <div className="absolute top-3 right-3">
                              {event.registered ? (
                                <Badge className="bg-white/90 text-[#773CCA] hover:bg-white shadow-lg">
                                  ✓ Registrado
                                </Badge>
                              ) : (
                                <Badge className="bg-white/90 text-gray-700 hover:bg-white shadow-lg">Disponible</Badge>
                              )}
                            </div>
                            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                              <h3 className="text-xl font-bold text-white mb-1">{event.name}</h3>
                              <p className="text-sm text-white/90 line-clamp-1">{event.description}</p>
                            </div>
                          </div>
                          <div className="p-4 space-y-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <div className="bg-gradient-to-br from-[#11AFBE] to-[#773CCA] rounded-xl p-3 text-white text-center min-w-[60px]">
                                  <p className="text-xs font-semibold uppercase">{month}</p>
                                  <p className="text-2xl font-bold leading-none">{day}</p>
                                </div>
                                <div className="space-y-1">
                                  <div className="flex items-center gap-1.5 text-gray-600">
                                    <Clock className="w-4 h-4" />
                                    <span className="text-sm font-medium">{event.time}</span>
                                    <span className="text-xs text-gray-400">• {event.duration}</span>
                                  </div>
                                  <div className="flex items-center gap-1.5 text-gray-600">
                                    <MapPin className="w-4 h-4" />
                                    <span className="text-sm">{event.location}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                              <div className="flex items-center gap-2">
                                <div className="flex -space-x-2">
                                  {[1, 2, 3].map((i) => (
                                    <div
                                      key={i}
                                      className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 border-2 border-white flex items-center justify-center text-white text-xs font-semibold"
                                    >
                                      {String.fromCharCode(64 + i)}
                                    </div>
                                  ))}
                                </div>
                                <span className="text-xs text-gray-500 font-medium">{event.attendees} asistentes</span>
                              </div>
                              <Button
                                size="sm"
                                className="bg-gradient-to-r from-[#11AFBE] to-[#773CCA] text-white hover:opacity-90"
                                onClick={(e) => {
                                  e.preventDefault()
                                  e.stopPropagation()
                                }}
                              >
                                {event.registered ? "Ver detalles" : "Registrarse"}
                              </Button>
                            </div>
                          </div>
                        </Card>
                      </Link>
                    )
                  })}
                </div>
              </div>
            )}

            {activeTab === "avisos" && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-foreground">Notificaciones</h2>
                <div className="space-y-3">
                  {[
                    {
                      title: "Bienvenida",
                      message: "Gracias por hospedarte con nosotros",
                      time: "Hace 1 día",
                      read: true,
                    },
                    {
                      title: "Nuevo evento disponible",
                      message: "Workshop de Innovación - 15 Nov",
                      time: "Hace 2 horas",
                      read: false,
                    },
                    // { title: "Room service", message: "Tu pedido está en camino", time: "Hace 30 min", read: false }, // HIDDEN - Room service notifications temporarily disabled
                  ].map((notif, idx) => (
                    <Card key={idx} className={`p-4 ${!notif.read ? "bg-primary/5 border-primary/20" : ""}`}>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-foreground text-sm">{notif.title}</h4>
                          <p className="text-sm text-muted-foreground mt-1">{notif.message}</p>
                          <p className="text-xs text-muted-foreground mt-2">{notif.time}</p>
                        </div>
                        {!notif.read && <div className="w-2 h-2 bg-destructive rounded-full shrink-0 mt-1" />}
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}
            {activeTab === "perfil" && (
              <div className="p-4">
                <div className="space-y-4">
                  <h2 className="text-xl font-bold text-foreground">Mi Perfil</h2>
                  <Card className="p-6">
                    <div className="text-center mb-6">
                      <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-3">
                        <span className="text-2xl font-bold text-primary-foreground">{userData.initials}</span>
                      </div>
                      <h3 className="font-semibold text-foreground">{userData.fullName}</h3>
                      <p className="text-sm text-muted-foreground">{userData.email}</p>
                      {isVIP && (
                        <div className="mt-2 inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
                          <Crown className="w-3 h-3" />
                          Cliente VIP
                        </div>
                      )}
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between py-3 border-b border-border">
                        <span className="text-sm text-muted-foreground">Habitación</span>
                        <span className="text-sm font-medium text-foreground">
                          {userData.room} - {userData.roomType}
                        </span>
                      </div>
                      <div className="flex justify-between py-3 border-b border-border">
                        <span className="text-sm text-muted-foreground">Check-in</span>
                        <span className="text-sm font-medium text-foreground">{userData.checkIn}</span>
                      </div>
                      <div className="flex justify-between py-3 border-b border-border">
                        <span className="text-sm text-muted-foreground">Check-out</span>
                        <span className="text-sm font-medium text-foreground">{userData.checkOut}</span>
                      </div>
                      <div className="flex justify-between py-3">
                        <span className="text-sm text-muted-foreground">Teléfono</span>
                        <span className="text-sm font-medium text-foreground">{userData.phone}</span>
                      </div>
                    </div>
                    <Button variant="outline" className="w-full mt-6 bg-transparent">
                      Editar Perfil
                    </Button>
                  </Card>
                </div>
              </div>
            )}
            {activeTab === "ordenes" && (
              <div className="pb-24 px-4 pt-6 space-y-4">
                <h2 className="text-2xl font-bold mb-4">Mis Órdenes</h2>

                <Card
                  className="relative overflow-hidden cursor-pointer hover:shadow-lg transition-all h-32"
                  onClick={() => {}} // DISABLED - Room Service functionality temporarily hidden
                >
                  <Image src="/club-sandwich.jpg" alt="Room Service" fill className="object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40" />
                  <div className="absolute inset-0 flex items-center justify-between px-6">
                    <div className="flex items-center gap-4">
                      <div className="bg-white/20 backdrop-blur-sm p-3 rounded-full">
                        <Utensils className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white mb-2">Ordenar Comida</h3>
                        <div className="inline-flex items-center gap-1.5 bg-[#773CCA] text-white text-xs px-3 py-1 rounded-full">
                          <Clock className="w-3 h-3" />
                          <span>Room Service disponible 24/7</span>
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="w-8 h-8 text-white" />
                  </div>
                </Card>

                <div className="bg-white rounded-lg p-4 shadow-sm border border-orange-200">
                  <div className="flex items-start gap-3">
                    <div className="bg-[#773CCA] p-2.5 rounded-full">
                      <Pizza className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-1">
                        <h4 className="font-semibold text-gray-900">Pizza Margherita</h4>
                        <span className="inline-flex items-center gap-1 bg-amber-500 text-white text-xs px-2 py-0.5 rounded-full font-medium">
                          <Clock className="w-3 h-3" />
                          En preparación
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">Tamaño: Grande • Extra queso</p>
                      <div className="bg-white/60 rounded-lg px-3 py-2 border border-orange-300">
                        <p className="text-sm font-medium text-gray-900 text-center">Llega entre 19:30 - 19:50</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">Servicios Disponibles</h3>
                  <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory scrollbar-hide">
                    {[
                      { name: "Spa & Masajes", time: "9AM - 9PM", image: "/luxury-spa-massage.png" },
                      { name: "Taxi", time: "24/7", image: "/luxury-taxi-car-service.jpg" },
                      { name: "Cabalgata", time: "8AM - 6PM", image: "/horse-riding-tour.jpg" },
                      { name: "Tour Ciudad", time: "10AM - 5PM", image: "/city-tour-bus.jpg" },
                      { name: "Room Service", time: "24/7", image: "/images/untitled-20design-20-283-29.png" },
                    ].map((service) => (
                      <div key={service.name} className="min-w-[264px] snap-start relative rounded-lg overflow-hidden">
                        <img
                          src={service.image || "/placeholder.svg"}
                          alt={service.name}
                          className="w-full h-40 object-cover"
                        />
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                          <p className="text-white font-semibold">{service.name}</p>
                          <p className="text-white/90 text-sm">{service.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-foreground mt-4">Historial de Solicitudes</h3>

                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="flex gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#6f65d0] to-[#67f1d0] flex items-center justify-center flex-shrink-0">
                        <Sparkles className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <p className="text-base font-semibold text-gray-900 leading-tight">Masaje Relajante 60 min</p>
                          <span className="text-base font-bold text-[#11AFBF] whitespace-nowrap">$85.00</span>
                        </div>
                        <p className="text-xs text-gray-500 mb-2">Hoy, 15:00 - Spa</p>
                        <Badge className="text-xs bg-green-100 text-green-700 hover:bg-green-100">Completado</Badge>
                      </div>
                    </div>
                  </div>

                  {roomServiceOrders.map((order, index) => (
                    <div key={order.id} className="bg-white rounded-xl p-4 shadow-sm">
                      <div className="flex gap-3">
                        <div className="w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center flex-shrink-0">
                          <Utensils className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <p className="text-base font-semibold text-gray-900 leading-tight">{order.items}</p>
                            <span className="text-base font-bold text-[#11AFBF] whitespace-nowrap">{order.total}</span>
                          </div>
                          <p className="text-xs text-gray-500 mb-2">{order.date}</p>
                          <Badge
                            variant={order.status === "Entregado" ? "secondary" : "default"}
                            className={`text-xs ${
                              order.status === "Entregado"
                                ? "bg-green-100 text-green-700 hover:bg-green-100"
                                : "bg-yellow-100 text-yellow-700 hover:bg-yellow-100"
                            }`}
                          >
                            {order.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}

                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="flex gap-3">
                      <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                        <Car className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <p className="text-base font-semibold text-gray-900 leading-tight">Taxi al Aeropuerto</p>
                          <span className="text-base font-bold text-[#11AFBF] whitespace-nowrap">$45.00</span>
                        </div>
                        <p className="text-xs text-gray-500 mb-2">Ayer, 06:30</p>
                        <Badge className="text-xs bg-green-100 text-green-700 hover:bg-green-100">Completado</Badge>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="flex gap-3">
                      <div className="w-12 h-12 rounded-full bg-teal-500 flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <p className="text-base font-semibold text-gray-900 leading-tight">
                            Tour de Cabalgata - 2 personas
                          </p>
                          <span className="text-base font-bold text-[#11AFBF] whitespace-nowrap">$120.00</span>
                        </div>
                        <p className="text-xs text-gray-500 mb-2">15 Dic, 14:00</p>
                        <Badge className="text-xs bg-green-100 text-green-700 hover:bg-green-100">Completado</Badge>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-[#11AFBF] rounded-xl p-4 mt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-base font-bold text-white">Total Acumulado</span>
                    <span className="text-2xl font-bold text-white">
                      €
                      {(
                        roomServiceOrders.reduce((sum, order) => {
                          const price = Number.parseFloat(order.total.replace(/[€$]/g, ""))
                          return sum + price
                        }, 0) +
                        45.0 +
                        120.0 +
                        22.0
                      ).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            )}
            {activeTab === "calendario" && (
              <div className="space-y-6 px-4 pb-24">
                <h2 className="text-2xl font-bold text-foreground">Mi Agenda</h2>

                {/* Hoy */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-6 bg-[#11AFBF] rounded-full" />
                    <h3 className="text-lg font-semibold">
                      Hoy - {new Date().toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long" })}
                    </h3>
                  </div>

                  <div className="space-y-2">
                    {/* Desayuno */}
                    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                      <div className="flex items-start justify-between">
                        <div className="flex gap-3">
                          <div className="flex flex-col items-center">
                            <span className="text-sm font-semibold text-[#773CCA]">08:00</span>
                            <div className="w-px h-full bg-[#773CCA] mt-1" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <Coffee className="w-5 h-5 text-[#773CCA]" />
                              <h4 className="font-semibold">Desayuno</h4>
                            </div>
                            <p className="text-sm text-muted-foreground">Restaurante Principal</p>
                            <span className="inline-block mt-2 px-3 py-1 text-xs font-medium bg-[#11AFBF] text-white rounded-full">
                              Confirmado
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Limpieza */}
                    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                      <div className="flex items-start justify-between">
                        <div className="flex gap-3">
                          <div className="flex flex-col items-center">
                            <span className="text-sm font-semibold text-[#773CCA]">10:00</span>
                            <div className="w-px h-full bg-[#773CCA] mt-1" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <Sparkles className="w-5 h-5 text-[#773CCA]" />
                              <h4 className="font-semibold">Servicio de Limpieza</h4>
                            </div>
                            <p className="text-sm text-muted-foreground">Habitación 305</p>
                            <span className="inline-block mt-2 px-3 py-1 text-xs font-medium bg-[#11AFBF] text-white rounded-full">
                              Programado
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Gimnasio */}
                    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                      <div className="flex items-start justify-between">
                        <div className="flex gap-3">
                          <div className="flex flex-col items-center">
                            <span className="text-sm font-semibold text-[#773CCA]">18:00</span>
                            <div className="w-px h-full bg-[#773CCA] mt-1" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <Dumbbell className="w-5 h-5 text-[#773CCA]" />
                              <h4 className="font-semibold">Gimnasio</h4>
                            </div>
                            <p className="text-sm text-muted-foreground">Centro de Fitness - Piso 2</p>
                            <span className="inline-block mt-2 px-3 py-1 text-xs font-medium bg-[#11AFBF] text-white rounded-full">
                              Reservado
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Pizza en camino */}
                    <div className="bg-white rounded-xl p-4 shadow-sm border-2 border-orange-300">
                      <div className="flex items-start justify-between">
                        <div className="flex gap-3">
                          <div className="flex flex-col items-center">
                            <span className="text-sm font-semibold text-orange-600">19:30</span>
                            <div className="w-px h-full bg-orange-400 mt-1" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <UtensilsCrossed className="w-5 h-5 text-orange-600" />
                              <h4 className="font-semibold">Pizza Margherita</h4>
                            </div>
                            <p className="text-sm text-muted-foreground">Room Service - Entrega a habitación</p>
                            <div className="flex items-center gap-2 mt-2">
                              <span className="inline-block px-3 py-1 text-xs font-medium bg-yellow-500 text-white rounded-full">
                                En Preparación
                              </span>
                              <span className="text-xs text-orange-600 font-medium">Llega: 19:30 - 19:50</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Mañana */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-6 bg-gray-400 rounded-full" />
                    <h3 className="text-lg font-semibold">
                      Mañana -{" "}
                      {new Date(Date.now() + 86400000).toLocaleDateString("es-ES", {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                      })}
                    </h3>
                  </div>

                  <div className="space-y-2">
                    {/* Conferencia */}
                    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                      <div className="flex items-start justify-between">
                        <div className="flex gap-3">
                          <div className="flex flex-col items-center">
                            <span className="text-sm font-semibold text-[#773CCA]">10:00</span>
                            <div className="w-px h-full bg-[#773CCA] mt-1" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <Users className="w-5 h-5 text-[#773CCA]" />
                              <h4 className="font-semibold">Conferencia Anual Q1</h4>
                            </div>
                            <p className="text-sm text-muted-foreground">Salón Principal - 4 horas</p>
                            <span className="inline-block mt-2 px-3 py-1 text-xs font-medium bg-[#773CCA] text-white rounded-full">
                              Registrado
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Desayuno */}
                    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                      <div className="flex items-start justify-between">
                        <div className="flex gap-3">
                          <div className="flex flex-col items-center">
                            <span className="text-sm font-semibold text-[#773CCA]">08:00</span>
                            <div className="w-px h-full bg-[#773CCA] mt-1" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <Coffee className="w-5 h-5 text-[#773CCA]" />
                              <h4 className="font-semibold">Desayuno</h4>
                            </div>
                            <p className="text-sm text-muted-foreground">Restaurante Principal</p>
                            <span className="inline-block mt-2 px-3 py-1 text-xs font-medium bg-[#11AFBF] text-white rounded-full">
                              Confirmado
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Piscina */}
                    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                      <div className="flex items-start justify-between">
                        <div className="flex gap-3">
                          <div className="flex flex-col items-center">
                            <span className="text-sm font-semibold text-[#773CCA]">15:00</span>
                            <div className="w-px h-full bg-[#773CCA] mt-1" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <Waves className="w-5 h-5 text-[#773CCA]" />
                              <h4 className="font-semibold">Piscina</h4>
                            </div>
                            <p className="text-sm text-muted-foreground">Terraza - Piso 8</p>
                            <span className="inline-block mt-2 px-3 py-1 text-xs font-medium bg-[#11AFBF] text-white rounded-full">
                              Reservado
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </main>
        </main>
      )}
      <nav className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-lg border-t border-border shadow-lg">
        <div className="flex items-center justify-around px-2 py-2">
          <button
            onClick={() => setActiveTab("inicio")}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${
              activeTab === "inicio" ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Home className="w-5 h-5" />
            <span className="text-xs font-medium">Inicio</span>
          </button>
          <button
            onClick={() => setActiveTab("ordenes")}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${
              activeTab === "ordenes" ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Utensils className="w-5 h-5" />
            <span className="text-xs font-medium">Órdenes</span>
          </button>
          <button
            onClick={() => setActiveTab("eventos")}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${
              activeTab === "eventos" ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Calendar className="w-5 h-5" />
            <span className="text-xs font-medium">Eventos</span>
          </button>
          <button
            onClick={() => setActiveTab("avisos")}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all relative ${
              activeTab === "avisos" ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Bell className="w-5 h-5" />
            <span className="text-xs font-medium">Avisos</span>
            <div className="absolute top-1 right-3 w-2 h-2 bg-destructive rounded-full animate-pulse" />
          </button>
          <button
            onClick={() => setActiveTab("perfil")}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${
              activeTab === "perfil" ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <User className="w-5 h-5" />
            <span className="text-xs font-medium">Perfil</span>
          </button>
          <button
            onClick={() => setActiveTab("calendario")}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${
              activeTab === "calendario" ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <CalendarDays className="w-5 h-5" />
            <span className="text-xs font-medium">Agenda</span>
          </button>
        </div>
      </nav>
    </div>
  )
}
