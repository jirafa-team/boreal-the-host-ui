"use client"

import { useSelector } from "react-redux"
import type { RootState } from "@/store/store"
import { FacilitiesApiContainer } from "./containers/FacilitiesApiContainer"
import { FacilitiesMockContainer } from "./containers/FacilitiesMockContainer"

export default function FacilitiesPage() {
  const dataSource = useSelector((state: RootState) => state.dataSource.dataSource)

  if (dataSource === "api") {
    return <FacilitiesApiContainer />
  }
  return <FacilitiesMockContainer />
}
