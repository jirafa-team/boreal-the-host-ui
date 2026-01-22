"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, AlertCircle, CheckCircle2, User, MapPin, Calendar } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function TicketsPage() {
  const [filter, setFilter] = useState<"all" | "pending" | "in-progress" | "resolved">("all")
  const [tickets, setTickets] = useState([
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
      assignedTo: null as string | null,
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
      assignedTo: "Juan López - Cocina",
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
      assignedTo: "María Rodríguez - Limpieza",
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
      assignedTo: "Carlos Sánchez - Seguridad",
    },
  ])

  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null)
  const [showAssignDialog, setShowAssignDialog] = useState(false)
  const [showCompleteDialog, setShowCompleteDialog] = useState(false)

  const staffMembers = [
    { id: "1", name: "Juan López", department: "Cocina" },
    { id: "2", name: "María Rodríguez", department: "Limpieza" },
    { id: "3", name: "Carlos Sánchez", department: "Seguridad" },
    { id: "4", name: "Ana García", department: "Recepción" },
    { id: "5", name: "Roberto Martínez", department: "Mantenimiento" },
    { id: "6", name: "Patricia López", department: "Servicio de Piso" },
    { id: "7", name: "Diego Fernández", department: "Mantenimiento" },
    { id: "8", name: "Laura González", department: "Limpieza" },
  ]

  const handleAssignTicket = (staffName: string, staffDepartment: string) => {
    if (!selectedTicketId) return

    setTickets((prevTickets) =>
      prevTickets.map((ticket) =>
        ticket.id === selectedTicketId
          ? {
              ...ticket,
              assignedTo: `${staffName} - ${staffDepartment}`,
              status: ticket.status === "pending" ? "in-progress" : ticket.status,
            }
          : ticket,
      ),
    )
    setShowAssignDialog(false)
    setSelectedTicketId(null)
  }

  const handleCompleteTicket = () => {
    if (!selectedTicketId) return

    setTickets((prevTickets) =>
      prevTickets.map((ticket) =>
        ticket.id === selectedTicketId ? { ...ticket, status: "resolved" } : ticket,
      ),
    )
    setShowCompleteDialog(false)
    setSelectedTicketId(null)
  }

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

      {/* Stats as Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card
          className={`p-4 cursor-pointer transition-all hover:shadow-md ${
            filter === "all" ? "ring-2 ring-primary" : ""
          }`}
          onClick={() => setFilter("all")}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <AlertCircle className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Todos</p>
              <p className="text-2xl font-bold">{tickets.length}</p>
            </div>
          </div>
        </Card>
        <Card
          className={`p-4 cursor-pointer transition-all hover:shadow-md ${
            filter === "pending" ? "ring-2 ring-primary" : ""
          }`}
          onClick={() => setFilter("pending")}
        >
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
        <Card
          className={`p-4 cursor-pointer transition-all hover:shadow-md ${
            filter === "in-progress" ? "ring-2 ring-primary" : ""
          }`}
          onClick={() => setFilter("in-progress")}
        >
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
        <Card
          className={`p-4 cursor-pointer transition-all hover:shadow-md ${
            filter === "resolved" ? "ring-2 ring-primary" : ""
          }`}
          onClick={() => setFilter("resolved")}
        >
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
      </div>

      {/* Tickets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredTickets.map((ticket) => {
          const statusBadge = getStatusBadge(ticket.status)
          const priorityBadge = getPriorityBadge(ticket.priority)

          return (
            <Card key={ticket.id} className="p-6 flex flex-col">
              <div className="mb-4">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-semibold flex-1">{ticket.title}</h3>
                  <Badge variant="outline" className={statusBadge.className}>
                    {statusBadge.label}
                  </Badge>
                </div>
                <div className="flex gap-2 mb-3">
                  <Badge variant="outline" className={priorityBadge.className}>
                    {priorityBadge.label}
                  </Badge>
                  <Badge variant="secondary">{ticket.category}</Badge>
                  <Badge variant="outline">{ticket.subcategory}</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-4">{ticket.description}</p>
              </div>

              <div className="space-y-2 text-sm mb-4 flex-1">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  <span className="text-muted-foreground">Huésped:</span>
                  <span className="font-medium">{ticket.guest}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  <span className="text-muted-foreground">Habitación:</span>
                  <span className="font-medium">{ticket.room}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  <span className="text-muted-foreground">Creado:</span>
                  <span className="font-medium">{ticket.createdAt}</span>
                </div>
                <div className="flex items-start gap-2 pt-2 border-t border-border">
                  <User className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="text-muted-foreground">Asignado a:</span>
                    {ticket.assignedTo ? (
                      <p className="font-semibold text-primary">{ticket.assignedTo}</p>
                    ) : (
                      <p className="font-semibold text-muted-foreground italic">Sin asignar</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                {ticket.status === "pending" && (
                  <Dialog open={showAssignDialog && selectedTicketId === ticket.id} onOpenChange={setShowAssignDialog}>
                    <DialogTrigger asChild>
                      <Button
                        size="sm"
                        variant="default"
                        className="flex-1"
                        onClick={() => setSelectedTicketId(ticket.id)}
                      >
                        Asignar
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>Asignar Ticket</DialogTitle>
                        <DialogDescription>
                          Selecciona el personal al que deseas asignar este ticket
                        </DialogDescription>
                      </DialogHeader>
                      <ScrollArea className="h-80 w-full rounded-md border p-4">
                        <div className="space-y-2">
                          {staffMembers.map((staff) => (
                            <Button
                              key={staff.id}
                              variant="outline"
                              className="w-full justify-start h-auto py-3 flex-col items-start bg-transparent"
                              onClick={() => handleAssignTicket(staff.name, staff.department)}
                            >
                              <span className="font-semibold">{staff.name}</span>
                              <span className="text-xs text-muted-foreground">{staff.department}</span>
                            </Button>
                          ))}
                        </div>
                      </ScrollArea>
                    </DialogContent>
                  </Dialog>
                )}
                {ticket.status === "in-progress" && (
                  <Dialog open={showCompleteDialog && selectedTicketId === ticket.id} onOpenChange={setShowCompleteDialog}>
                    <DialogTrigger asChild>
                      <Button
                        size="sm"
                        variant="default"
                        className="flex-1"
                        onClick={() => setSelectedTicketId(ticket.id)}
                      >
                        Completar
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-sm">
                      <DialogHeader>
                        <DialogTitle>Completar Ticket</DialogTitle>
                        <DialogDescription>
                          ¿Estás seguro de que deseas cerrar este ticket? Esta acción no se puede deshacer.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <Card className="p-4 bg-muted">
                          <p className="font-semibold text-sm">{ticket.title}</p>
                          <p className="text-xs text-muted-foreground mt-2">Habitación {ticket.room}</p>
                        </Card>
                        <div className="flex gap-3">
                          <Button
                            variant="outline"
                            className="flex-1 bg-transparent"
                            onClick={() => setShowCompleteDialog(false)}
                          >
                            Cancelar
                          </Button>
                          <Button
                            variant="default"
                            className="flex-1 bg-green-600 hover:bg-green-700"
                            onClick={handleCompleteTicket}
                          >
                            Confirmar
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
                {ticket.status === "resolved" && (
                  <Button size="sm" variant="outline" disabled className="flex-1 bg-transparent">
                    Completado
                  </Button>
                )}
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
