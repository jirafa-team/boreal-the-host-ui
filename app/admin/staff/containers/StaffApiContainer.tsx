'use client';

import { useState } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store/store';
import {
  useGetStaffQuery,
  useGetStaffStatsQuery,
  useDeleteStaffMutation,
} from '@/app/admin/staff/slice/staffSlice';
import { StaffView } from '../components/StaffView';
import type { StaffMemberDisplay } from '@/interfaces/staff/StaffMemberDisplay';

export function StaffApiContainer() {
  const dataSource = useSelector((state: RootState) => state.dataSource.dataSource);
  const isApiMode = dataSource === 'api';

  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editStaff, setEditStaff] = useState<StaffMemberDisplay | null>(null);

  const { data: apiData, isLoading, error, refetch } = useGetStaffQuery(undefined, {
    skip: !isApiMode,
  });
  const { data: statsData, isLoading: staffStatsLoading } = useGetStaffStatsQuery(undefined, {
    skip: !isApiMode,
  });

  const [deleteStaff] = useDeleteStaffMutation();

  const staffList: StaffMemberDisplay[] = apiData?.data?.objects ?? [];
  const staffStats = statsData?.data ?? null;

  const handleDelete = async (id: string) => {
    try {
      await deleteStaff(id).unwrap();
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
      staffStats={staffStats}
      staffStatsLoading={staffStatsLoading}
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
