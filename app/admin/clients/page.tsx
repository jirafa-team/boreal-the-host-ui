"use client"

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
  status: "checked-in" | "reserved" | "checked-out"
  vip: boolean
  nationality: string
  guests: number
  totalSpent: number
  notes: string
  groupMembers?: Guest[]
  roomType?: "premium" | "deluxe" | "standard"
  visitCount?: number
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
    totalSpent: 0,
    notes: "Aniversario de bodas, preparar decoración especial",
    roomType: "deluxe",
    visitCount: 2,
    groupMembers: [
      { id: "3a", name: "Emma Smith", email: "emma.s@email.com", phone: "+1 555 123 4568", relationship: "Esposa" },
      { id: "3b", name: "Lucas Smith", email: "lucas.s@email.com", phone: "+1 555 123 4569", relationship: "Hijo" },
    ],
  },
  {
    id: "4",
    name: "Sophie Dubois",
    email: "sophie.dubois@email.com",
    phone: "+33 6 12 34 56 78",
    room: "401",
    checkIn: "2025-01-08",
    checkOut: "2025-01-11",
    status: "checked-out",
    vip: false,
    nationality: "Francia",
    guests: 2,
    totalSpent: 890,
    notes: "",
    roomType: "standard",
    visitCount: 2,
    groupMembers: [
      {
        id: "4a",
        name: "Pierre Dubois",
        email: "pierre.d@email.com",
        phone: "+33 6 12 34 56 79",
        relationship: "Esposo",
      },
    ],
  },
  {
    id: "5",
    name: "Alessandro Rossi",
    email: "alessandro.rossi@email.com",
    phone: "+39 345 678 9012",
    room: "103",
    checkIn: "2025-01-11",
    checkOut: "2025-01-13",
    status: "checked-in",
    vip: false,
    nationality: "Italia",
    guests: 1,
    totalSpent: 320,
    notes: "",
    roomType: "standard",
    visitCount: 7,
  },
  {
    id: "6",
    name: "Ana Torres",
    email: "ana.torres@email.com",
    phone: "+34 687 234 567",
    room: "605",
    checkIn: "2025-01-16",
    checkOut: "2025-01-22",
    status: "reserved",
    vip: true,
    nationality: "Argentina",
    guests: 2,
    totalSpent: 0,
    notes: "Viaje de negocios, requiere factura",
    roomType: "premium",
    visitCount: 4,
    groupMembers: [
      {
        id: "6a",
        name: "Roberto Torres",
        email: "roberto.t@email.com",
        phone: "+34 687 234 568",
        relationship: "Hermano",
      },
    ],
  },
]

export default function ClientsPage() {
  const { t } = useLanguage()
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [clients] = useState<Client[]>(mockClients)
  const [activeTab, setActiveTab] = useState<"current" | "historical">("current")
  const [expandedClient, setExpandedClient] = useState<string | null>(null)

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
    const badges = []

    // VIP or Premium Room Badge (Gold)
    if (client.vip || client.roomType === "premium" || client.roomType === "deluxe") {
      badges.push(
        <Badge
          key="vip"
          className="bg-gradient-to-r from-amber-500 to-yellow-500 text-white border-0 shadow-lg shadow-amber-500/30"
        >
          ★ {t("admin.vip")}
        </Badge>,
      )
    }

    // Frequent Guest Badge (Silver/Blue) - 3+ visits
    if (client.visitCount && client.visitCount >= 3) {
      badges.push(
        <Badge
          key="frequent"
          className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0 shadow-lg shadow-blue-500/30"
        >
          ♥ {t("admin.frequentGuest")}
        </Badge>,
      )
    }

    return badges
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{t("admin.clientManagement")}</h1>
          <p className="text-muted-foreground mt-1">{t("admin.administerHotelGuests")}</p>
        </div>
        <Button>
          <UserCircle className="w-4 h-4 mr-2" />
          {t("admin.newClient")}
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{t("admin.checkInToday")}</p>
                <p className="text-2xl font-bold text-foreground">3</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{t("admin.activeGuests")}</p>
                <p className="text-2xl font-bold text-foreground">8</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                <UserCircle className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{t("admin.futureReservations")}</p>
                <p className="text-2xl font-bold text-foreground">12</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{t("admin.vipClients")}</p>
                <p className="text-2xl font-bold text-foreground">5</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs to switch between active and historical clients */}
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "current" | "historical")}>
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="current" className="gap-2">
            <CheckCircle2 className="w-4 h-4" />
            {t("admin.currentGuests")}
          </TabsTrigger>
          <TabsTrigger value="historical" className="gap-2">
            <Clock className="w-4 h-4" />
            {t("admin.historicalClients")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
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
                      <>
                        <tr key={client.id} className="hover:bg-muted/30 transition-colors">
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
                                  {new Date(client.checkIn).toLocaleDateString("es-ES", {
                                    day: "2-digit",
                                    month: "short",
                                  })}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                                <Calendar className="w-3 h-3 text-muted-foreground" />
                                <span className="text-foreground">
                                  {new Date(client.checkOut).toLocaleDateString("es-ES", {
                                    day: "2-digit",
                                    month: "short",
                                  })}
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
                      </>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
