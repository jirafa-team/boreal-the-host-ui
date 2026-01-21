"use client"

import { useState, useMemo } from "react"
import { ChevronLeft, ChevronRight, CheckCircle2, Circle, AlertCircle, Clock, MapPin } from "lucide-react"
import { useRouter } from "next/navigation"

export default function StaffTasksPage() {
  const router = useRouter()
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: "Limpiar Habitación 204",
      category: "Limpieza",
      status: "pending",
      priority: "high",
      time: "09:00 AM",
      location: "Piso 2",
      description: "Suite Premium - Cambiar sábanas y limpiar baño",
      date: "today",
    },
    {
      id: 2,
      title: "Preparar Sala de Conferencias",
      category: "Mantenimiento",
      status: "in-progress",
      priority: "high",
      time: "10:30 AM",
      location: "Sala B",
      description: "Configurar proyector y mesas para reunión",
      date: "today",
    },
    {
      id: 3,
      title: "Reposición de Minibar - Piso 3",
      category: "Servicio",
      status: "pending",
      priority: "medium",
      time: "11:00 AM",
      location: "Piso 3",
      description: "Reabastecer bebidas frías",
      date: "today",
    },
    {
      id: 4,
      title: "Inspección Piscina",
      category: "Limpieza",
      status: "completed",
      priority: "medium",
      time: "08:00 AM",
      location: "Azotea",
      description: "Revisar nivel de químicos y filtros",
      date: "yesterday",
    },
    {
      id: 5,
      title: "Reparar Aire Acondicionado Habitación 305",
      category: "Mantenimiento",
      status: "pending",
      priority: "high",
      time: "14:00 PM",
      location: "Piso 3",
      description: "Cliente reportó que no enfría",
      date: "tomorrow",
    },
    {
      id: 6,
      title: "Atender Solicitud Room Service",
      category: "Servicio",
      status: "in-progress",
      priority: "high",
      time: "14:30 PM",
      location: "Habitación 204",
      description: "Entregar pedido de desayuno",
      date: "tomorrow",
    },
  ])
  const [statusFilter, setStatusFilter] = useState<string | null>(null)
  const [dateFilter, setDateFilter] = useState<"yesterday" | "today" | "tomorrow">("today")

  const toggleTaskStatus = (id: number) => {
    setTasks(
      tasks.map((task) => {
        if (task.id === id) {
          const statusMap = { pending: "in-progress", "in-progress": "completed", completed: "pending" }
          return { ...task, status: statusMap[task.status as keyof typeof statusMap] }
        }
        return task
      }),
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "in-progress":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-yellow-100 text-yellow-800"
    }
  }

  const getPriorityIcon = (priority: string) => {
    return priority === "high" ? (
      <AlertCircle className="w-5 h-5 text-red-500" />
    ) : (
      <Clock className="w-5 h-5 text-orange-500" />
    )
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="w-6 h-6 text-green-500" />
      case "in-progress":
        return <Clock className="w-6 h-6 text-blue-500" />
      default:
        return <Circle className="w-6 h-6 text-gray-400" />
    }
  }

  const pendingCount = tasks.filter((t) => t.status === "pending" && t.date === dateFilter).length
  const inProgressCount = tasks.filter((t) => t.status === "in-progress" && t.date === dateFilter).length
  const completedCount = tasks.filter((t) => t.status === "completed" && t.date === dateFilter).length

  const filteredTasks = useMemo(() => {
    let result = tasks.filter((t) => t.date === dateFilter)
    if (statusFilter) {
      result = result.filter((t) => t.status === statusFilter)
    }
    return result
  }, [tasks, dateFilter, statusFilter])

  const getDateLabel = (date: string) => {
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const formatDateShort = (d: Date) => {
      return d.toLocaleDateString("es-ES", { day: "numeric", month: "short" })
    }

    switch (date) {
      case "yesterday":
        return formatDateShort(yesterday)
      case "tomorrow":
        return formatDateShort(tomorrow)
      default:
        return "Hoy"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white sticky top-0 z-50">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center gap-4">
          <button onClick={() => router.push("/")} className="p-2 hover:bg-blue-500 rounded-lg">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">Mis Tareas</h1>
            <p className="text-blue-100 text-sm">{getDateLabel(dateFilter)}</p>
          </div>
        </div>
      </div>

      {/* Date Navigation */}
      <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between bg-white shadow-sm">
        <button
          onClick={() => setDateFilter("yesterday")}
          className={`p-2 rounded-lg transition-all flex items-center gap-1 ${
            dateFilter === "yesterday"
              ? "bg-blue-100 text-blue-600 font-semibold"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          <ChevronLeft className="w-5 h-5" />
          <span className="text-xs hidden sm:inline">
            {new Date(new Date().setDate(new Date().getDate() - 1)).toLocaleDateString("es-ES", {
              day: "numeric",
              month: "short",
            })}
          </span>
        </button>
        <button
          onClick={() => setDateFilter("today")}
          className={`px-4 py-2 rounded-lg font-semibold transition-all whitespace-nowrap text-sm ${
            dateFilter === "today"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          {getDateLabel("today")}
        </button>
        <button
          onClick={() => setDateFilter("tomorrow")}
          className={`p-2 rounded-lg transition-all flex items-center gap-1 ${
            dateFilter === "tomorrow"
              ? "bg-blue-100 text-blue-600 font-semibold"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          <span className="text-xs hidden sm:inline">
            {new Date(new Date().setDate(new Date().getDate() + 1)).toLocaleDateString("es-ES", {
              day: "numeric",
              month: "short",
            })}
          </span>
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Stats - Filtros */}
      <div className="max-w-md mx-auto px-4 py-4 grid grid-cols-4 gap-2">
        <button
          onClick={() => setStatusFilter(null)}
          className={`rounded-lg p-3 text-center text-xs font-semibold transition-all ${
            statusFilter === null
              ? "bg-gray-800 text-white shadow-md"
              : "bg-white text-gray-600 shadow-sm hover:shadow-md"
          }`}
        >
          <div className="text-lg font-bold">{tasks.length}</div>
          <div>Todas</div>
        </button>
        <button
          onClick={() => setStatusFilter("pending")}
          className={`rounded-lg p-3 text-center text-xs font-semibold transition-all ${
            statusFilter === "pending"
              ? "bg-yellow-600 text-white shadow-md"
              : "bg-white text-gray-600 shadow-sm hover:shadow-md"
          }`}
        >
          <div className="text-lg font-bold">{pendingCount}</div>
          <div>Pendientes</div>
        </button>
        <button
          onClick={() => setStatusFilter("in-progress")}
          className={`rounded-lg p-3 text-center text-xs font-semibold transition-all ${
            statusFilter === "in-progress"
              ? "bg-blue-600 text-white shadow-md"
              : "bg-white text-gray-600 shadow-sm hover:shadow-md"
          }`}
        >
          <div className="text-lg font-bold">{inProgressCount}</div>
          <div>En Progreso</div>
        </button>
        <button
          onClick={() => setStatusFilter("completed")}
          className={`rounded-lg p-3 text-center text-xs font-semibold transition-all ${
            statusFilter === "completed"
              ? "bg-green-600 text-white shadow-md"
              : "bg-white text-gray-600 shadow-sm hover:shadow-md"
          }`}
        >
          <div className="text-lg font-bold">{completedCount}</div>
          <div>Completadas</div>
        </button>
      </div>

      {/* Tasks List */}
      <div className="max-w-md mx-auto px-4 py-4 space-y-3">
        {filteredTasks.map((task) => (
          <div
            key={task.id}
            onClick={() => router.push(`/staff/tasks/${task.id}`)}
            className="bg-white rounded-lg p-4 shadow-sm border-l-4 border-blue-500 cursor-pointer hover:shadow-md transition-shadow"
          >
            <div className="flex items-start gap-4">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  toggleTaskStatus(task.id)
                }}
                className="pt-1 flex-shrink-0 hover:scale-110 transition-transform"
              >
                {getStatusIcon(task.status)}
              </button>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3
                    className={`font-semibold text-gray-900 ${task.status === "completed" ? "line-through text-gray-400" : ""}`}
                  >
                    {task.title}
                  </h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold whitespace-nowrap flex-shrink-0 ${getStatusColor(task.status)}`}>
                    {task.status === "pending"
                      ? "Pendiente"
                      : task.status === "in-progress"
                        ? "En Progreso"
                        : "Completada"}
                  </span>
                </div>

                <div className="flex items-center gap-2 mb-2 text-sm font-semibold text-blue-600">
                  <Clock className="w-4 h-4" />
                  {task.time}
                </div>

                <p className={`text-sm mb-2 ${task.status === "completed" ? "text-gray-400" : "text-gray-600"}`}>
                  {task.description}
                </p>

                <div className="flex flex-wrap gap-2 items-center text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {task.location}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
