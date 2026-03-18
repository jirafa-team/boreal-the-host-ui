'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Plus, CheckSquare, Clock } from 'lucide-react';
import type { StaffMemberView, NewStaffForm, NewTaskForm } from './types';
import { CreateStaffDialog } from './CreateStaffDialog';
import { AssignTaskDialog } from './AssignTaskDialog';
import { StaffScheduleEditor } from './StaffScheduleEditor';

type TFunction = (key: string) => string;

export type StaffViewProps = {
  staff: StaffMemberView[];
  isLoading?: boolean;
  error?: unknown;
  searchName: string;
  onSearchNameChange: (value: string) => void;
  selectedStaff: StaffMemberView | null;
  onSelectedStaffChange: (member: StaffMemberView | null) => void;
  showAddDialog: boolean;
  onShowAddDialogChange: (open: boolean) => void;
  showAssignTaskDialog: boolean;
  onShowAssignTaskDialogChange: (open: boolean) => void;
  staffForTask: StaffMemberView | null;
  onOpenAssignTask: () => void;
  newStaff: NewStaffForm;
  onNewStaffChange: (updater: (prev: NewStaffForm) => NewStaffForm) => void;
  newTask: NewTaskForm;
  onNewTaskChange: (updater: (prev: NewTaskForm) => NewTaskForm) => void;
  onAddStaff: () => void;
  onAssignTask: () => void;
  t: TFunction;
  loading?: boolean;
  departments?: Array<{ id: string; name: string }>;
  showScheduleEditor?: boolean;
  scheduleStaffId?: string | null;
  scheduleStaffName?: string;
  onOpenScheduleEditor?: (staffId: string, staffName: string) => void;
  onCloseScheduleEditor?: (open: boolean) => void;
};

function getStatusColor(status: string): string {
  switch (status) {
    case 'available':
      return 'bg-green-500';
    case 'busy':
      return 'bg-yellow-500';
    case 'off':
      return 'bg-gray-400';
    default:
      return 'bg-gray-400';
  }
}

