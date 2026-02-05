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

      {/* Tabs Section */}
      <div className="border-b border-emerald-700/20 bg-slate-950/50 backdrop-blur-sm">
        <div className="px-6 flex gap-8">
          {[
            { id: "analysis", label: "En Análisis" },
            { id: "completed", label: "Tareas Completadas" },
            { id: "monitoring", label: "Monitoreo" }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as "analysis" | "completed" | "monitoring")}
              className={`py-3 px-1 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? "text-emerald-300 border-emerald-400"
                  : "text-slate-400 border-transparent hover:text-slate-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content with Sidebar */}
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
          {activeTab === "analysis" && (
            <>
              {/* Chat Area for Analysis Tab */}
              <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-md px-4 py-3 rounded-lg ${
                        msg.role === "user"
                          ? "bg-gradient-to-r from-emerald-600 to-cyan-600 text-white rounded-br-none shadow-lg"
                          : "bg-slate-800 text-slate-100 border border-slate-700 rounded-bl-none shadow-lg"
                      }`}
                    >
                      <p className="text-sm">{msg.content}</p>
                    </div>
                  </div>
                ))}
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

              {/* Input Area for Analysis */}
              <div className="border-t border-emerald-700/30 bg-slate-900/80 backdrop-blur-sm p-4 rounded-lg">
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    placeholder="Escribe tu comando aquí... (ej: 'Cuál es la ocupación de hoy?')"
                    className="flex-1 px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    disabled={isLoading}
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!message.trim() || isLoading}
                    className="bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white gap-2 px-6 shadow-lg"
                  >
                    <Send className="w-4 h-4" />
                    Enviar
                  </Button>
                </div>
              </div>
            </>
          )}

          {activeTab === "completed" && (
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-3">
                <h2 className="text-lg font-semibold text-emerald-300 mb-4">Tareas Completadas</h2>
                {[
                  { title: "Revisar ocupación semanal", time: "Hace 2 horas" },
                  { title: "Generar reporte de check-ins", time: "Hace 4 horas" },
                  { title: "Análisis de satisfacción", time: "Hace 1 día" },
                  { title: "Optimización de precios", time: "Hace 2 días" }
                ].map((task, idx) => (
                  <div key={idx} className="p-4 rounded-lg border border-green-700/30 bg-slate-800/50 hover:bg-slate-700/50 transition-colors">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-green-400 mt-2"></div>
                      <div className="flex-1">
                        <p className="text-slate-100 font-medium text-sm">{task.title}</p>
                        <p className="text-slate-400 text-xs mt-1">{task.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "monitoring" && (
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-3">
                <h2 className="text-lg font-semibold text-blue-300 mb-4">Monitoreo en Tiempo Real</h2>
                {[
                  { metric: "Ocupación actual", value: "78%", status: "normal", trend: "↓ 12%" },
                  { metric: "Check-ins esperados", value: "5", status: "warning", trend: "Próximas 2h" },
                  { metric: "Tickets abiertos", value: "17", status: "alert", trend: "+3 hoy" },
                  { metric: "Velocidad promedio", value: "45min", status: "normal", trend: "↓ 5min" }
                ].map((item, idx) => (
                  <div key={idx} className={`p-4 rounded-lg border ${
                    item.status === "alert" ? "border-red-700/30 bg-red-900/10" :
                    item.status === "warning" ? "border-orange-700/30 bg-orange-900/10" :
                    "border-blue-700/30 bg-blue-900/10"
                  }`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-slate-100 font-medium text-sm">{item.metric}</p>
                        <p className="text-slate-400 text-xs mt-1">{item.trend}</p>
                      </div>
                      <p className={`text-2xl font-bold ${
                        item.status === "alert" ? "text-red-400" :
                        item.status === "warning" ? "text-orange-400" :
                        "text-blue-400"
                      }`}>{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
