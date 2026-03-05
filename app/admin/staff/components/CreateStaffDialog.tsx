'use client';

import {
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
import type { NewStaffForm } from './types';

type TFunction = (key: string) => string;

export type CreateStaffDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  newStaff: NewStaffForm;
  onNewStaffChange: (updater: (prev: NewStaffForm) => NewStaffForm) => void;
  onSubmit: () => void;
  t: TFunction;
};

export function CreateStaffDialog({
  open,
  onOpenChange,
  newStaff,
  onNewStaffChange,
  onSubmit,
  t,
}: CreateStaffDialogProps) {
  return (
    <DialogContent className="max-w-md">
      <DialogHeader>
        <DialogTitle>{t('admin.newUser')}</DialogTitle>
        <DialogDescription>{t('admin.registerNewTeamMember')}</DialogDescription>
      </DialogHeader>
      <div className="space-y-4 py-4">
        <div>
          <Label htmlFor="name" className="text-sm font-medium">
            {t('admin.fullName')}
          </Label>
          <Input
            id="name"
            placeholder={t('admin.exampleFullName')}
            value={newStaff.name}
            onChange={(e) =>
              onNewStaffChange((prev) => ({ ...prev, name: e.target.value }))
            }
            className="mt-2"
          />
        </div>
        <div>
          <Label htmlFor="email" className="text-sm font-medium">
            Email
          </Label>
          <Input
            id="email"
            placeholder={t('admin.exampleEmail')}
            value={newStaff.email}
            onChange={(e) =>
              onNewStaffChange((prev) => ({ ...prev, email: e.target.value }))
            }
            className="mt-2"
          />
        </div>
        <div>
          <Label htmlFor="department" className="text-sm font-medium">
            {t('admin.department')}
          </Label>
          <Select
            value={newStaff.department}
            onValueChange={(value) =>
              onNewStaffChange((prev) => ({ ...prev, department: value }))
            }
          >
            <SelectTrigger className="mt-2">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Limpieza">{t('admin.cleaning')}</SelectItem>
              <SelectItem value="Mantenimiento">
                {t('admin.maintenance')}
              </SelectItem>
              <SelectItem value="Seguridad">{t('admin.security')}</SelectItem>
              <SelectItem value="Recepción">{t('admin.reception')}</SelectItem>
              <SelectItem value="Servicio">{t('admin.service')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="shift" className="text-sm font-medium">
            {t('admin.shift')}
          </Label>
          <Select
            value={newStaff.shift}
            onValueChange={(value) =>
              onNewStaffChange((prev) => ({ ...prev, shift: value }))
            }
          >
            <SelectTrigger className="mt-2">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="morning">{t('admin.morning')}</SelectItem>
              <SelectItem value="afternoon">{t('admin.afternoon')}</SelectItem>
              <SelectItem value="evening">{t('admin.evening')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={() => onOpenChange(false)}>
          {t('admin.cancel')}
        </Button>
        <Button onClick={onSubmit} className="bg-blue-600 hover:bg-blue-700">
          {t('admin.registerStaff')}
        </Button>
      </div>
    </DialogContent>
  );
}
