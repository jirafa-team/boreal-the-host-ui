'use client';

import { useSelector } from 'react-redux';
import type { RootState } from '@/store/store';
import { StaffApiContainer } from '@/app/admin/staff/containers/StaffApiContainer';
import { StaffMockContainer } from '@/app/admin/staff/containers/StaffMockContainer';

export default function StaffManagement() {
  const dataSource = useSelector((state: RootState) => state.dataSource.dataSource);

  if (dataSource === 'api') {
    return <StaffApiContainer />;
  }
  return <StaffMockContainer />;
}
