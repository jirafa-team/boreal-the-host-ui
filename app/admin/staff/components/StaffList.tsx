'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2 } from 'lucide-react';
import { useLanguage } from '@/lib/i18n-context';
import type { StaffMemberDisplay } from '@/interfaces/staff/StaffMemberDisplay';

export interface StaffListProps {
  staffList: StaffMemberDisplay[];
  onEdit: (staff: StaffMemberDisplay) => void;
  onDelete: (id: string) => void;
  isLoading?: boolean;
}

function getStatusBadge(status: string, t: (k: string) => string) {
  console.log('status', status)
  if (status === 'active') {
    return <Badge className="bg-green-500/10 text-green-600 border-green-500/20">{t('admin.active')}</Badge>;
  }
  if (status === 'pending') {
    return <Badge className="bg-red-500/10 text-orange-600 border-orange-500/20">{t('admin.pending')}</Badge>;
  }
  return <Badge className="bg-red-500/10 text-red-600 border-red-500/20">{t('admin.inactive')}</Badge>;
}

export function StaffList({ staffList, onEdit, onDelete, isLoading }: StaffListProps) {
  const { t } = useLanguage();

  if (isLoading) {
    return (
      <Card className="border-0 shadow-lg">
        <CardContent className="p-8 text-center text-gray-500">
          {t('admin.loading') ?? 'Cargando...'}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-lg">
      <CardContent className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-4 px-4 font-semibold text-gray-700">{t('admin.name')}</th>
                <th className="text-left py-4 px-4 font-semibold text-gray-700">{t('admin.email')}</th>
                <th className="text-left py-4 px-4 font-semibold text-gray-700">{t('admin.status')}</th>
                <th className="text-left py-4 px-4 font-semibold text-gray-700">{t('admin.department') ?? 'Departamento'}</th>
                <th className="text-left py-4 px-4 font-semibold text-gray-700">{t('admin.schedule') ?? 'Horario'}</th>
                <th className="text-right py-4 px-4 font-semibold text-gray-700">{t('admin.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {staffList.map((staff) => (
                <tr key={staff.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-4 font-semibold text-gray-900">{staff.name}</td>
                  <td className="py-4 px-4 text-gray-600">{staff.email}</td>
                  <td className="py-4 px-4">{getStatusBadge(staff.status, t)}</td>
                  <td className="py-4 px-4 text-gray-600">{staff.departmentId ?? '—'}</td>
                  <td className="py-4 px-4 text-gray-600">
                    {staff.workStartTime && staff.workEndTime
                      ? `${staff.workStartTime} - ${staff.workEndTime}`
                      : '—'}
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(staff)}
                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(staff.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {staffList.length === 0 && (
          <p className="py-8 text-center text-gray-500">{t('admin.noStaff') ?? 'No hay personal registrado.'}</p>
        )}
      </CardContent>
    </Card>
  );
}
