'use client';

import { useState, useEffect } from 'react';
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
import { useUpdateStaffMutation } from '@/app/admin/staff/slice/staffSlice';
import { useLanguage } from '@/lib/i18n-context';
import type { StaffMemberDisplay } from '@/interfaces/staff/StaffMemberDisplay';

export interface EditStaffDialogProps {
  open: boolean;
  staff: StaffMemberDisplay | null;
  onClose: () => void;
  onSuccess: () => void;
  onMockUpdate?: (id: string, payload: { firstName?: string; lastName?: string; email?: string; position?: string; status?: string }) => void;
}

export function EditStaffDialog({
  open,
  staff,
  onClose,
  onSuccess,
  onMockUpdate,
}: EditStaffDialogProps) {
  const { t } = useLanguage();
  const [updateStaff, { isLoading: isUpdating }] = useUpdateStaffMutation();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [position, setPosition] = useState('');
  const [status, setStatus] = useState<string>('active');

  useEffect(() => {
    if (staff) {
      setFirstName(staff.firstName ?? '');
      setLastName(staff.lastName ?? '');
      setEmail(staff.email ?? '');
      setPosition(staff.position ?? '');
      setStatus(staff.status ?? 'active');
    }
  }, [staff]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!staff) return;

    const payload = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      position: position.trim() || undefined,
      status,
    };

    try {
      if (onMockUpdate) {
        onMockUpdate(staff.id, payload);
      } else {
        await updateStaff({ id: staff.id, payload }).unwrap();
      }
      onSuccess();
      onClose();
    } catch {
      // Error handled by mutation / parent
    }
  };

  const handleOpenChange = (openState: boolean) => {
    if (!openState) onClose();
  };

  if (!staff) return null;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t('admin.editStaff') ?? 'Editar personal'}</DialogTitle>
          <DialogDescription>
            {t('admin.editStaffInfo') ?? 'Modifica los datos del miembro del personal.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-firstName">{t('admin.firstName') ?? 'Nombre'}</Label>
              <Input
                id="edit-firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder={t('admin.firstNamePlaceholder') ?? 'Ej. María'}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-lastName">{t('admin.lastName') ?? 'Apellidos'}</Label>
              <Input
                id="edit-lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder={t('admin.lastNamePlaceholder') ?? 'Ej. González'}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-email">{t('admin.email')}</Label>
            <Input
              id="edit-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('admin.emailPlaceholder')}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-position">{t('admin.position') ?? 'Cargo'}</Label>
            <Input
              id="edit-position"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              placeholder={t('admin.positionPlaceholder') ?? 'Ej. Recepcionista'}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-status">{t('admin.status')}</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger id="edit-status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">{t('admin.active')}</SelectItem>
                <SelectItem value="inactive">{t('admin.inactive')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} className="bg-transparent">
              {t('admin.cancel') ?? 'Cancelar'}
            </Button>
            <Button type="submit" disabled={isUpdating} className="bg-blue-600 hover:bg-blue-700">
              {isUpdating ? (t('admin.saving') ?? 'Guardando...') : (t('admin.save') ?? 'Guardar')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
