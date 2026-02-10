"use client"

import { CardContent } from "@/components/ui/card"
import { CardHeader } from "@/components/ui/card"
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
import { Users, Clock, CheckCircle2, AlertCircle, User, Plus, Calendar, LayoutGrid, Book as Broom, Wrench, Shield, ReceiptText, UtensilsCrossed, UserPlus } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useLanguage } from "@/lib/i18n-context"
import { Search } from "lucide-react" // Import the Search component

type StaffMember = {
  id: number
  name: string
  status: "available" | "busy" | "off"
  currentRoom?: number
  tasksToday: number
  maxCapacity: number
  shift: string
  avatar: string
  department: "Limpieza" | "Mantenimiento" | "Seguridad" | "Recepción" | "Servicio"
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

export default function StaffManagement() {
  const { t } = useLanguage()
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
      department: "Limpieza",
    },
    {
      id: 2,
      name: "Roberto Fernández",
      status: "available",
      tasksToday: 3,
      maxCapacity: 8,
      shift: "7:00 AM - 3:00 PM",
      avatar: "RF",
      department: "Mantenimiento",
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
      department: "Limpieza",
    },
    {
      id: 4,
      name: "Diego Ramírez",
      status: "available",
      tasksToday: 2,
      maxCapacity: 8,
      shift: "11:00 AM - 7:00 PM",
      avatar: "DR",
      department: "Seguridad",
    },
    {
      id: 5,
      name: "Laura Pérez",
      status: "off",
      tasksToday: 0,
      maxCapacity: 8,
      shift: "Día libre",
      avatar: "LP",
      department: "Recepción",
    },
    {
      id: 6,
      name: "Ana Rodríguez",
      status: "available",
      tasksToday: 4,
      maxCapacity: 8,
      shift: "7:00 AM - 3:00 PM",
      avatar: "AR",
      department: "Servicio",
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
      department: "Mantenimiento",
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
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null)
  const [viewMode, setViewMode] = useState<"overview" | "kanban">("overview")
  const [collapsedStaff, setCollapsedStaff] = useState<Set<number>>(new Set())
  const [searchName, setSearchName] = useState("")
  const [filterDepartment, setFilterDepartment] = useState("all")
  const [filterDate, setFilterDate] = useState("")
  const [activityDialogOpen, setActivityDialogOpen] = useState(false)
  const [newActivity, setNewActivity] = useState({
    assignedTo: "",
    description: "",
    priority: "normal" as const,
    dueTime: "",
  })

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
    <>
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-10">
        <div className="px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">{t("admin.staffTitle")}</h1>
              <p className="text-sm text-muted-foreground">{t("admin.manageYour")} {t("admin.staffMembers")}</p>
            </div>
            <div className="flex gap-4 items-center ml-auto">
              {/* View Mode Toggle */}
              <div className="inline-flex h-10 items-center rounded-lg bg-gray-100 p-1 border border-gray-200">
                <button
                  onClick={() => setViewMode("overview")}
                  className={`px-5 py-2 rounded-md font-medium text-sm transition-all ${
                    viewMode === "overview"
                      ? "text-white shadow-md"
                      : "text-gray-700 hover:text-gray-900"
                  }`}
                  style={viewMode === "overview" ? { backgroundColor: "#394a63" } : {}}
                >
                  General
                </button>
                <button
                  onClick={() => setViewMode("kanban")}
                  className={`px-5 py-2 rounded-md font-medium text-sm transition-all ${
                    viewMode === "kanban"
                      ? "text-white shadow-md"
                      : "text-gray-700 hover:text-gray-900"
                  }`}
                  style={viewMode === "kanban" ? { backgroundColor: "#394a63" } : {}}
                >
                  Kanban
                </button>
              </div>
              
              {/* Create Activity Button */}
              <Dialog open={activityDialogOpen} onOpenChange={setActivityDialogOpen}>
                <button 
                  onClick={() => setActivityDialogOpen(true)}
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 text-white shadow-md hover:shadow-lg transition-all duration-300 hover:scale-110 group relative"
                  title="Crear actividad"
                >
                  <Calendar className="w-5 h-5" />
                  <span className="absolute top-full mt-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                    Crear actividad
                  </span>
                </button>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Crear Nueva Actividad</DialogTitle>
                    <DialogDescription>Asigna una actividad a un miembro del staff</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-5 py-4">
                    <div>
                      <Label htmlFor="assignedTo" className="text-sm font-medium mb-2 block">Asignar a</Label>
                      <Select value={newActivity.assignedTo} onValueChange={(value) => setNewActivity({ ...newActivity, assignedTo: value })}>
                        <SelectTrigger className="h-10">
                          <SelectValue placeholder="Seleccionar personal" />
                        </SelectTrigger>
                        <SelectContent>
                          {staff.map((member) => (
                            <SelectItem key={member.id} value={member.name}>
                              {member.name} ({member.department})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="description" className="text-sm font-medium mb-2 block">Descripción de la Actividad</Label>
                      <Input
                        id="description"
                        placeholder="Ej: Revisar sistema de aire acondicionado..."
                        value={newActivity.description}
                        onChange={(e) => setNewActivity({ ...newActivity, description: e.target.value })}
                        className="h-10"
                      />
                    </div>
                    <div>
                      <Label htmlFor="priority" className="text-sm font-medium mb-2 block">Prioridad</Label>
                      <Select value={newActivity.priority} onValueChange={(value: any) => setNewActivity({ ...newActivity, priority: value })}>
                        <SelectTrigger className="h-10">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="normal">Normal</SelectItem>
                          <SelectItem value="urgent">Urgente</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="dueTime" className="text-sm font-medium mb-2 block">Hora de Entrega</Label>
                      <Input
                        id="dueTime"
                        type="time"
                        value={newActivity.dueTime}
                        onChange={(e) => setNewActivity({ ...newActivity, dueTime: e.target.value })}
                        className="h-10"
                      />
                    </div>
                    <Button 
                      onClick={() => {
                        if (newActivity.assignedTo && newActivity.description) {
                          setActivityDialogOpen(false)
                          setNewActivity({ assignedTo: "", description: "", priority: "normal", dueTime: "" })
                        }
                      }}
                      className="w-full h-10"
                    >
                      Crear Actividad
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
              
              <Dialog>
                <DialogTrigger asChild>
                  <button 
                    className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/80 text-white shadow-md hover:shadow-lg transition-all duration-300 hover:scale-110 group relative"
                    title="Agregar personal"
                  >
                    <UserPlus className="w-5 h-5" />
                    <span className="absolute top-full mt-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                      Agregar personal
                    </span>
                  </button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Añadir Nuevo Personal</DialogTitle>
                    <DialogDescription>Registra un nuevo miembro del equipo de staff</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div>
                      <Label htmlFor="name">Nombre Completo</Label>
                      <Input id="name" placeholder="Ej: María González" />
                    </div>
                    <div>
                      <Label htmlFor="department">Departamento</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar departamento" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Limpieza">Limpieza</SelectItem>
                          <SelectItem value="Mantenimiento">Mantenimiento</SelectItem>
                          <SelectItem value="Seguridad">Seguridad</SelectItem>
                          <SelectItem value="Recepción">Recepción</SelectItem>
                          <SelectItem value="Servicio">Servicio</SelectItem>
                        </SelectContent>
                      </Select>
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
                      <Label htmlFor="capacity">Capacidad Diaria (tareas)</Label>
                      <Input id="capacity" type="number" placeholder="8" defaultValue="8" />
                    </div>
                  </div>
                  <Button className="w-full">Registrar Personal</Button>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="p-6 space-y-6">

      {/* Stats Cards by Department - Only show in overview */}
      {viewMode === "overview" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            { dept: "Limpieza", icon: Broom, color: "from-green-400 to-green-600", iconBg: "bg-green-600", textColor: "text-white" },
            { dept: "Mantenimiento", icon: Wrench, color: "from-yellow-500 to-yellow-600", iconBg: "bg-yellow-600", textColor: "text-white" },
            { dept: "Seguridad", icon: Shield, color: "from-red-600 to-red-700", iconBg: "bg-red-700", textColor: "text-white" },
            { dept: "Recepción", icon: ReceiptText, color: "from-pink-600 to-pink-700", iconBg: "bg-pink-700", textColor: "text-white" },
            { dept: "Servicio", icon: UtensilsCrossed, color: "from-violet-500 to-violet-700", iconBg: "bg-violet-700", textColor: "text-white" },
          ].map((deptInfo) => {
            const deptStaff = staff.filter((s) => s.department === deptInfo.dept)
            const availableCount = deptStaff.filter((s) => s.status === "available").length
            const busyCount = deptStaff.filter((s) => s.status === "busy").length
            const offCount = deptStaff.filter((s) => s.status === "off").length
            const capacityPercentage = Math.round((busyCount / deptStaff.length) * 100) || 0
            return (
              <Card key={deptInfo.dept} className="relative overflow-hidden bg-background hover:shadow-md transition-shadow border border-border p-0">
                {/* Title Header */}
                <div className={`bg-gradient-to-br ${deptInfo.color} p-3 relative overflow-hidden`}>
                  {/* Background circle decoration */}
                  <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-white rounded-full -mr-4 -mt-4"></div>
                  </div>
                  
                  {/* Content */}
                  <div className="relative flex items-center justify-between">
                    <h3 className={`font-semibold text-sm ${deptInfo.textColor}`}>{deptInfo.dept}</h3>
                    <deptInfo.icon className="w-5 h-5 text-white" />
                  </div>
                </div>
                
                {/* Content */}
                <div className="px-3 py-2 space-y-2">
                  {/* Status breakdown - Horizontal */}
                  <div className="flex items-center justify-between gap-2 border-b border-border pb-2">
                    <div className="flex-1 text-center">
                      <span className="font-semibold text-xs text-foreground block">{availableCount}</span>
                      <span className="text-muted-foreground text-xs block">Disponible</span>
                    </div>
                    <div className="w-px h-6 bg-border"></div>
                    <div className="flex-1 text-center">
                      <span className="font-semibold text-xs text-foreground block">{busyCount}</span>
                      <span className="text-muted-foreground text-xs block">Ocupado</span>
                    </div>
                    <div className="w-px h-6 bg-border"></div>
                    <div className="flex-1 text-center">
                      <span className="font-semibold text-xs text-foreground block">{offCount}</span>
                      <span className="text-muted-foreground text-xs block">Descanso</span>
                    </div>
                  </div>
                  
                  {/* Capacity bar - Refined */}
                  <div className="pt-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-muted-foreground text-xs">Ocupación</span>
                      <span className="font-semibold text-xs text-foreground">{capacityPercentage}%</span>
                    </div>
                    <div className="w-full bg-border rounded-full h-0.5 overflow-hidden shadow-inner">
                      <div
                        className={`bg-gradient-to-r ${deptInfo.color} rounded-full h-0.5 transition-all duration-500`}
                        style={{ width: `${capacityPercentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      )}

      {viewMode === "overview" && (
        <div>
          {/* Staff List - Grid Layout */}
          <Card className="p-6">
            <div className="flex-1 max-w-xs mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Ej: María, Roberto..."
                  value={searchName}
                  onChange={(e) => setSearchName(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {staff
                .filter((member) => member.name.toLowerCase().includes(searchName.toLowerCase()))
                .map((member) => (
                <Card
                  key={member.id}
                  className={`p-4 cursor-pointer hover:shadow-md transition-shadow ${
                    member.status === "available" ? "border-green-200" : ""
                  }`}
                  onClick={() => setSelectedStaff(member)}
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center text-white font-bold shadow-md mb-3">
                      {member.avatar}
                    </div>
                    <h3 className="font-semibold text-foreground text-sm">{member.name}</h3>
                    <p className="text-xs text-muted-foreground">{member.department}</p>
                    <p className="text-xs text-muted-foreground mt-1">{member.shift}</p>
                    <Badge className={`${getStatusColor(member.status)} text-white mt-3`}>
                      {getStatusText(member.status)}
                    </Badge>
                    {member.currentRoom && (
                      <p className="text-xs text-muted-foreground mt-2">Hab. {member.currentRoom}</p>
                    )}
                  </div>
                  <div className="mt-4 pt-4 border-t border-border">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-muted-foreground">{t("admin.tasksToday")}</span>
                      <span className="font-semibold text-foreground">
                        {member.tasksToday} / {member.maxCapacity}
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
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
        </div>
      )}

      {viewMode === "kanban" && (
        <div className="space-y-4">
          {/* Filters */}
          <Card className="p-4">
            <div className="flex gap-4 items-end">
              <div className="flex-1">
                <Label htmlFor="search-name" className="text-sm font-medium">Buscar por nombre</Label>
                <Input
                  id="search-name"
                  placeholder="Ej: María, Roberto..."
                  value={searchName}
                  onChange={(e) => setSearchName(e.target.value)}
                  className="mt-2"
                />
              </div>
              <div className="w-48">
                <Label htmlFor="filter-dept" className="text-sm font-medium">Filtrar por departamento</Label>
                <Select value={filterDepartment} onValueChange={setFilterDepartment}>
                  <SelectTrigger id="filter-dept" className="mt-2">
                    <SelectValue placeholder="Todos los departamentos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los departamentos</SelectItem>
                    <SelectItem value="Limpieza">Limpieza</SelectItem>
                    <SelectItem value="Mantenimiento">Mantenimiento</SelectItem>
                    <SelectItem value="Seguridad">Seguridad</SelectItem>
                    <SelectItem value="Recepción">Recepción</SelectItem>
                    <SelectItem value="Servicio">Servicio</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="w-48">
                <Label htmlFor="filter-date" className="text-sm font-medium">Filtrar por fecha</Label>
                <Input
                  id="filter-date"
                  type="date"
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                  className="mt-2"
                />
              </div>
            </div>
          </Card>

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
                  .filter((s) =>
                    s.name.toLowerCase().includes(searchName.toLowerCase())
                  )
                  .filter((s) =>
                    filterDepartment === "all" || s.department === filterDepartment
                  )
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
        </div>
      )}

      {/* Staff Detail Dialog */}
      {selectedStaff && (
        <Dialog open={!!selectedStaff} onOpenChange={() => {
          setSelectedStaff(null)
          setEditingStaff(null)
        }}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editingStaff ? "Editar Personal" : "Detalles del Personal"}</DialogTitle>
            </DialogHeader>
            
            {!editingStaff ? (
              // View Mode
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
                    <span className="text-muted-foreground">Departamento</span>
                    <span className="font-medium text-foreground">{selectedStaff.department}</span>
                  </div>
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
                <Button 
                  onClick={() => setEditingStaff(selectedStaff)}
                  className="w-full mt-4"
                >
                  Editar
                </Button>
              </div>
            ) : (
              // Edit Mode
              <div className="space-y-4">
                <div>
                  <Label htmlFor="edit-name" className="text-sm font-medium">Nombre</Label>
                  <Input
                    id="edit-name"
                    value={editingStaff.name}
                    onChange={(e) => setEditingStaff({...editingStaff, name: e.target.value})}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-dept" className="text-sm font-medium">Departamento</Label>
                  <Select 
                    value={editingStaff.department}
                    onValueChange={(value) => setEditingStaff({...editingStaff, department: value as any})}
                  >
                    <SelectTrigger id="edit-dept" className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Limpieza">Limpieza</SelectItem>
                      <SelectItem value="Mantenimiento">Mantenimiento</SelectItem>
                      <SelectItem value="Seguridad">Seguridad</SelectItem>
                      <SelectItem value="Recepción">Recepción</SelectItem>
                      <SelectItem value="Servicio">Servicio</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="edit-status" className="text-sm font-medium">Estado</Label>
                  <Select 
                    value={editingStaff.status}
                    onValueChange={(value) => setEditingStaff({...editingStaff, status: value as any})}
                  >
                    <SelectTrigger id="edit-status" className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="available">Disponible</SelectItem>
                      <SelectItem value="busy">Ocupada</SelectItem>
                      <SelectItem value="off">Descanso</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="edit-shift" className="text-sm font-medium">Turno</Label>
                  <Input
                    id="edit-shift"
                    value={editingStaff.shift}
                    onChange={(e) => setEditingStaff({...editingStaff, shift: e.target.value})}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-tasks" className="text-sm font-medium">Tareas de hoy</Label>
                  <Input
                    id="edit-tasks"
                    type="number"
                    min="0"
                    value={editingStaff.tasksToday}
                    onChange={(e) => setEditingStaff({...editingStaff, tasksToday: parseInt(e.target.value) || 0})}
                    className="mt-1"
                  />
                </div>
                <div className="flex gap-2 mt-6">
                  <Button 
                    variant="outline"
                    onClick={() => setEditingStaff(null)}
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                  <Button 
                    onClick={() => {
                      setStaff(staff.map(s => s.id === editingStaff.id ? editingStaff : s))
                      setSelectedStaff(editingStaff)
                      setEditingStaff(null)
                    }}
                    className="flex-1"
                  >
                    Guardar
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      )}
      </div>
    </>
  )
}
