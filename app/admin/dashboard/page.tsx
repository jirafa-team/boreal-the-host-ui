"use client"

import { useSelector } from "react-redux"
import type { RootState } from "@/store/store"
import { DashboardApiContainer } from "./containers/DashboardApiContainer"
import { DashboardMockContainer } from "./containers/DashboardMockContainer"

export default function DashboardControl() {
  const dataSource = useSelector(
    (state: RootState) => state.dataSource.dataSource
  )

  if (dataSource === "api") {
    return <DashboardApiContainer />
  }
  return <DashboardMockContainer />
}
