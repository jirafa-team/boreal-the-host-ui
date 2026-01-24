"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, CheckCircle2, User, MapPin, ChefHat, Utensils, AlertTriangle, AlertCircle, Grid3x3, Table, ShoppingCart } from "lucide-react"

export default function PedidosPage() {
  const [filter, setFilter] = useState<"all" | "pending" | "preparing" | "delivered">("all")
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards")

  const orders = [
    {
      id: "P-2024-001",
      guest: "Carlos García",
      room: "204",
      items: [
        { name: "Club Sandwich", quantity: 1, price: 15.5 },
        { name: "Coca-Cola", quantity: 2, price: 3.0 },
      ],
      total: 18.5,
      status: "preparing",
      orderedAt: "2024-01-13 19:20",
      estimatedDelivery: "19:30 - 19:50",
      delayStatus: "on-time", // on-time, delayed, critical
    },
    {
      id: "P-2024-002",
      guest: "Isabella Von Habsburg",
      room: "501",
      items: [
        { name: "Sushi Platter", quantity: 1, price: 35.0 },
        { name: "Vino Blanco Premium", quantity: 1, price: 45.0 },
      ],
      total: 80.0,
      status: "pending",
      orderedAt: "2024-01-13 20:15",
      estimatedDelivery: "20:45 - 21:05",
      delayStatus: "on-time",
    },
    {
      id: "P-2024-003",
      guest: "Ana Martínez",
      room: "305",
      items: [
        { name: "Caesar Salad", quantity: 1, price: 12.5 },
        { name: "Agua Mineral", quantity: 1, price: 2.5 },
      ],
      total: 15.0,
      status: "delivered",
      orderedAt: "2024-01-13 18:00",
      deliveredAt: "18:25",
      delayStatus: "on-time",
    },
    {
      id: "P-2024-004",
      guest: "Roberto Fernández",
      room: "108",
      items: [
        { name: "Hamburguesa Gourmet", quantity: 2, price: 18.0 },
        { name: "Papas Fritas", quantity: 2, price: 6.0 },
        { name: "Cerveza Artesanal", quantity: 2, price: 8.0 },
      ],
      total: 32.0,
      status: "preparing",
      orderedAt: "2024-01-13 19:45",
      estimatedDelivery: "20:15 - 20:35",
      delayStatus: "delayed",
    },
    {
      id: "P-2024-005",
      guest: "Diego López",
      room: "402",
      items: [
        { name: "Filete Mignon", quantity: 1, price: 42.0 },
        { name: "Vino Tinto", quantity: 1, price: 38.0 },
      ],
      total: 80.0,
      status: "preparing",
      orderedAt: "2024-01-13 19:10",
      estimatedDelivery: "19:45 - 20:05",
      delayStatus: "critical",
    },
  ]

  const filteredOrders = filter === "all" ? orders : orders.filter((o) => o.status === filter)

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: "Pendiente", badgeClass: "bg-gray-600 text-white", bgColor: "bg-yellow-50" },
      preparing: { label: "En Preparación", badgeClass: "bg-yellow-600 text-white", bgColor: "bg-blue-50" },
      delivered: { label: "Entregado", badgeClass: "bg-green-700 text-white", bgColor: "bg-green-50" },
    }
    return statusConfig[status as keyof typeof statusConfig] || statusConfig.pending
  }

  const getDelayIndicator = (delayStatus: string) => {
    if (delayStatus === "delayed") {
      return {
        icon: AlertTriangle,
        color: "text-orange-600",
        bgColor: "bg-orange-50",
        borderColor: "border-orange-200",
        label: "Retrasado",
      }
    }
    if (delayStatus === "critical") {
      return {
        icon: AlertCircle,
        color: "text-red-600",
        bgColor: "bg-red-50",
        borderColor: "border-red-200",
        label: "Muy retrasado",
      }
    }
    return null
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Pedidos de Room Service</h1>
          <p className="text-muted-foreground">Gestiona las órdenes de comida a las habitaciones</p>
        </div>
        <button 
          className="relative group w-10 h-10 rounded-full bg-primary hover:bg-primary/90 text-white flex items-center justify-center transition-all shadow-md hover:shadow-lg"
          title="Nuevo pedido"
        >
          <ShoppingCart className="w-5 h-5" />
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-gray-900 text-white text-xs rounded pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            Nuevo Pedido
          </div>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card
          className="p-4 cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => setFilter("pending")}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-500/10 rounded-lg">
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Pendientes</p>
              <p className="text-2xl font-bold">{orders.filter((o) => o.status === "pending").length}</p>
            </div>
          </div>
        </Card>
        <Card
          className="p-4 cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => setFilter("preparing")}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <ChefHat className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">En Preparación</p>
              <p className="text-2xl font-bold">{orders.filter((o) => o.status === "preparing").length}</p>
            </div>
          </div>
        </Card>
        <Card
          className="p-4 cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => setFilter("delivered")}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-500/10 rounded-lg">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Entregados Hoy</p>
              <p className="text-2xl font-bold">{orders.filter((o) => o.status === "delivered").length}</p>
            </div>
          </div>
        </Card>
        <Card
          className="p-4 cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => setFilter("all")}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500/10 rounded-lg">
              <Utensils className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Ingresos Hoy</p>
              <p className="text-2xl font-bold">€{orders.reduce((sum, o) => sum + o.total, 0).toFixed(2)}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* View Mode Switcher */}
      <div className="flex gap-2">
        <Button variant={filter === "all" ? "default" : "outline"} onClick={() => setFilter("all")}>
          Todos
        </Button>
        <Button variant={filter === "pending" ? "default" : "outline"} onClick={() => setFilter("pending")}>
          Pendientes
        </Button>
        <Button variant={filter === "preparing" ? "default" : "outline"} onClick={() => setFilter("preparing")}>
          En Preparación
        </Button>
        <Button variant={filter === "delivered" ? "default" : "outline"} onClick={() => setFilter("delivered")}>
          Entregados
        </Button>
      </div>

      {/* Orders View - Cards or Table */}
      {viewMode === "cards" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredOrders.map((order) => {
            const statusBadge = getStatusBadge(order.status)
            const delayIndicator = getDelayIndicator(order.delayStatus)
            const DelayIcon = delayIndicator?.icon

            return (
              <Card
                key={order.id}
                className={`p-6 border-0 ${statusBadge.bgColor}`}
              >
                <div className="space-y-4">
                  {/* Header with status top-right and estimated time below */}
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-lg font-semibold">Pedido #{order.id}</h3>
                    <div className="flex flex-col items-end gap-2">
                      <Badge className={statusBadge.badgeClass}>
                        {statusBadge.label}
                      </Badge>
                      {order.status !== "delivered" && (
                        <Badge className="bg-purple-800 text-white text-xs gap-1.5">
                          <Clock className="w-3.5 h-3.5" />
                          {order.estimatedDelivery}
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Delay indicator if needed */}
                  {delayIndicator && DelayIcon && (
                    <div className={`p-2 rounded-lg flex items-center gap-2 ${delayIndicator.bgColor} border ${delayIndicator.borderColor}`}>
                      <DelayIcon className={`w-4 h-4 ${delayIndicator.color}`} />
                      <span className={`text-sm font-medium ${delayIndicator.color}`}>{delayIndicator.label}</span>
                    </div>
                  )}

                  {/* Order info */}
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <span>{order.guest}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span>Habitación {order.room}</span>
                    </div>
                  </div>

                  {/* Items */}
                  <div className="bg-white/50 rounded-lg p-3 text-sm">
                    <h4 className="font-semibold mb-2">Items:</h4>
                    <div className="space-y-1">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between">
                          <span>
                            {item.quantity}x {item.name}
                          </span>
                          <span className="font-medium">€{(item.quantity * item.price).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                    <div className="border-t pt-2 mt-2 flex justify-between font-semibold">
                      <span>Total</span>
                      <span>€{order.total.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Delivered info */}
                  {order.status === "delivered" && (
                    <div className="text-sm text-green-600 flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" />
                      Entregado a las {order.deliveredAt}
                    </div>
                  )}

                  {/* Action buttons */}
                  <div className="flex gap-2">
                    {order.status === "pending" && (
                      <Button size="sm" variant="default" className="flex-1">
                        Iniciar Preparación
                      </Button>
                    )}
                    {order.status === "preparing" && (
                      <Button size="sm" variant="default" className="flex-1">
                        Marcar Entregado
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      ) : (
        /* Table View */
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-muted border-b">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold">Pedido</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Cliente</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Habitación</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Estado</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Entrega</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Total</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredOrders.map((order) => {
                const statusBadge = getStatusBadge(order.status)
                const delayIndicator = getDelayIndicator(order.delayStatus)

                return (
                  <tr key={order.id} className="hover:bg-muted/50">
                    <td className="px-4 py-3 text-sm font-medium">{order.id}</td>
                    <td className="px-4 py-3 text-sm">{order.guest}</td>
                    <td className="px-4 py-3 text-sm">{order.room}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Badge className={statusBadge.badgeClass}>
                          {statusBadge.label}
                        </Badge>
                        {delayIndicator && (
                          <span className={`text-xs font-medium ${delayIndicator.color}`}>
                            {delayIndicator.icon === AlertTriangle ? "⚠️" : "🔴"} {delayIndicator.label}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {order.status !== "delivered" ? order.estimatedDelivery : `Entregado ${order.deliveredAt}`}
                    </td>
                    <td className="px-4 py-3 text-sm font-medium">€{order.total.toFixed(2)}</td>
                    <td className="px-4 py-3">
                      {order.status === "pending" && (
                        <Button size="sm" variant="outline">
                          Preparar
                        </Button>
                      )}
                      {order.status === "preparing" && (
                        <Button size="sm" variant="outline">
                          Entregar
                        </Button>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
