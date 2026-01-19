"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, Calendar, MapPin, User, CreditCard, ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useState } from "react"

export default function ReservationDetailsPage() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const roomImages = [
    "/luxury-deluxe-hotel-room-with-king-bed-and-modern-.jpg",
    "/hotel-room-bathroom-with-marble-and-elegant-fixtur.jpg",
    "/hotel-room-balcony-with-city-view-and-comfortable-.jpg",
    "/hotel-room-workspace-desk-and-amenities.jpg",
  ]

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % roomImages.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + roomImages.length) % roomImages.length)
  }

  const reservationData = {
    confirmationCode: "HT2024-7845",
    guestName: "Carlos Martínez",
    email: "carlos.martinez@email.com",
    phone: "+54 11 4567-8900",
    checkIn: "15 Dic, 2024",
    checkOut: "18 Dic, 2024",
    nights: 3,
    room: "305",
    roomType: "Deluxe Suite",
    guests: 2,
    bedType: "King Size",
    price: "$450",
    pricePerNight: "$150",
    paymentMethod: "Tarjeta de Crédito •••• 4532",
    paymentStatus: "Pagado",
    specialRequests: "Vista al mar, piso alto",
    amenities: [
      "WiFi gratuito",
      "Desayuno incluido",
      "Acceso al gimnasio",
      "Piscina",
      "Room service 24/7",
      "Servicio de limpieza diario",
    ],
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#233b64" }}>
      {/* Header */}
      <div className="sticky top-0 z-10 p-4 text-white" style={{ backgroundColor: "#233b64" }}>
        <div className="flex items-center gap-4">
          <Link href="/client?type=future">
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
            <div className="flex justify-between">
              <span className="text-gray-600">Noches</span>
              <span className="font-semibold">{reservationData.nights} noches</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Huéspedes</span>
              <span className="font-semibold">{reservationData.guests} personas</span>
            </div>
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
            <div className="flex justify-between">
              <span className="text-gray-600">Cama</span>
              <span className="font-semibold">{reservationData.bedType}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Solicitudes</span>
              <span className="font-medium text-sm text-right">{reservationData.specialRequests}</span>
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

        {/* Payment Information */}
        <Card className="p-6 bg-white">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Información de Pago
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Precio por noche</span>
              <span className="font-medium">{reservationData.pricePerNight}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Total ({reservationData.nights} noches)</span>
              <span className="font-bold text-lg">{reservationData.price}</span>
            </div>
            <div className="pt-3 border-t">
              <div className="flex justify-between">
                <span className="text-gray-600">Método de pago</span>
                <span className="font-medium text-sm">{reservationData.paymentMethod}</span>
              </div>
              <div className="flex justify-between mt-2">
                <span className="text-gray-600">Estado</span>
                <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                  {reservationData.paymentStatus}
                </span>
              </div>
            </div>
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
