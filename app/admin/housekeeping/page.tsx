"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Users, Clock, CheckCircle2, AlertCircle, User, Plus, Calendar, LayoutGrid } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type StaffMember = {
  id: number
  name: string
  status: "available" | "busy" | "off"
  currentRoom?: number
  tasksToday: number
  maxCapacity: number
  shift: string
  avatar: string
}

type CleaningRequest = {
  id: number
  roomNumber: number
  guestName: string
  requestedTime: string
  status: "pending" | "assigned" | "in-progress" | "completed"
  assignedTo?: string
  priority: "normal" | "urgent"
}

export default function HousekeepingManagement() {
  const [staff, setStaff] = useState<StaffMember[]>([
    {
      id: 1,
      name: "María González",
      status: "busy",
      currentRoom: 204,
      tasksToday: 5,
      maxCapacity: 8,
      shift: "7:00 AM - 3:00 PM",
      avatar: "MG",
    },
    {
      id: 2,
      name: "Roberto Fernández",
      status: "available",
      tasksToday: 3,
      maxCapacity: 8,
      shift: "7:00 AM - 3:00 PM",
      avatar: "RF",
    },
    {
      id: 3,
      name: "Carmen Silva",
      status: "busy",
      currentRoom: 312,
      tasksToday: 6,
      maxCapacity: 8,
      shift: "11:00 AM - 7:00 PM",
      avatar: "CS",
    },
    {
      id: 4,
      name: "Diego Ramírez",
      status: "available",
      tasksToday: 2,
      maxCapacity: 8,
      shift: "11:00 AM - 7:00 PM",
      avatar: "DR",
    },
    {
      id: 5,
      name: "Laura Pérez",
      status: "off",
      tasksToday: 0,
      maxCapacity: 8,
      shift: "Día libre",
      avatar: "LP",
    },
    {
      id: 6,
      name: "Ana Rodríguez",
      status: "available",
      tasksToday: 4,
      maxCapacity: 8,
      shift: "7:00 AM - 3:00 PM",
      avatar: "AR",
    },
    {
      id: 7,
      name: "Carlos Méndez",
      status: "busy",
      currentRoom: 108,
      tasksToday: 5,
      maxCapacity: 8,
      shift: "11:00 AM - 7:00 PM",
      avatar: "CM",
    },
  ])

  const [requests, setRequests] = useState<CleaningRequest[]>([
    {
      id: 1,
      roomNumber: 204,
      guestName: "Carlos Martínez",
      requestedTime: "7:30 AM",
      status: "completed",
      assignedTo: "María González",
      priority: "normal",
    },
    {
      id: 2,
      roomNumber: 315,
      guestName: "Laura García",
      requestedTime: "8:30 AM",
      status: "completed",
      assignedTo: "María González",
      priority: "normal",
    },
    {
      id: 3,
      roomNumber: 401,
      guestName: "Pedro Sánchez",
      requestedTime: "9:30 AM",
      status: "completed",
      assignedTo: "María González",
      priority: "normal",
    },
    {
      id: 4,
      roomNumber: 218,
      guestName: "Isabel Moreno",
      requestedTime: "11:00 AM",
      status: "in-progress",
      assignedTo: "María González",
      priority: "normal",
    },
    {
      id: 5,
      roomNumber: 325,
      guestName: "Jorge Ruiz",
      requestedTime: "12:30 PM",
      status: "assigned",
      assignedTo: "María González",
      priority: "normal",
    },
    {
      id: 6,
      roomNumber: 208,
      guestName: "Ana López",
      requestedTime: "7:00 AM",
      status: "completed",
      assignedTo: "Roberto Fernández",
      priority: "normal",
    },
    {
      id: 7,
      roomNumber: 112,
      guestName: "Ricardo Santos",
      requestedTime: "8:00 AM",
      status: "completed",
      assignedTo: "Roberto Fernández",
      priority: "urgent",
    },
    {
      id: 8,
      roomNumber: 405,
      guestName: "Beatriz Castro",
      requestedTime: "9:00 AM",
      status: "completed",
      assignedTo: "Roberto Fernández",
      priority: "normal",
    },
    {
      id: 9,
      roomNumber: 320,
      guestName: "Manuel Ortiz",
      requestedTime: "10:30 AM",
      status: "in-progress",
      assignedTo: "Roberto Fernández",
      priority: "normal",
    },
    {
      id: 10,
      roomNumber: 215,
      guestName: "Claudia Vega",
      requestedTime: "12:00 PM",
      status: "assigned",
      assignedTo: "Roberto Fernández",
      priority: "normal",
    },
    {
      id: 11,
      roomNumber: 418,
      guestName: "Fernando Díaz",
      requestedTime: "1:30 PM",
      status: "assigned",
      assignedTo: "Roberto Fernández",
      priority: "normal",
    },
    {
      id: 12,
      roomNumber: 105,
      guestName: "Patricia Reyes",
      requestedTime: "7:30 AM",
      status: "completed",
      assignedTo: "Ana Rodríguez",
      priority: "normal",
    },
    {
      id: 13,
      roomNumber: 220,
      guestName: "Andrés Flores",
      requestedTime: "8:30 AM",
      status: "completed",
      assignedTo: "Ana Rodríguez",
      priority: "normal",
    },
    {
      id: 14,
      roomNumber: 308,
      guestName: "Valeria Jiménez",
      requestedTime: "10:00 AM",
      status: "completed",
      assignedTo: "Ana Rodríguez",
      priority: "urgent",
    },
    {
      id: 15,
      roomNumber: 412,
      guestName: "Sebastián Herrera",
      requestedTime: "11:30 AM",
      status: "in-progress",
      assignedTo: "Ana Rodríguez",
      priority: "normal",
    },
    {
      id: 16,
      roomNumber: 225,
      guestName: "Mónica Ríos",
      requestedTime: "1:00 PM",
      status: "assigned",
      assignedTo: "Ana Rodríguez",
      priority: "normal",
    },
    {
      id: 17,
      roomNumber: 318,
      guestName: "Daniel Rojas",
      requestedTime: "2:00 PM",
      status: "assigned",
      assignedTo: "Ana Rodríguez",
      priority: "normal",
    },
    {
      id: 18,
      roomNumber: 312,
      guestName: "Miguel Torres",
      requestedTime: "11:30 AM",
      status: "completed",
      assignedTo: "Carmen Silva",
      priority: "normal",
    },
    {
      id: 19,
      roomNumber: 420,
      guestName: "Gabriela Mendoza",
      requestedTime: "12:30 PM",
      status: "completed",
      assignedTo: "Carmen Silva",
      priority: "normal",
    },
    {
      id: 20,
      roomNumber: 210,
      guestName: "Javier Núñez",
      requestedTime: "1:30 PM",
      status: "in-progress",
      assignedTo: "Carmen Silva",
      priority: "urgent",
    },
    {
      id: 21,
      roomNumber: 328,
      guestName: "Lucía Paredes",
      requestedTime: "3:00 PM",
      status: "assigned",
      assignedTo: "Carmen Silva",
      priority: "normal",
    },
    {
      id: 22,
      roomNumber: 415,
      guestName: "Rodrigo Silva",
      requestedTime: "4:30 PM",
      status: "assigned",
      assignedTo: "Carmen Silva",
      priority: "normal",
    },
    {
      id: 23,
      roomNumber: 118,
      guestName: "Elena Vargas",
      requestedTime: "5:30 PM",
      status: "assigned",
      assignedTo: "Carmen Silva",
      priority: "normal",
    },
    {
      id: 24,
      roomNumber: 202,
      guestName: "Alberto Guzmán",
      requestedTime: "11:00 AM",
      status: "completed",
      assignedTo: "Diego Ramírez",
      priority: "normal",
    },
    {
      id: 25,
      roomNumber: 305,
      guestName: "Cristina Campos",
      requestedTime: "12:00 PM",
      status: "completed",
      assignedTo: "Diego Ramírez",
      priority: "normal",
    },
    {
      id: 26,
      roomNumber: 422,
      guestName: "Francisco Luna",
      requestedTime: "2:00 PM",
      status: "in-progress",
      assignedTo: "Diego Ramírez",
      priority: "normal",
    },
    {
      id: 27,
      roomNumber: 228,
      guestName: "Paola Medina",
      requestedTime: "3:30 PM",
      status: "assigned",
      assignedTo: "Diego Ramírez",
      priority: "normal",
    },
    {
      id: 28,
      roomNumber: 315,
      guestName: "Héctor Ramírez",
      requestedTime: "4:30 PM",
      status: "assigned",
      assignedTo: "Diego Ramírez",
      priority: "urgent",
    },
    {
      id: 29,
      roomNumber: 120,
      guestName: "Teresa Soto",
      requestedTime: "6:00 PM",
      status: "assigned",
      assignedTo: "Diego Ramírez",
      priority: "normal",
    },
    {
      id: 30,
      roomNumber: 108,
      guestName: "Sofia Herrera",
      requestedTime: "11:00 AM",
      status: "completed",
      assignedTo: "Carlos Méndez",
      priority: "normal",
    },
    {
      id: 31,
      roomNumber: 410,
      guestName: "Raúl Peña",
      requestedTime: "12:00 PM",
      status: "completed",
      assignedTo: "Carlos Méndez",
      priority: "normal",
    },
    {
      id: 32,
      roomNumber: 222,
      guestName: "Carmen Aguirre",
      requestedTime: "1:00 PM",
      status: "completed",
      assignedTo: "Carlos Méndez",
      priority: "normal",
    },
    {
      id: 33,
      roomNumber: 330,
      guestName: "Ernesto Cortés",
      requestedTime: "2:30 PM",
      status: "in-progress",
      assignedTo: "Carlos Méndez",
      priority: "urgent",
    },
    {
      id: 34,
      roomNumber: 425,
      guestName: "Natalia Márquez",
      requestedTime: "4:00 PM",
      status: "assigned",
      assignedTo: "Carlos Méndez",
      priority: "normal",
    },
    {
      id: 35,
      roomNumber: 115,
      guestName: "Víctor Salinas",
      requestedTime: "5:00 PM",
      status: "assigned",
      assignedTo: "Carlos Méndez",
      priority: "normal",
    },
    {
      id: 36,
      roomNumber: 212,
      guestName: "Irene Molina",
      requestedTime: "6:30 PM",
      status: "assigned",
      assignedTo: "Carlos Méndez",
      priority: "normal",
    },
    {
      id: 37,
      roomNumber: 322,
      guestName: "Alejandro Cruz",
      requestedTime: "2:00 PM",
      status: "pending",
      priority: "normal",
    },
    {
      id: 38,
      roomNumber: 428,
      guestName: "Mariana Lagos",
      requestedTime: "3:30 PM",
      status: "pending",
      priority: "urgent",
    },
  ])

  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null)
  const [viewMode, setViewMode] = useState<"overview" | "schedule" | "kanban">("overview")
  const [collapsedStaff, setCollapsedStaff] = useState<Set<number>>(new Set())

  const availableStaff = staff.filter((s) => s.status === "available")
  const busyStaff = staff.filter((s) => s.status === "busy")
  const totalCapacity = staff.filter((s) => s.status !== "off").reduce((acc, s) => acc + s.maxCapacity, 0)
  const usedCapacity = staff.filter((s) => s.status !== "off").reduce((acc, s) => acc + s.tasksToday, 0)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-500"
      case "busy":
        return "bg-yellow-500"
      case "off":
        return "bg-gray-400"
      default:
        return "bg-gray-400"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "available":
        return "Disponible"
      case "busy":
        return "Ocupada"
      case "off":
        return "Libre"
      default:
        return status
    }
  }

  const getRequestStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-300"
      case "assigned":
        return "bg-blue-100 text-blue-800 border-blue-300"
      case "in-progress":
        return "bg-purple-100 text-purple-800 border-purple-300"
      case "completed":
        return "bg-green-100 text-green-800 border-green-300"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getRequestStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Pendiente"
      case "assigned":
        return "Asignada"
      case "in-progress":
        return "En Progreso"
      case "completed":
        return "Completada"
      default:
        return status
    }
  }

  const toggleCollapse = (staffId: number) => {
    setCollapsedStaff((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(staffId)) {
        newSet.delete(staffId)
      } else {
        newSet.add(staffId)
      }
      return newSet
    })
  }

  const timeSlots = Array.from({ length: 16 }, (_, i) => {
    const hour = Math.floor(i / 2) + 7
    const minute = (i % 2) * 30
    return `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`
  })

  const getTasksForTimeSlot = (staffName: string, timeSlot: string) => {
    return requests.filter((r) => {
      if (r.assignedTo !== staffName) return false
      const taskTime = r.requestedTime
      return taskTime === timeSlot || taskTime.startsWith(timeSlot.split(":")[0])
    })
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Gestión de Limpieza</h1>
          <p className="text-muted-foreground mt-1">Administra el personal y las solicitudes de limpieza</p>
        </div>
        <div className="flex gap-3">
          <Button
            variant={viewMode === "overview" ? "default" : "outline"}
            onClick={() => setViewMode("overview")}
            size="sm"
          >
            Vista General
          </Button>
          <Button
            variant={viewMode === "schedule" ? "default" : "outline"}
            onClick={() => setViewMode("schedule")}
            size="sm"
          >
            <Calendar className="w-4 h-4 mr-2" />
            Agenda
          </Button>
          <Button
            variant={viewMode === "kanban" ? "default" : "outline"}
            onClick={() => setViewMode("kanban")}
            size="sm"
          >
            <LayoutGrid className="w-4 h-4 mr-2" />
            Kanban
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Añadir Personal
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Añadir Nuevo Personal</DialogTitle>
                <DialogDescription>Registra un nuevo miembro del equipo de limpieza</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <Label htmlFor="name">Nombre Completo</Label>
                  <Input id="name" placeholder="Ej: María González" />
                </div>
                <div>
                  <Label htmlFor="shift">Turno</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar turno" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="morning">Mañana (7:00 AM - 3:00 PM)</SelectItem>
                      <SelectItem value="afternoon">Tarde (11:00 AM - 7:00 PM)</SelectItem>
                      <SelectItem value="evening">Noche (3:00 PM - 11:00 PM)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="capacity">Capacidad Diaria (habitaciones)</Label>
                  <Input id="capacity" type="number" placeholder="8" defaultValue="8" />
                </div>
              </div>
              <Button className="w-full">Registrar Personal</Button>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6 bg-gradient-to-br from-green-50 to-white dark:from-green-950/20 dark:to-background border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground font-medium">Personal Disponible</p>
              <p className="text-3xl font-bold text-green-600 mt-2">{availableStaff.length}</p>
            </div>
            <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-white" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-yellow-50 to-white dark:from-yellow-950/20 dark:to-background border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground font-medium">Personal Ocupado</p>
              <p className="text-3xl font-bold text-yellow-600 mt-2">{busyStaff.length}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-500 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-white" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-orange-50 to-white dark:from-orange-950/20 dark:to-background border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground font-medium">Solicitudes Pendientes</p>
              <p className="text-3xl font-bold text-orange-600 mt-2">
                {requests.filter((r) => r.status === "pending").length}
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-white" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-blue-50 to-white dark:from-blue-950/20 dark:to-background border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground font-medium">Capacidad Total</p>
              <p className="text-3xl font-bold text-blue-600 mt-2">
                {usedCapacity}/{totalCapacity}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
          </div>
        </Card>
      </div>

      {viewMode === "overview" ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Staff List */}
          <Card className="p-6">
            <h2 className="text-xl font-bold text-foreground mb-4">Personal de Limpieza</h2>
            <div className="space-y-3">
              {staff.map((member) => (
                <Card
                  key={member.id}
                  className={`p-4 cursor-pointer hover:shadow-md transition-shadow ${
                    member.status === "available" ? "border-green-200" : ""
                  }`}
                  onClick={() => setSelectedStaff(member)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center text-white font-bold shadow-md">
                        {member.avatar}
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{member.name}</h3>
                        <p className="text-sm text-muted-foreground">{member.shift}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className={getStatusColor(member.status) + " text-white"}>
                        {getStatusText(member.status)}
                      </Badge>
                      {member.currentRoom && (
                        <p className="text-xs text-muted-foreground mt-1">Hab. {member.currentRoom}</p>
                      )}
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-border">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Tareas hoy</span>
                      <span className="font-semibold text-foreground">
                        {member.tasksToday} / {member.maxCapacity}
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2 mt-2">
                      <div
                        className="bg-primary rounded-full h-2 transition-all"
                        style={{ width: `${(member.tasksToday / member.maxCapacity) * 100}%` }}
                      />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </Card>

          {/* Cleaning Requests */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-foreground">Solicitudes de Limpieza</h2>
              <Badge variant="secondary">{requests.length} total</Badge>
            </div>
            <div className="space-y-3">
              {requests.map((request) => (
                <Card key={request.id} className="p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-foreground">Habitación {request.roomNumber}</h3>
                        {request.priority === "urgent" && (
                          <Badge variant="destructive" className="text-xs">
                            Urgente
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{request.guestName}</p>
                    </div>
                    <Badge className={getRequestStatusColor(request.status)}>
                      {getRequestStatusText(request.status)}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span>{request.requestedTime}</span>
                    </div>
                    {request.assignedTo && (
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <User className="w-4 h-4" />
                        <span className="text-xs">{request.assignedTo}</span>
                      </div>
                    )}
                  </div>
                  {request.status === "pending" && (
                    <Select
                      onValueChange={(value) => {
                        setRequests(
                          requests.map((r) =>
                            r.id === request.id ? { ...r, status: "assigned" as const, assignedTo: value } : r,
                          ),
                        )
                      }}
                    >
                      <SelectTrigger className="w-full mt-3">
                        <SelectValue placeholder="Asignar personal..." />
                      </SelectTrigger>
                      <SelectContent>
                        {staff
                          .filter((s) => s.status !== "off" && s.tasksToday < s.maxCapacity)
                          .map((s) => (
                            <SelectItem key={s.id} value={s.name}>
                              {s.name} ({s.tasksToday}/{s.maxCapacity})
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  )}
                </Card>
              ))}
            </div>
          </Card>
        </div>
      ) : viewMode === "schedule" ? (
        <div className="space-y-6">
          {staff
            .filter((s) => s.status !== "off")
            .map((member) => {
              const memberRequests = requests
                .filter((r) => r.assignedTo === member.name)
                .sort((a, b) => {
                  const timeA = Number.parseInt(a.requestedTime.split(":")[0])
                  const timeB = Number.parseInt(b.requestedTime.split(":")[0])
                  return timeA - timeB
                })

              const hours = Array.from({ length: 8 }, (_, i) => {
                const hour = 7 + i
                return `${hour}:00`
              })

              const isCollapsed = collapsedStaff.has(member.id)

              return (
                <Card key={member.id} className="p-6">
                  {/* Staff Header */}
                  <div
                    className="flex items-center justify-between mb-6 pb-4 border-b border-border cursor-pointer hover:bg-muted/30 -m-6 p-6 rounded-t-lg transition-colors"
                    onClick={() => toggleCollapse(member.id)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center text-white font-bold shadow-md">
                        {member.avatar}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-foreground">{member.name}</h3>
                        <p className="text-sm text-muted-foreground">{member.shift}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <Badge className={getStatusColor(member.status) + " text-white mb-2"}>
                          {getStatusText(member.status)}
                        </Badge>
                        <p className="text-sm text-muted-foreground">
                          {member.tasksToday} / {member.maxCapacity} tareas
                        </p>
                      </div>
                      <div className={`transition-transform ${isCollapsed ? "rotate-180" : ""}`}>
                        <svg
                          className="w-5 h-5 text-muted-foreground"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {!isCollapsed && (
                    <>
                      {/* Timeline Calendar */}
                      <div className="space-y-3">
                        {hours.map((hour) => {
                          const tasksAtThisHour = memberRequests.filter((r) => {
                            const requestHour = r.requestedTime.split(":")[0] + ":00"
                            return requestHour === hour
                          })

                          return (
                            <div key={hour} className="flex gap-4">
                              {/* Time Label */}
                              <div className="w-20 flex-shrink-0 pt-2">
                                <span className="text-sm font-medium text-muted-foreground">{hour}</span>
                              </div>

                              {/* Timeline Content */}
                              <div className="flex-1 relative">
                                {/* Timeline Bar */}
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-border rounded-full" />

                                {/* Tasks */}
                                <div className="pl-6 space-y-2">
                                  {tasksAtThisHour.length > 0 ? (
                                    tasksAtThisHour.map((task) => (
                                      <div
                                        key={task.id}
                                        className="relative bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/20 rounded-lg p-3 hover:shadow-md transition-all"
                                      >
                                        {/* Timeline Dot */}
                                        <div className="absolute -left-[26px] top-4 w-3 h-3 bg-primary rounded-full border-2 border-background shadow-sm" />

                                        <div className="flex items-start justify-between">
                                          <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                              <span className="font-semibold text-foreground">
                                                Habitación {task.roomNumber}
                                              </span>
                                              {task.priority === "urgent" && (
                                                <Badge variant="destructive" className="text-xs">
                                                  Urgente
                                                </Badge>
                                              )}
                                            </div>
                                            <p className="text-sm text-muted-foreground">{task.guestName}</p>
                                            <div className="flex items-center gap-2 mt-2">
                                              <Clock className="w-3 h-3 text-muted-foreground" />
                                              <span className="text-xs text-muted-foreground">
                                                {task.requestedTime}
                                              </span>
                                            </div>
                                          </div>
                                          <Badge className={getRequestStatusColor(task.status)}>
                                            {getRequestStatusText(task.status)}
                                          </Badge>
                                        </div>
                                      </div>
                                    ))
                                  ) : (
                                    <div className="py-2 text-sm text-muted-foreground/50 italic">Sin actividades</div>
                                  )}
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>

                      {/* Summary Footer */}
                      <div className="mt-6 pt-4 border-t border-border flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-purple-500 rounded-full" />
                            <span className="text-muted-foreground">
                              En Progreso: {memberRequests.filter((r) => r.status === "in-progress").length}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-blue-500 rounded-full" />
                            <span className="text-muted-foreground">
                              Asignadas: {memberRequests.filter((r) => r.status === "assigned").length}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-green-500 rounded-full" />
                            <span className="text-muted-foreground">
                              Completadas: {memberRequests.filter((r) => r.status === "completed").length}
                            </span>
                          </div>
                        </div>
                        <div className="text-sm font-medium text-foreground">
                          Total del día: {memberRequests.length} tareas
                        </div>
                      </div>
                    </>
                  )}
                </Card>
              )
            })}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <div className="min-w-max">
            {/* Header Row with Time Slots */}
            <div className="flex gap-2 mb-4 sticky left-0">
              {/* Staff Column Header */}
              <div className="w-48 flex-shrink-0">
                <div className="h-16 flex items-center justify-center bg-muted rounded-lg border border-border">
                  <span className="text-sm font-semibold text-muted-foreground">Personal</span>
                </div>
              </div>

              {/* Time Slot Headers */}
              <div className="flex gap-2">
                {timeSlots.map((timeSlot) => (
                  <div key={timeSlot} className="w-32 flex-shrink-0">
                    <div className="h-16 flex flex-col items-center justify-center bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg border border-primary/20">
                      <Clock className="w-4 h-4 text-primary mb-1" />
                      <span className="text-xs font-medium text-foreground">{timeSlot}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Staff Rows */}
            <div className="space-y-2">
              {staff
                .filter((s) => s.status !== "off")
                .map((member) => (
                  <div key={member.id} className="flex gap-2">
                    {/* Staff Info (Fixed Column) */}
                    <div className="w-48 flex-shrink-0 sticky left-0 bg-background">
                      <Card className="p-3 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20 h-full">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md">
                            {member.avatar}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-foreground text-sm truncate">{member.name}</h3>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge className={getStatusColor(member.status) + " text-white text-xs py-0"}>
                                {getStatusText(member.status)}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {member.tasksToday}/{member.maxCapacity}
                              </span>
                            </div>
                          </div>
                        </div>
                      </Card>
                    </div>

                    {/* Time Slots for this Staff Member */}
                    <div className="flex gap-2">
                      {timeSlots.map((timeSlot) => {
                        const tasksInSlot = getTasksForTimeSlot(member.name, timeSlot)
                        const hasTask = tasksInSlot.length > 0

                        return (
                          <div key={timeSlot} className="w-32 flex-shrink-0">
                            {hasTask ? (
                              <div className="space-y-2">
                                {tasksInSlot.map((task) => (
                                  <Card
                                    key={task.id}
                                    className="p-2 bg-gradient-to-r from-primary/10 to-primary/5 border-primary/30 hover:shadow-lg transition-all cursor-pointer h-full"
                                  >
                                    <div className="flex flex-col gap-1">
                                      <div className="flex items-center justify-between">
                                        <span className="font-semibold text-foreground text-xs">{task.roomNumber}</span>
                                        {task.priority === "urgent" && (
                                          <Badge variant="destructive" className="text-[10px] px-1 py-0">
                                            !
                                          </Badge>
                                        )}
                                      </div>
                                      <p className="text-[10px] text-muted-foreground truncate">{task.guestName}</p>
                                      <Badge className={getRequestStatusColor(task.status) + " text-[10px] px-1 py-0"}>
                                        {getRequestStatusText(task.status)}
                                      </Badge>
                                    </div>
                                  </Card>
                                ))}
                              </div>
                            ) : (
                              <div className="h-full min-h-[80px] bg-muted/30 rounded-lg border border-dashed border-border flex items-center justify-center">
                                <span className="text-xs text-muted-foreground/50">Libre</span>
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* Staff Detail Dialog */}
      {selectedStaff && (
        <Dialog open={!!selectedStaff} onOpenChange={() => setSelectedStaff(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Detalles del Personal</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  {selectedStaff.avatar}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground">{selectedStaff.name}</h3>
                  <Badge className={getStatusColor(selectedStaff.status) + " text-white mt-1"}>
                    {getStatusText(selectedStaff.status)}
                  </Badge>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">Turno</span>
                  <span className="font-medium text-foreground">{selectedStaff.shift}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">Tareas de hoy</span>
                  <span className="font-medium text-foreground">
                    {selectedStaff.tasksToday} / {selectedStaff.maxCapacity}
                  </span>
                </div>
                {selectedStaff.currentRoom && (
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Habitación actual</span>
                    <span className="font-medium text-foreground">{selectedStaff.currentRoom}</span>
                  </div>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
