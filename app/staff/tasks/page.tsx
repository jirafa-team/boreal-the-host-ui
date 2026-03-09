"use client";

import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { StaffTasksApiContainer } from "./containers/StaffTasksApiContainer";
import { StaffTasksMockContainer } from "./containers/StaffTasksMockContainer";

export default function StaffTasksPage() {
  const dataSource = useSelector((state: RootState) => state.dataSource.dataSource);

  if (dataSource === "api") {
    return <StaffTasksApiContainer />;
  }
  return <StaffTasksMockContainer />;
}
