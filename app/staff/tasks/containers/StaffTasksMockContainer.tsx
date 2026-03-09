"use client";

import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import {
  loadMockStaffTasks,
  setTasks,
} from "@/features/staff-task/slices/staffTaskSlice";
import { StaffTasksView, mapStaffTaskToUi, type UiTask } from "../components/StaffTasksView";
import type { StaffTask } from "@/interfaces/staff-task/StaffTask";

const statusMap = {
  pending: "in-progress",
  "in-progress": "completed",
  completed: "pending",
} as const;

export function StaffTasksMockContainer() {
  const dispatch = useDispatch();
  const tasksFromSlice = useSelector((state: RootState) => state.staffTask.tasks);

  useEffect(() => {
    dispatch(loadMockStaffTasks());
  }, [dispatch]);

  const tasks: UiTask[] = useMemo(
    () => tasksFromSlice.map((t) => mapStaffTaskToUi(t as StaffTask)),
    [tasksFromSlice]
  );

  const onToggleTask = (id: number | string) => {
    const next = tasksFromSlice.map((t) =>
      t.id === String(id)
        ? {
            ...t,
            status:
              statusMap[(t.status as keyof typeof statusMap) ?? "pending"] ?? "pending",
          }
        : t
    );
    dispatch(setTasks(next));
  };

  return <StaffTasksView tasks={tasks} onToggleTask={onToggleTask} />;
}
