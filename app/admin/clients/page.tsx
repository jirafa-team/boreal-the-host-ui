"use client"

import React from "react"
import { useLanguage } from "@/lib/i18n-context"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Guest {
  id: string
  name: string
  email: string
  phone: string
  relationship: string
}

interface Client {
  id: string
  name: string
  email: string
  phone: string
  room: string
  checkIn: string
  checkOut: string
  status: "checked-in" | "checked-out" | "reserved"
  vip: boolean
  nationality: string
  guests: number
  totalSpent: number
  notes?: string
  roomType?: "standard" | "deluxe" | "premium"
  visitCount?: number
  groupMembers?: Array<{ id: string; name: string; email: string; phone: string; relationship: string }>
  category?: "Basic" | "Preferred" | "Elite" | "VIP"
}

const mockClients: Client[] = [
  {
    id: "1",
    name: "Carlos Mendoza",
    email: "carlos.mendoza@email.com",
    phone: "+34 612 345 678",
    room: "501",
    checkIn: "2025-01-10",
    checkOut: "2025-01-15",
    status: "checked-in",
    vip: true,
    nationality: "España",
    guests: 2,
    totalSpent: 1250,
    notes: "Cliente frecuente, prefiere habitación con vista al mar",
    roomType: "premium",
    visitCount: 5,
    category: "VIP",
    groupMembers: [
      { id: "1a", name: "Laura Mendoza", email: "laura.m@email.com", phone: "+34 612 345 679", relationship: "Esposa" },
    ],
  },
  {
    id: "2",
    name: "María García",
    email: "maria.garcia@email.com",
    phone: "+34 698 765 432",
    room: "302",
    checkIn: "2025-01-12",
    checkOut: "2025-01-14",
    status: "checked-in",
    vip: false,
    nationality: "México",
    guests: 1,
    totalSpent: 450,
    notes: "",
    roomType: "standard",
    visitCount: 1,
    category: "Basic",
  },
  {
    id: "3",
    name: "John Smith",
    email: "john.smith@email.com",
    phone: "+1 555 123 4567",
    room: "204",
    checkIn: "2025-01-15",
    checkOut: "2025-01-20",
    status: "reserved",
    vip: true,
    nationality: "USA",
    guests: 3,
    totalSpent: 2800,
    notes: "Requiere servicio concierge",
    roomType: "premium",
    visitCount: 8,
    category: "Elite",
  },
  {
    id: "4",
    name: "Sophie Laurent",
    email: "sophie.laurent@email.com",
    phone: "+33 612 345 678",
    room: "405",
    checkIn: "2025-01-16",
    checkOut: "2025-01-18",
    status: "checked-in",
    vip: false,
    nationality: "Francia",
    guests: 1,
    totalSpent: 680,
    notes: "Prefiere comidas vegetarianas",
    roomType: "deluxe",
    visitCount: 3,
    category: "Preferred",
  },
  {
    id: "5",
    name: "Ahmed Hassan",
    email: "ahmed.hassan@email.com",
    phone: "+966 50 123 4567",
    room: "301",
    checkIn: "2025-01-11",
    checkOut: "2025-01-16",
    status: "checked-in",
    vip: true,
    nationality: "Arabia Saudita",
    guests: 4,
    totalSpent: 3500,
    notes: "Cliente VIP - Primer viaje",
    roomType: "premium",
    visitCount: 1,
    category: "VIP",
  },
  {
    id: "6",
    name: "Emma Wilson",
    email: "emma.wilson@email.com",
    phone: "+44 20 7946 0958",
    room: "103",
    checkIn: "2025-01-13",
    checkOut: "2025-01-17",
    status: "checked-in",
    vip: false,
    nationality: "Reino Unido",
    guests: 2,
    totalSpent: 550,
    notes: "",
    roomType: "standard",
    visitCount: 2,
    category: "Basic",
  },
  {
    id: "7",
    name: "Roberto Silva",
    email: "roberto.silva@email.com",
    phone: "+55 11 98765-4321",
    room: "502",
    checkIn: "2025-01-09",
    checkOut: "2025-01-14",
    status: "checked-out",
    vip: false,
    nationality: "Brasil",
    guests: 1,
    totalSpent: 920,
    notes: "Solicitó early checkout",
    roomType: "deluxe",
    visitCount: 4,
    category: "Elite",
  },
]

