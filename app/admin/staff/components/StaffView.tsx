'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/lib/i18n-context';
import { Plus } from 'lucide-react';
import type { StaffMemberDisplay } from '@/interfaces/staff/StaffMemberDisplay';
import { StaffList } from './StaffList';
import { CreateStaffDialog } from './CreateStaffDialog';
import { EditStaffDialog } from './EditStaffDialog';

export interface StaffViewProps {
  staffList: StaffMemberDisplay[];
  isLoading: boolean;
  error?: unknown;
  createDialogOpen: boolean;
  setCreateDialogOpen: (open: boolean) => void;
  editStaff: StaffMemberDisplay | null;
  setEditStaff: (staff: StaffMemberDisplay | null) => void;
  onDelete: (id: string) => void;
  onCreateSuccess: () => void;
  onEditSuccess: () => void;
  isApiMode: boolean;
  onMockCreate?: (payload: { firstName: string; lastName: string; email: string; workStartTime?: string; workEndTime?: string; departmentId?: string }) => void;
  onMockUpdate?: (id: string, payload: { firstName?: string; lastName?: string; email?: string; position?: string; status?: string }) => void;
}

export function StaffView({
  staffList,
  isLoading,
  error,
  createDialogOpen,
  setCreateDialogOpen,
  editStaff,
  setEditStaff,
  onDelete,
  onCreateSuccess,
  onEditSuccess,
  isApiMode,
  onMockCreate,
  onMockUpdate,
}: StaffViewProps) {
  const { t } = useLanguage();

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

        <StaffList
          staffList={staffList}
          onEdit={setEditStaff}
          onDelete={onDelete}
          isLoading={isLoading}
        />

        <CreateStaffDialog
          open={createDialogOpen}
          onClose={() => setCreateDialogOpen(false)}
          onSuccess={onCreateSuccess}
          isApiMode={isApiMode}
          onMockCreate={!isApiMode ? onMockCreate : undefined}
        />

        <EditStaffDialog
          open={!!editStaff}
          staff={editStaff}
          onClose={() => setEditStaff(null)}
          onSuccess={onEditSuccess}
          onMockUpdate={!isApiMode ? onMockUpdate : undefined}
        />
      </div>
    </div>
  );
}
