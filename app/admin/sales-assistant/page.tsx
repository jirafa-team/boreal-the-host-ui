"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  TrendingUp,
  Sparkles,
  Utensils,
  Dumbbell,
  Droplets,
  Car,
  Wine,
  Zap,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react"
import { useState } from "react"
import { useLanguage } from "@/lib/i18n-context"

type OfferStatus = "pending" | "accepted" | "rejected"

interface Offer {
  id: string
  service: string
  icon: any
  price: number
  color: string
  bgColor: string
  clientName: string
  room: string
  probability: number
  reason: string
  status: OfferStatus
  responseDate?: string
}

export default function SalesAssistantPage() {
  const [activeTab, setActiveTab] = useState<"pending" | "history">("pending")
  const { t, language } = useLanguage()

  const [offers, setOffers] = useState<Offer[]>([
    {
      id: "1",
      service: "Paquete SPA Premium",
      icon: Sparkles,
      price: 350,
      color: "text-pink-500",
      bgColor: "bg-pink-500/10",
      clientName: "Martín Rodríguez",
      room: "501",
      probability: 95,
      reason: "",
      status: "pending",
    },
    {
      id: "2",
      service: "Servicio de Chofer Privado",
      icon: Car,
      price: 800,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      clientName: "Isabella Von Habsburg",
      room: "Penthouse",
      probability: 92,
      reason: "",
      status: "pending",
    },
    {
      id: "3",
      service: "Paquete SPA Premium",
      icon: Sparkles,
      price: 350,
      color: "text-pink-500",
      bgColor: "bg-pink-500/10",
      clientName: "Isabella Von Habsburg",
      room: "Penthouse",
      probability: 90,
      reason: "",
      status: "pending",
    },
    {
      id: "4",
      service: "Cabana Premium en Piscina",
      icon: Droplets,
      price: 120,
      color: "text-cyan-500",
      bgColor: "bg-cyan-500/10",
      clientName: "Isabella Von Habsburg",
      room: "Penthouse",
      probability: 88,
      reason: "",
      status: "pending",
    },
    {
      id: "5",
      service: "Plan de Entrenamiento Mensual",
      icon: Dumbbell,
      price: 280,
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
      clientName: "Martín Rodríguez",
      room: "501",
      probability: 85,
      reason: "",
      status: "pending",
    },
    {
      id: "6",
      service: "Cabana Premium en Piscina",
      icon: Droplets,
      price: 120,
      color: "text-cyan-500",
      bgColor: "bg-cyan-500/10",
      clientName: "Carlos Méndez",
      room: "204",
      probability: 82,
      reason: "",
      status: "pending",
    },
    {
      id: "7",
      service: "Cata de Vinos Premium",
      icon: Wine,
      price: 320,
      color: "text-red-500",
      bgColor: "bg-red-500/10",
      clientName: "Isabella Von Habsburg",
      room: "Penthouse",
      probability: 78,
      reason: "",
      status: "pending",
    },
    {
      id: "8",
      service: "Experiencia Gastronómica Exclusiva",
      icon: Utensils,
      price: 450,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
      clientName: "Martín Rodríguez",
      room: "501",
      probability: 72,
      reason: "",
      status: "pending",
    },
    {
      id: "9",
      service: "Plan de Desayunos Semanales",
      icon: Utensils,
      price: 180,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
      clientName: "Carlos Méndez",
      room: "204",
      probability: 68,
      reason: "",
      status: "pending",
    },
    {
      id: "10",
      service: "Membresía VIP Plus",
      icon: Zap,
      price: 1200,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
      clientName: "Martín Rodríguez",
      room: "501",
      probability: 65,
      reason: "",
      status: "pending",
    },
  ])

  const handleAccept = (offerId: string) => {
    setOffers((prev) =>
      prev.map((offer) =>
        offer.id === offerId
          ? { ...offer, status: "accepted", responseDate: new Date().toLocaleDateString(language === "es" ? "es-ES" : language === "pt" ? "pt-BR" : language === "en" ? "en-GB" : "fr-FR") }
          : offer,
      ),
    )
  }

  const handleReject = (offerId: string) => {
    setOffers((prev) =>
      prev.map((offer) =>
        offer.id === offerId
          ? { ...offer, status: "rejected", responseDate: new Date().toLocaleDateString("es-AR") }
          : offer,
      ),
    )
  }

  const getProbabilityColor = (probability: number) => {
    if (probability >= 80) return "text-[#D946A6] bg-[#D946A6]/10 border-[#D946A6]/20"
    if (probability >= 60) return "text-[#D946A6] bg-[#D946A6]/10 border-[#D946A6]/20"
    return "text-[#D946A6] bg-[#D946A6]/10 border-[#D946A6]/20"
  }

  const pendingOffers = offers.filter((o) => o.status === "pending").sort((a, b) => b.probability - a.probability)
  const historyOffers = offers.filter((o) => o.status !== "pending").sort((a, b) => b.probability - a.probability)

  const pendingValue = pendingOffers.reduce((sum, offer) => sum + offer.price, 0)
  const acceptedValue = offers.filter((o) => o.status === "accepted").reduce((sum, offer) => sum + offer.price, 0)

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{t("admin.salesAssistantTitle")}</h1>
        <p className="text-gray-600 mt-1">{t("admin.offersPersonalized")}</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">{t("admin.pendingOffers")}</p>
                <p className="text-3xl font-bold text-foreground">{pendingOffers.length}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                <Clock className="w-6 h-6 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">{t("admin.pendingValue")}</p>
                <p className="text-3xl font-bold text-foreground">${pendingValue.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">{t("admin.accepted")}</p>
                <p className="text-3xl font-bold text-green-600">
                  {offers.filter((o) => o.status === "accepted").length}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">{t("admin.acceptedValue")}</p>
                <p className="text-3xl font-bold text-green-600">${acceptedValue.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-2 border-b">
        <button
          onClick={() => setActiveTab("pending")}
          className={`px-4 py-2 font-semibold transition-colors ${
            activeTab === "pending" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-600 hover:text-gray-900"
          }`}
        >
          {t("admin.activeOffers")} ({pendingOffers.length})
        </button>
        <button
          onClick={() => setActiveTab("history")}
          className={`px-4 py-2 font-semibold transition-colors ${
            activeTab === "history" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-600 hover:text-gray-900"
          }`}
        >
          {t("admin.history")} ({historyOffers.length})
        </button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{activeTab === "pending" ? t("admin.activeOffers") : t("admin.history")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {(activeTab === "pending" ? pendingOffers : historyOffers).map((offer) => {
              const Icon = offer.icon

              return (
                <div key={offer.id} className="flex items-center gap-4 p-4 border rounded-lg hover:bg-muted/50">
                  <div className={`w-12 h-12 rounded-lg ${offer.bgColor} flex items-center justify-center shrink-0`}>
                    <Icon className={`w-6 h-6 ${offer.color}`} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground">{offer.service}</h3>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <p className="text-sm text-muted-foreground">
                        {offer.clientName} • {t("admin.roomLabel")} {offer.room}
                      </p>
                      <Badge className={getProbabilityColor(offer.probability)} variant="outline">
                        {offer.probability}{t("admin.probability")}
                      </Badge>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <p className="text-lg font-bold text-foreground">${offer.price}</p>
                  </div>

                  {offer.status === "pending" ? (
                    <div className="flex gap-2 shrink-0">
                      <Button
                        size="sm"
                        className="text-white hover:opacity-90 border-0"
                        style={{ backgroundColor: "#235E20" }}
                        onClick={() => handleAccept(offer.id)}
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        {t("admin.acceptButton")}
                      </Button>
                      <Button
                        size="sm"
                        className="text-white hover:opacity-90 border-0"
                        style={{ backgroundColor: "#AA2C2C" }}
                        onClick={() => handleReject(offer.id)}
                      >
                        <XCircle className="w-4 h-4 mr-1" />
                        {t("admin.rejectButton")}
                      </Button>
                    </div>
                  ) : (
                    <div className="shrink-0">
                      {offer.status === "accepted" ? (
                        <Badge className="text-white border-0" style={{ backgroundColor: "#235E20" }}>
                          <CheckCircle className="w-3 h-3 mr-1" />
                          {t("admin.acceptedLabel")}
                        </Badge>
                      ) : (
                        <Badge className="text-white border-0" style={{ backgroundColor: "#AA2C2C" }}>
                          <XCircle className="w-3 h-3 mr-1" />
                          {t("admin.rejectedLabel")}
                        </Badge>
                      )}
                      {offer.responseDate && <p className="text-xs text-muted-foreground mt-1">{offer.responseDate}</p>}
                    </div>
                  )}
                </div>
              )
            })}

            {(activeTab === "pending" ? pendingOffers : historyOffers).length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <p>
                  {activeTab === "pending" ? t("admin.noPendingOffers") : t("admin.noHistoryOffers")}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