export default function ClientsPage() {
  const { t } = useLanguage()
  const router = useRouter()
  const [clients, setClients] = useState<Client[]>(mockClients)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [activeTab, setActiveTab] = useState<"current" | "historical">("current")
  const [clientsFilter, setClientsFilter] = useState<"all" | "active" | "checkout" | "vip">("all")
  const [expandedClient, setExpandedClient] = useState<string | null>(null)
  const [showNewClientModal, setShowNewClientModal] = useState(false)
  const [newClient, setNewClient] = useState({
    name: "",
    email: "",
    phone: "",
    room: "",
    checkIn: "",
    checkOut: "",
    roomType: "standard" as const,
    status: "active" as const,
    vip: false,
    visitCount: 1,
    notes: "",
    category: "Basic" as const
  })

  const activeClients = clients.filter((client) => client.status === "checked-in" || client.status === "reserved")
  const historicalClients = clients.filter((client) => client.status === "checked-out")

  const displayedClients = activeTab === "current" ? activeClients : historicalClients

  const filteredClients = displayedClients.filter((client) => {
    const matchesSearch =
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.room.includes(searchTerm)
    const matchesStatus = statusFilter === "all" || client.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const toggleExpanded = (clientId: string) => {
    if (expandedClient === clientId) {
      setExpandedClient(null)
    } else {
      setExpandedClient(clientId)
    }
  }

  const getStatusBadge = (status: Client["status"]) => {
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
    
    const categoryConfig = {
      Basic: {
        className: "bg-blue-100 text-blue-800",
        label: "Basic"
      },
      Preferred: {
        className: "bg-gray-100 text-gray-800",
        label: "Preferred"
      },
      Elite: {
        className: "bg-yellow-100 text-yellow-800",
        label: "Elite"
      },
      VIP: {
        className: "bg-black text-white",
        label: "VIP"
      }
    }

    const config = categoryConfig[category]

    return (
      <Badge className={`${config.className} border-0`}>
        {config.label}
      </Badge>
    )
  }

  const handleAddClient = () => {
    if (newClient.name && newClient.email) {
      const client: Client = {
        id: `client-${Date.now()}`,
        name: newClient.name,
        email: newClient.email,
        phone: newClient.phone,
        room: newClient.room,
        checkIn: newClient.checkIn,
        checkOut: newClient.checkOut,
        roomType: newClient.roomType,
        status: newClient.status,
        vip: newClient.vip,
        visitCount: newClient.visitCount,
        notes: newClient.notes
      }
      setClients([...clients, client])
      setShowNewClientModal(false)
      setNewClient({
        name: "",
        email: "",
        phone: "",
        room: "",
        checkIn: "",
        checkOut: "",
        roomType: "standard",
        status: "active",
        vip: false,
        visitCount: 1,
        notes: ""
      })
    }
  }

  return (
    <div className="p-0 space-y-6">
      {/* Header */}
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
                  Agregar Cliente
                </span>
              </button>
            </div>
          </div>
          
          {/* Tab Buttons */}
          <div className="flex gap-3 mt-4">
            <button
              onClick={() => setActiveTab("current")}
              className={`group relative overflow-hidden rounded-lg px-5 py-2 text-white transition-all duration-300 text-xs font-medium ${
                activeTab === "current"
                  ? "bg-gradient-to-br from-green-600 to-green-700 shadow-lg scale-105 ring-2 ring-white ring-opacity-50"
                  : "bg-gradient-to-br from-green-600 to-green-700 opacity-60 hover:opacity-75 shadow-sm hover:shadow-md hover:scale-105"
              }`}
            >
              <div className="absolute top-0 right-0 w-12 h-12 bg-white opacity-10 rounded-full -mr-6 -mt-6"></div>
              <Users className="w-4 h-4 inline mr-2 relative z-10" />
              <span className="relative z-10">Huéspedes Actuales</span>
            </button>
            <button
              onClick={() => setActiveTab("historical")}
              className={`group relative overflow-hidden rounded-lg px-5 py-2 text-white transition-all duration-300 text-xs font-medium ${
                activeTab === "historical"
                  ? "bg-gradient-to-br from-slate-600 to-slate-700 shadow-lg scale-105 ring-2 ring-white ring-opacity-50"
                  : "bg-gradient-to-br from-slate-600 to-slate-700 opacity-60 hover:opacity-75 shadow-sm hover:shadow-md hover:scale-105"
              }`}
            >
              <div className="absolute top-0 right-0 w-12 h-12 bg-white opacity-10 rounded-full -mr-6 -mt-6"></div>
              <History className="w-4 h-4 inline mr-2 relative z-10" />
              <span className="relative z-10">Clientes Históricos</span>
            </button>
          </div>
        </div>
      </header>

      {/* Stats */}
      <div className="p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div
            className="relative overflow-hidden rounded-lg p-4 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer group"
            style={{
              background: clientsFilter === "all" ? "linear-gradient(135deg, rgb(124, 58, 255), rgb(109, 40, 217))" : "white",
              color: clientsFilter === "all" ? "white" : "black"
            }}
            onClick={() => setClientsFilter("all")}
          >
            {clientsFilter === "all" && (
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 right-0 w-20 h-20 bg-white rounded-full -mr-8 -mt-8"></div>
              </div>
            )}
            <div className="relative flex items-center gap-3">
              <div className={`p-2 rounded-lg ${clientsFilter === "all" ? "bg-white/20" : "bg-violet-100"}`}>
                <UserCircle className={`w-5 h-5 ${clientsFilter === "all" ? "text-white" : "text-violet-600"}`} />
              </div>
              <div>
                <p className={`text-sm ${clientsFilter === "all" ? "opacity-90" : "text-muted-foreground"}`}>{t("admin.checkInToday")}</p>
                <p className="text-2xl font-bold">3</p>
              </div>
            </div>
          </div>

          <div
            className="relative overflow-hidden rounded-lg p-4 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer group"
            style={{
              background: clientsFilter === "active" ? "linear-gradient(135deg, rgb(34, 197, 94), rgb(22, 163, 74))" : "white",
              color: clientsFilter === "active" ? "white" : "black"
            }}
            onClick={() => setClientsFilter("active")}
          >
            {clientsFilter === "active" && (
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 right-0 w-20 h-20 bg-white rounded-full -mr-8 -mt-8"></div>
              </div>
            )}
            <div className="relative flex items-center gap-3">
              <div className={`p-2 rounded-lg ${clientsFilter === "active" ? "bg-white/20" : "bg-green-100"}`}>
                <CheckCircle2 className={`w-5 h-5 ${clientsFilter === "active" ? "text-white" : "text-green-600"}`} />
              </div>
              <div>
                <p className={`text-sm ${clientsFilter === "active" ? "opacity-90" : "text-muted-foreground"}`}>{t("admin.activeGuests")}</p>
                <p className="text-2xl font-bold">8</p>
              </div>
            </div>
          </div>

          <div
            className="relative overflow-hidden rounded-lg p-4 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer group"
            style={{
              background: clientsFilter === "checkout" ? "linear-gradient(135deg, rgb(234, 88, 12), rgb(194, 65, 12))" : "white",
              color: clientsFilter === "checkout" ? "white" : "black"
            }}
            onClick={() => setClientsFilter("checkout")}
          >
            {clientsFilter === "checkout" && (
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 right-0 w-20 h-20 bg-white rounded-full -mr-8 -mt-8"></div>
              </div>
            )}
            <div className="relative flex items-center gap-3">
              <div className={`p-2 rounded-lg ${clientsFilter === "checkout" ? "bg-white/20" : "bg-orange-100"}`}>
                <LogOut className={`w-5 h-5 ${clientsFilter === "checkout" ? "text-white" : "text-orange-600"}`} />
              </div>
              <div>
                <p className={`text-sm ${clientsFilter === "checkout" ? "opacity-90" : "text-muted-foreground"}`}>{t("admin.checkOutToday")}</p>
                <p className="text-2xl font-bold">{clients.filter(c => c.checkOut === new Date().toISOString().split('T')[0]).length}</p>
              </div>
            </div>
          </div>

          <div
            className="relative overflow-hidden rounded-lg p-4 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer group"
            style={{
              background: clientsFilter === "vip" ? "linear-gradient(135deg, rgb(234, 179, 8), rgb(202, 138, 4))" : "white",
              color: clientsFilter === "vip" ? "white" : "black"
            }}
            onClick={() => setClientsFilter("vip")}
          >
            {clientsFilter === "vip" && (
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 right-0 w-20 h-20 bg-white rounded-full -mr-8 -mt-8"></div>
              </div>
            )}
            <div className="relative flex items-center gap-3">
              <div className={`p-2 rounded-lg ${clientsFilter === "vip" ? "bg-white/20" : "bg-yellow-100"}`}>
                <CreditCard className={`w-5 h-5 ${clientsFilter === "vip" ? "text-white" : "text-yellow-600"}`} />
              </div>
              <div>
                <p className={`text-sm ${clientsFilter === "vip" ? "opacity-90" : "text-muted-foreground"}`}>{t("admin.vipClients")}</p>
                <p className="text-2xl font-bold">5</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder={t("admin.searchPlaceholder")}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
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

        {/* Clients Table */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50 border-b">
                  <tr>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground w-12"></th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">{t("admin.guest")}</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">{t("admin.room")}</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">{t("admin.checkIn")}</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">{t("admin.checkOut")}</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">{t("admin.status")}</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">{t("admin.spent")}</th>
                    <th className="text-right p-4 text-sm font-medium text-muted-foreground">{t("admin.actions")}</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredClients.map((client) => (
                    <React.Fragment key={client.id}>
                      <tr className="hover:bg-muted/30 transition-colors">
                        <td className="p-4">
                          {client.groupMembers && client.groupMembers.length > 0 && (
                            <button
                              onClick={() => toggleExpanded(client.id)}
                              className="hover:bg-muted rounded p-1 transition-colors"
                            >
                              {expandedClient === client.id ? (
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
                                  href={`/admin/clients/${client.id}`}
                                  className="font-medium text-foreground hover:text-primary hover:underline"
                                >
                                  {client.name}
                                </Link>
                                {getClientTierBadge(client)}
                              </div>
                              <p className="text-sm text-muted-foreground">{client.email}</p>
                              {client.visitCount && client.visitCount > 1 && (
                                <p className="text-xs text-muted-foreground mt-0.5">
                                  {client.visitCount} {t("admin.visitsToHotel")}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center">
                              <span className="text-sm font-semibold text-primary">{client.room}</span>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-sm">
                              <Calendar className="w-3 h-3 text-muted-foreground" />
                              <span className="text-foreground">
                                {client.checkIn.split('-').slice(2).reverse().join('/')}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <Calendar className="w-3 h-3 text-muted-foreground" />
                              <span className="text-foreground">
                                {client.checkOut.split('-').slice(2).reverse().join('/')}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">{getStatusBadge(client.status)}</td>
                        <td className="p-4">
                          <span className="text-foreground">{client.guests}</span>
                        </td>
                        <td className="p-4">
                          <span className="font-semibold text-foreground">${client.totalSpent}</span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center justify-end gap-2">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreVertical className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                  <Edit className="w-4 h-4 mr-2" />
                                  {t("admin.edit")}
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-red-600">
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  {t("admin.delete")}
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </td>
                      </tr>

                      {expandedClient === client.id &&
                        client.groupMembers &&
                        client.groupMembers.map((member) => (
                          <tr key={member.id} className="bg-muted/20 hover:bg-muted/40 transition-colors">
                            <td className="p-4"></td>
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
                            <td className="p-4" colSpan={4}>
                              <p className="text-sm text-muted-foreground">{member.phone}</p>
                            </td>
                          </tr>
                        ))}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* New Client Modal */}
      {showNewClientModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-foreground mb-6">Agregar Nuevo Cliente</h2>

            <div className="space-y-6">
              {/* Name and Email */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nombre</label>
                  <input
                    type="text"
                    value={newClient.name}
                    onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nombre completo"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={newClient.email}
                    onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="correo@ejemplo.com"
                  />
                </div>
              </div>

              {/* Phone and Room */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Teléfono</label>
                  <input
                    type="tel"
                    value={newClient.phone}
                    onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Habitación</label>
                  <input
                    type="text"
                    value={newClient.room}
                    onChange={(e) => setNewClient({ ...newClient, room: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ej: 205"
                  />
                </div>
              </div>

              {/* Check In and Check Out */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Check-in</label>
                  <input
                    type="date"
                    value={newClient.checkIn}
                    onChange={(e) => setNewClient({ ...newClient, checkIn: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Check-out</label>
                  <input
                    type="date"
                    value={newClient.checkOut}
                    onChange={(e) => setNewClient({ ...newClient, checkOut: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Room Type and Status */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Habitación</label>
                  <select
                    value={newClient.roomType}
                    onChange={(e) => setNewClient({ ...newClient, roomType: e.target.value as "standard" | "deluxe" | "premium" })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="standard">Estándar</option>
                    <option value="deluxe">Deluxe</option>
                    <option value="premium">Premium</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
                  <select
                    value={newClient.status}
                    onChange={(e) => setNewClient({ ...newClient, status: e.target.value as "active" | "checkout" })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="active">Activo</option>
                    <option value="checkout">Check-out</option>
                  </select>
                </div>
              </div>

              {/* VIP and Visit Count */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="vip"
                    checked={newClient.vip}
                    onChange={(e) => setNewClient({ ...newClient, vip: e.target.checked })}
                    className="h-4 w-4 text-blue-600 rounded"
                  />
                  <label htmlFor="vip" className="ml-2 text-sm font-medium text-gray-700">
                    Cliente VIP
                  </label>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Número de Visitas</label>
                  <input
                    type="number"
                    value={newClient.visitCount}
                    onChange={(e) => setNewClient({ ...newClient, visitCount: parseInt(e.target.value) || 1 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-20"
                    min="1"
                  />
                </div>
              </div>

              {/* Client Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Categoría de Cliente</label>
                <select
                  value={newClient.category}
                  onChange={(e) => setNewClient({ ...newClient, category: e.target.value as "Basic" | "Preferred" | "Elite" | "VIP" })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Basic">Basic</option>
                  <option value="Preferred">Preferred</option>
                  <option value="Elite">Elite</option>
                  <option value="VIP">VIP</option>
                </select>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Notas</label>
                <textarea
                  value={newClient.notes}
                  onChange={(e) => setNewClient({ ...newClient, notes: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-20"
                  placeholder="Notas adicionales sobre el cliente..."
                />
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-3 mt-8">
              <button
                onClick={() => setShowNewClientModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium flex-1"
              >
                Cancelar
              </button>
              <button
                onClick={handleAddClient}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex-1"
              >
                Agregar Cliente
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
