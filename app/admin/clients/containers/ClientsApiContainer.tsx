"use client"

import React, { useMemo, useState } from "react"
import { useParams } from "next/navigation"
import { useSelector } from "react-redux"
import type { RootState } from "@/store/store"
import { useLanguage } from "@/lib/i18n-context"
import { useGetReservationsWithDetailsQuery } from "@/features/reservation/slices/reservationSlice"
import { ClientsView } from "@/app/admin/clients/components/ClientsView"
import type { Client, ClientStatus } from "@/app/admin/clients/components/types"
import type { NewClientForm } from "@/app/admin/clients/components/ClientsView"

const initialNewClient: NewClientForm = {
  name: "",
  email: "",
  phone: "",
  room: "",
  checkIn: "",
  checkOut: "",
  roomType: "standard",
  status: "active",
  nationality: "",
}

type ReservationWithDetails = {
  id?: string
  userId?: string
  checkIn?: string | Date
  checkOut?: string | Date
  status?: string
  user?: {
    id: string
    firstName?: string
    lastName?: string
    email?: string
    phoneNumber?: string
  }
  room?: {
    id: string
    number?: string
    status?: string
    checkIn?: string | Date | null
    checkOut?: string | Date | null
  }
}

function toISOString(d: string | Date | undefined | null): string {
  if (d == null) return "-"
  if (typeof d === "string") return d
  try {
    return new Date(d).toISOString().split("T")[0]
  } catch {
    return "-"
  }
}

function mapReservationToClientStatus(
  checkIn: string | undefined,
  checkOut: string | undefined,
  reservationStatus?: string
): ClientStatus {
  if (reservationStatus === "pending") return "reserved"
  const today = new Date().toISOString().split("T")[0]
  if (!checkOut || checkOut === "-") return "reserved"
  if (checkOut < today) return "checked-out"
  if (checkIn && checkIn <= today) return "checked-in"
  return "reserved"
}

function mapReservationToClient(r: ReservationWithDetails): Client {
  const user = r.user
  const room = r.room
  const checkIn = toISOString(r.checkIn)
  const checkOut = toISOString(r.checkOut)
  const name =
    user?.firstName != null || user?.lastName != null
      ? [user?.firstName ?? "", user?.lastName ?? ""].filter(Boolean).join(" ").trim()
      : "-"

  return {
    id: user?.id ?? r.id ?? "",
    reservationId: r.id,
    name: name || "-",
    email: user?.email ?? "-",
    phone: user?.phoneNumber ?? "-",
    room: room?.number ?? "-",
    checkIn: checkIn || "-",
    checkOut: checkOut || "-",
    status: mapReservationToClientStatus(checkIn, checkOut, r.status),
    vip: false,
    nationality: "-",
    guests: "-",
    totalSpent: "-",
  }
}

export function ClientsApiContainer() {
  const { t } = useLanguage()
  const params = useParams()
  const orgId = params?.orgId as string | undefined
  const dataSource = useSelector((state: RootState) => state.dataSource.dataSource)
  const skip = dataSource !== "api"

  const { data, isLoading, error } = useGetReservationsWithDetailsQuery(
    { role: "Customer", limit: 100 },
    { skip }
  )

  const clients: Client[] = useMemo(() => {
    const raw = data?.data as { objects?: ReservationWithDetails[] } | undefined
    const list = raw?.objects ?? (data?.data as { reservations?: ReservationWithDetails[] })?.reservations ?? []
    return (Array.isArray(list) ? list : []).map(mapReservationToClient)
  }, [data?.data])

  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [activeTab, setActiveTab] = useState<"current" | "historical">("current")
  const [clientsFilter, setClientsFilter] = useState<"all" | "active" | "checkout" | "vip">("all")
  const [expandedClient, setExpandedClient] = useState<string | null>(null)
  const [showNewClientModal, setShowNewClientModal] = useState(false)
  const [newClient, setNewClient] = useState<NewClientForm>(initialNewClient)

  const activeClients = useMemo(
    () => clients.filter((c) => c.status === "checked-in" || c.status === "reserved"),
    [clients]
  )
  const historicalClients = useMemo(() => clients.filter((c) => c.status === "checked-out"), [clients])
  const displayedClients = activeTab === "current" ? activeClients : historicalClients

  const filteredClients = useMemo(() => {
    const today = new Date().toISOString().split("T")[0]
    return displayedClients.filter((client) => {
      const matchesSearch =
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (client.room && client.room !== "-" && client.room.includes(searchTerm))
      const matchesStatus = statusFilter === "all" || client.status === statusFilter
      let matchesKPIFilter = true
      if (clientsFilter === "active") matchesKPIFilter = client.status === "checked-in"
      else if (clientsFilter === "checkout") matchesKPIFilter = client.checkOut === today
      else if (clientsFilter === "vip") matchesKPIFilter = false
      return matchesSearch && matchesStatus && matchesKPIFilter
    })
  }, [displayedClients, searchTerm, statusFilter, clientsFilter])

  const handleToggleExpanded = (clientId: string) => {
    setExpandedClient((prev) => (prev === clientId ? null : clientId))
  }

  const handleAddClient = () => {
    setShowNewClientModal(false)
    setNewClient(initialNewClient)
  }

  return (
    <ClientsView
      filteredClients={filteredClients}
      clients={clients}
      searchTerm={searchTerm}
      onSearchTermChange={setSearchTerm}
      statusFilter={statusFilter}
      onStatusFilterChange={setStatusFilter}
      activeTab={activeTab}
      onActiveTabChange={setActiveTab}
      clientsFilter={clientsFilter}
      onClientsFilterChange={setClientsFilter}
      expandedClient={expandedClient}
      onToggleExpanded={handleToggleExpanded}
      showNewClientModal={showNewClientModal}
      setShowNewClientModal={setShowNewClientModal}
      newClient={newClient}
      setNewClient={setNewClient}
      onAddClient={handleAddClient}
      orgId={orgId}
      t={t}
      isLoading={isLoading}
      error={error}
    />
  )
}
