"use client"

import { useSelector } from "react-redux"
import type { RootState } from "@/store/store"
import { RoomsApiContainer } from "./containers/RoomsApiContainer"
import { RoomsMockContainer } from "./containers/RoomsMockContainer"

export default function RoomsManagement() {
  const dataSource = useSelector((state: RootState) => state.dataSource.dataSource)

  if (dataSource === "api") {
    return <RoomsApiContainer />
  }
  return <RoomsMockContainer />
}
