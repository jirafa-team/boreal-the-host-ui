"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, Bot, Send, History, MessageSquare, Settings, Zap, BarChart3, Users } from "lucide-react"

export default function AgenticoPage() {
  const router = useRouter()
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState<Array<{ role: string; content: string }>>([
    { role: "assistant", content: "Hola, soy tu asistente agentico. ¿Cómo puedo ayudarte hoy?" }
  ])
  const [isLoading, setIsLoading] = useState(false)

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

      {/* Main Content with Sidebar */}
      <div className="h-[calc(100vh-80px)] flex gap-6 p-6">
        {/* Left Sidebar Panel */}
        <div className="w-64 flex flex-col gap-4">
          {/* Quick Actions */}
          <Card className="p-4 border border-emerald-700/30 bg-slate-900/50 backdrop-blur-sm">
            <h3 className="text-sm font-semibold text-emerald-300 mb-3 flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Acciones Rápidas
            </h3>
            <div className="space-y-2">
              {quickActions.map((action, idx) => {
                const Icon = action.icon
                return (
                  <button
                    key={idx}
                    onClick={() => {
                      setMessage(action.command)
                      setTimeout(() => {
                        const newMessages = [...messages, { role: "user", content: action.command }]
                        setMessages(newMessages)
                        setIsLoading(true)
                        setTimeout(() => {
                          setMessages([
                            ...newMessages,
                            { role: "assistant", content: "Procesando tu solicitud..." }
                          ])
                          setIsLoading(false)
                        }, 1000)
                      }, 100)
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg bg-slate-800/50 hover:bg-emerald-600/20 border border-slate-700/50 hover:border-emerald-600/50 text-slate-200 hover:text-emerald-200 transition-all text-xs flex items-center gap-2"
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {action.label}
                  </button>
                )
              })}
            </div>
          </Card>

          {/* Historial */}
          <Card className="p-4 border border-blue-700/30 bg-slate-900/50 backdrop-blur-sm flex-1 flex flex-col">
            <h3 className="text-sm font-semibold text-blue-300 mb-3 flex items-center gap-2">
              <History className="w-4 h-4" />
              Historial
            </h3>
            <div className="space-y-2 flex-1 overflow-y-auto">
              <div className="px-3 py-2 rounded-lg bg-slate-800/50 border border-slate-700/50 text-slate-300 text-xs hover:bg-blue-600/20 cursor-pointer transition-all">
                Consulta de ocupación
              </div>
              <div className="px-3 py-2 rounded-lg bg-slate-800/50 border border-slate-700/50 text-slate-300 text-xs hover:bg-blue-600/20 cursor-pointer transition-all">
                Reporte de check-ins
              </div>
              <div className="px-3 py-2 rounded-lg bg-slate-800/50 border border-slate-700/50 text-slate-300 text-xs hover:bg-blue-600/20 cursor-pointer transition-all">
                Análisis de pedidos
              </div>
            </div>
          </Card>

          {/* Settings */}
          <Card className="p-4 border border-purple-700/30 bg-slate-900/50 backdrop-blur-sm">
            <button className="w-full flex items-center gap-2 text-purple-300 hover:text-purple-200 transition-colors text-sm">
              <Settings className="w-4 h-4" />
              Configuración
            </button>
          </Card>
        </div>

        {/* Right Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Chat Area */}
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

          {/* Input Area */}
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
        </div>
      </div>
    </div>
  )
}
