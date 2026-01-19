"use client"

import { useState } from "react"
import { ChevronLeft, CheckCircle2, Circle, AlertCircle, Clock, MapPin } from "lucide-react"
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
    },
  ])

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

  const pendingCount = tasks.filter((t) => t.status === "pending").length
  const inProgressCount = tasks.filter((t) => t.status === "in-progress").length
  const completedCount = tasks.filter((t) => t.status === "completed").length

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
            <p className="text-blue-100 text-sm">Staff Dashboard</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-md mx-auto px-4 py-4 grid grid-cols-3 gap-3">
        <div className="bg-white rounded-lg p-4 text-center shadow-sm">
          <div className="text-2xl font-bold text-yellow-600">{pendingCount}</div>
          <div className="text-xs text-gray-600">Pendientes</div>
        </div>
        <div className="bg-white rounded-lg p-4 text-center shadow-sm">
          <div className="text-2xl font-bold text-blue-600">{inProgressCount}</div>
          <div className="text-xs text-gray-600">En Progreso</div>
        </div>
        <div className="bg-white rounded-lg p-4 text-center shadow-sm">
          <div className="text-2xl font-bold text-green-600">{completedCount}</div>
          <div className="text-xs text-gray-600">Completadas</div>
        </div>
      </div>

      {/* Tasks List */}
      <div className="max-w-md mx-auto px-4 py-4 space-y-3">
        {tasks.map((task) => (
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
                  {getPriorityIcon(task.priority)}
                </div>

                <p className={`text-sm mb-2 ${task.status === "completed" ? "text-gray-400" : "text-gray-600"}`}>
                  {task.description}
                </p>

                <div className="flex flex-wrap gap-2 items-center text-xs text-gray-500 mb-2">
                  <span className={`px-2 py-1 rounded-full ${getStatusColor(task.status)}`}>
                    {task.status === "pending"
                      ? "Pendiente"
                      : task.status === "in-progress"
                        ? "En Progreso"
                        : "Completada"}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {task.time}
                  </span>
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
