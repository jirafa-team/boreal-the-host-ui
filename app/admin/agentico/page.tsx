"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, Bot, Send, History, MessageSquare, Settings, Zap, BarChart3, Users, Briefcase, TrendingUp, Headphones, Users2, UserCheck, CheckCircle, Clock, ChevronUp, ChevronDown } from "lucide-react"

export default function AgenticoPage() {
  const router = useRouter()
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState<Array<{ role: string; content: string }>>([])
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<"analysis" | "completed" | "monitoring">("analysis")
  const [chatExpanded, setChatExpanded] = useState(false)

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
      <div className={`h-[calc(100vh-80px)] flex gap-6 p-6 transition-all duration-300 ${chatExpanded ? "relative" : ""}`}>
        {/* Left Sidebar Panel - Hidden when chat expanded */}
        {!chatExpanded && (
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
        )}

        {/* Right Content Area */}
        <div className={`flex flex-col ${chatExpanded ? "flex-1" : "flex-1"}`}>
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
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {[
                  { 
                    title: "Análisis de ocupación",
                    icon: "📊",
                    status: "En progreso",
                    summary: "Revisando tasas\npor hora"
                  },
                  { 
                    title: "Reporte de ingresos",
                    icon: "💰",
                    status: "En progreso",
                    summary: "Cálculo semanal\nen progreso"
                  },
                  { 
                    title: "Análisis de guests",
                    icon: "👥",
                    status: "En progreso",
                    summary: "Segmentación\npor perfil"
                  },
                  { 
                    title: "Predicción demanda",
                    icon: "🔮",
                    status: "En progreso",
                    summary: "ML próximos\n30 días"
                  },
                  { 
                    title: "Satisfacción",
                    icon: "⭐",
                    status: "En progreso",
                    summary: "Reviews y ratings\nen proceso"
                  },
                  { 
                    title: "Optimización",
                    icon: "📈",
                    status: "En progreso",
                    summary: "Ajuste de tarifas\nactualizado"
                  },
                  { 
                    title: "Tendencias",
                    icon: "📉",
                    status: "En progreso",
                    summary: "Análisis histórico\ncomparativo"
                  },
                  { 
                    title: "Segmentación",
                    icon: "🎯",
                    status: "En progreso",
                    summary: "Clasificación\nde huéspedes"
                  }
                ].map((task, idx) => (
                  <div
                    key={idx}
                    className="bg-gradient-to-br from-slate-800 to-slate-900 border border-emerald-700/30 rounded-lg p-3 flex flex-col hover:border-emerald-600/50 hover:shadow-lg hover:shadow-emerald-500/10 transition-all cursor-pointer group min-h-32"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-lg">{task.icon}</span>
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div>
                    </div>
                    <h3 className="font-semibold text-xs text-slate-100 group-hover:text-emerald-300 transition-colors line-clamp-1">{task.title}</h3>
                    <p className="text-xs text-emerald-400/70 mb-auto text-[10px]">En progreso</p>
                    <div className="border-t border-slate-700/50 pt-1.5 mt-auto">
                      <p className="text-xs text-slate-300 leading-tight line-clamp-2">{task.summary}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "completed" && (
            <div className="flex-1 overflow-y-auto space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Pie Chart Panel */}
                <Card className="p-4 border border-green-700/30 bg-slate-800/50 lg:col-span-1">
                  <h3 className="text-sm font-semibold text-green-300 mb-3">Distribución de Tareas</h3>
                  <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                      <Pie
                        data={[
                          { name: "Análisis", value: 40 },
                          { name: "Reportes", value: 25 },
                          { name: "Optimización", value: 20 },
                          { name: "Auditoría", value: 15 }
                        ]}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        <Cell fill="#10b981" />
                        <Cell fill="#34d399" />
                        <Cell fill="#6ee7b7" />
                        <Cell fill="#a7f3d0" />
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #10b981" }} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="text-xs text-slate-400 mt-2 space-y-1">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>Análisis: 40%
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-500"></div>Reportes: 25%
                    </div>
                  </div>
                </Card>

                {/* Data Table Panel */}
                <Card className="p-4 border border-green-700/30 bg-slate-800/50 lg:col-span-2 overflow-hidden">
                  <h3 className="text-sm font-semibold text-green-300 mb-3">Tareas Completadas Recientemente</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b border-green-700/20">
                          <th className="px-3 py-2 text-left text-slate-400">Tarea</th>
                          <th className="px-3 py-2 text-left text-slate-400">Completada</th>
                          <th className="px-3 py-2 text-left text-slate-400">Duración</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { title: "Revisar ocupación semanal", time: "Hace 2 horas", duration: "45 min" },
                          { title: "Generar reporte de check-ins", time: "Hace 4 horas", duration: "30 min" },
                          { title: "Análisis de satisfacción", time: "Hace 1 día", duration: "2h 15min" },
                          { title: "Optimización de precios", time: "Hace 2 días", duration: "1h 30min" },
                          { title: "Reporte de ingresos", time: "Hace 3 días", duration: "1h 20min" },
                          { title: "Auditoría de guests", time: "Hace 1 semana", duration: "4h 45min" }
                        ].map((task, idx) => (
                          <tr key={idx} className="border-b border-slate-700/20 hover:bg-slate-700/30 transition-colors">
                            <td className="px-3 py-2 text-slate-100">{task.title}</td>
                            <td className="px-3 py-2 text-slate-400">{task.time}</td>
                            <td className="px-3 py-2 text-slate-400">{task.duration}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>
              </div>

              {/* Results Summary Panel */}
              <Card className="p-6 border border-green-700/30 bg-gradient-to-br from-slate-800/50 to-slate-900/50">
                <h3 className="text-sm font-semibold text-green-300 mb-4">Resumen de Resultados</h3>
                <div className="space-y-3 text-sm text-slate-200">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-400 mt-1.5 flex-shrink-0"></div>
                    <div>
                      <p className="font-medium">Análisis Completados</p>
                      <p className="text-slate-400">Se revisaron 6 análisis principales sobre ocupación, ingresos y satisfacción de huéspedes. Los datos mostran una tendencia positiva en reservas para julio con un incremento del 20%.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0"></div>
                    <div>
                      <p className="font-medium">Reportes Generados</p>
                      <p className="text-slate-400">Se generaron reportes de check-ins con datos consolidados. Se identificaron 5 check-ins próximos en las siguientes 2 horas en las habitaciones 5 y 7.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-teal-400 mt-1.5 flex-shrink-0"></div>
                    <div>
                      <p className="font-medium">Optimizaciones Realizadas</p>
                      <p className="text-slate-400">Se ajustaron tarifas según la demanda proyectada. La ocupación actual está en 78%, con una baja del 12% desde la semana pasada. Se recomiendan estrategias de promoción.</p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {activeTab === "monitoring" && (
            <div className="flex-1 overflow-y-auto space-y-4">
              {/* Occupancy Chart */}
              <Card className="p-4 border border-blue-700/30 bg-slate-800/50">
                <h3 className="text-sm font-semibold text-blue-300 mb-3">Ocupación por Hora</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={[
                    { time: "00:00", value: 45 },
                    { time: "04:00", value: 38 },
                    { time: "08:00", value: 62 },
                    { time: "12:00", value: 78 },
                    { time: "16:00", value: 85 },
                    { time: "20:00", value: 92 },
                    { time: "23:00", value: 78 }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="time" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #0f766e" }} />
                    <Line type="monotone" dataKey="value" stroke="#06b6d4" strokeWidth={2} dot={{ fill: "#06b6d4", r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </Card>

              {/* Performance Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { label: "Ocupación", value: "78%", color: "text-blue-400" },
                  { label: "Check-ins", value: "5", color: "text-orange-400" },
                  { label: "Tickets", value: "17", color: "text-red-400" },
                  { label: "Velocidad", value: "45m", color: "text-green-400" }
                ].map((metric, idx) => (
                  <div key={idx} className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-3">
                    <p className="text-xs text-slate-400">{metric.label}</p>
                    <p className={`text-2xl font-bold ${metric.color} mt-1`}>{metric.value}</p>
                  </div>
                ))}
              </div>

              {/* Revenue Chart */}
              <Card className="p-4 border border-green-700/30 bg-slate-800/50">
                <h3 className="text-sm font-semibold text-green-300 mb-3">Ingresos Diarios</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={[
                    { day: "Lun", revenue: 2400 },
                    { day: "Mar", revenue: 2210 },
                    { day: "Mié", revenue: 2290 },
                    { day: "Jue", revenue: 2800 },
                    { day: "Vie", revenue: 3200 },
                    { day: "Sab", revenue: 3800 },
                    { day: "Dom", revenue: 2800 }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="day" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #16a34a" }} />
                    <Bar dataKey="revenue" fill="#22c55e" />
                  </BarChart>
                </ResponsiveContainer>
              </Card>

              {/* Status Table */}
              <Card className="p-4 border border-slate-700/30 bg-slate-800/50 overflow-hidden">
                <h3 className="text-sm font-semibold text-slate-300 mb-3">Estado de Sistemas</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-slate-700/30">
                        <th className="px-3 py-2 text-left text-slate-400">Sistema</th>
                        <th className="px-3 py-2 text-left text-slate-400">Estado</th>
                        <th className="px-3 py-2 text-left text-slate-400">Última actualización</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { system: "API Principal", status: "Online", time: "Hace 1min" },
                        { system: "Base de datos", status: "Online", time: "Hace 2min" },
                        { system: "Reservas", status: "Online", time: "Hace 5min" },
                        { system: "Reportes", status: "Online", time: "Hace 10min" }
                      ].map((item, idx) => (
                        <tr key={idx} className="border-b border-slate-700/20 hover:bg-slate-700/30">
                          <td className="px-3 py-2 text-slate-100">{item.system}</td>
                          <td className="px-3 py-2">
                            <span className="inline-flex items-center gap-1 text-green-400">
                              <div className="w-2 h-2 rounded-full bg-green-400"></div>
                              {item.status}
                            </span>
                          </td>
                          <td className="px-3 py-2 text-slate-400">{item.time}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
          )}
        </div>

        {/* Agent Input - Fixed at bottom, spans all tabs */}
        <div className="absolute bottom-0 right-0 left-80 p-6 bg-gradient-to-t from-slate-950 via-slate-950/90 to-transparent border-t border-emerald-700/20">
          <div className="flex gap-3 items-center">
            <button
              onClick={() => setChatExpanded(!chatExpanded)}
              className="flex-shrink-0 p-2 rounded-lg bg-slate-800/50 border border-slate-700/50 text-slate-300 hover:bg-slate-700/50 hover:text-emerald-300 transition-all"
              title={chatExpanded ? "Cerrar chat" : "Expandir chat"}
            >
              {chatExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
            </button>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="Ingresa instrucciones al agente..."
              className="flex-1 px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              disabled={isLoading}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!message.trim() || isLoading}
              className="bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white gap-2 px-6 shadow-lg flex-shrink-0"
            >
              <Send className="w-4 h-4" />
              Enviar
            </Button>
          </div>
        </div>

        {/* Chat Expanded View */}
        {chatExpanded && (
          <div className="fixed inset-0 top-20 bg-slate-950/95 backdrop-blur-sm z-40 flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-emerald-700/20">
              <h2 className="text-lg font-semibold text-emerald-300">Conversación</h2>
              <button
                onClick={() => setChatExpanded(false)}
                className="p-2 rounded-lg bg-slate-800/50 border border-slate-700/50 text-slate-300 hover:bg-slate-700/50 transition-all"
              >
                <ChevronDown className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.length === 0 ? (
                <div className="flex items-center justify-center h-full text-slate-400">
                  <p>Sin mensajes aún. Comienza a escribir instrucciones al agente.</p>
                </div>
              ) : (
                messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-2xl px-4 py-3 rounded-lg ${
                        msg.role === "user"
                          ? "bg-gradient-to-r from-emerald-600 to-cyan-600 text-white rounded-br-none shadow-lg"
                          : "bg-slate-800 text-slate-100 border border-slate-700 rounded-bl-none shadow-lg"
                      }`}
                    >
                      <p className="text-sm">{msg.content}</p>
                    </div>
                  </div>
                ))
              )}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-slate-800 border border-slate-700 text-slate-100 px-4 py-3 rounded-lg rounded-bl-none shadow-lg">
                    <div className="flex gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: "0ms" }}></div>
                      <div className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: "150ms" }}></div>
                      <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: "300ms" }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
