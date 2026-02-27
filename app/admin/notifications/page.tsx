"use client"

import { DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { useRouter, useParams } from "next/navigation"
import { useSelector } from "react-redux"
import { useState, Suspense } from "react"
import type { RootState } from "@/store/store"
import { useSearchParams } from "next/navigation"
import { ROUTES } from "@/shared/types/routes"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Send, Users, Bell, Zap, Filter, Calendar, MessageSquare, Plus, CheckCircle2, Search, Copy, MoreVertical, Clock } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import Loading from "./loading"

export default function NotificationsPage() {
  const params = useParams()
  const orgId = params?.orgId as string | undefined
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isCreateAutomationOpen, setIsCreateAutomationOpen] = useState(false)
  const [notificationTitle, setNotificationTitle] = useState("")
  const [notificationMessage, setNotificationMessage] = useState("")
  const [segmentType, setSegmentType] = useState("all")
  const [priority, setPriority] = useState("normal")
  const [scheduledDate, setScheduledDate] = useState("")
  const [scheduledTime, setScheduledTime] = useState("")
  const [searchHistoricalNotifications, setSearchHistoricalNotifications] = useState("")
  const [searchNotifications, setSearchNotifications] = useState("")
  const [searchAutomatedNotifications, setSearchAutomatedNotifications] = useState("")
  const [isEditAutomationOpen, setIsEditAutomationOpen] = useState(false)
  const [editingAutomation, setEditingAutomation] = useState(null)
  const [automationName, setAutomationName] = useState("")
  const [automationTrigger, setAutomationTrigger] = useState("")
  const [automationTemplate, setAutomationTemplate] = useState("")
  const searchParams = useSearchParams()
  const router = useRouter()
  const notificationsLogHref = orgId ? ROUTES.NOTIFICATIONS_LOG(orgId) : "/admin/notifications/log"

  // Mock data para notificaciones enviadas
  const sentNotifications = [
    {
      id: 1,
      title: "Bienvenida al Hotel",
      message: "Esperamos que disfrute su estadía",
      segment: "Nuevos huéspedes",
      sent: "20/11/2024 08:30 AM",
      recipients: 12,
      status: "delivered",
    },
    {
      id: 2,
      title: "Evento Especial Esta Noche",
      message: "Cena de gala a las 20:00",
      segment: "Todos los huéspedes",
      sent: "20/11/2024 03:15 PM",
      recipients: 45,
      status: "delivered",
    },
    {
      id: 3,
      title: "Recordatorio de Check-out",
      message: "Recordamos que tu check-out es hoy",
      recipients: 312,
      segment: "Todos",
      sent: "20/11/2024 10:30 AM",
    },
    {
      id: 4,
      title: "Invitación a Evento",
      message: "No te pierdas nuestro evento especial esta noche",
      recipients: 156,
      segment: "VIP",
      sent: "20/11/2024 08:15 AM",
    },
    {
      id: 5,
      title: "Promoción Especial",
      message: "Disfruta de 20% descuento en nuestros servicios",
      recipients: 289,
      segment: "Huéspedes Activos",
      sent: "19/11/2024 03:45 PM",
    },
  ]

  // Mock data para notificaciones automatizadas
  const [automatedNotifications, setAutomatedNotifications] = useState([
    {
      id: 1,
      name: "Bienvenida Check-in",
      trigger: "Al hacer check-in",
      template: "Bienvenido a nuestro hotel. Su habitación es la {room_number}",
      active: true,
      sent: 156,
    },
    {
      id: 2,
      name: "Recordatorio Check-out",
      trigger: "1 día antes del check-out",
      template: "Recordatorio: Su check-out es mañana a las 12:00",
      active: true,
      sent: 142,
    },
    {
      id: 3,
      name: "Encuesta de Satisfacción",
      trigger: "Al hacer check-out",
      template: "Gracias por su estadía. Por favor comparte su experiencia",
      active: true,
      sent: 138,
    },
    {
      id: 4,
      name: "Ofertas Especiales",
      trigger: "Cada viernes 10:00 AM",
      template: "Descubra nuestras ofertas especiales del fin de semana",
      active: false,
      sent: 0,
    },
  ])

  // Mock data para notificaciones históricas
  const historicalNotifications = [
    {
      id: 101,
      date: "21/11/2024",
      time: "14:30",
      title: "Bienvenida Check-in",
      segment: "Nuevos huéspedes",
      recipients: 8,
      status: "delivered",
    },
    {
      id: 102,
      date: "21/11/2024",
      time: "09:15",
      title: "Recordatorio Check-out",
      segment: "Todos",
      recipients: 145,
      status: "delivered",
    },
    {
      id: 103,
      date: "20/11/2024",
      time: "18:45",
      title: "Evento Especial Esta Noche",
      segment: "VIP",
      recipients: 32,
      status: "delivered",
    },
    {
      id: 104,
      date: "20/11/2024",
      time: "10:20",
      title: "Promoción Especial",
      segment: "Huéspedes Activos",
      recipients: 201,
      status: "delivered",
    },
    {
      id: 105,
      date: "19/11/2024",
      time: "15:50",
      title: "Encuesta de Satisfacción",
      segment: "Check-out hoy",
      recipients: 67,
      status: "delivered",
    },
    {
      id: 106,
      date: "19/11/2024",
      time: "08:30",
      title: "Ofertas del Fin de Semana",
      segment: "Todos",
      recipients: 312,
      status: "delivered",
    },
    {
      id: 107,
      date: "18/11/2024",
      time: "20:10",
      title: "Cena de Gala",
      segment: "Reservaciones Activas",
      recipients: 89,
      status: "delivered",
    },
    {
      id: 108,
      date: "18/11/2024",
      time: "11:05",
      title: "Bienvenida Check-in",
      segment: "Nuevos huéspedes",
      recipients: 12,
      status: "delivered",
    },
  ]

  const handleSendNotification = () => {
    console.log("Enviando notificación:", {
      title: notificationTitle,
      message: notificationMessage,
      segment: segmentType,
      priority,
      scheduled: scheduledDate && scheduledTime ? `${scheduledDate} ${scheduledTime}` : null,
    })
    // Reset form and close modal
    setNotificationTitle("")
    setNotificationMessage("")
    setSegmentType("all")
    setPriority("normal")
    setScheduledDate("")
    setScheduledTime("")
    setIsCreateModalOpen(false)
  }

  const toggleAutomatedNotification = (id) => {
    setAutomatedNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, active: !notif.active } : notif)),
    )
  }

  const handleDuplicateNotification = (notification) => {
    setNotificationTitle(notification.title)
    setNotificationMessage(notification.message)
    setSegmentType(notification.segment)
    setIsCreateModalOpen(true)
  }

  const filteredNotifications = sentNotifications.filter((notif) =>
    notif.title.toLowerCase().includes(searchNotifications.toLowerCase()) ||
    notif.message.toLowerCase().includes(searchNotifications.toLowerCase()),
  )

  const handleEditAutomation = (automation) => {
    setEditingAutomation(automation)
    setAutomationName(automation.name)
    setAutomationTrigger(automation.trigger)
    setAutomationTemplate(automation.template)
    setIsEditAutomationOpen(true)
  }

  const handleSaveAutomation = () => {
    if (editingAutomation) {
      setAutomatedNotifications((prev) =>
        prev.map((notif) =>
          notif.id === editingAutomation.id
            ? {
                ...notif,
                name: automationName,
                trigger: automationTrigger,
                template: automationTemplate,
              }
            : notif,
        ),
      )
    }
    setIsEditAutomationOpen(false)
    setEditingAutomation(null)
    setAutomationName("")
    setAutomationTrigger("")
    setAutomationTemplate("")
  }

  const dataSource = useSelector((state: RootState) => state.dataSource.dataSource)
  if (dataSource === "api") {
    return (
      <div className="p-8">
        <Card className="p-6">
          <p className="text-muted-foreground">Datos desde API: esta vista aún no está conectada.</p>
        </Card>
      </div>
    )
  }

  return (
    <Suspense fallback={<Loading />}>
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Gestión de Notificaciones</h1>
            <p className="text-muted-foreground mt-1">
              Envía notificaciones a tus clientes y gestiona campañas automatizadas
            </p>
          </div>
          <Button
            className="gap-2 bg-slate-600 hover:bg-slate-700 text-white"
            onClick={() => router.push(notificationsLogHref)}
          >
            <Clock className="w-4 h-4" />
            Log de Notificaciones
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Notificaciones Recientes */}
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="space-y-4">
              <div className="flex flex-row items-center justify-between">
                <div className="space-y-1">
                  <CardTitle className="flex items-center gap-3">
                    <Bell className="w-7 h-7 text-blue-500" />
                    <span className="text-2xl">Notificaciones Recientes</span>
                  </CardTitle>
                  <CardDescription className="ml-10">Historial de notificaciones enviadas</CardDescription>
                </div>
                <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="gap-2">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        <MessageSquare className="w-5 h-5" />
                        Crear Nueva Notificación
                      </DialogTitle>
                      <DialogDescription>Envía notificaciones personalizadas a tus clientes</DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="title">Título</Label>
                        <Input
                          id="title"
                          placeholder="Ej: Evento especial esta noche"
                          value={notificationTitle}
                          onChange={(e) => setNotificationTitle(e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="message">Mensaje</Label>
                        <Textarea
                          id="message"
                          placeholder="Escribe tu mensaje aquí..."
                          value={notificationMessage}
                          onChange={(e) => setNotificationMessage(e.target.value)}
                          rows={4}
                        />
                        <p className="text-xs text-muted-foreground">{notificationMessage.length}/200 caracteres</p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="segment" className="flex items-center gap-2">
                          <Filter className="w-4 h-4" />
                          Segmentar Audiencia
                        </Label>
                        <Select value={segmentType} onValueChange={setSegmentType}>
                          <SelectTrigger id="segment">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Todos los huéspedes (45)</SelectItem>
                            <SelectItem value="checkin-today">Check-in hoy (12)</SelectItem>
                            <SelectItem value="checkout-tomorrow">Check-out mañana (8)</SelectItem>
                            <SelectItem value="vip">Huéspedes VIP (15)</SelectItem>
                            <SelectItem value="suite">Suites (7)</SelectItem>
                            <SelectItem value="long-stay">Estadía larga (+7 días) (5)</SelectItem>
                            <SelectItem value="event-registered">Registrados en eventos (23)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="priority">Prioridad</Label>
                          <Select value={priority} onValueChange={setPriority}>
                            <SelectTrigger id="priority">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="low">Baja</SelectItem>
                              <SelectItem value="normal">Normal</SelectItem>
                              <SelectItem value="high">Alta</SelectItem>
                              <SelectItem value="urgent">Urgente</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            Programar (opcional)
                          </Label>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" className="w-full bg-transparent">
                                {scheduledDate && scheduledTime ? `${scheduledDate} ${scheduledTime}` : "Enviar ahora"}
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Programar Envío</DialogTitle>
                                <DialogDescription>Selecciona fecha y hora para enviar la notificación</DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                  <Label htmlFor="date">Fecha</Label>
                                  <Input
                                    id="date"
                                    type="date"
                                    value={scheduledDate}
                                    onChange={(e) => setScheduledDate(e.target.value)}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="time">Hora</Label>
                                  <Input
                                    id="time"
                                    type="time"
                                    value={scheduledTime}
                                    onChange={(e) => setScheduledTime(e.target.value)}
                                  />
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </div>

                      <Button
                        onClick={handleSendNotification}
                        className="w-full"
                        disabled={!notificationTitle || !notificationMessage}
                      >
                        <Send className="w-4 h-4 mr-2" />
                        {scheduledDate && scheduledTime ? "Programar Notificación" : "Enviar Ahora"}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar notificaciones..."
                  value={searchNotifications}
                  onChange={(e) => setSearchNotifications(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {filteredNotifications.map((notif) => (
                  <div key={notif.id} className="border border-border rounded-lg p-4 space-y-2">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-foreground">{notif.title}</h4>
                        <p className="text-sm text-muted-foreground mt-1">{notif.message}</p>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size="sm" variant="ghost" className="h-7 w-7 p-0">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Ver detalles</DropdownMenuItem>
                          <DropdownMenuItem>Reenviar</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">Eliminar</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {notif.recipients} destinatarios
                        </span>
                        <span>•</span>
                        <Badge variant="secondary" className="text-xs">
                          {notif.segment}
                        </Badge>
                        <span>•</span>
                        <span>{notif.sent}</span>
                      </div>
                      <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Notificaciones Automatizadas */}
          <Card className="border-l-4 border-l-purple-500">
            <CardHeader className="flex flex-row items-start justify-between">
              <div className="space-y-4 flex-1">
                <div className="space-y-1">
                  <CardTitle className="flex items-center gap-3">
                    <Zap className="w-7 h-7 text-purple-500" />
                    <span className="text-2xl">Notificaciones Automatizadas</span>
                  </CardTitle>
                  <CardDescription className="ml-10">
                    Configura notificaciones que se envían automáticamente según eventos del sistema
                  </CardDescription>
                </div>

                {/* Search Bar */}
                <div className="relative max-w-xs">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar automatización..."
                    value={searchAutomatedNotifications}
                    onChange={(e) => setSearchAutomatedNotifications(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Controls - Top Right */}
              <div className="flex gap-2">
                <Dialog open={isCreateAutomationOpen} onOpenChange={setIsCreateAutomationOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="gap-2 bg-purple-500 hover:bg-purple-600 text-white border-0">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        <Zap className="w-5 h-5" />
                        Crear Nueva Automatización
                      </DialogTitle>
                      <DialogDescription>Configura una notificación automática basada en eventos</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="automation-name">Nombre</Label>
                        <Input id="automation-name" placeholder="Ej: Recordatorio de check-out" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="automation-trigger">Disparador</Label>
                        <Select>
                          <SelectTrigger id="automation-trigger">
                            <SelectValue placeholder="Selecciona un disparador" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="checkin">Al hacer check-in</SelectItem>
                            <SelectItem value="checkout">Al hacer check-out</SelectItem>
                            <SelectItem value="before-checkout">Antes del check-out</SelectItem>
                            <SelectItem value="event-register">Al registrarse en evento</SelectItem>
                            <SelectItem value="scheduled">Programado</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="automation-template">Plantilla</Label>
                        <Textarea id="automation-template" placeholder="Escribe la plantilla..." rows={4} />
                      </div>
                      <Button className="w-full">Crear Automatización</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {automatedNotifications
                  .filter((notif) =>
                    notif.name.toLowerCase().includes(searchAutomatedNotifications.toLowerCase())
                  )
                  .map((notif) => (
                    <div key={notif.id} className="border border-border rounded-lg p-4 space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3 flex-1">
                          <h4 className="font-semibold text-foreground">{notif.name}</h4>
                          <Badge variant={notif.active ? "default" : "secondary"}>
                            {notif.active ? "Activa" : "Inactiva"}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <Switch
                            checked={notif.active}
                            onCheckedChange={() => toggleAutomatedNotification(notif.id)}
                            className="[&>span]:bg-purple-500 data-[state=checked]:bg-purple-600"
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditAutomation(notif)}
                          >
                            Editar
                          </Button>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">
                          <span className="font-medium">Disparador:</span> {notif.trigger}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          <span className="font-medium">Plantilla:</span> {notif.template}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Suspense>
  )
}

// loading.tsx
// export default function Loading() {
//   return null
// }
