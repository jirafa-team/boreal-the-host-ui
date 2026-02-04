"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, Bot, Zap, Brain, MessageCircle, Send } from "lucide-react"

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

      {/* Main Content */}
      <div className="max-w-4xl mx-auto h-[calc(100vh-80px)] flex flex-col">
        {/* Features Info */}
        {messages.length === 1 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6">
            <Card className="p-4 border border-emerald-700/30 bg-slate-900/50 backdrop-blur-sm hover:bg-slate-800/50 hover:border-emerald-600/50 transition-all">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-emerald-900/50">
                  <Zap className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-emerald-100">Acciones Rápidas</h3>
                  <p className="text-sm text-slate-300 mt-1">Ejecuta comandos y automatiza tareas</p>
                </div>
              </div>
            </Card>

            <Card className="p-4 border border-blue-700/30 bg-slate-900/50 backdrop-blur-sm hover:bg-slate-800/50 hover:border-blue-600/50 transition-all">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-blue-900/50">
                  <Brain className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-blue-100">Análisis Inteligente</h3>
                  <p className="text-sm text-slate-300 mt-1">Obtén insights sobre tu negocio</p>
                </div>
              </div>
            </Card>

            <Card className="p-4 border border-purple-700/30 bg-slate-900/50 backdrop-blur-sm hover:bg-slate-800/50 hover:border-purple-600/50 transition-all">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-purple-900/50">
                  <MessageCircle className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-purple-100">Conversación Natural</h3>
                  <p className="text-sm text-slate-300 mt-1">Comunícate en lenguaje natural</p>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
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
        <div className="border-t border-emerald-700/30 bg-slate-900/80 backdrop-blur-sm p-6">
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
  )
}
