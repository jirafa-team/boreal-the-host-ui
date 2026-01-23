'use client'

import { ArrowLeft, Clock, Search, MoreVertical, CheckCircle2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

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

const Loading = () => null;

export default function NotificationLogPage() {
  const router = useRouter()
  const [searchHistoricalNotifications, setSearchHistoricalNotifications] = useState("")
  const searchParams = useSearchParams();

  return (
    <Suspense fallback={<Loading />}>
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Histórico de Notificaciones</h1>
            <p className="text-muted-foreground mt-1">
              Log completo de todas las notificaciones enviadas
            </p>
          </div>
        </div>

        {/* Table Card */}
        <Card>
          <CardHeader>
            <div className="relative max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar notificación..."
                value={searchHistoricalNotifications}
                onChange={(e) => setSearchHistoricalNotifications(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader className="bg-muted">
                  <TableRow>
                    <TableHead className="font-semibold">Fecha y Hora</TableHead>
                    <TableHead className="font-semibold">Título</TableHead>
                    <TableHead className="font-semibold">Segmento</TableHead>
                    <TableHead className="font-semibold text-right">Destinatarios</TableHead>
                    <TableHead className="font-semibold text-center">Estado</TableHead>
                    <TableHead className="w-10"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {historicalNotifications
                    .filter((notif) =>
                      notif.title.toLowerCase().includes(searchHistoricalNotifications.toLowerCase()) ||
                      notif.segment.toLowerCase().includes(searchHistoricalNotifications.toLowerCase())
                    )
                    .map((notif) => (
                      <TableRow key={notif.id} className="hover:bg-muted/50">
                        <TableCell className="text-sm">
                          <div className="space-y-0.5">
                            <p className="font-medium">{notif.date}</p>
                            <p className="text-xs text-muted-foreground">{notif.time}</p>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm font-medium">{notif.title}</TableCell>
                        <TableCell className="text-sm">{notif.segment}</TableCell>
                        <TableCell className="text-sm text-right font-medium">{notif.recipients}</TableCell>
                        <TableCell className="text-center">
                          <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            Enviada
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button size="sm" variant="ghost" className="h-7 w-7 p-0">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>Ver detalles</DropdownMenuItem>
                              <DropdownMenuItem>Duplicar</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive">Eliminar</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>
            {historicalNotifications.filter((notif) =>
              notif.title.toLowerCase().includes(searchHistoricalNotifications.toLowerCase()) ||
              notif.segment.toLowerCase().includes(searchHistoricalNotifications.toLowerCase())
            ).length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No se encontraron notificaciones
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Suspense>
  )
}
