'use client';

import { useEffect, useMemo, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '@/store/store';
import { loadMockStaff, setStaff } from '@/app/admin/staff/slice/staffSlice';
import type { UserWithOptionalStaff } from '@/app/admin/staff/utils/userToStaffDisplay';
import { userToStaffDisplay } from '@/app/admin/staff/utils/userToStaffDisplay';
import { staffDisplayToView } from '@/app/admin/staff/utils/staffDisplayToView';
import { StaffView } from '../components/StaffView';
import type {
  StaffMemberView,
  NewStaffForm,
  NewTaskForm,
} from '../components/types';
import { useLanguage } from '@/lib/i18n-context';
import { SHIFT_TO_SCHEDULE } from '@/app/admin/staff/constants';

const MOCK_DEPARTMENTS = [
  { id: '1', name: 'Limpieza' },
  { id: '2', name: 'Mantenimiento' },
  { id: '3', name: 'Seguridad' },
  { id: '4', name: 'Recepción' },
  { id: '5', name: 'Servicio' },
];

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

export function StaffMockContainer() {
  const { t } = useLanguage();
  const dispatch = useDispatch();
  const staffFromSlice = useSelector((state: RootState) => state.staff.staff);

  const [searchName, setSearchName] = useState('');
  const [selectedStaff, setSelectedStaff] = useState<StaffMemberView | null>(
    null
  );
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showAssignTaskDialog, setShowAssignTaskDialog] = useState(false);
  const [newStaff, setNewStaff] = useState<NewStaffForm>(initialNewStaff);
  const [newTask, setNewTask] = useState<NewTaskForm>(initialNewTask);

  useEffect(() => {
    dispatch(loadMockStaff());
  }, [dispatch]);

  const staff: StaffMemberView[] = useMemo(() => {
    const list = staffFromSlice.map(userToStaffDisplay);
    return list.map(staffDisplayToView);
  }, [staffFromSlice]);

  const handleAddStaff = useCallback(() => {
    if (!newStaff.name.trim() || !newStaff.email.trim()) return;
    const scheduleData = SHIFT_TO_SCHEDULE[newStaff.shift] ?? SHIFT_TO_SCHEDULE.morning;
    const [firstName, ...lastParts] = newStaff.name.trim().split(/\s+/);
    const lastName = lastParts.join(' ') || firstName;
    const newMember: UserWithOptionalStaff = {
      id: `mock-${Date.now()}`,
      firstName,
      lastName,
      name: newStaff.name.trim(),
      email: newStaff.email.trim(),
      roleName: 'Staff',
      status: 'active',
      employee: {
        workStatus: 'available',
        departmentName: newStaff.department as string,
        workStartTime: scheduleData.workStartTime,
        workEndTime: scheduleData.workEndTime,
        tasksToday: 0,
        maxCapacity: 8,
      },
    };
    dispatch(setStaff([...staffFromSlice, newMember]));
    setShowAddDialog(false);
    setNewStaff(initialNewStaff);
  }, [newStaff, staffFromSlice, dispatch]);

  const handleAssignTask = useCallback(() => {
    if (!selectedStaff || !newTask.description.trim()) return;
    const nextList = staffFromSlice.map((u) => {
      if (u.id !== selectedStaff.id) return u;
      const current = (u as UserWithOptionalStaff).employee?.tasksToday ?? 0;
      const max = (u as UserWithOptionalStaff).employee?.maxCapacity ?? 8;
      return {
        ...u,
        employee: {
          ...(u as UserWithOptionalStaff).employee,
          tasksToday: Math.min(current + 1, max),
          maxCapacity: (u as UserWithOptionalStaff).employee?.maxCapacity ?? 8,
        },
      };
    }) as UserWithOptionalStaff[];
    dispatch(setStaff(nextList));
    setShowAssignTaskDialog(false);
    setNewTask(initialNewTask);
    setSelectedStaff((prev) => {
      if (!prev || prev.id !== selectedStaff.id) return prev;
      const max = prev.maxCapacity;
      return {
        ...prev,
        tasksToday: Math.min(prev.tasksToday + 1, max),
      };
    });
  }, [selectedStaff, newTask, staffFromSlice, dispatch]);

  return (
    <StaffView
      staff={staff}
      isLoading={false}
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
      departments={MOCK_DEPARTMENTS}
    />
  );
}
