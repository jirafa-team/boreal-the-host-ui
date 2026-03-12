"use client"

import { useSelector } from "react-redux"
import type { RootState } from "@/store/store"
import { StaysApiContainer } from "./containers/StaysApiContainer"
import { StaysMockContainer } from "./containers/StaysMockContainer"

export default function StaysPage() {
  const dataSource = useSelector((state: RootState) => state.dataSource.dataSource)

  if (dataSource === "api") {
    return <StaysApiContainer />
  }
  return <StaysMockContainer />
}
