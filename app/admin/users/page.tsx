"use client"

import { useSelector } from "react-redux"
import type { RootState } from "@/store/store"
import { UsersApiContainer } from "./containers/UsersApiContainer"
import { UsersMockContainer } from "./containers/UsersMockContainer"

export default function UsersPage() {
  const dataSource = useSelector((state: RootState) => state.dataSource.dataSource)

  if (dataSource === "api") {
    return <UsersApiContainer />
  }
  return <UsersMockContainer />
}
