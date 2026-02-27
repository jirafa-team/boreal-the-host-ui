'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
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
import { useGetDepartmentsQuery } from '@/features/taxonomy-department/slices/taxonomyDepartmentSlice';
import { useCreateUserMutation } from '@/app/admin/users/slice/userSlice';
import { useLanguage } from '@/lib/i18n-context';
import { SHIFT_TO_SCHEDULE, STAFF_ROLE_NAME } from '@/app/admin/staff/constants';

export interface CreateStaffDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  isApiMode: boolean;
  onMockCreate?: (payload: { firstName: string; lastName: string; email: string; workStartTime?: string; workEndTime?: string; departmentId?: string }) => void;
}

const SHIFT_KEYS = Object.keys(SHIFT_TO_SCHEDULE);

export function CreateStaffDialog({
  open,
  onClose,
  onSuccess,
  isApiMode,
  onMockCreate,
}: CreateStaffDialogProps) {
  const { t } = useLanguage();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [departmentId, setDepartmentId] = useState<string>('');
  const [shift, setShift] = useState<string>('');

  const [createUser, { isLoading: isCreating }] = useCreateUserMutation();
  const { data: departmentsData } = useGetDepartmentsQuery(undefined, { skip: !open });
  const departments = departmentsData?.data ?? [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const schedule = shift ? SHIFT_TO_SCHEDULE[shift] : undefined;
    const payload = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      departmentId: departmentId || undefined,
      workStartTime: schedule?.workStartTime,
      workEndTime: schedule?.workEndTime,
    };

    try {
      if (isApiMode) {
        await createUser({
          ...payload,
          roleName: STAFF_ROLE_NAME,
        }).unwrap();
      } else if (onMockCreate) {
        onMockCreate(payload);
      }
      setFirstName('');
      setLastName('');
      setEmail('');
      setDepartmentId('');
      setShift('');
      onSuccess();
      onClose();
    } catch {
      // Error handled by mutation / toast if needed
    }
  };

  const handleOpenChange = (openState: boolean) => {
    if (!openState) onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t('admin.addStaff') ?? 'Añadir personal'}</DialogTitle>
          <DialogDescription>
            {t('admin.addStaffInfo') ?? 'Completa los datos del nuevo miembro del personal.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="create-firstName">{t('admin.firstName') ?? 'Nombre'}</Label>
              <Input
                id="create-firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder={t('admin.firstNamePlaceholder') ?? 'Ej. María'}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="create-lastName">{t('admin.lastName') ?? 'Apellidos'}</Label>
              <Input
                id="create-lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder={t('admin.lastNamePlaceholder') ?? 'Ej. González'}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="create-email">{t('admin.email')}</Label>
            <Input
              id="create-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('admin.emailPlaceholder')}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="create-department">{t('admin.department') ?? 'Departamento'}</Label>
            <Select value={departmentId} onValueChange={setDepartmentId}>
              <SelectTrigger id="create-department">
                <SelectValue placeholder={t('admin.selectDepartment') ?? 'Seleccionar departamento'} />
              </SelectTrigger>
              <SelectContent>
                {departments.map((d) => (
                  <SelectItem key={d.id} value={d.id}>
                    {d.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="create-shift">{t('admin.shift') ?? 'Turno'}</Label>
            <Select value={shift} onValueChange={setShift}>
              <SelectTrigger id="create-shift">
                <SelectValue placeholder={t('admin.selectShift') ?? 'Seleccionar turno'} />
              </SelectTrigger>
              <SelectContent>
                {SHIFT_KEYS.map((key) => (
                  <SelectItem key={key} value={key}>
                    {SHIFT_TO_SCHEDULE[key].workStartTime} - {SHIFT_TO_SCHEDULE[key].workEndTime}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} className="bg-transparent">
              {t('admin.cancel') ?? 'Cancelar'}
            </Button>
            <Button type="submit" disabled={isCreating} className="bg-blue-600 hover:bg-blue-700">
              {isCreating ? (t('admin.saving') ?? 'Guardando...') : (t('admin.save') ?? 'Guardar')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
