'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock } from 'lucide-react';
import { useLanguage } from '@/lib/i18n-context';
import type { StaffMemberDisplay } from '@/interfaces/staff/StaffMemberDisplay';

const timeSlots = Array.from({ length: 16 }, (_, i) => {
  const hour = Math.floor(i / 2) + 7;
  const minute = (i % 2) * 30;
  return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
});

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

export interface StaffKanbanTimelineProps {
  staffList: StaffMemberDisplay[];
  onEdit: (staff: StaffMemberDisplay) => void;
  isLoading?: boolean;
}

export function StaffKanbanTimeline({ staffList, onEdit, isLoading }: StaffKanbanTimelineProps) {
  const { t } = useLanguage();

  const filteredStaff = staffList.filter((s) => (s.employee?.workStatus ?? 'available').toLowerCase() !== 'off');

  if (isLoading) {
    return (
      <div className="py-8 text-center text-muted-foreground">
        {t('admin.loading') ?? 'Cargando...'}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <div className="min-w-max">
        <div className="flex gap-2 mb-4 sticky left-0">
          <div className="w-48 flex-shrink-0">
            <div className="h-16 flex items-center justify-center bg-muted rounded-lg border border-border">
              <span className="text-sm font-semibold text-muted-foreground">Personal</span>
            </div>
          </div>
          <div className="flex gap-2">
            {timeSlots.map((timeSlot) => (
              <div key={timeSlot} className="w-32 flex-shrink-0">
                <div className="h-16 flex flex-col items-center justify-center bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg border border-primary/20">
                  <Clock className="w-4 h-4 text-primary mb-1" />
                  <span className="text-xs font-medium text-foreground">{timeSlot}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          {filteredStaff.map((member) => {
            const workStatus = member.employee?.workStatus ?? 'available';
            const tasksToday = member.employee?.tasksToday ?? 0;
            const maxCapacity = member.employee?.maxCapacity ?? 8;
            return (
              <div key={member.id} className="flex gap-2">
                <div className="w-48 flex-shrink-0 sticky left-0 bg-background">
                  <Card
                    className="p-3 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20 h-full cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => onEdit(member)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md">
                        {getInitials(member.name)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground text-sm truncate">{member.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className={getWorkStatusColor(workStatus) + ' text-white text-xs py-0'}>
                            {getWorkStatusLabel(workStatus, t)}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {tasksToday}/{maxCapacity}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
                <div className="flex gap-2">
                  {timeSlots.map((timeSlot) => (
                    <div key={timeSlot} className="w-32 flex-shrink-0">
                      <div className="h-full min-h-[80px] bg-muted/30 rounded-lg border border-dashed border-border flex items-center justify-center">
                        <span className="text-xs text-muted-foreground/50">Libre</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
