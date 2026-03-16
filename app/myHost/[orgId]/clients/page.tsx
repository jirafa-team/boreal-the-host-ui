"use client"

import { useSelector } from "react-redux"
import type { RootState } from "@/store/store"
import { ClientsApiContainer } from "@/app/admin/clients/containers/ClientsApiContainer"
import { ClientsMockContainer } from "@/app/admin/clients/containers/ClientsMockContainer"

export default function ClientsPage() {
  const dataSource = useSelector((state: RootState) => state.dataSource.dataSource)

  if (dataSource === "api") {
    return <ClientsApiContainer />
  }
  return <ClientsMockContainer />
}
