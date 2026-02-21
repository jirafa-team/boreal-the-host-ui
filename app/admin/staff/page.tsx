'use client';

import { useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store/store';
import {
  useGetUsersQuery,
  useDeleteUserMutation,
} from '@/features/user/slices/userSlice';
import type { User } from '@/interfaces/user/User';
import { StaffList } from '@/features/staff/components/StaffList';
import { CreateStaffDialog } from '@/features/staff/components/CreateStaffDialog';
import { EditStaffDialog } from '@/features/staff/components/EditStaffDialog';
import { userToStaffDisplay } from '@/features/staff/utils/userToStaffDisplay';
import { STAFF_ROLE_NAME } from '@/features/staff/constants';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/lib/i18n-context';
import { Plus } from 'lucide-react';
import type { StaffMemberDisplay } from '@/interfaces/staff/StaffMemberDisplay';

const MOCK_STAFF: User[] = [
  { id: '1', firstName: 'María', lastName: 'González', email: 'maria@hotel.com', roleName: STAFF_ROLE_NAME, status: 'active' },
  { id: '2', firstName: 'Roberto', lastName: 'Fernández', email: 'roberto@hotel.com', roleName: STAFF_ROLE_NAME, status: 'active' },
  { id: '3', firstName: 'Carmen', lastName: 'Silva', email: 'carmen@hotel.com', roleName: STAFF_ROLE_NAME, status: 'active' },
  { id: '4', firstName: 'Diego', lastName: 'Ramírez', email: 'diego@hotel.com', roleName: STAFF_ROLE_NAME, status: 'active' },
  { id: '5', firstName: 'Laura', lastName: 'Pérez', email: 'laura@hotel.com', roleName: STAFF_ROLE_NAME, status: 'active' },
];

export default function StaffManagement() {
  const { t } = useLanguage();
  const dataSource = useSelector((state: RootState) => state.dataSource.dataSource);
  const isApiMode = dataSource === 'api';

  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editStaff, setEditStaff] = useState<StaffMemberDisplay | null>(null);
  const [mockList, setMockList] = useState<User[]>(MOCK_STAFF);

  const queryParams = useMemo(
    () => ({ filter: JSON.stringify({ userRole: STAFF_ROLE_NAME }) }),
    []
  );

  const { data: apiData, isLoading, error, refetch } = useGetUsersQuery(queryParams, {
    skip: !isApiMode,
  });

  const [deleteUser] = useDeleteUserMutation();

  const staffList: StaffMemberDisplay[] = useMemo(() => {
    const raw = isApiMode
      ? (apiData?.data as { objects?: User[] } | undefined)?.objects ?? []
      : mockList;
    return raw.map(userToStaffDisplay);
  }, [isApiMode, apiData, mockList]);

  const handleDelete = async (id: string) => {
    if (typeof window !== 'undefined' && !window.confirm(t('admin.confirmDelete') ?? '¿Eliminar este miembro del personal?')) return;
    if (isApiMode) {
      try {
        await deleteUser(id).unwrap();
        refetch();
      } catch {
        // error handled by mutation
      }
    } else {
      setMockList((prev) => prev.filter((u) => u.id !== id));
    }
  };

  const handleCreateSuccess = () => {
    setCreateDialogOpen(false);
    if (isApiMode) refetch();
  };

  const handleEditSuccess = () => {
    setEditStaff(null);
    if (isApiMode) refetch();
  };

  const handleMockCreate = (payload: { firstName: string; lastName: string; email: string }) => {
    const newUser: User = {
      id: `mock-${Date.now()}`,
      firstName: payload.firstName,
      lastName: payload.lastName,
      email: payload.email,
      roleName: STAFF_ROLE_NAME,
      status: 'active',
    };
    setMockList((prev) => [...prev, newUser]);
  };

  const handleMockUpdate = (id: string, payload: { firstName?: string; lastName?: string; email?: string; position?: string; status?: string }) => {
    setMockList((prev) =>
      prev.map((u) => (u.id === id ? { ...u, ...payload } : u))
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {t('admin.staffTitle') ?? t('admin.staffManagement') ?? 'Personal'}
            </h1>
            <p className="text-gray-600 mt-1">
              {staffList.length} {staffList.length === 1 ? (t('admin.staffMember') ?? 'miembro') : (t('admin.staffMembers') ?? 'miembros')}
            </p>
          </div>
          <Button
            onClick={() => setCreateDialogOpen(true)}
            className="gap-2 bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" />
            {t('admin.addStaff') ?? 'Añadir personal'}
          </Button>
        </div>

        {error && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-4 text-red-700">
              {'data' in error && error.data && typeof (error.data as { message?: string }).message === 'string'
                ? (error.data as { message: string }).message
                : 'Error al cargar el personal.'}
            </CardContent>
          </Card>
        )}

        <StaffList
          staffList={staffList}
          onEdit={setEditStaff}
          onDelete={handleDelete}
          isLoading={isLoading}
        />

        <CreateStaffDialog
          open={createDialogOpen}
          onClose={() => setCreateDialogOpen(false)}
          onSuccess={handleCreateSuccess}
          isApiMode={isApiMode}
          onMockCreate={!isApiMode ? handleMockCreate : undefined}
        />

        <EditStaffDialog
          open={!!editStaff}
          staff={editStaff}
          onClose={() => setEditStaff(null)}
          onSuccess={handleEditSuccess}
          onMockUpdate={!isApiMode ? handleMockUpdate : undefined}
        />
      </div>
    </div>
  );
}
