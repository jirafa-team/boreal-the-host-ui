'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { NewTaskForm } from './types';

type TFunction = (key: string) => string;

export type AssignTaskDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedStaffName: string;
  newTask: NewTaskForm;
  onNewTaskChange: (updater: (prev: NewTaskForm) => NewTaskForm) => void;
  onSubmit: () => void;
  t: TFunction;
};

export function AssignTaskDialog({
  open,
  onOpenChange,
  selectedStaffName,
  newTask,
  onNewTaskChange,
  onSubmit,
  t,
}: AssignTaskDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{t('admin.createActivity')}</DialogTitle>
          <DialogDescription>
            {t('admin.assignActivityToStaff')}:{' '}
            <span className="font-semibold">{selectedStaffName}</span>
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div>
            <Label htmlFor="description" className="text-sm font-medium">
              {t('admin.activityDescription')}
            </Label>
            <Input
              id="description"
              placeholder={t('admin.exampleActivityDescription')}
              value={newTask.description}
              onChange={(e) =>
                onNewTaskChange((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="priority" className="text-sm font-medium">
              {t('admin.priority')}
            </Label>
            <Select
              value={newTask.priority}
              onValueChange={(value: 'normal' | 'urgent') =>
                onNewTaskChange((prev) => ({ ...prev, priority: value }))
              }
            >
              <SelectTrigger className="mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="normal">{t('admin.normal')}</SelectItem>
                <SelectItem value="urgent">{t('admin.urgent')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="estimatedDuration" className="text-sm font-medium">
              {t('admin.estimatedDuration')}
            </Label>
            <Select
              value={newTask.estimatedDurationMinutes.toString()}
              onValueChange={(v) =>
                onNewTaskChange((prev) => ({
                  ...prev,
                  estimatedDurationMinutes: Number(v),
                }))
              }
            >
              <SelectTrigger className="mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15">15 min</SelectItem>
                <SelectItem value="30">30 min</SelectItem>
                <SelectItem value="45">45 min</SelectItem>
                <SelectItem value="60">1 hora</SelectItem>
                <SelectItem value="90">1.5 horas</SelectItem>
                <SelectItem value="120">2 horas</SelectItem>
                <SelectItem value="180">3 horas</SelectItem>
                <SelectItem value="240">4 horas</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="scheduledDate" className="text-sm font-medium">
                {t('admin.scheduledDate')}
              </Label>
              <Input
                id="scheduledDate"
                type="date"
                value={newTask.scheduledDate}
                onChange={(e) =>
                  onNewTaskChange((prev) => ({
                    ...prev,
                    scheduledDate: e.target.value,
                  }))
                }
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="scheduledTime" className="text-sm font-medium">
                {t('admin.scheduledTime')}
              </Label>
              <Input
                id="scheduledTime"
                type="time"
                value={newTask.scheduledTime}
                onChange={(e) =>
                  onNewTaskChange((prev) => ({
                    ...prev,
                    scheduledTime: e.target.value,
                  }))
                }
                className="mt-2"
              />
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t('admin.cancel')}
          </Button>
          <Button type='button' onClick={onSubmit} className="bg-amber-600 hover:bg-amber-700">
            {t('admin.create')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
