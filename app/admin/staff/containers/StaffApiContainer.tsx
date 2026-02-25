'use client';

import { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store/store';
import {
  useGetUsersQuery,
  useDeleteUserMutation,
} from '@/features/user/slices/userSlice';
import type { User } from '@/interfaces/user/User';
import { STAFF_ROLE_NAME } from '@/app/admin/staff/constants';
import { userToStaffDisplay } from '@/app/admin/staff/utils/userToStaffDisplay';
import { StaffView } from '../components/StaffView';
import type { StaffMemberDisplay } from '@/interfaces/staff/StaffMemberDisplay';
import { useLanguage } from '@/lib/i18n-context';

export function StaffApiContainer() {
  const { t } = useLanguage();
  const dataSource = useSelector((state: RootState) => state.dataSource.dataSource);
  const isApiMode = dataSource === 'api';

  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editStaff, setEditStaff] = useState<StaffMemberDisplay | null>(null);

  const queryParams = useMemo(
    () => ({ filter: JSON.stringify({ userRole: STAFF_ROLE_NAME }) }),
    []
  );

  const { data: apiData, isLoading, error, refetch } = useGetUsersQuery(queryParams, {
    skip: !isApiMode,
  });

  const [deleteUser] = useDeleteUserMutation();

  const staffList: StaffMemberDisplay[] = useMemo(() => {
    const raw = (apiData?.data as { objects?: User[] } | undefined)?.objects ?? [];
    return raw.map(userToStaffDisplay);
  }, [apiData]);

  const handleDelete = async (id: string) => {
    if (typeof window !== 'undefined' && !window.confirm(t('admin.confirmDelete') ?? '¿Eliminar este miembro del personal?')) return;
    try {
      await deleteUser(id).unwrap();
      refetch();
    } catch {
      // error handled by mutation
    }
  };

  const handleCreateSuccess = () => {
    setCreateDialogOpen(false);
    refetch();
  };

  const handleEditSuccess = () => {
    setEditStaff(null);
    refetch();
  };

  return (
    <StaffView
      staffList={staffList}
      isLoading={isLoading}
      error={error}
      createDialogOpen={createDialogOpen}
      setCreateDialogOpen={setCreateDialogOpen}
      editStaff={editStaff}
      setEditStaff={setEditStaff}
      onDelete={handleDelete}
      onCreateSuccess={handleCreateSuccess}
      onEditSuccess={handleEditSuccess}
      isApiMode={true}
    />
  );
}
