"use client"

import React, { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ROUTES } from "@/shared/types/routes"
import {
  Search,
  Filter,
  UserCircle,
  Calendar,
  CreditCard,
  MoreVertical,
  Edit,
  Trash2,
  Clock,
  CheckCircle2,
  XCircle,
  ChevronDown,
  ChevronRight,
  UserPlus,
  Users,
  History,
  LogOut,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import type { Client, ClientStatus } from "./types"

type TFunction = (key: string) => string

export type NewClientForm = {
  name: string
  email: string
  phone: string
  room: string
  checkIn: string
  checkOut: string
  roomType: "standard" | "deluxe" | "premium"
  status: "active" | "checkout"
  nationality: string
  category?: "Basic" | "Preferred" | "Elite" | "VIP"
  notes?: string
}

export type ClientsViewProps = {
  filteredClients: Client[]
  clients: Client[]
  searchTerm: string
  onSearchTermChange: (value: string) => void
  statusFilter: string
  onStatusFilterChange: (value: string) => void
  activeTab: "current" | "historical"
  onActiveTabChange: (tab: "current" | "historical") => void
  clientsFilter: "all" | "active" | "checkout" | "vip"
  onClientsFilterChange: (filter: "all" | "active" | "checkout" | "vip") => void
  expandedClient: string | null
  onToggleExpanded: (clientId: string) => void
  showNewClientModal: boolean
  setShowNewClientModal: (open: boolean) => void
  newClient: NewClientForm
  setNewClient: (updater: (prev: NewClientForm) => NewClientForm) => void
  onAddClient: () => void
  orgId: string | undefined
  t: TFunction
  isLoading?: boolean
  error?: unknown
}

function formatDate(iso: string): string {
  if (!iso || iso === "-") return "-"
  const parts = iso.split("-")
  if (parts.length !== 3) return iso
  return `${parts[2]}/${parts[1]}/${parts[0]}`
}

function displaySpent(value: number | string): string {
  if (value === "-" || value === undefined || value === null) return "-"
  if (typeof value === "number") return `$${value}`
  return String(value)
}

function displayGuests(value: number | string): string {
  if (value === "-" || value === undefined || value === null) return "-"
  return String(value)
}

export function ClientsView({
  filteredClients,
  clients,
  searchTerm,
  onSearchTermChange,
  statusFilter,
  onStatusFilterChange,
  activeTab,
  onActiveTabChange,
  clientsFilter,
  onClientsFilterChange,
  expandedClient,
  onToggleExpanded,
  showNewClientModal,
  setShowNewClientModal,
  newClient,
  setNewClient,
  onAddClient,
  orgId,
  t,
  isLoading,
  error,
}: ClientsViewProps) {
  const router = useRouter()
  const [clientToDelete, setClientToDelete] = useState<Client | null>(null)

  const getStatusBadge = (status: ClientStatus) => {
    switch (status) {
      case "checked-in":
        return (
          <Badge className="bg-green-500/10 text-green-600 border-green-500/20">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            {t("admin.checkIn")}
          </Badge>
        )
      case "reserved":
        return (
          <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/20">
            <Clock className="w-3 h-3 mr-1" />
            {t("admin.reserved")}
          </Badge>
        )
      case "checked-out":
        return (
          <Badge className="bg-gray-500/10 text-gray-600 border-gray-500/20">
            <XCircle className="w-3 h-3 mr-1" />
            {t("admin.checkOut")}
          </Badge>
        )
    }
  }

  const getClientTierBadge = (client: Client) => {
    const category = client.category || "Basic"
    const categoryConfig: Record<string, { className: string; label: string }> = {
      Basic: { className: "bg-blue-100 text-blue-800", label: "Basic" },
      Preferred: { className: "bg-gray-100 text-gray-800", label: "Preferred" },
      Elite: { className: "bg-yellow-100 text-yellow-800", label: "Elite" },
      VIP: { className: "bg-black text-white", label: "VIP" },
    }
    const config = categoryConfig[category] || categoryConfig.Basic
    return (
      <Badge className={`${config.className} border-0`}>
        {config.label}
      </Badge>
    )
  }

  const today = new Date().toISOString().split("T")[0]
  const checkInTodayCount = clients.filter((c) => c.checkIn === today).length
  const checkoutTodayCount = clients.filter((c) => c.checkOut === today).length

  if (error) {
    return (
      <div className="p-8">
        <Card className="p-6">
          <p className="text-destructive">Error al cargar los datos.</p>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-0 space-y-6">
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">{t("admin.clientManagement")}</h1>
              <p className="text-sm text-muted-foreground">{t("admin.administerHotelGuests")}</p>
            </div>
            <div className="flex gap-4 items-center ml-auto">
              <button
                className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-md hover:shadow-lg transition-all duration-300 hover:scale-110 group relative"
                title="Agregar cliente"
                onClick={() => setShowNewClientModal(true)}
              >
                <div className="relative flex items-center justify-center">
                  <UserPlus className="w-5 h-5" />
                  <span className="absolute text-base font-bold -bottom-0.5 -right-0.5 text-white drop-shadow-lg">+</span>
                </div>
                <span className="absolute top-full mt-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                  {t("admin.newClient")}
                </span>
              </button>
            </div>
          </div>

          <div className="flex gap-3 mt-4">
            <button
              onClick={() => onActiveTabChange("current")}
              className={`group relative overflow-hidden rounded-lg px-5 py-2 text-white transition-all duration-300 text-xs font-medium ${activeTab === "current"
                ? "bg-gradient-to-br from-green-600 to-green-700 shadow-lg scale-105 ring-2 ring-white ring-opacity-50"
                : "bg-gradient-to-br from-green-600 to-green-700 opacity-60 hover:opacity-75 shadow-sm hover:shadow-md hover:scale-105"
                }`}
            >
              <div className="absolute top-0 right-0 w-12 h-12 bg-white opacity-10 rounded-full -mr-6 -mt-6" />
              <Users className="w-4 h-4 inline mr-2 relative z-10" />
              <span className="relative z-10">{t("admin.currentGuests")}</span>
            </button>
            <button
              onClick={() => onActiveTabChange("historical")}
              className={`group relative overflow-hidden rounded-lg px-5 py-2 text-white transition-all duration-300 text-xs font-medium ${activeTab === "historical"
                ? "bg-gradient-to-br from-slate-600 to-slate-700 shadow-lg scale-105 ring-2 ring-white ring-opacity-50"
                : "bg-gradient-to-br from-slate-600 to-slate-700 opacity-60 hover:opacity-75 shadow-sm hover:shadow-md hover:scale-105"
                }`}
            >
              <div className="absolute top-0 right-0 w-12 h-12 bg-white opacity-10 rounded-full -mr-6 -mt-6" />
              <History className="w-4 h-4 inline mr-2 relative z-10" />
              <span className="relative z-10">{t("admin.historicalClients")}</span>
            </button>
          </div>
        </div>
      </header>

      <div className="p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div
            className="relative overflow-hidden rounded-lg p-4 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer group"
            style={{
              background: clientsFilter === "all" ? "linear-gradient(135deg, rgb(124, 58, 255), rgb(109, 40, 217))" : "white",
              color: clientsFilter === "all" ? "white" : "black",
            }}
            onClick={() => onClientsFilterChange("all")}
          >
            {clientsFilter === "all" && (
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 right-0 w-20 h-20 bg-white rounded-full -mr-8 -mt-8" />
              </div>
            )}
            <div className="relative flex items-center gap-3">
              <div className={`p-2 rounded-lg ${clientsFilter === "all" ? "bg-white/20" : "bg-violet-100"}`}>
                <UserCircle className={`w-5 h-5 ${clientsFilter === "all" ? "text-white" : "text-violet-600"}`} />
              </div>
              <div>
                <p className={`text-sm ${clientsFilter === "all" ? "opacity-90" : "text-muted-foreground"}`}>{t("admin.checkInToday")}</p>
                <p className="text-2xl font-bold">{checkInTodayCount}</p>
              </div>
            </div>
          </div>

          <div
            className="relative overflow-hidden rounded-lg p-4 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer group"
            style={{
              background: clientsFilter === "active" ? "linear-gradient(135deg, rgb(34, 197, 94), rgb(22, 163, 74))" : "white",
              color: clientsFilter === "active" ? "white" : "black",
            }}
            onClick={() => onClientsFilterChange("active")}
          >
            {clientsFilter === "active" && (
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 right-0 w-20 h-20 bg-white rounded-full -mr-8 -mt-8" />
              </div>
            )}
            <div className="relative flex items-center gap-3">
              <div className={`p-2 rounded-lg ${clientsFilter === "active" ? "bg-white/20" : "bg-green-100"}`}>
                <CheckCircle2 className={`w-5 h-5 ${clientsFilter === "active" ? "text-white" : "text-green-600"}`} />
              </div>
              <div>
                <p className={`text-sm ${clientsFilter === "active" ? "opacity-90" : "text-muted-foreground"}`}>{t("admin.activeGuests")}</p>
                <p className="text-2xl font-bold">{clients.filter((c) => c.status === "checked-in").length}</p>
              </div>
            </div>
          </div>

          <div
            className="relative overflow-hidden rounded-lg p-4 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer group"
            style={{
              background: clientsFilter === "checkout" ? "linear-gradient(135deg, rgb(234, 88, 12), rgb(194, 65, 12))" : "white",
              color: clientsFilter === "checkout" ? "white" : "black",
            }}
            onClick={() => onClientsFilterChange("checkout")}
          >
            {clientsFilter === "checkout" && (
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 right-0 w-20 h-20 bg-white rounded-full -mr-8 -mt-8" />
              </div>
            )}
            <div className="relative flex items-center gap-3">
              <div className={`p-2 rounded-lg ${clientsFilter === "checkout" ? "bg-white/20" : "bg-orange-100"}`}>
                <LogOut className={`w-5 h-5 ${clientsFilter === "checkout" ? "text-white" : "text-orange-600"}`} />
              </div>
              <div>
                <p className={`text-sm ${clientsFilter === "checkout" ? "opacity-90" : "text-muted-foreground"}`}>{t("admin.checkOutToday")}</p>
                <p className="text-2xl font-bold">{checkoutTodayCount}</p>
              </div>
            </div>
          </div>

          <div
            className="relative overflow-hidden rounded-lg p-4 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer group"
            style={{
              background: clientsFilter === "vip" ? "linear-gradient(135deg, rgb(234, 179, 8), rgb(202, 138, 4))" : "white",
              color: clientsFilter === "vip" ? "white" : "black",
            }}
            onClick={() => onClientsFilterChange("vip")}
          >
            {clientsFilter === "vip" && (
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 right-0 w-20 h-20 bg-white rounded-full -mr-8 -mt-8" />
              </div>
            )}
            <div className="relative flex items-center gap-3">
              <div className={`p-2 rounded-lg ${clientsFilter === "vip" ? "bg-white/20" : "bg-yellow-100"}`}>
                <CreditCard className={`w-5 h-5 ${clientsFilter === "vip" ? "text-white" : "text-yellow-600"}`} />
              </div>
              <div>
                <p className={`text-sm ${clientsFilter === "vip" ? "opacity-90" : "text-muted-foreground"}`}>{t("admin.vipClients")}</p>
                <p className="text-2xl font-bold">{clients.filter((c) => c.vip).length}</p>
              </div>
            </div>
          </div>
        </div>

        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder={t("admin.searchPlaceholder")}
                  value={searchTerm}
                  onChange={(e) => onSearchTermChange(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={onStatusFilterChange}>
                <SelectTrigger className="w-full md:w-48">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder={t("admin.filterStatus")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("admin.allStatuses")}</SelectItem>
                  <SelectItem value="checked-in">{t("admin.checkedIn")}</SelectItem>
                  <SelectItem value="reserved">{t("admin.reserved")}</SelectItem>
                  {activeTab === "historical" && <SelectItem value="checked-out">{t("admin.checkedOut")}</SelectItem>}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-8 text-center text-muted-foreground">Cargando...</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/50 border-b">
                    <tr>
                      <th className="text-left p-4 text-sm font-medium text-muted-foreground w-12" />
                      <th className="text-left p-4 text-sm font-medium text-muted-foreground">{t("admin.guest")}</th>
                      <th className="text-left p-4 text-sm font-medium text-muted-foreground">{t("admin.room")}</th>
                      <th className="text-left p-4 text-sm font-medium text-muted-foreground">{t("admin.checkIn")}</th>
                      <th className="text-left p-4 text-sm font-medium text-muted-foreground">{t("admin.checkOut")}</th>
                      <th className="text-left p-4 text-sm font-medium text-muted-foreground">{t("admin.status")}</th>
                      <th className="text-left p-4 text-sm font-medium text-muted-foreground">Huéspedes</th>
                      <th className="text-left p-4 text-sm font-medium text-muted-foreground">{t("admin.spent")}</th>
                      <th className="text-right p-4 text-sm font-medium text-muted-foreground">{t("admin.actions")}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {filteredClients.map((client) => {
                      const rowKey = client.reservationId ?? client.id
                      return (
                        <React.Fragment key={rowKey}>
                          <tr className="hover:bg-muted/30 transition-colors">
                            <td className="p-4">
                              {client.groupMembers && client.groupMembers.length > 0 && (
                                <button
                                  type="button"
                                  onClick={() => onToggleExpanded(rowKey)}
                                  className="hover:bg-muted rounded p-1 transition-colors"
                                >
                                  {expandedClient === rowKey ? (
                                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                                  ) : (
                                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                                  )}
                                </button>
                              )}
                            </td>
                            <td className="p-4">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                  <UserCircle className="w-6 h-6 text-primary" />
                                </div>
                                <div>
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <Link
                                      href={orgId ? ROUTES.CLIENT_DETAIL(orgId, client.id) : `/admin/clients/${client.id}`}
                                      className="font-medium text-foreground hover:text-primary hover:underline"
                                    >
                                      {client.name}
                                    </Link>
                                    {getClientTierBadge(client)}
                                  </div>
                                  <p className="text-sm text-muted-foreground">{client.email}</p>
                                  {client.visitCount != null && client.visitCount !== "-" && Number(client.visitCount) > 1 && (
                                    <p className="text-xs text-muted-foreground mt-0.5">
                                      {client.visitCount} {t("admin.visitsToHotel")}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="p-4">
                              <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center">
                                <span className="text-sm font-semibold text-primary">{client.room}</span>
                              </div>
                            </td>
                            <td className="p-4">
                              <div className="space-y-1">
                                <div className="flex items-center gap-2 text-sm">
                                  <Calendar className="w-3 h-3 text-muted-foreground" />
                                  <span className="text-foreground">{formatDate(client.checkIn)}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                  <Calendar className="w-3 h-3 text-muted-foreground" />
                                  <span className="text-foreground">{formatDate(client.checkOut)}</span>
                                </div>
                              </div>
                            </td>
                            <td className="p-4">{getStatusBadge(client.status)}</td>
                            <td className="p-4">
                              <span className="text-foreground">{displayGuests(client.guests)}</span>
                            </td>
                            <td className="p-4">
                              <span className="font-semibold text-foreground">{displaySpent(client.totalSpent)}</span>
                            </td>
                            <td className="p-4">
                              <span className="font-semibold text-foreground">-</span>
                            </td>
                            <td className="p-4">
                              <div className="flex items-center justify-end gap-2">
                                <DropdownMenu modal={false}>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm">
                                      <MoreVertical className="w-4 h-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem
                                      onSelect={() => {
                                        router.push(orgId ? ROUTES.CLIENT_DETAIL(orgId, client.id) : `/admin/clients/${client.id}`)
                                      }}
                                    >
                                      <Edit className="w-4 h-4 mr-2" />
                                      {t("admin.edit")}
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      className="text-red-600"
                                      onSelect={() => setClientToDelete(client)}
                                    >
                                      <Trash2 className="w-4 h-4 mr-2" />
                                      {t("admin.delete")}
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </td>
                          </tr>

                          {expandedClient === rowKey &&
                            client.groupMembers?.map((member) => (
                              <tr key={member.id} className="bg-muted/20 hover:bg-muted/40 transition-colors">
                                <td className="p-4" />
                                <td className="p-4 pl-16">
                                  <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                                      <UserCircle className="w-5 h-5 text-muted-foreground" />
                                    </div>
                                    <div>
                                      <p className="font-medium text-sm text-foreground">{member.name}</p>
                                      <p className="text-xs text-muted-foreground">{member.relationship}</p>
                                    </div>
                                  </div>
                                </td>
                                <td className="p-4">
                                  <span className="text-sm text-muted-foreground">-</span>
                                </td>
                                <td className="p-4">
                                  <p className="text-sm text-muted-foreground">{member.email}</p>
                                </td>
                                <td className="p-4" colSpan={5}>
                                  <p className="text-sm text-muted-foreground">{member.phone}</p>
                                </td>
                              </tr>
                            ))}
                        </React.Fragment>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {showNewClientModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-foreground mb-6">Agregar Nuevo Cliente</h2>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nombre</label>
                  <input
                    type="text"
                    value={newClient.name}
                    onChange={(e) => setNewClient((prev) => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nombre completo"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={newClient.email}
                    onChange={(e) => setNewClient((prev) => ({ ...prev, email: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="correo@ejemplo.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Teléfono</label>
                  <input
                    type="tel"
                    value={newClient.phone}
                    onChange={(e) => setNewClient((prev) => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Habitación</label>
                  <input
                    type="text"
                    value={newClient.room}
                    onChange={(e) => setNewClient((prev) => ({ ...prev, room: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ej: 205"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Check-in</label>
                  <input
                    type="date"
                    value={newClient.checkIn}
                    onChange={(e) => setNewClient((prev) => ({ ...prev, checkIn: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Check-out</label>
                  <input
                    type="date"
                    value={newClient.checkOut}
                    onChange={(e) => setNewClient((prev) => ({ ...prev, checkOut: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Habitación</label>
                  <select
                    value={newClient.roomType}
                    onChange={(e) =>
                      setNewClient((prev) => ({ ...prev, roomType: e.target.value as "standard" | "deluxe" | "premium" }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="standard">Estándar</option>
                    <option value="deluxe">Deluxe</option>
                    <option value="premium">Premium</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nacionalidad</label>
                  <input
                    type="text"
                    value={newClient.nationality}
                    onChange={(e) => setNewClient((prev) => ({ ...prev, nationality: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ej: España"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
                <select
                  value={newClient.status}
                  onChange={(e) =>
                    setNewClient((prev) => ({ ...prev, status: e.target.value as "active" | "checkout" }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="active">Activo</option>
                  <option value="checkout">Check-out</option>
                </select>
              </div>

              <div className="flex gap-3 mt-8">
                <button
                  type="button"
                  onClick={() => setShowNewClientModal(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium flex-1"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={onAddClient}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex-1"
                >
                  Agregar Cliente
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Dialog open={!!clientToDelete} onOpenChange={(open) => !open && setClientToDelete(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t("admin.delete")} {t("admin.guest")}</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            {clientToDelete
              ? `¿Eliminar a ${clientToDelete.name}? Esta acción no se puede deshacer.`
              : ""}
          </p>
          <div className="flex gap-3 justify-end mt-4">
            <Button variant="outline" onClick={() => setClientToDelete(null)}>
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                // TODO: llamar API de eliminación cuando exista
                setClientToDelete(null)
              }}
            >
              {t("admin.delete")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
