'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/lib/i18n-context';
import type { StaffMemberDisplay } from '@/interfaces/staff/StaffMemberDisplay';

export interface StaffCardGridProps {
  staffList: StaffMemberDisplay[];
  onEdit: (staff: StaffMemberDisplay) => void;
  onDelete: (id: string) => void;
  isLoading?: boolean;
}

function getWorkStatusColor(status: string): string {
  const s = (status ?? '').toLowerCase();
  if (s === 'available') return 'bg-green-500';
  if (s === 'busy') return 'bg-yellow-500';
  return 'bg-gray-400';
}

function getWorkStatusLabel(status: string, t: (k: string) => string): string {
  const s = (status ?? '').toLowerCase();
  if (s === 'available') return t('admin.available');
  if (s === 'busy') return t('admin.busy');
  return t('admin.off');
}

function getInitials(name: string): string {
  if (!name?.trim()) return '?';
  return name
    .split(/\s+/)
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function StaffCardGrid({ staffList, onEdit, onDelete, isLoading }: StaffCardGridProps) {
  const { t } = useLanguage();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i} className="animate-pulse border border-border">
            <CardContent className="p-4">
              <div className="h-40 bg-muted rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (staffList.length === 0) {
    return (
      <Card className="border border-border">
        <CardContent className="p-8 text-center text-muted-foreground">
          {t('admin.noStaff') ?? 'No hay personal registrado.'}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {staffList.map((member) => {
        const workStatus = (member.employee?.workStatus ?? 'available').toLowerCase();
        const shift =
          member.employee?.workStartTime && member.employee?.workEndTime
            ? `${member.employee.workStartTime} - ${member.employee.workEndTime}`
            : (t('admin.dayOff') ?? 'Día libre');
        const tasksToday = member.employee?.tasksToday ?? 0;
        const maxCapacity = member.employee?.maxCapacity ?? 8;
        const progress = maxCapacity > 0 ? (tasksToday / maxCapacity) * 100 : 0;
        const currentRoom = member.employee?.currentRoom;

        return (
          <Card
            key={member.id}
            className={`p-4 cursor-pointer hover:shadow-md transition-shadow ${
              workStatus === 'available' ? 'border-green-200' : 'border-border'
            }`}
            onClick={() => onEdit(member)}
          >
            <CardContent className="p-0">
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center text-white font-bold shadow-md mb-3">
                  {getInitials(member.name)}
                </div>
                <h3 className="font-semibold text-foreground text-sm">{member.name}</h3>
                <p className="text-xs text-muted-foreground">{member.employee?.departmentName ?? '—'}</p>
                <p className="text-xs text-muted-foreground mt-1">{shift}</p>
                <Badge className={`${getWorkStatusColor(workStatus)} text-white mt-3`}>
                  {getWorkStatusLabel(workStatus, t)}
                </Badge>
                {currentRoom != null && currentRoom !== undefined ? (
                  <p className="text-xs text-muted-foreground mt-2">Hab. {currentRoom}</p>
                ) : workStatus === 'off' ? (
                  <p className="text-xs text-muted-foreground mt-2">{t('admin.dayOff') ?? 'Día libre'}</p>
                ) : null}
              </div>
              <div className="mt-4 pt-4 border-t border-border">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-muted-foreground">{t('admin.tasksToday')}</span>
                  <span className="font-semibold text-foreground">
                    {tasksToday} / {maxCapacity}
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-primary rounded-full h-2 transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
