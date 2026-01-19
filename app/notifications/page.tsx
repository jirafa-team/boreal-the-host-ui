"use client"

import type React from "react"

import { useState } from "react"
import { ArrowLeft, Send, Users, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface Notification {
  id: string
  title: string
  message: string
  target: "all" | "guests" | "event"
  timestamp: string
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      title: "Bienvenida",
      message: "Bienvenidos a nuestro hotel. Estamos aquí para servirles.",
      target: "all",
      timestamp: "2024-03-10T10:00:00",
    },
    {
      id: "2",
      title: "Evento esta noche",
      message: "Recordatorio: Cena de gala a las 20:00 en el restaurante principal.",
      target: "event",
      timestamp: "2024-03-10T14:30:00",
    },
  ])
  const [formData, setFormData] = useState({
    title: "",
    message: "",
    target: "all" as "all" | "guests" | "event",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newNotification: Notification = {
      id: Date.now().toString(),
      title: formData.title,
      message: formData.message,
      target: formData.target,
      timestamp: new Date().toISOString(),
    }
    setNotifications([newNotification, ...notifications])
    setFormData({ title: "", message: "", target: "all" })
  }

  const getTargetLabel = (target: string) => {
    switch (target) {
      case "all":
        return "Todos los clientes"
      case "guests":
        return "Huéspedes del hotel"
      case "event":
        return "Asistentes a eventos"
      default:
        return "Desconocido"
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card border-b border-border">
        <div className="px-4 py-3 flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => window.history.back()}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-lg font-semibold text-foreground">Notificaciones</h1>
            <p className="text-xs text-muted-foreground">Comunícate con tus clientes</p>
          </div>
        </div>
      </header>

      {/* Send Form */}
      <div className="p-4 bg-muted border-b border-border">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title" className="text-sm text-foreground">
              Título
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Ej: Actualización importante"
              required
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="message" className="text-sm text-foreground">
              Mensaje
            </Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Escribe tu mensaje aquí..."
              required
              rows={4}
              className="mt-1"
            />
          </div>
          <div>
            <Label className="text-sm text-foreground mb-2 block">Destinatarios</Label>
            <div className="grid gap-2">
              <Button
                type="button"
                variant={formData.target === "all" ? "default" : "outline"}
                className="justify-start"
                onClick={() => setFormData({ ...formData, target: "all" })}
              >
                <Users className="w-4 h-4 mr-2" />
                Todos los clientes
              </Button>
              <Button
                type="button"
                variant={formData.target === "guests" ? "default" : "outline"}
                className="justify-start"
                onClick={() => setFormData({ ...formData, target: "guests" })}
              >
                <User className="w-4 h-4 mr-2" />
                Solo huéspedes del hotel
              </Button>
              <Button
                type="button"
                variant={formData.target === "event" ? "default" : "outline"}
                className="justify-start"
                onClick={() => setFormData({ ...formData, target: "event" })}
              >
                <Users className="w-4 h-4 mr-2" />
                Asistentes a eventos
              </Button>
            </div>
          </div>
          <Button type="submit" className="w-full">
            <Send className="w-4 h-4 mr-2" />
            Enviar Notificación
          </Button>
        </form>
      </div>

      {/* Notifications History */}
      <div className="p-4">
        <h2 className="text-base font-semibold text-foreground mb-3">Historial de Notificaciones</h2>
        <div className="space-y-3">
          {notifications.map((notification) => (
            <Card key={notification.id} className="p-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-foreground">{notification.title}</h3>
                <span className="text-xs text-muted-foreground">
                  {new Date(notification.timestamp).toLocaleDateString("es-ES", {
                    day: "numeric",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mb-3">{notification.message}</p>
              <div className="flex items-center gap-2 pt-3 border-t border-border">
                <Users className="w-4 h-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">{getTargetLabel(notification.target)}</span>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
