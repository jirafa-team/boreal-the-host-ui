"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, ArrowLeft, Download, QrCode, Phone } from "lucide-react"
import Link from "next/link"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import Image from "next/image"

interface Recommendation {
  id: number
  name: string
  category: string
  distance: string
  rating: number
  description: string
  address: string
  phone: string
  hours: string
  discount: string
}

const cityRecommendations: Recommendation[] = [
  {
    id: 1,
    name: "Museos de Arte Moderno",
    category: "Museo",
    distance: "500m",
    rating: 4.8,
    description: "Galería de arte contemporáneo con exposiciones nacionales e internacionales",
    address: "Calle Principal 123",
    phone: "+34 123 456 789",
    hours: "10:00 - 18:00",
    discount: "10% de descuento con código: HOTEL2024",
  },
  {
    id: 2,
    name: "Restaurante La Toscana",
    category: "Restaurante",
    distance: "800m",
    rating: 4.6,
    description: "Cocina italiana auténtica en ambiente elegante",
    address: "Paseo del Prado 456",
    phone: "+34 987 654 321",
    hours: "13:00 - 23:00",
    discount: "15% descuento en comida con QR",
  },
  {
    id: 3,
    name: "Parque Central",
    category: "Naturaleza",
    distance: "200m",
    rating: 4.7,
    description: "Hermoso parque con lago, jardines y zona de recreo",
    address: "Av. del Parque s/n",
    phone: "Entrada gratuita",
    hours: "Siempre abierto",
    discount: "Acceso gratuito al área VIP",
  },
  {
    id: 4,
    name: "Centro Comercial Plaza Mayor",
    category: "Compras",
    distance: "1.2km",
    rating: 4.5,
    description: "Centro comercial con tiendas de marcas internacionales y locales",
    address: "Plaza Mayor 789",
    phone: "+34 111 222 333",
    hours: "10:00 - 21:00",
    discount: "5% extra en todas las tiendas",
  },
  {
    id: 5,
    name: "Spa & Wellness Center",
    category: "Bienestar",
    distance: "600m",
    rating: 4.9,
    description: "Centro de spa con masajes, faciales y tratamientos holísticos",
    address: "Calle Serenidad 321",
    phone: "+34 333 444 555",
    hours: "09:00 - 20:00",
    discount: "20% en tratamientos premium",
  },
  {
    id: 6,
    name: "Teatro Nacional",
    category: "Cultura",
    distance: "1.5km",
    rating: 4.8,
    description: "Teatro histórico con obras de teatro, música y danza",
    address: "Avenida de la Cultura 555",
    phone: "+34 666 777 888",
    hours: "Según programación",
    discount: "Entrada a precio especial",
  },
]

export default function RecommendationsPage() {
  const [selectedQR, setSelectedQR] = useState<Recommendation | null>(null)

  const downloadQR = (recommendation: Recommendation) => {
    // En una implementación real, aquí generarías el QR
    console.log(`Descargando QR para: ${recommendation.name}`)
    // Por ahora solo simulamos
    alert(`QR generado para ${recommendation.name}\nDescuento: ${recommendation.discount}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background pb-24">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-lg border-b border-border">
        <div className="flex items-center gap-4 p-4 max-w-screen-xl mx-auto">
          <Link href="/client">
            <Button variant="ghost" size="icon" className="shrink-0">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-foreground">Recomendaciones de la Ciudad</h1>
            <p className="text-sm text-muted-foreground">Descubre los mejores lugares con descuentos especiales</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 max-w-screen-xl mx-auto">
        <div className="space-y-4">
          {cityRecommendations.map((place) => (
            <Card key={place.id} className="overflow-hidden hover:shadow-lg transition-all">
              <div className="p-6 space-y-4">
                {/* Header with rating and discount */}
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-foreground truncate">{place.name}</h3>
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      <Badge variant="outline" className="text-xs shrink-0">
                        {place.category}
                      </Badge>
                      <span className="text-xs text-muted-foreground flex items-center gap-1 shrink-0">
                        <MapPin className="w-3 h-3" />
                        {place.distance}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <div className="flex items-center gap-1 text-amber-500">
                      <span className="text-lg font-bold">★</span>
                      <span className="text-sm font-semibold">{place.rating}</span>
                    </div>
                    {/* Discount as Badge */}
                    <Badge className="bg-green-500 hover:bg-green-600 text-white text-xs font-bold">
                      {place.discount}
                    </Badge>
                  </div>
                </div>
              </div>
              {/* Description */}
              <p className="text-sm text-muted-foreground">{place.description}</p>

                {/* Details */}
                <div className="bg-muted/50 rounded-lg p-3 space-y-2 text-xs">
                  <div className="flex items-start gap-2">
                    <span className="font-semibold text-foreground min-w-16">Dirección:</span>
                    <span className="text-muted-foreground">{place.address}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-semibold text-foreground min-w-16">Horario:</span>
                    <span className="text-muted-foreground">{place.hours}</span>
                  </div>
                </div>

                {/* Discount - Removed since it's now in header */}

                {/* Actions */}
                <div className="flex gap-3 pt-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 gap-2 bg-transparent"
                        onClick={() => setSelectedQR(place)}
                      >
                        <QrCode className="w-4 h-4" />
                        Generar QR
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Código QR - {selectedQR?.name}</DialogTitle>
                        <DialogDescription>
                          Escanea este código en el establecimiento para aplicar tu descuento
                        </DialogDescription>
                      </DialogHeader>
                      <div className="flex flex-col items-center gap-4 py-6">
                        <div className="bg-white p-4 rounded-lg border-2 border-foreground">
                          {/* Placeholder para QR - En producción usarías una librería como qrcode.react */}
                          <div className="w-48 h-48 bg-gradient-to-br from-primary to-primary/50 rounded flex items-center justify-center text-white text-center">
                            <div className="space-y-2">
                              <QrCode className="w-12 h-12 mx-auto" />
                              <p className="text-xs font-semibold">{selectedQR?.name}</p>
                              <p className="text-[10px] opacity-80">{selectedQR?.discount}</p>
                            </div>
                          </div>
                        </div>
                        <div className="text-center space-y-2">
                          <p className="text-sm font-semibold text-foreground">ID: QR-{selectedQR?.id}-{new Date().getTime()}</p>
                          <p className="text-xs text-muted-foreground">Válido por 24 horas</p>
                        </div>
                      </div>
                      <Button
                        onClick={() => selectedQR && downloadQR(selectedQR)}
                        className="w-full gap-2"
                      >
                        <Download className="w-4 h-4" />
                        Descargar QR
                      </Button>
                    </DialogContent>
                  </Dialog>

                  <Button 
                    variant="default" 
                    size="sm" 
                    className="flex-1 gap-2"
                    onClick={() => window.location.href = `tel:${place.phone}`}
                  >
                    <Phone className="w-4 h-4" />
                    Llamar
                  </Button>
                </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
