"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, Bot, Send, History, MessageSquare, Settings, Zap, BarChart3, Users, Briefcase, TrendingUp, Headphones, Users2, UserCheck } from "lucide-react"

export default function AgenticoPage() {
  const router = useRouter()
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState<Array<{ role: string; content: string }>>([])
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<"analysis" | "completed" | "monitoring">("analysis")

  const handleSendMessage = async () => {
    if (!message.trim()) return

    // Add user message
    const newMessages = [...messages, { role: "user", content: message }]
    setMessages(newMessages)
    setMessage("")
    setIsLoading(true)

    // Simulate AI response
    setTimeout(() => {
      setMessages([
        ...newMessages,
        { role: "assistant", content: "Entendido. Estoy procesando tu solicitud. En una versión completa, aquí conectaríamos con un LLM real para procesar tu comando." }
      ])
      setIsLoading(false)
    }, 1000)
  }

  const quickActions = [
    { icon: BarChart3, label: "Ocupación diaria", command: "¿Cuál es la ocupación de hoy?" },
    { icon: Users, label: "Check-ins próximos", command: "Muéstrame los check-ins del próximo día" },
    { icon: Zap, label: "Pedidos pendientes", command: "¿Cuántos pedidos están pendientes?" },
  ]

  const areas = [
    { id: "marketing", name: "Marketing", icon: TrendingUp, active: true },
    { id: "sales", name: "Ventas", icon: BarChart3, active: true },
    { id: "support", name: "Atención al cliente", icon: Headphones, active: false },
    { id: "users", name: "Usuarios", icon: Users2, active: false },
    { id: "staff", name: "Personal", icon: UserCheck, active: true },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header with Boreal Colors */}
      <div className="sticky top-0 z-10 bg-gradient-to-r from-emerald-900 via-blue-900 to-purple-900 border-b border-emerald-700/30 shadow-lg">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.back()}
              className="hover:bg-emerald-800/30 text-emerald-100"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-gradient-to-br from-emerald-500 to-cyan-500 shadow-lg">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-cyan-300 to-blue-300">Modo Agentico</h1>
                <p className="text-xs text-emerald-200/70">Asistente inteligente para tu hotel</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content with Sidebar and Tabs */}
      <div className="h-[calc(100vh-80px)] flex gap-6 p-6">
        {/* Left Sidebar Panel */}
        <div className="w-64 flex flex-col gap-4">
          {/* Daily Summary - Compact KPI Layout */}
          <Card className="p-4 border border-emerald-700/30 bg-gradient-to-br from-slate-900/70 to-slate-800/50 backdrop-blur-sm">
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-emerald-300">
                Hola, <span className="text-cyan-300">Carlos</span>
              </h3>

              <div className="grid grid-cols-3 gap-2">
                {/* Occupancy KPI */}
                <div className="p-2 rounded-lg bg-slate-800/50 border border-red-700/30 text-center hover:bg-red-900/20 transition-colors">
                  <p className="text-xl font-bold text-red-400">-12%</p>
                  <p className="text-xs text-slate-300">Ocupación</p>
                </div>

                {/* Tickets KPI */}
                <div className="p-2 rounded-lg bg-slate-800/50 border border-orange-700/30 text-center hover:bg-orange-900/20 transition-colors">
                  <p className="text-xl font-bold text-orange-400">17</p>
                  <p className="text-xs text-slate-300">Tickets</p>
                </div>

                {/* Reservations KPI */}
                <div className="p-2 rounded-lg bg-slate-800/50 border border-green-700/30 text-center hover:bg-green-900/20 transition-colors">
                  <p className="text-xl font-bold text-green-400">+20%</p>
                  <p className="text-xs text-slate-300">Reservas</p>
                </div>
              </div>

              <p className="text-xs text-emerald-300 font-medium">¿En qué trabajamos hoy?</p>
            </div>
          </Card>

          {/* Agent Hub */}
          <Card className="p-4 border border-purple-700/30 bg-slate-900/50 backdrop-blur-sm flex-1 flex flex-col">
            <h3 className="text-sm font-semibold text-purple-300 mb-3 flex items-center gap-2">
              <Briefcase className="w-4 h-4" />
              Agent Hub
            </h3>
            <div className="space-y-2 flex-1 overflow-y-auto">
              {areas.map((area) => {
                const Icon = area.icon
                return (
                  <button
                    key={area.id}
                    className={`w-full px-3 py-2.5 rounded-lg transition-all flex items-center gap-2.5 text-xs font-medium ${
                      area.active
                        ? "bg-gradient-to-r from-purple-600/40 to-pink-600/40 border border-purple-500/60 text-purple-100 shadow-lg shadow-purple-500/20"
                        : "bg-slate-800/50 border border-slate-700/50 text-slate-300 hover:bg-slate-700/50"
                    }`}
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <span className="flex-1 text-left">{area.name}</span>
                    {area.active && (
                      <div className="w-2 h-2 rounded-full bg-green-400 shadow-lg shadow-green-400/50 animate-pulse"></div>
                    )}
                  </button>
                )
              })}
            </div>
          </Card>
        </div>

        {/* Right Content Area */}
        <div className="flex-1 flex flex-col">
          {/* Tabs Navigation with Continuity */}
          <div className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-0.5 mb-4 flex gap-0.5">
            {[
              { id: "analysis", label: "En Análisis" },
              { id: "completed", label: "Tareas Completadas" },
              { id: "monitoring", label: "Monitoreo" }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as "analysis" | "completed" | "monitoring")}
                className={`flex-1 px-4 py-1.5 text-xs font-medium rounded transition-all ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-emerald-600 to-cyan-600 text-white shadow-lg shadow-emerald-500/20"
                    : "text-slate-300 hover:text-slate-200"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === "analysis" && (
            <div className="flex-1 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { 
                    title: "Análisis de ocupación",
                    icon: "📊",
                    status: "En progreso",
                    summary: "Revisando tasas de ocupación\npor rango horario"
                  },
                  { 
                    title: "Reporte de ingresos",
                    icon: "💰",
                    status: "En progreso",
                    summary: "Calculando ingresos totales\nde la semana actual"
                  },
                  { 
                    title: "Análisis de guests",
                    icon: "👥",
                    status: "En progreso",
                    summary: "Segmentando guests por\nperfiles de estancia"
                  },
                  { 
                    title: "Predicción de demanda",
                    icon: "🔮",
                    status: "En progreso",
                    summary: "Aplicando ML para próximos\n30 días"
                  },
                  { 
                    title: "Análisis de satisfacción",
                    icon: "⭐",
                    status: "En progreso",
                    summary: "Procesando reviews y ratings\nde huéspedes"
                  },
                  { 
                    title: "Optimización precios",
                    icon: "📈",
                    status: "En progreso",
                    summary: "Ajustando tarifas según\nmercado actual"
                  }
                ].map((task, idx) => (
                  <div
                    key={idx}
                    className="aspect-square bg-gradient-to-br from-slate-800 to-slate-900 border border-emerald-700/30 rounded-lg p-4 flex flex-col hover:border-emerald-600/50 hover:shadow-lg hover:shadow-emerald-500/10 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-2xl">{task.icon}</span>
                      <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                    </div>
                    <h3 className="font-semibold text-sm text-slate-100 group-hover:text-emerald-300 transition-colors line-clamp-1">{task.title}</h3>
                    <p className="text-xs text-emerald-400/70 mb-auto">Estado: {task.status}</p>
                    <div className="border-t border-slate-700/50 pt-2 mt-auto">
                      <p className="text-xs text-slate-300 leading-tight">{task.summary}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "completed" && (
            <div className="flex-1 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { 
                    title: "Revisar ocupación semanal",
                    icon: "✅",
                    time: "Hace 2 horas",
                    summary: "Se completó análisis de ocupación\npara toda la semana"
                  },
                  { 
                    title: "Generar reporte de check-ins",
                    icon: "📋",
                    time: "Hace 4 horas",
                    summary: "Reporte generado con datos de\ntodos los check-ins"
                  },
                  { 
                    title: "Análisis de satisfacción",
                    icon: "⭐",
                    time: "Hace 1 día",
                    summary: "Se procesaron 150 reviews\ny se calculó promedio"
                  },
                  { 
                    title: "Optimización de precios",
                    icon: "💲",
                    time: "Hace 2 días",
                    summary: "Tarifas ajustadas según\ndemanda proyectada"
                  },
                  { 
                    title: "Reporte de ingresos",
                    icon: "💰",
                    time: "Hace 3 días",
                    summary: "Ingresos totales calculados\ncon variación mensual"
                  },
                  { 
                    title: "Auditoría de guests",
                    icon: "👤",
                    time: "Hace 1 semana",
                    summary: "Se revisaron 500+ perfiles\ny se segmentaron datos"
                  }
                ].map((task, idx) => (
                  <div
                    key={idx}
                    className="aspect-square bg-gradient-to-br from-slate-800 to-slate-900 border border-green-700/30 rounded-lg p-4 flex flex-col hover:border-green-600/50 hover:shadow-lg hover:shadow-green-500/10 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-2xl">{task.icon}</span>
                      <div className="w-2 h-2 rounded-full bg-green-400"></div>
                    </div>
                    <h3 className="font-semibold text-sm text-slate-100 group-hover:text-green-300 transition-colors line-clamp-1">{task.title}</h3>
                    <p className="text-xs text-green-400/70 mb-auto">{task.time}</p>
                    <div className="border-t border-slate-700/50 pt-2 mt-auto">
                      <p className="text-xs text-slate-300 leading-tight">{task.summary}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "monitoring" && (
            <div className="flex-1 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { 
                    title: "Ocupación actual",
                    icon: "📊",
                    value: "78%",
                    status: "normal",
                    summary: "↓ 12% desde hace una semana\nTendencia: bajando"
                  },
                  { 
                    title: "Check-ins próximos",
                    icon: "📍",
                    value: "5",
                    status: "warning",
                    summary: "Esperados en próximas 2 horas\nHabitaciones: 5 y 7"
                  },
                  { 
                    title: "Tickets abiertos",
                    icon: "🎫",
                    value: "17",
                    status: "alert",
                    summary: "+3 nuevos hoy\n6 sin asignar"
                  },
                  { 
                    title: "Velocidad promedio",
                    icon: "⏱️",
                    value: "45m",
                    status: "normal",
                    summary: "↓ 5 min. respecto a ayer\nMejora: +11%"
                  },
                  { 
                    title: "Revenue en tiempo real",
                    icon: "💵",
                    value: "$2.8K",
                    status: "normal",
                    summary: "Hoy hasta el momento\n↑ $300 proyectado"
                  },
                  { 
                    title: "Satisfacción guests",
                    icon: "😊",
                    value: "4.6/5",
                    status: "normal",
                    summary: "Rating promedio hoy\n94 reviews procesados"
                  }
                ].map((item, idx) => {
                  const statusColors = {
                    alert: "border-red-700/30 bg-red-900/10 hover:border-red-600/50 hover:shadow-red-500/10",
                    warning: "border-orange-700/30 bg-orange-900/10 hover:border-orange-600/50 hover:shadow-orange-500/10",
                    normal: "border-blue-700/30 bg-blue-900/10 hover:border-blue-600/50 hover:shadow-blue-500/10"
                  }
                  const textColors = {
                    alert: "text-red-400",
                    warning: "text-orange-400",
                    normal: "text-blue-400"
                  }
                  return (
                    <div
                      key={idx}
                      className={`aspect-square rounded-lg p-4 flex flex-col hover:shadow-lg transition-all cursor-pointer group border ${statusColors[item.status as keyof typeof statusColors]}`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-2xl">{item.icon}</span>
                      </div>
                      <h3 className="font-semibold text-sm text-slate-100 group-hover:text-slate-50 transition-colors line-clamp-1">{item.title}</h3>
                      <p className={`text-2xl font-bold mb-auto ${textColors[item.status as keyof typeof textColors]}`}>{item.value}</p>
                      <div className="border-t border-slate-700/50 pt-2 mt-auto">
                        <p className="text-xs text-slate-300 leading-tight">{item.summary}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
