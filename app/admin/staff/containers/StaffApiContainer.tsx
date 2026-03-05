'use client';

import { useMemo, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store/store';
import { useGetStaffQuery } from '@/app/admin/staff/slice/staffSlice';
import { useCreateUserMutation } from '@/app/admin/users/slice/userSlice';
import { useGetDepartmentsQuery } from '@/features/taxonomy-department/slices/taxonomyDepartmentSlice';
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
};

const initialNewTask: NewTaskForm = {
  description: '',
  priority: 'normal',
  deliveryTime: '1',
};

export function StaffApiContainer() {
  const { t } = useLanguage();
  const dataSource = useSelector((state: RootState) => state.dataSource.dataSource);
  const isApiMode = dataSource === 'api';

  const { data: apiData, isLoading, error, refetch } = useGetStaffQuery(undefined, {
    skip: !isApiMode,
  });
  const [createUser] = useCreateUserMutation();
  const { data: departmentsData } = useGetDepartmentsQuery(undefined, { skip: !isApiMode });
  const departments = departmentsData?.data ?? [];

  const staff: StaffMemberView[] = useMemo(() => {
    const list = apiData?.data?.objects ?? [];
    return list.map(staffDisplayToView);
  }, [apiData]);

  const [searchName, setSearchName] = useState('');
  const [selectedStaff, setSelectedStaff] = useState<StaffMemberView | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showAssignTaskDialog, setShowAssignTaskDialog] = useState(false);
  const [newStaff, setNewStaff] = useState<NewStaffForm>(initialNewStaff);
  const [newTask, setNewTask] = useState<NewTaskForm>(initialNewTask);

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
      await createUser({
        firstName,
        lastName,
        email: newStaff.email.trim(),
        roleName: STAFF_ROLE_NAME,
        departmentId: departmentId ?? undefined,
        workStartTime: schedule.workStartTime,
        workEndTime: schedule.workEndTime,
      }).unwrap();
      setShowAddDialog(false);
      setNewStaff(initialNewStaff);
      refetch();
    } catch {
      // Error handled by mutation / UI
    }
  }, [newStaff, createUser, resolveDepartmentId, refetch]);

  const handleAssignTask = useCallback(() => {
    // No assign-task API wired; close dialog and reset form
    setShowAssignTaskDialog(false);
    setNewTask(initialNewTask);
  }, []);

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
      onShowAssignTaskDialogChange={setShowAssignTaskDialog}
      newStaff={newStaff}
      onNewStaffChange={setNewStaff}
      newTask={newTask}
      onNewTaskChange={setNewTask}
      onAddStaff={handleAddStaff}
      onAssignTask={handleAssignTask}
      t={t}
    />
  );
}
