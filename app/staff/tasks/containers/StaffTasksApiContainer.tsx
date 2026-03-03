"use client";

import { useMemo } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { useGetStaffTasksQuery } from "@/features/staff-task/slices/staffTaskSlice";
import { StaffTasksView, mapStaffTaskToUi, type UiTask } from "../components/StaffTasksView";
import type { StaffTask } from "@/interfaces/staff-task/StaffTask";

function getTaskList(data: { objects?: StaffTask[]; staffTasks?: StaffTask[]; tasks?: StaffTask[] } | undefined): StaffTask[] {
  if (!data) return [];
  return data.objects ?? data.staffTasks ?? data.tasks ?? [];
}

export function StaffTasksApiContainer() {
  const userId = useSelector((state: RootState) => state.auth?.user?.uuid);
  const { data: apiData } = useGetStaffTasksQuery(
    userId ? { userId } : undefined,
    { skip: !userId }
  );

  const tasks: UiTask[] = useMemo(() => {
    const list = getTaskList(apiData?.data);
    return list.map((t) => mapStaffTaskToUi(t));
  }, [apiData?.data]);

  const onToggleTask = () => {
    // En modo API el cambio de estado se hace en la pantalla de detalle con useUpdateStaffTaskMutation
  };

  return <StaffTasksView tasks={tasks} onToggleTask={onToggleTask} />;
}