export function StaffView({
  staff,
  isLoading,
  error,
  searchName,
  onSearchNameChange,
  selectedStaff,
  onSelectedStaffChange,
  showAddDialog,
  onShowAddDialogChange,
  showAssignTaskDialog,
  onShowAssignTaskDialogChange,
  staffForTask,
  onOpenAssignTask,
  newStaff,
  onNewStaffChange,
  newTask,
  onNewTaskChange,
  onAddStaff,
  onAssignTask,
  t,
  loading,
  departments,
  showScheduleEditor,
  scheduleStaffId,
  scheduleStaffName,
  onOpenScheduleEditor,
  onCloseScheduleEditor,
}: StaffViewProps) {
  const getStatusText = (status: string) => {
    switch (status) {
      case 'available':
        return t('admin.available');
      case 'busy':
        return t('admin.busy');
      case 'off':
        return t('admin.off');
      default:
        return status;
    }
  };

  const filteredStaff = staff.filter((member) =>
    member.name.toLowerCase().includes(searchName.toLowerCase())
  );

  return (
    <div className="flex flex-col h-screen bg-background">
      <header className="bg-card border-b border-border px-8 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {t('admin.staffTitle')}
            </h1>
            <p className="text-sm text-muted-foreground">
              {t('admin.manageYour')} {t('admin.staffMembers')}
            </p>
          </div>
          <Dialog open={showAddDialog} onOpenChange={onShowAddDialogChange}>
            <DialogTrigger asChild>
              <button
                className="flex items-center justify-center w-10 h-10 rounded-full text-white shadow-md hover:shadow-lg transition-all duration-300 hover:scale-110 group relative"
                style={{ backgroundColor: '#1557F6' }}
                title={t('admin.addStaff')}
              >
                <Plus className="w-5 h-5" />
                <span className="absolute top-full mt-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                  {t('admin.addStaff')}
                </span>
              </button>
            </DialogTrigger>
            <CreateStaffDialog
              open={showAddDialog}
              onOpenChange={onShowAddDialogChange}
              newStaff={newStaff}
              onNewStaffChange={onNewStaffChange}
              onSubmit={onAddStaff}
              t={t}
              loading={loading}
              departments={departments}
            />
          </Dialog>
        </div>
      </header>

      <div className="flex-1 overflow-auto p-8">
        <div className="space-y-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="search" className="text-sm font-medium">
                {t('admin.searchByName')}
              </Label>
              <Input
                id="search"
                placeholder={t('admin.searchUsers')}
                value={searchName}
                onChange={(e) => onSearchNameChange(e.target.value)}
                className="mt-2"
              />
            </div>
          </div>

          {error && (
            <p className="text-sm text-destructive">
              {t('admin.errorLoadingStaff') ?? 'Error al cargar el personal.'}
            </p>
          )}

          {isLoading ? (
            <p className="text-sm text-muted-foreground py-4">Cargando...</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {staff.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <p className="text-muted-foreground">{t('admin.selectFeature')}</p>
                </div>
              ) : (
                filteredStaff.map((member) => (
                  <Card
                    key={member.id}
                    className="p-4 cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => onSelectedStaffChange(member)}
                  >
                    <div className="flex flex-col items-center text-center">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center text-white font-bold shadow-md mb-3">
                        {member.avatar}
                      </div>
                      <h3 className="font-semibold text-foreground text-sm">
                        {member.name}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {member.department}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {member.shift}
                      </p>
                      <Badge
                        className={`${getStatusColor(member.status)} text-white mt-3`}
                      >
                        {getStatusText(member.status)}
                      </Badge>
                    </div>
                    <div className="mt-4 pt-4 border-t border-border">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          {t('admin.tasksToday')}
                        </span>
                        <span className="font-semibold text-foreground">
                          {member.completedTasks} / {member.totalTasks}
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2 mt-2">
                        <div
                          className="bg-primary rounded-full h-2 transition-all"
                          style={{
                            width: `${member.totalTasks > 0 ? (member.completedTasks / member.totalTasks) * 100 : 0}%`,
                          }}
                        />
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {selectedStaff && (
        <Dialog
          open={!!selectedStaff}
          onOpenChange={(open) => !open && onSelectedStaffChange(null)}
        >
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{t('admin.staffDetails')}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  {selectedStaff.avatar}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground">
                    {selectedStaff.name}
                  </h3>
                  <Badge
                    className={`${getStatusColor(selectedStaff.status)} text-white mt-1`}
                  >
                    {getStatusText(selectedStaff.status)}
                  </Badge>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">
                    {t('admin.department')}
                  </span>
                  <span className="font-medium text-foreground">
                    {selectedStaff.department}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">
                    {t('admin.shift')}
                  </span>
                  <span className="font-medium text-foreground">
                    {selectedStaff.shift}
                  </span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-muted-foreground">
                    {t('admin.tasksToday')}
                  </span>
                  <span className="font-medium text-foreground">
                    {selectedStaff.tasksToday}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => {
                    if (onOpenScheduleEditor && selectedStaff) {
                      onSelectedStaffChange(null);
                      onOpenScheduleEditor(selectedStaff.id, selectedStaff.name);
                    }
                  }}
                  variant="outline"
                  className="flex-1"
                >
                  <Clock className="w-4 h-4 mr-2" />
                  Horario
                </Button>
                <Button
                  onClick={onOpenAssignTask}
                  className="flex-1 bg-amber-600 hover:bg-amber-700"
                >
                  <CheckSquare className="w-4 h-4 mr-2" />
                  {t('admin.createActivity')}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      <AssignTaskDialog
        open={showAssignTaskDialog}
        onOpenChange={onShowAssignTaskDialogChange}
        selectedStaffName={staffForTask?.name ?? ''}
        newTask={newTask}
        onNewTaskChange={onNewTaskChange}
        onSubmit={onAssignTask}
        t={t}
      />

      {onCloseScheduleEditor && (
        <StaffScheduleEditor
          staffId={scheduleStaffId ?? null}
          staffName={scheduleStaffName}
          open={!!showScheduleEditor}
          onOpenChange={onCloseScheduleEditor}
        />
      )}
    </div>
  );
}
