"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, AlertCircle, CheckCircle2, User, MapPin, Calendar, TicketPlus, CheckCircle } from "lucide-react"
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
    <div className="p-8">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-10 -mx-8 -mt-8 px-8 py-4 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Tickets de Soporte</h1>
            <p className="text-sm text-muted-foreground">Gestiona los reportes y solicitudes de los huéspedes</p>
          </div>
          <div className="flex gap-4 items-center ml-auto">
            <Dialog>
              <DialogTrigger asChild>
                <button 
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/80 text-white shadow-md hover:shadow-lg transition-all duration-300 hover:scale-110 group relative"
                  title="Nuevo ticket"
                >
                  <TicketPlus className="w-5 h-5" />
                  <span className="absolute top-full mt-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                    Nuevo Ticket
                  </span>
                </button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Crear Nuevo Ticket</DialogTitle>
                  <DialogDescription>Registra un nuevo ticket de soporte</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div>
                    <Label htmlFor="ticket-title">Título</Label>
                    <Input id="ticket-title" placeholder="Ej: Aire acondicionado no funciona" />
                  </div>
                  <div>
                    <Label htmlFor="ticket-description">Descripción</Label>
                    <Input id="ticket-description" placeholder="Describe el problema..." />
                  </div>
                  <div>
                    <Label htmlFor="ticket-category">Categoría</Label>
                    <Input id="ticket-category" placeholder="Ej: Mantenimiento" />
                  </div>
                </div>
                <Button className="w-full">Crear Ticket</Button>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      <div className="space-y-6">

      {/* Stats as Filters */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div 
          onClick={() => setFilter("all")}
          className={`p-4 relative rounded-3xl shadow-2xl text-center cursor-pointer transition-all overflow-hidden ${filter === "all" ? 'text-white' : 'bg-white/95 backdrop-blur-lg hover:shadow-lg'}`}
          style={filter === "all" ? { backgroundColor: "#1E40AF" } : {}}
        >
          {filter === "all" && (
            <div className="absolute -top-16 -right-16 w-28 h-28 rounded-full" style={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }} />
          )}
          <div className="relative z-10">
            <p className={`text-6xl font-bold mb-1 ${filter === "all" ? 'text-white' : 'text-blue-600'}`}>{tickets.length}</p>
            <p className={`text-xs font-medium ${filter === "all" ? 'text-blue-100' : 'text-muted-foreground'}`}>Todos</p>
          </div>
        </div>
        <div 
          onClick={() => setFilter("pending")}
          className={`p-4 relative rounded-3xl shadow-2xl text-center cursor-pointer transition-all overflow-hidden ${filter === "pending" ? 'text-white' : 'bg-white/95 backdrop-blur-lg hover:shadow-lg'}`}
          style={filter === "pending" ? { backgroundColor: "#CA8A04" } : {}}
        >
          {filter === "pending" && (
            <div className="absolute -top-16 -right-16 w-28 h-28 rounded-full" style={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }} />
          )}
          <div className="relative z-10">
            <p className={`text-6xl font-bold mb-1 ${filter === "pending" ? 'text-white' : 'text-yellow-600'}`}>{tickets.filter((t) => t.status === "pending").length}</p>
            <p className={`text-xs font-medium ${filter === "pending" ? 'text-yellow-100' : 'text-muted-foreground'}`}>Pendientes</p>
          </div>
        </div>
        <div 
          onClick={() => setFilter("in-progress")}
          className={`p-4 relative rounded-3xl shadow-2xl text-center cursor-pointer transition-all overflow-hidden ${filter === "in-progress" ? 'text-white' : 'bg-white/95 backdrop-blur-lg hover:shadow-lg'}`}
          style={filter === "in-progress" ? { backgroundColor: "#1E3A8A" } : {}}
        >
          {filter === "in-progress" && (
            <div className="absolute -top-16 -right-16 w-28 h-28 rounded-full" style={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }} />
          )}
          <div className="relative z-10">
            <p className={`text-6xl font-bold mb-1 ${filter === "in-progress" ? 'text-white' : 'text-blue-700'}`}>{tickets.filter((t) => t.status === "in-progress").length}</p>
            <p className={`text-xs font-medium ${filter === "in-progress" ? 'text-blue-100' : 'text-muted-foreground'}`}>En Proceso</p>
          </div>
        </div>
        <div 
          onClick={() => setFilter("resolved")}
          className={`p-4 relative rounded-3xl shadow-2xl text-center cursor-pointer transition-all overflow-hidden ${filter === "resolved" ? 'text-white' : 'bg-white/95 backdrop-blur-lg hover:shadow-lg'}`}
          style={filter === "resolved" ? { backgroundColor: "#235E20" } : {}}
        >
          {filter === "resolved" && (
            <div className="absolute -top-16 -right-16 w-28 h-28 rounded-full" style={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }} />
          )}
          <div className="relative z-10">
            <p className={`text-6xl font-bold mb-1 ${filter === "resolved" ? 'text-white' : ''}`} style={filter !== "resolved" ? { color: "#235E20" } : {}}>{tickets.filter((t) => t.status === "resolved").length}</p>
            <p className={`text-xs font-medium ${filter === "resolved" ? 'text-green-100' : 'text-muted-foreground'}`}>Resueltos</p>
          </div>
        </div>
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
                          {!selectedTime ? "Selecciona el horario para la tarea" : `Selecciona el empleado para las ${selectedTime}`}
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
                {ticket.status === "pending" && (
                  <Dialog open={showAssignDialog && selectedTicketId === ticket.id} onOpenChange={setShowAssignDialog}>
                    <DialogTrigger asChild>
                      <Button
                        size="sm"
                        className="flex-1 bg-primary hover:bg-primary/90 text-white"
                        onClick={() => setSelectedTicketId(ticket.id)}
                      >
                        Asignar
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Asignar Ticket</DialogTitle>
                        <DialogDescription>
                          {!selectedTime ? "Selecciona el horario para la tarea" : `Selecciona el empleado para las ${selectedTime}`}
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
                  <Button
                    size="sm"
                    className="flex-1 text-white hover:opacity-90 border-0"
                    style={{ backgroundColor: "#235E20" }}
                    onClick={() => {
                      setSelectedTicketId(ticket.id)
                      setShowCompleteDialog(true)
                    }}
                  >
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Completar
                  </Button>
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
    </div>
  )
}
