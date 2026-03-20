'use client';

import { useMemo, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store/store';
import { useGetStaffQuery } from '@/app/admin/staff/slice/staffSlice';
import { useCreateUserMutation } from '@/app/admin/users/slice/userSlice';
import { useGetDepartmentsQuery } from '@/features/taxonomy-department/slices/taxonomyDepartmentSlice';
import { useCreateStaffTaskMutation } from '@/features/staff-task/slices/staffTaskSlice';
import { staffDisplayToView } from '@/app/admin/staff/utils/staffDisplayToView';
import { StaffView } from '../components/StaffView';
import type { StaffMemberView, NewStaffForm, NewTaskForm } from '../components/types';
import { useLanguage } from '@/lib/i18n-context';
import { STAFF_ROLE_NAME, SHIFT_TO_SCHEDULE } from '@/app/admin/staff/constants';

const initialNewStaff: NewStaffForm = {
  name: '',
  email: '',
  department: 'Limpieza',
  shift: 'morning',
  password: '',
};

const initialNewTask: NewTaskForm = {
  description: '',
  priority: 'normal',
  estimatedDurationMinutes: 30,
  scheduledDate: '',
  scheduledTime: '',
};

export function StaffApiContainer() {
  const { t } = useLanguage();
  const dataSource = useSelector((state: RootState) => state.dataSource.dataSource);
  const isApiMode = dataSource === 'api';

  const { data: apiData, isLoading, error, refetch } = useGetStaffQuery(undefined, {
    skip: !isApiMode,
  });
  const [createUser] = useCreateUserMutation();
  const [createStaffTask] = useCreateStaffTaskMutation();
  const [loading, setLoading] = useState<boolean>(false);
  const { data: departmentsData } = useGetDepartmentsQuery(undefined, { skip: !isApiMode });
  const departments = departmentsData?.data ?? [];

  const staff: StaffMemberView[] = useMemo(() => {
    const list = apiData?.data?.objects ?? [];
    return list.map(staffDisplayToView);
  }, [apiData]);

  const [searchName, setSearchName] = useState('');
  const [selectedStaff, setSelectedStaff] = useState<StaffMemberView | null>(null);
  const [staffForTask, setStaffForTask] = useState<StaffMemberView | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showAssignTaskDialog, setShowAssignTaskDialog] = useState(false);
  const [newStaff, setNewStaff] = useState<NewStaffForm>(initialNewStaff);
  const [newTask, setNewTask] = useState<NewTaskForm>(initialNewTask);
  const [showScheduleEditor, setShowScheduleEditor] = useState(false);
  const [scheduleStaffId, setScheduleStaffId] = useState<string | null>(null);
  const [scheduleStaffName, setScheduleStaffName] = useState('');

  const resolveDepartmentId = useCallback(
    (departmentName: string): string | undefined => {
      const byName = departments.find(
        (d) => d.name?.toLowerCase() === departmentName.toLowerCase()
      );
      return byName?.id;
    },
    [departments]
  );

  const handleAddStaff = useCallback(async () => {
    if (!newStaff.name.trim() || !newStaff.email.trim()) return;
    const [firstName, ...lastParts] = newStaff.name.trim().split(/\s+/);
    const lastName = lastParts.join(' ') || firstName;
    const schedule = SHIFT_TO_SCHEDULE[newStaff.shift] ?? SHIFT_TO_SCHEDULE.morning;
    const departmentId = resolveDepartmentId(newStaff.department);
    try {
      setLoading(true);
      await createUser({
        firstName,
        lastName,
        email: newStaff.email.trim(),
        roleName: STAFF_ROLE_NAME,
        departmentId: departmentId ?? undefined,
        workStartTime: schedule.workStartTime,
        workEndTime: schedule.workEndTime,
        ...(newStaff.password.trim() && { password: newStaff.password.trim() }),
      }).unwrap();
      setShowAddDialog(false);
      setNewStaff(initialNewStaff);
      setLoading(false)
      refetch();
    } catch {
      // Error handled by mutation / UI
    }
  }, [newStaff, createUser, resolveDepartmentId, refetch]);

  const handleOpenAssignTask = useCallback(() => {
    setStaffForTask(selectedStaff);
    setSelectedStaff(null);
    setShowAssignTaskDialog(true);
  }, [selectedStaff]);

  const handleOpenScheduleEditor = useCallback((staffId: string, staffName: string) => {
    setScheduleStaffId(staffId);
    setScheduleStaffName(staffName);
    setShowScheduleEditor(true);
  }, []);

  const handleCloseScheduleEditor = useCallback((open: boolean) => {
    if (!open) {
      setShowScheduleEditor(false);
      setScheduleStaffId(null);
      setScheduleStaffName('');
    }
  }, []);

  const handleCloseAssignTask = useCallback((open: boolean) => {
    if (!open) {
      setShowAssignTaskDialog(false);
      setStaffForTask(null);
    }
  }, []);

  const handleAssignTask = useCallback(async () => {
    if (!staffForTask || !newTask.description.trim() || !newTask.scheduledDate || !newTask.scheduledTime) return;
    try {
      setLoading(true);
      await createStaffTask({
        userId: staffForTask.id,
        scheduledStartAt: new Date(`${newTask.scheduledDate}T${newTask.scheduledTime}`).toISOString(),
        description: newTask.description.trim(),
        estimatedDurationMinutes: newTask.estimatedDurationMinutes,
      }).unwrap();
      setShowAssignTaskDialog(false);
      setStaffForTask(null);
      setNewTask(initialNewTask);
    } catch {
      // error handled by mutation/UI
    } finally {
      setLoading(false);
    }
  }, [staffForTask, newTask, createStaffTask]);

  return (
    <StaffView
      staff={staff}
      isLoading={isLoading}
      error={error}
      searchName={searchName}
      onSearchNameChange={setSearchName}
      selectedStaff={selectedStaff}
      onSelectedStaffChange={setSelectedStaff}
      showAddDialog={showAddDialog}
      onShowAddDialogChange={setShowAddDialog}
      showAssignTaskDialog={showAssignTaskDialog}
      onShowAssignTaskDialogChange={handleCloseAssignTask}
      staffForTask={staffForTask}
      onOpenAssignTask={handleOpenAssignTask}
      newStaff={newStaff}
      onNewStaffChange={setNewStaff}
      newTask={newTask}
      onNewTaskChange={setNewTask}
      onAddStaff={handleAddStaff}
      onAssignTask={handleAssignTask}
      t={t}
      loading={loading}
      departments={departments}
      showScheduleEditor={showScheduleEditor}
      scheduleStaffId={scheduleStaffId}
      scheduleStaffName={scheduleStaffName}
      onOpenScheduleEditor={handleOpenScheduleEditor}
      onCloseScheduleEditor={handleCloseScheduleEditor}
    />
  );
}
