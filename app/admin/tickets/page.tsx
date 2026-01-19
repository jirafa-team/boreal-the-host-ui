"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, AlertCircle, CheckCircle2, User, MapPin, Calendar } from "lucide-react"

export default function TicketsPage() {
  const [filter, setFilter] = useState<"all" | "pending" | "in-progress" | "resolved">("all")

  const tickets = [
    {
      id: "T-001",
      title: "Aire acondicionado no funciona",
      category: "Mantenimiento",
      subcategory: "Clima",
      room: "204",
      guest: "Carlos García",
      priority: "high",
      status: "pending",
      createdAt: "2024-01-13 14:30",
      description: "El aire acondicionado de la habitación no enciende",
    },
    {
      id: "T-002",
      title: "Pedido incorrecto",
      category: "Problema con Orden",
      subcategory: "Pedido incorrecto",
      room: "305",
      guest: "Ana Martínez",
      priority: "medium",
      status: "in-progress",
      createdAt: "2024-01-13 12:15",
      description: "Solicité ensalada César pero recibí una ensalada mixta",
    },
    {
      id: "T-003",
      title: "Toallas faltantes",
      category: "Servicio",
      subcategory: "Limpieza incompleta",
      room: "108",
      guest: "Roberto Fernández",
      priority: "low",
      status: "resolved",
      createdAt: "2024-01-13 10:00",
      description: "Faltan toallas en el baño después de la limpieza",
    },
    {
      id: "T-004",
      title: "Ruido excesivo",
      category: "Habitación",
      subcategory: "Ruido",
      room: "412",
      guest: "Isabella Von Habsburg",
      priority: "high",
      status: "in-progress",
      createdAt: "2024-01-13 22:45",
      description: "Ruido proveniente de la habitación contigua",
    },
  ]

  const filteredTickets = filter === "all" ? tickets : tickets.filter((t) => t.status === filter)

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: "Pendiente", className: "bg-yellow-500/10 text-yellow-700 border-yellow-500/20" },
      "in-progress": { label: "En Proceso", className: "bg-blue-500/10 text-blue-700 border-blue-500/20" },
      resolved: { label: "Resuelto", className: "bg-green-500/10 text-green-700 border-green-500/20" },
    }
    return statusConfig[status as keyof typeof statusConfig] || statusConfig.pending
  }

  const getPriorityBadge = (priority: string) => {
    const priorityConfig = {
      high: { label: "Alta", className: "bg-red-500/10 text-red-700 border-red-500/20" },
      medium: { label: "Media", className: "bg-orange-500/10 text-orange-700 border-orange-500/20" },
      low: { label: "Baja", className: "bg-gray-500/10 text-gray-700 border-gray-500/20" },
    }
    return priorityConfig[priority as keyof typeof priorityConfig] || priorityConfig.medium
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Tickets de Soporte</h1>
          <p className="text-muted-foreground">Gestiona los reportes y solicitudes de los huéspedes</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-500/10 rounded-lg">
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Pendientes</p>
              <p className="text-2xl font-bold">{tickets.filter((t) => t.status === "pending").length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <AlertCircle className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">En Proceso</p>
              <p className="text-2xl font-bold">{tickets.filter((t) => t.status === "in-progress").length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-500/10 rounded-lg">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Resueltos</p>
              <p className="text-2xl font-bold">{tickets.filter((t) => t.status === "resolved").length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-500/10 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Prioridad Alta</p>
              <p className="text-2xl font-bold">{tickets.filter((t) => t.priority === "high").length}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        <Button variant={filter === "all" ? "default" : "outline"} onClick={() => setFilter("all")}>
          Todos
        </Button>
        <Button variant={filter === "pending" ? "default" : "outline"} onClick={() => setFilter("pending")}>
          Pendientes
        </Button>
        <Button variant={filter === "in-progress" ? "default" : "outline"} onClick={() => setFilter("in-progress")}>
          En Proceso
        </Button>
        <Button variant={filter === "resolved" ? "default" : "outline"} onClick={() => setFilter("resolved")}>
          Resueltos
        </Button>
      </div>

      {/* Tickets List */}
      <div className="space-y-4">
        {filteredTickets.map((ticket) => {
          const statusBadge = getStatusBadge(ticket.status)
          const priorityBadge = getPriorityBadge(ticket.priority)

          return (
            <Card key={ticket.id} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold">{ticket.title}</h3>
                    <Badge variant="outline" className={statusBadge.className}>
                      {statusBadge.label}
                    </Badge>
                    <Badge variant="outline" className={priorityBadge.className}>
                      {priorityBadge.label}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">{ticket.description}</p>
                  <div className="flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <span>{ticket.guest}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span>Habitación {ticket.room}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span>{ticket.createdAt}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <Badge variant="secondary">{ticket.category}</Badge>
                    <Badge variant="outline">{ticket.subcategory}</Badge>
                  </div>
                </div>
                <div className="flex gap-2">
                  {ticket.status === "pending" && (
                    <Button size="sm" variant="default">
                      Tomar Ticket
                    </Button>
                  )}
                  {ticket.status === "in-progress" && (
                    <Button size="sm" variant="default">
                      Marcar Resuelto
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
