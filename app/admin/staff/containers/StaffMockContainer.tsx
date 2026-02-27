'use client';

import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '@/store/store';
import { loadMockStaff, setStaff } from '@/app/admin/staff/slice/staffSlice';
import type { User } from '@/interfaces/user/User';
import { STAFF_ROLE_NAME } from '@/app/admin/staff/constants';
import { userToStaffDisplay } from '@/app/admin/staff/utils/userToStaffDisplay';
import { StaffView } from '../components/StaffView';
import type { StaffMemberDisplay } from '@/interfaces/staff/StaffMemberDisplay';
import { useLanguage } from '@/lib/i18n-context';

export function StaffMockContainer() {
  const { t } = useLanguage();
  const dispatch = useDispatch();
  const staff = useSelector((state: RootState) => state.staff.staff);

  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editStaff, setEditStaff] = useState<StaffMemberDisplay | null>(null);

  useEffect(() => {
    dispatch(loadMockStaff());
  }, [dispatch]);

  const staffList: StaffMemberDisplay[] = useMemo(
    () => staff.map(userToStaffDisplay),
    [staff]
  );

  const handleDelete = (id: string) => {
    if (typeof window !== 'undefined' && !window.confirm(t('admin.confirmDelete') ?? '¿Eliminar este miembro del personal?')) return;
    dispatch(setStaff(staff.filter((u) => u.id !== id)));
  };

  const handleCreateSuccess = () => {
    setCreateDialogOpen(false);
  };

  const handleEditSuccess = () => {
    setEditStaff(null);
  };

  const handleMockCreate = (payload: { firstName: string; lastName: string; email: string; workStartTime?: string; workEndTime?: string; departmentId?: string }) => {
    const newUser: User = {
      id: `mock-${Date.now()}`,
      firstName: payload.firstName,
      lastName: payload.lastName,
      email: payload.email,
      roleName: STAFF_ROLE_NAME,
      status: 'active',
    };
    dispatch(setStaff([...staff, newUser]));
  };

  const handleMockUpdate = (id: string, payload: { firstName?: string; lastName?: string; email?: string; position?: string; status?: string }) => {
    dispatch(
      setStaff(
        staff.map((u) => (u.id === id ? { ...u, ...payload } : u))
      )
    );
  };

  return (
    <StaffView
      staffList={staffList}
      isLoading={false}
      createDialogOpen={createDialogOpen}
      setCreateDialogOpen={setCreateDialogOpen}
      editStaff={editStaff}
      setEditStaff={setEditStaff}
      onDelete={handleDelete}
      onCreateSuccess={handleCreateSuccess}
      onEditSuccess={handleEditSuccess}
      isApiMode={false}
      onMockCreate={handleMockCreate}
      onMockUpdate={handleMockUpdate}
    />
  );
}
