'use client';

import { useSelector } from 'react-redux';
import type { RootState } from '@/store/store';
import { StaffApiContainer } from './containers/StaffApiContainer';
import { StaffMockContainer } from './containers/StaffMockContainer';

export default function StaffManagement() {
  const dataSource = useSelector((state: RootState) => state.dataSource.dataSource);

  if (dataSource === 'api') {
    return <StaffApiContainer />;
  }
  return <StaffMockContainer />;
}
