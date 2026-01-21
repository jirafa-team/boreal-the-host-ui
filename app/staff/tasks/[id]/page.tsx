"use client"

import { useState } from "react"
import { ChevronLeft, Play, Pause, X, CheckCircle2, Clock, MapPin, AlertCircle } from "lucide-react"
import { useRouter, useParams } from "next/navigation"

export default function TaskDetailPage() {
  const router = useRouter()
  const params = useParams()
  const taskId = Number.parseInt(params.id as string)

  const [task, setTask] = useState({
    id: taskId,
    title: "Limpiar Habitación 204",
    category: "Limpieza",
    status: "pending",
    priority: "high",
    time: "09:00 AM",
    location: "Piso 2",
    description: "Suite Premium - Cambiar sábanas y limpiar baño",
    details:
      "Tareas específicas: Cambiar sábanas del dormitorio, limpiar baño completo, pasar aspiradora, organizar amenities",
  })

  const [comment, setComment] = useState("")
  const [commentError, setCommentError] = useState("")

  const validateComment = () => {
    if (task.status === "in-progress") {
      if (!comment.trim()) {
        setCommentError("Por favor, escribe un comentario antes de completar o cancelar la tarea")
        return false
      }
      if (comment.trim().length < 5) {
        setCommentError("El comentario debe tener al menos 5 caracteres")
        return false
      }
    }
    setCommentError("")
    return true
  }

  const handleStatusChange = (newStatus: string) => {
    if ((newStatus === "completed" || newStatus === "cancelled") && task.status === "in-progress") {
      if (!validateComment()) {
        return
      }
    }
    setTask({ ...task, status: newStatus })
    setComment("")
    setCommentError("")
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "in-progress":
        return "bg-blue-100 text-blue-800"
      case "paused":
        return "bg-orange-100 text-orange-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-yellow-100 text-yellow-800"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "completed":
        return "Completada"
      case "in-progress":
        return "En Progreso"
      case "paused":
        return "Pausada"
      case "cancelled":
        return "Cancelada"
      default:
        return "Pendiente"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white sticky top-0 z-50">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center gap-4">
          <button onClick={() => router.back()} className="p-2 hover:bg-blue-500 rounded-lg">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div className="flex-1">
            <h1 className="text-xl font-bold truncate">{task.title}</h1>
            <p className="text-blue-100 text-sm">{task.category}</p>
          </div>
        </div>
      </div>

      {/* Task Details */}
      <div className="max-w-md mx-auto px-4 py-4 space-y-4">
        {/* Action Buttons - Now at the top */}
        <div className="bg-white rounded-lg p-4 shadow-sm space-y-3">
          <h3 className="font-semibold text-gray-900">Acciones</h3>
          <div className="grid grid-cols-2 gap-2">
            {/* Start Button */}
            {(task.status === "pending" || task.status === "paused") && (
              <button
                onClick={() => handleStatusChange("in-progress")}
                className="flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                <Play className="w-5 h-5" />
                Iniciar
              </button>
            )}

            {/* Pause Button */}
            {task.status === "in-progress" && (
              <button
                onClick={() => handleStatusChange("paused")}
                className="flex items-center justify-center gap-2 bg-orange-600 text-white py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors"
              >
                <Pause className="w-5 h-5" />
                Pausar
              </button>
            )}

            {/* Complete Button */}
            {task.status !== "completed" && task.status !== "cancelled" && (
              <button
                onClick={() => handleStatusChange("completed")}
                className="flex items-center justify-center gap-2 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                disabled={task.status === "in-progress" && !comment.trim()}
              >
                <CheckCircle2 className="w-5 h-5" />
                Completar
              </button>
            )}

            {/* Cancel Button */}
            {task.status !== "completed" && task.status !== "cancelled" && (
              <button
                onClick={() => handleStatusChange("cancelled")}
                className="flex items-center justify-center gap-2 bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                disabled={task.status === "in-progress" && !comment.trim()}
              >
                <X className="w-5 h-5" />
                Cancelar
              </button>
            )}
          </div>
        </div>

        {/* Status Card */}
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Estado Actual</h2>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(task.status)}`}>
              {getStatusLabel(task.status)}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            {task.priority === "high" ? (
              <AlertCircle className="w-4 h-4 text-red-500" />
            ) : (
              <Clock className="w-4 h-4 text-orange-500" />
            )}
            <span>{task.priority === "high" ? "Prioridad Alta" : "Prioridad Media"}</span>
          </div>
        </div>

        {/* Location & Time */}
        <div className="bg-white rounded-lg p-4 shadow-sm space-y-3">
          <div className="flex items-center gap-3">
            <MapPin className="w-5 h-5 text-blue-600" />
            <div>
              <p className="text-xs text-gray-500">Ubicación</p>
              <p className="font-semibold text-gray-900">{task.location}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-blue-600" />
            <div>
              <p className="text-xs text-gray-500">Horario</p>
              <p className="font-semibold text-gray-900">{task.time}</p>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-2">Descripción</h3>
          <p className="text-gray-600 text-sm mb-3">{task.description}</p>
          <p className="text-gray-700 text-sm border-l-4 border-blue-500 pl-3">{task.details}</p>
        </div>

        {/* Comments Section - Only show when in-progress */}
        {task.status === "in-progress" && (
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-3">Comentarios de la Tarea</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Comentario <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => {
                    setComment(e.target.value)
                    if (commentError) setCommentError("")
                  }}
                  placeholder="Describe lo que has hecho, cualquier incidencia, o notas importantes sobre esta tarea..."
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${
                    commentError ? "border-red-500 bg-red-50" : "border-gray-300"
                  }`}
                  rows={4}
                />
                {commentError && <p className="text-red-600 text-sm mt-1">{commentError}</p>}
                <p className="text-xs text-gray-500 mt-1">{comment.length} caracteres (mínimo 5)</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
