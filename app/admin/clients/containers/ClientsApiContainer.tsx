"use client"

import React, { useMemo, useState, useCallback } from "react"
import { useParams } from "next/navigation"
import { useSelector } from "react-redux"
import type { RootState } from "@/store/store"
import { useLanguage } from "@/lib/i18n-context"
import {
  useGetClientsQuery,
  useCreateClientMutation,
  useDeleteClientMutation,
  mapClientApiToClient,
} from "@/app/admin/clients/slice/clientSlice"
import { ClientsView } from "@/app/admin/clients/components/ClientsView"
import type { Client } from "@/app/admin/clients/components/types"
import type { NewClientForm } from "@/app/admin/clients/components/ClientsView"
import { useToast } from "@/hooks/use-toast"

const initialNewClient: NewClientForm = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  room: "",
  checkIn: "",
  checkOut: "",
  roomType: "standard",
  status: "active",
  nationality: "",
  category: "Basic",
  notes: "",
  createUserForClient: false,
}

export function ClientsApiContainer() {
  const { t } = useLanguage()
  const { toast } = useToast()
  const params = useParams()
  const orgId = params?.orgId as string | undefined
  const dataSource = useSelector((state: RootState) => state.dataSource.dataSource)
  const skip = dataSource !== "api"

  const { data, isLoading, error } = useGetClientsQuery(
    { page: 1, limit: 100 },
    { skip }
  )

  const [createClient] = useCreateClientMutation()
  const [deleteClient] = useDeleteClientMutation()

  const clients: Client[] = useMemo(() => {
    const list = data?.data?.objects ?? []
    return (Array.isArray(list) ? list : []).map(mapClientApiToClient)
  }, [data?.data?.objects])

  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [activeTab, setActiveTab] = useState<"current" | "historical">("current")
  const [clientsFilter, setClientsFilter] = useState<"all" | "active" | "checkout" | "vip">("all")
  const [expandedClient, setExpandedClient] = useState<string | null>(null)
  const [showNewClientModal, setShowNewClientModal] = useState(false)
  const [newClient, setNewClient] = useState<NewClientForm>(initialNewClient)

  const activeClients = useMemo(
    () =>
      clients.filter(
        (c) => c.status === "checked-in" || c.status === "reserved" || c.status === "no-reservation"
      ),
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

  const handleAddClient = useCallback(async () => {
    if (!newClient.firstName.trim() || !newClient.lastName.trim() || !newClient.email.trim()) return
    try {
      await createClient({
        firstName: newClient.firstName.trim(),
        lastName: newClient.lastName.trim(),
        email: newClient.email.trim(),
        phone: newClient.phone?.trim() || undefined,
        nationality: newClient.nationality?.trim() || undefined,
        category: newClient.category,
        notes: newClient.notes?.trim() || undefined,
        createUserForClient: newClient.createUserForClient ?? false,
      }).unwrap()
      setShowNewClientModal(false)
      setNewClient(initialNewClient)
      const displayName = [newClient.firstName, newClient.lastName].filter(Boolean).join(" ").trim()
      toast({ title: "Éxito", description: `Cliente ${displayName || "creado"} creado correctamente.` })
    } catch {
      toast({
        title: "Error",
        description: "No se pudo crear el cliente.",
        variant: "destructive",
      })
    }
  }, [newClient, createClient, toast])

  const handleDeleteClient = useCallback(
    async (clientId: string) => {
      try {
        await deleteClient(clientId).unwrap()
        toast({ title: "Éxito", description: "Cliente eliminado correctamente." })
      } catch {
        toast({
          title: "Error",
          description: "No se pudo eliminar el cliente.",
          variant: "destructive",
        })
      }
    },
    [deleteClient, toast]
  )

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
      onConfirmDeleteClient={handleDeleteClient}
      orgId={orgId}
      t={t}
      isLoading={isLoading}
      error={error}
    />
  )
}
