"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, Calendar, MapPin, User, ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useState, useMemo } from "react"
import { useSearchParams } from "next/navigation"
import { useSelector } from "react-redux"
import type { RootState } from "@/store/store"
import { useGetUserReservationContextsQuery } from "@/features/reservation/slices/reservationSlice"

const roomImages = [
  "/luxury-deluxe-hotel-room-with-king-bed-and-modern-.jpg",
  "/hotel-room-bathroom-with-marble-and-elegant-fixtur.jpg",
  "/hotel-room-balcony-with-city-view-and-comfortable-.jpg",
  "/hotel-room-workspace-desk-and-amenities.jpg",
]

const DEFAULT_AMENITIES = [
  "WiFi gratuito",
  "Desayuno incluido",
  "Acceso al gimnasio",
  "Piscina",
  "Room service 24/7",
  "Servicio de limpieza diario",
]

function formatDisplayDate(value: string | Date | undefined): string {
  if (!value) return "—"
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return "—"
  return d.toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" })
}

export default function ReservationDetailsPage() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const searchParams = useSearchParams()
  const reservationId = searchParams.get("reservationId")
  const organizationId = useSelector((state: RootState) => state.organization?.currentOrganizationId ?? state.auth?.currentOrganization?.id)
  const { data, isLoading } = useGetUserReservationContextsQuery(undefined, {
    skip: !organizationId || !reservationId,
  })

  const reservation = useMemo(() => {
    const list = (data?.reservations ?? []) as Array<{
      id?: string
      code?: string
      checkIn?: string | Date
      checkOut?: string | Date
      status?: string
      room?: { number?: string }
      user?: { firstName?: string; lastName?: string; email?: string; phoneNumber?: string }
    }>
    return reservationId ? list.find((r) => String(r.id) === String(reservationId)) : null
  }, [data?.reservations, reservationId])

  const reservationData = useMemo(() => {
    if (!reservation) {
      return {
        confirmationCode: "—",
        guestName: "—",
        email: "—",
        phone: "—",
        checkIn: "—",
        checkOut: "—",
        nights: 0,
        room: "—",
        roomType: "Habitación",
        amenities: DEFAULT_AMENITIES,
      }
    }
    const checkIn = reservation.checkIn ? new Date(reservation.checkIn) : null
    const checkOut = reservation.checkOut ? new Date(reservation.checkOut) : null
    const nights = checkIn && checkOut ? Math.max(0, Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24))) : 0
    const guestName = [reservation.user?.firstName, reservation.user?.lastName].filter(Boolean).join(" ") || "—"
    return {
      confirmationCode: reservation.code ?? reservation.id ?? "—",
      guestName,
      email: reservation.user?.email ?? "—",
      phone: reservation.user?.phoneNumber ?? "—",
      checkIn: formatDisplayDate(reservation.checkIn),
      checkOut: formatDisplayDate(reservation.checkOut),
      nights,
      room: reservation.room?.number ?? "—",
      roomType: "Habitación",
      amenities: DEFAULT_AMENITIES,
    }
  }, [reservation])

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % roomImages.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + roomImages.length) % roomImages.length)
  }

  if (!reservationId) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#233b64" }}>
        <div className="text-white text-center">
          <p className="text-lg">No se especificó reserva.</p>
          <Link href="/client/stays">
            <Button variant="outline" className="mt-4 text-white border-white hover:bg-white/10">
              Volver a estadías
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#233b64" }}>
        <p className="text-white text-lg">Cargando...</p>
      </div>
    )
  }

  if (!reservation) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#233b64" }}>
        <div className="text-white text-center">
          <p className="text-lg">Reserva no encontrada.</p>
          <Link href="/client/stays">
            <Button variant="outline" className="mt-4 text-white border-white hover:bg-white/10">
              Volver a estadías
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#233b64" }}>
      {/* Header */}
      <div className="sticky top-0 z-10 p-4 text-white" style={{ backgroundColor: "#233b64" }}>
        <div className="flex items-center gap-4">
          <Link href="/client/stays">
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
              <ArrowLeft className="w-6 h-6" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Detalles de Reserva</h1>
            <p className="text-sm text-white/80">Código: {reservationData.confirmationCode}</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 pb-20 space-y-4">
        <Card className="p-0 bg-white overflow-hidden">
          <div className="relative w-full h-64">
            <Image
              src={roomImages[currentImageIndex] || "/placeholder.svg"}
              alt={`Habitación ${reservationData.room} - Imagen ${currentImageIndex + 1}`}
              fill
              className="object-cover"
            />
            {/* Navigation Buttons */}
            <div className="absolute inset-0 flex items-center justify-between p-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={prevImage}
                className="bg-black/30 hover:bg-black/50 text-white rounded-full"
              >
                <ChevronLeft className="w-6 h-6" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={nextImage}
                className="bg-black/30 hover:bg-black/50 text-white rounded-full"
              >
                <ChevronRight className="w-6 h-6" />
              </Button>
            </div>
            {/* Image Counter */}
            <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
              {currentImageIndex + 1} / {roomImages.length}
            </div>
          </div>
          {/* Thumbnail Navigation */}
          <div className="flex gap-2 p-4 overflow-x-auto">
            {roomImages.map((image, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                  currentImageIndex === index ? "border-[#67f1d0]" : "border-gray-200"
                }`}
              >
                <Image src={image || "/placeholder.svg"} alt={`Miniatura ${index + 1}`} fill className="object-cover" />
              </button>
            ))}
          </div>
        </Card>

        {/* Guest Information */}
        <Card className="p-6 bg-white">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <User className="w-5 h-5" />
            Información del Huésped
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Nombre</span>
              <span className="font-semibold">{reservationData.guestName}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Email</span>
              <span className="font-medium text-sm">{reservationData.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Teléfono</span>
              <span className="font-medium">{reservationData.phone}</span>
            </div>
          </div>
        </Card>

        {/* Stay Details */}
        <Card className="p-6 bg-white">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Detalles de la Estadía
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Check-in</span>
              <span className="font-semibold">{reservationData.checkIn}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Check-out</span>
              <span className="font-semibold">{reservationData.checkOut}</span>
            </div>
            {reservationData.nights > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-600">Noches</span>
                <span className="font-semibold">{reservationData.nights} noches</span>
              </div>
            )}
          </div>
        </Card>

        {/* Room Details */}
        <Card className="p-6 bg-white">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Detalles de la Habitación
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Habitación</span>
              <span className="font-semibold">#{reservationData.room}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tipo</span>
              <span className="font-semibold">{reservationData.roomType}</span>
            </div>
          </div>
        </Card>

        {/* Amenities */}
        <Card className="p-6 bg-white">
          <h2 className="text-lg font-bold mb-4">Servicios Incluidos</h2>
          <div className="grid grid-cols-2 gap-3">
            {reservationData.amenities.map((amenity, index) => (
              <div key={index} className="flex items-center gap-2 text-sm">
                <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-[#6f65d0] to-[#67f1d0]"></div>
                <span>{amenity}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Actions */}
        <div className="space-y-3 pt-2">
          <Button
            className="w-full bg-gradient-to-r from-[#6f65d0] to-[#67f1d0] text-white border-0 hover:opacity-90"
            size="lg"
          >
            Modificar Reserva
          </Button>
          <Button
            variant="outline"
            className="w-full border-2 border-white text-white hover:bg-white/10 bg-transparent"
            size="lg"
          >
            Contactar Soporte
          </Button>
        </div>
      </div>
    </div>
  )
}
