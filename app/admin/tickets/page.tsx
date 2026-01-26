"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, AlertCircle, CheckCircle2, User, MapPin, Calendar, TicketPlus } from "lucide-react"
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
      scheduledTime: null as string | null,
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
      scheduledTime: null as string | null,
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
      scheduledTime: null as string | null,
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
  const [scheduledTime, setScheduledTime] = useState<string | null>(null)
  const [selectedStaffForSchedule, setSelectedStaffForSchedule] = useState<{ name: string; department: string } | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)

  const availableHours = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00"]

  const staffMembers = [
    { id: "1", name: "Juan López", department: "Cocina", availableHours: ["08:00", "09:00", "10:00", "11:00", "12:00", "18:00", "19:00", "20:00"] },
    { id: "2", name: "María Rodríguez", department: "Limpieza", availableHours: ["08:00", "09:00", "10:00", "13:00", "14:00", "15:00", "16:00"] },
    { id: "3", name: "Carlos Sánchez", department: "Seguridad", availableHours: ["08:00", "11:00", "12:00", "13:00", "16:00", "17:00", "18:00", "19:00", "20:00"] },
    { id: "4", name: "Ana García", department: "Recepción", availableHours: ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"] },
    { id: "5", name: "Roberto Martínez", department: "Mantenimiento", availableHours: ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00", "18:00"] },
    { id: "6", name: "Patricia López", department: "Servicio de Piso", availableHours: ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00"] },
    { id: "7", name: "Diego Fernández", department: "Mantenimiento", availableHours: ["13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00"] },
    { id: "8", name: "Laura González", department: "Limpieza", availableHours: ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"] },
  ]

  const getAvailableStaffForTime = (time: string | null) => {
    if (!time) return []
    return staffMembers.filter((staff) => staff.availableHours.includes(time))
  }

  const handleAssignTicket = (staffName: string, staffDepartment: string) => {
    if (!selectedTicketId || !selectedTime) return

    setTickets((prevTickets) =>
      prevTickets.map((ticket) =>
        ticket.id === selectedTicketId
          ? {
              ...ticket,
              assignedTo: `${staffName} - ${staffDepartment}`,
              scheduledTime: selectedTime,
              status: ticket.status === "pending" ? "in-progress" : ticket.status,
            }
          : ticket,
      ),
    )
    setShowAssignDialog(false)
    setSelectedTicketId(null)
    setSelectedTime(null)
    setSelectedStaffForSchedule(null)
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
        <button 
          className="relative group w-10 h-10 rounded-full bg-primary hover:bg-primary/90 text-white flex items-center justify-center transition-all shadow-md hover:shadow-lg"
          title="Nuevo ticket"
        >
          <TicketPlus className="w-5 h-5" />
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-gray-900 text-white text-xs rounded pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            Nuevo Ticket
          </div>
        </button>
      </div>

      {/* Stats as Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card
          className={`p-4 bg-gradient-to-br from-blue-50 to-white text-center cursor-pointer transition-all ${
            filter === "all" ? "ring-2 ring-primary" : ""
          }`}
          onClick={() => setFilter("all")}
        >
          <p className="text-4xl font-bold text-blue-600 mb-1">{tickets.length}</p>
          <p className="text-xs text-muted-foreground font-medium">Todos</p>
        </Card>
        <Card
          className={`p-4 bg-gradient-to-br from-yellow-50 to-white text-center cursor-pointer transition-all ${
            filter === "pending" ? "ring-2 ring-primary" : ""
          }`}
          onClick={() => setFilter("pending")}
        >
          <p className="text-4xl font-bold text-yellow-600 mb-1">{tickets.filter((t) => t.status === "pending").length}</p>
          <p className="text-xs text-muted-foreground font-medium">Pendientes</p>
        </Card>
        <Card
          className={`p-4 bg-gradient-to-br from-blue-100 to-white text-center cursor-pointer transition-all ${
            filter === "in-progress" ? "ring-2 ring-primary" : ""
          }`}
          onClick={() => setFilter("in-progress")}
        >
          <p className="text-4xl font-bold text-blue-700 mb-1">{tickets.filter((t) => t.status === "in-progress").length}</p>
          <p className="text-xs text-muted-foreground font-medium">En Proceso</p>
        </Card>
        <Card
          className={`p-4 bg-gradient-to-br from-green-50 to-white text-center cursor-pointer transition-all ${
            filter === "resolved" ? "ring-2 ring-primary" : ""
          }`}
          onClick={() => setFilter("resolved")}
        >
          <p className="text-4xl font-bold text-green-600 mb-1">{tickets.filter((t) => t.status === "resolved").length}</p>
          <p className="text-xs text-muted-foreground font-medium">Resueltos</p>
        </Card>
      </div>

      {/* Tickets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                  <div className="flex-1">
                    <span className="text-muted-foreground">Asignado a:</span>
                    {ticket.assignedTo ? (
                      <div>
                        <p className="font-semibold text-primary">{ticket.assignedTo}</p>
                        {ticket.scheduledTime && (
                          <p className="text-xs text-muted-foreground mt-1">Programado: {ticket.scheduledTime}</p>
                        )}
                      </div>
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
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                        onClick={() => setSelectedTicketId(ticket.id)}
                      >
                        Asignar
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Asignar Ticket</DialogTitle>
                        <DialogDescription>
                          {!selectedTime 
                            ? "Selecciona el horario para la tarea" 
                            : `Selecciona el empleado para las ${selectedTime}`}
                        </DialogDescription>
                      </DialogHeader>
                      
                      {!selectedTime ? (
                        // Step 1: Select Time - Grid of hours
                        <div className="grid grid-cols-4 gap-2">
                          {availableHours.map((hour) => (
                            <Button
                              key={hour}
                              variant={selectedTime === hour ? "default" : "outline"}
                              className="h-12 text-sm"
                              onClick={() => setSelectedTime(hour)}
                            >
                              {hour}
                            </Button>
                          ))}
                        </div>
                      ) : (
                        // Step 2: Select Staff - Show only available for selected time
                        <div className="space-y-3">
                          {getAvailableStaffForTime(selectedTime).length > 0 ? (
                            <>
                              <div className="space-y-2">
                                {getAvailableStaffForTime(selectedTime).map((staff) => (
                                  <Button
                                    key={staff.id}
                                    variant="outline"
                                    className="w-full justify-start h-auto py-3 flex-col items-start bg-transparent hover:bg-muted"
                                    onClick={() => handleAssignTicket(staff.name, staff.department)}
                                  >
                                    <span className="font-semibold">{staff.name}</span>
                                    <span className="text-xs text-muted-foreground">{staff.department}</span>
                                  </Button>
                                ))}
                              </div>
                              <Button
                                variant="outline"
                                className="w-full bg-transparent"
                                onClick={() => setSelectedTime(null)}
                              >
                                Cambiar Horario
                              </Button>
                            </>
                          ) : (
                            <div className="text-center py-8">
                              <p className="text-muted-foreground mb-4">No hay empleados disponibles para las {selectedTime}</p>
                              <Button
                                variant="outline"
                                onClick={() => setSelectedTime(null)}
                              >
                                Seleccionar otro horario
                              </Button>
                            </div>
                          )}
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                )}
                {ticket.status !== "pending" && ticket.status !== "resolved" && (
                  <>
                    {ticket.assignedTo && (
                      <Dialog open={showAssignDialog && selectedTicketId === ticket.id} onOpenChange={setShowAssignDialog}>
                        <DialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="outline"
                            className="bg-amber-50 text-amber-700 hover:bg-amber-100 border-amber-200"
                            onClick={() => setSelectedTicketId(ticket.id)}
                          >
                            Reasignar
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Reasignar Ticket</DialogTitle>
                            <DialogDescription>
                              {!selectedTime 
                                ? "Selecciona el horario para la tarea" 
                                : `Selecciona el empleado para las ${selectedTime}`}
                            </DialogDescription>
                          </DialogHeader>
                          
                          {!selectedTime ? (
                            // Step 1: Select Time - Grid of hours
                            <div className="grid grid-cols-4 gap-2">
                              {availableHours.map((hour) => (
                                <Button
                                  key={hour}
                                  variant={selectedTime === hour ? "default" : "outline"}
                                  className="h-12 text-sm"
                                  onClick={() => setSelectedTime(hour)}
                                >
                                  {hour}
                                </Button>
                              ))}
                            </div>
                          ) : (
                            // Step 2: Select Staff - Show only available for selected time
                            <div className="space-y-3">
                              {getAvailableStaffForTime(selectedTime).length > 0 ? (
                                <>
                                  <div className="space-y-2">
                                    {getAvailableStaffForTime(selectedTime).map((staff) => (
                                      <Button
                                        key={staff.id}
                                        variant="outline"
                                        className="w-full justify-start h-auto py-3 flex-col items-start bg-transparent hover:bg-muted"
                                        onClick={() => handleAssignTicket(staff.name, staff.department)}
                                      >
                                        <span className="font-semibold">{staff.name}</span>
                                        <span className="text-xs text-muted-foreground">{staff.department}</span>
                                      </Button>
                                    ))}
                                  </div>
                                  <Button
                                    variant="outline"
                                    className="w-full bg-transparent"
                                    onClick={() => setSelectedTime(null)}
                                  >
                                    Cambiar Horario
                                  </Button>
                                </>
                              ) : (
                                <div className="text-center py-8">
                                  <p className="text-muted-foreground mb-4">No hay empleados disponibles para las {selectedTime}</p>
                                  <Button
                                    variant="outline"
                                    onClick={() => setSelectedTime(null)}
                                  >
                                    Seleccionar otro horario
                                  </Button>
                                </div>
                              )}
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                    )}
                    <Dialog open={showCompleteDialog && selectedTicketId === ticket.id} onOpenChange={setShowCompleteDialog}>
                      <DialogTrigger asChild>
                        <Button
                          size="sm"
                          className="flex-1 bg-green-600 hover:bg-green-700 text-white"
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
                              className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                              onClick={handleCompleteTicket}
                            >
                              Confirmar
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </>
                )}
                {ticket.assignedTo && ticket.status !== "resolved" && (
                  <Dialog open={showAssignDialog && selectedTicketId === ticket.id} onOpenChange={setShowAssignDialog}>
                    <DialogTrigger asChild>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 bg-transparent"
                        onClick={() => setSelectedTicketId(ticket.id)}
                      >
                        Reasignar
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Reasignar Ticket</DialogTitle>
                        <DialogDescription>
                          {!selectedTime 
                            ? "Selecciona el horario para la tarea" 
                            : `Selecciona el empleado para las ${selectedTime}`}
                        </DialogDescription>
                      </DialogHeader>
                      
                      {!selectedTime ? (
                        // Step 1: Select Time - Grid of hours
                        <div className="grid grid-cols-4 gap-2">
                          {availableHours.map((hour) => (
                            <Button
                              key={hour}
                              variant={selectedTime === hour ? "default" : "outline"}
                              className="h-12 text-sm"
                              onClick={() => setSelectedTime(hour)}
                            >
                              {hour}
                            </Button>
                          ))}
                        </div>
                      ) : (
                        // Step 2: Select Staff - Show only available for selected time
                        <div className="space-y-3">
                          {getAvailableStaffForTime(selectedTime).length > 0 ? (
                            <>
                              <div className="space-y-2">
                                {getAvailableStaffForTime(selectedTime).map((staff) => (
                                  <Button
                                    key={staff.id}
                                    variant="outline"
                                    className="w-full justify-start h-auto py-3 flex-col items-start bg-transparent hover:bg-muted"
                                    onClick={() => handleAssignTicket(staff.name, staff.department)}
                                  >
                                    <span className="font-semibold">{staff.name}</span>
                                    <span className="text-xs text-muted-foreground">{staff.department}</span>
                                  </Button>
                                ))}
                              </div>
                              <Button
                                variant="outline"
                                className="w-full bg-transparent"
                                onClick={() => setSelectedTime(null)}
                              >
                                Cambiar Horario
                              </Button>
                            </>
                          ) : (
                            <div className="text-center py-8">
                              <p className="text-muted-foreground mb-4">No hay empleados disponibles para las {selectedTime}</p>
                              <Button
                                variant="outline"
                                onClick={() => setSelectedTime(null)}
                              >
                                Seleccionar otro horario
                              </Button>
                            </div>
                          )}
                        </div>
                      )}
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
