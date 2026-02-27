'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/lib/i18n-context';
import { Calendar, Plus } from 'lucide-react';
import type { StaffMemberDisplay } from '@/interfaces/staff/StaffMemberDisplay';
import type { StaffStatsByDepartment } from '@/interfaces/staff/StaffStatsByDepartment';
import { StaffCardGrid } from './StaffCardGrid';
import { StaffKanbanTimeline } from './StaffKanbanTimeline';
import { DepartmentStatsCards } from './DepartmentStatsCards';
import { CreateStaffDialog } from './CreateStaffDialog';
import { EditStaffDialog } from './EditStaffDialog';

export interface StaffViewProps {
  staffList: StaffMemberDisplay[];
  isLoading: boolean;
  error?: unknown;
  staffStats?: StaffStatsByDepartment[] | null;
  staffStatsLoading?: boolean;
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
  staffStats = null,
  staffStatsLoading = false,
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
  const [viewMode, setViewMode] = useState<'overview' | 'kanban'>('overview');
  const [searchName, setSearchName] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [filterDate, setFilterDate] = useState('');
  const [activityDialogOpen, setActivityDialogOpen] = useState(false);

  const filteredList = useMemo(() => {
    let list = staffList;
    const q = searchName.toLowerCase().trim();
    if (q) {
      list = list.filter(
        (s) =>
          s.name?.toLowerCase().includes(q) ||
          s.email?.toLowerCase().includes(q) ||
          s.firstName?.toLowerCase().includes(q) ||
          s.lastName?.toLowerCase().includes(q)
      );
    }
    if (filterDepartment !== 'all') {
      list = list.filter((s) => (s.employee?.departmentName ?? '') === filterDepartment);
    }
    return list;
  }, [staffList, searchName, filterDepartment]);

  return (
    <>
      <header className="bg-card border-b border-border sticky top-0 z-10">
        <div className="px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">{t('admin.staffTitle')}</h1>
              <p className="text-sm text-muted-foreground">{t('admin.manageYour')} {t('admin.staffMembers')}</p>
            </div>
            <div className="flex gap-4 items-center ml-auto">
              <div className="inline-flex h-10 items-center rounded-lg bg-gray-100 p-1 border border-gray-200">
                <button
                  type="button"
                  onClick={() => setViewMode('overview')}
                  className={`px-5 py-2 rounded-md font-medium text-sm transition-all ${
                    viewMode === 'overview' ? 'text-white shadow-md' : 'text-gray-700 hover:text-gray-900'
                  }`}
                  style={viewMode === 'overview' ? { backgroundColor: '#394a63' } : {}}
                >
                  General
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('kanban')}
                  className={`px-5 py-2 rounded-md font-medium text-sm transition-all ${
                    viewMode === 'kanban' ? 'text-white shadow-md' : 'text-gray-700 hover:text-gray-900'
                  }`}
                  style={viewMode === 'kanban' ? { backgroundColor: '#394a63' } : {}}
                >
                  Kanban
                </button>
              </div>
              <Dialog open={activityDialogOpen} onOpenChange={setActivityDialogOpen}>
                <button
                  type="button"
                  onClick={() => setActivityDialogOpen(true)}
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 text-white shadow-md hover:shadow-lg transition-all duration-300 hover:scale-110 group relative"
                  title={t('admin.createActivity')}
                >
                  <div className="relative flex items-center justify-center">
                    <Calendar className="w-5 h-5" />
                    <span className="absolute text-base font-bold -bottom-0.5 -right-0.5 text-white drop-shadow-lg">+</span>
                  </div>
                  <span className="absolute top-full mt-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                    {t('admin.createActivity')}
                  </span>
                </button>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>{t('admin.createNewActivity')}</DialogTitle>
                    <DialogDescription>{t('admin.assignActivityToStaff')}</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-5 py-4">
                    <div>
                      <Label htmlFor="assignedTo" className="text-sm font-medium mb-2 block">{t('admin.assignTo')}</Label>
                      <Select disabled>
                        <SelectTrigger id="assignedTo" className="h-10">
                          <SelectValue placeholder={t('admin.selectStaff')} />
                        </SelectTrigger>
                        <SelectContent>
                          {staffList.map((member) => (
                            <SelectItem key={member.id} value={member.id}>
                              {member.name} ({member.employee?.departmentName ?? '—'})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
              <button
                type="button"
                onClick={() => setCreateDialogOpen(true)}
                className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 border border-gray-200 text-gray-700 hover:bg-gray-200"
                title={t('admin.addStaff') ?? 'Añadir personal'}
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="space-y-4 p-6">
        <DepartmentStatsCards staffStats={staffStats ?? []} isLoading={staffStatsLoading} />

        <Card className="p-4">
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <Label htmlFor="search-name" className="text-sm font-medium">Buscar por nombre</Label>
              <Input
                id="search-name"
                placeholder="Ej: María, Roberto..."
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                className="mt-2"
              />
            </div>
            <div className="w-48">
              <Label htmlFor="filter-dept" className="text-sm font-medium">Filtrar por departamento</Label>
              <Select value={filterDepartment} onValueChange={setFilterDepartment}>
                <SelectTrigger id="filter-dept" className="mt-2">
                  <SelectValue placeholder="Todos los departamentos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los departamentos</SelectItem>
                  <SelectItem value="Limpieza">Limpieza</SelectItem>
                  <SelectItem value="Mantenimiento">Mantenimiento</SelectItem>
                  <SelectItem value="Seguridad">Seguridad</SelectItem>
                  <SelectItem value="Recepción">Recepción</SelectItem>
                  <SelectItem value="Servicio">Servicio</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="w-48">
              <Label htmlFor="filter-date" className="text-sm font-medium">Filtrar por fecha</Label>
              <Input
                id="filter-date"
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="mt-2"
              />
            </div>
          </div>
        </Card>

        {error && (
          <Card className="border-destructive bg-destructive/10">
            <CardContent className="p-4 text-destructive">
              {t('admin.errorLoadingStaff') ?? 'Error al cargar el personal.'}
            </CardContent>
          </Card>
        )}

        {viewMode === 'overview' ? (
          <StaffCardGrid
            staffList={filteredList}
            onEdit={setEditStaff}
            onDelete={onDelete}
            isLoading={isLoading}
          />
        ) : (
          <StaffKanbanTimeline
            staffList={filteredList}
            onEdit={setEditStaff}
            isLoading={isLoading}
          />
        )}

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
    </>
  );
}
