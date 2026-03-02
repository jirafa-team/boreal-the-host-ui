"use client"

import React, { useEffect, useMemo, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useParams } from "next/navigation"
import type { RootState } from "@/store/store"
import { useLanguage } from "@/lib/i18n-context"
import { loadMockClients, setClients } from "@/app/admin/clients/slice/clientSlice"
import { ClientsView } from "@/app/admin/clients/components/ClientsView"
import type { Client } from "@/app/admin/clients/components/types"
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

export function ClientsMockContainer() {
  const { t } = useLanguage()
  const dispatch = useDispatch()
  const params = useParams()
  const orgId = params?.orgId as string | undefined
  const dataSource = useSelector((state: RootState) => state.dataSource.dataSource)
  const clients = useSelector((state: RootState) => state.client.clients)

  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [activeTab, setActiveTab] = useState<"current" | "historical">("current")
  const [clientsFilter, setClientsFilter] = useState<"all" | "active" | "checkout" | "vip">("all")
  const [expandedClient, setExpandedClient] = useState<string | null>(null)
  const [showNewClientModal, setShowNewClientModal] = useState(false)
  const [newClient, setNewClient] = useState<NewClientForm>(initialNewClient)

  useEffect(() => {
    if (dataSource === "mock") {
      dispatch(loadMockClients())
    }
  }, [dataSource, dispatch])

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
        client.room.includes(searchTerm)
      const matchesStatus = statusFilter === "all" || client.status === statusFilter
      let matchesKPIFilter = true
      if (clientsFilter === "active") matchesKPIFilter = client.status === "checked-in"
      else if (clientsFilter === "checkout") matchesKPIFilter = client.checkOut === today
      else if (clientsFilter === "vip") matchesKPIFilter = client.vip === true
      return matchesSearch && matchesStatus && matchesKPIFilter
    })
  }, [displayedClients, searchTerm, statusFilter, clientsFilter])

  const handleToggleExpanded = (clientId: string) => {
    setExpandedClient((prev) => (prev === clientId ? null : clientId))
  }

  const handleAddClient = () => {
    if (!newClient.name || !newClient.email) return
    const status: Client["status"] = newClient.status === "checkout" ? "checked-out" : "checked-in"
    const client: Client = {
      id: `client-${Date.now()}`,
      name: newClient.name,
      email: newClient.email,
      phone: newClient.phone,
      room: newClient.room,
      checkIn: newClient.checkIn,
      checkOut: newClient.checkOut,
      status,
      vip: false,
      nationality: newClient.nationality,
      guests: 1,
      totalSpent: 0,
      notes: "",
      roomType: newClient.roomType,
    }
    dispatch(setClients([...clients, client]))
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
    />
  )
}
