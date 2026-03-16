"use client"

import { useSelector } from "react-redux"
import type { RootState } from "@/store/store"
import { ClientApiContainer } from "./containers/ClientApiContainer"
import { ClientMockContainer } from "./containers/ClientMockContainer"
export type { ClientType, ClientUserData } from "./types"

export default function ClientPage() {
  const dataSource = useSelector((state: RootState) => state.dataSource.dataSource)
  if (dataSource === "api") return <ClientApiContainer />
  return <ClientMockContainer />
}
