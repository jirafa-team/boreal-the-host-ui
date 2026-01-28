"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, CheckCircle2, User, MapPin, ChefHat, Utensils, AlertTriangle, AlertCircle, Grid3x3, Table, ShoppingCart } from "lucide-react"

export default function PedidosPage() {
  const [filter, setFilter] = useState<"all" | "pending" | "preparing" | "delivered">("all")
  const [viewMode, setViewMode] = useState<"kanban" | "list">("kanban")
  const [showNewOrderModal, setShowNewOrderModal] = useState(false)

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
    <>
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-10">
        <div className="px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Pedidos de Room Service</h1>
              <p className="text-sm text-muted-foreground">Gestiona las órdenes de comida a las habitaciones</p>
            </div>
            <div className="flex gap-4 items-center ml-auto">
              {/* View Mode Toggle */}
              <div className="inline-flex h-10 items-center rounded-lg bg-gray-100 p-1 border border-gray-200">
                <button
                  onClick={() => setViewMode("list")}
                  className={`px-5 py-2 rounded-md font-medium text-sm transition-all ${
                    viewMode === "list"
                      ? "text-white shadow-md"
                      : "text-gray-700 hover:text-gray-900"
                  }`}
                  style={viewMode === "list" ? { backgroundColor: "#394a63" } : {}}
                >
                  Lista
                </button>
                <button
                  onClick={() => setViewMode("kanban")}
                  className={`px-5 py-2 rounded-md font-medium text-sm transition-all ${
                    viewMode === "kanban"
                      ? "text-white shadow-md"
                      : "text-gray-700 hover:text-gray-900"
                  }`}
                  style={viewMode === "kanban" ? { backgroundColor: "#394a63" } : {}}
                >
                  Kanban
                </button>
              </div>
              <button 
                onClick={() => setShowNewOrderModal(true)}
                className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-orange-600 to-orange-700 text-white shadow-md hover:shadow-lg transition-all duration-300 hover:scale-110 group relative"
                title="Nuevo pedido"
              >
                <div className="relative flex items-center justify-center">
                  <ShoppingCart className="w-5 h-5" />
                  <span className="absolute text-base font-bold -bottom-0.5 -right-0.5 text-white drop-shadow-lg">+</span>
                </div>
                <span className="absolute top-full mt-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                  Nuevo Pedido
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="p-8 space-y-6">

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div
          className="relative overflow-hidden rounded-lg p-4 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer group"
          style={{
            background: filter === "all" ? "linear-gradient(135deg, rgb(124, 58, 255), rgb(109, 40, 217))" : "white",
            color: filter === "all" ? "white" : "black"
          }}
          onClick={() => setFilter("all")}
        >
          {filter === "all" && (
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-20 h-20 bg-white rounded-full -mr-8 -mt-8"></div>
            </div>
          )}
          <div className="relative flex items-center gap-3">
            <div className={`p-2 rounded-lg ${filter === "all" ? "bg-white/20" : "bg-gray-200"}`}>
              <ShoppingCart className={`w-5 h-5 ${filter === "all" ? "text-white" : "text-gray-700"}`} />
            </div>
            <div>
              <p className={`text-sm ${filter === "all" ? "opacity-90" : "text-muted-foreground"}`}>Todos</p>
              <p className="text-2xl font-bold">{orders.length}</p>
            </div>
          </div>
        </div>
        <div
          className="relative overflow-hidden rounded-lg p-4 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer group"
          style={{
            background: filter === "pending" ? "linear-gradient(135deg, rgb(234, 179, 8), rgb(202, 138, 4))" : "white",
            color: filter === "pending" ? "white" : "black"
          }}
          onClick={() => setFilter("pending")}
        >
          {filter === "pending" && (
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-20 h-20 bg-white rounded-full -mr-8 -mt-8"></div>
            </div>
          )}
          <div className="relative flex items-center gap-3">
            <div className={`p-2 rounded-lg ${filter === "pending" ? "bg-white/20" : "bg-gray-200"}`}>
              <Clock className={`w-5 h-5 ${filter === "pending" ? "text-white" : "text-gray-700"}`} />
            </div>
            <div>
              <p className={`text-sm ${filter === "pending" ? "opacity-90" : "text-muted-foreground"}`}>Pendientes</p>
              <p className="text-2xl font-bold">{orders.filter((o) => o.status === "pending").length}</p>
            </div>
          </div>
        </div>
        <div
          className="relative overflow-hidden rounded-lg p-4 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer group"
          style={{
            background: filter === "preparing" ? "linear-gradient(135deg, rgb(37, 99, 235), rgb(29, 78, 216))" : "white",
            color: filter === "preparing" ? "white" : "black"
          }}
          onClick={() => setFilter("preparing")}
        >
          {filter === "preparing" && (
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-20 h-20 bg-white rounded-full -mr-8 -mt-8"></div>
            </div>
          )}
          <div className="relative flex items-center gap-3">
            <div className={`p-2 rounded-lg ${filter === "preparing" ? "bg-white/20" : "bg-gray-200"}`}>
              <ChefHat className={`w-5 h-5 ${filter === "preparing" ? "text-white" : "text-gray-700"}`} />
            </div>
            <div>
              <p className={`text-sm ${filter === "preparing" ? "opacity-90" : "text-muted-foreground"}`}>En Preparación</p>
              <p className="text-2xl font-bold">{orders.filter((o) => o.status === "preparing").length}</p>
            </div>
          </div>
        </div>
        <div
          className="relative overflow-hidden rounded-lg p-4 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer group"
          style={{
            background: filter === "delivered" ? "linear-gradient(135deg, rgb(34, 197, 94), rgb(22, 163, 74))" : "white",
            color: filter === "delivered" ? "white" : "black"
          }}
          onClick={() => setFilter("delivered")}
        >
          {filter === "delivered" && (
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-20 h-20 bg-white rounded-full -mr-8 -mt-8"></div>
            </div>
          )}
          <div className="relative flex items-center gap-3">
            <div className={`p-2 rounded-lg ${filter === "delivered" ? "bg-white/20" : "bg-gray-200"}`}>
              <CheckCircle2 className={`w-5 h-5 ${filter === "delivered" ? "text-white" : "text-gray-700"}`} />
            </div>
            <div>
              <p className={`text-sm ${filter === "delivered" ? "opacity-90" : "text-muted-foreground"}`}>Entregados</p>
              <p className="text-2xl font-bold">{orders.filter((o) => o.status === "delivered").length}</p>
            </div>
          </div>
        </div>
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

        {/* Orders View - Kanban or List */}
        {viewMode === "kanban" ? (
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
    </>
  )
}
