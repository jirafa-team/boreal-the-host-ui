import type { StaffMemberDisplay } from '@/interfaces/staff/StaffMemberDisplay';
import type { StaffMemberView, StaffStatus } from '../components/types';

function getInitials(name: string): string {
  if (!name?.trim()) return '?';
  return name
    .split(/\s+/)
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

/** Format "07:00" -> "7:00 AM", "15:00" -> "3:00 PM" */
function formatTimeForDisplay(hhmm: string): string {
  if (!hhmm) return '';
  const [h, m] = hhmm.split(':').map(Number);
  const hour = h ?? 0;
  const minute = m ?? 0;
  if (hour === 0 && minute === 0) return '12:00 AM';
  if (hour < 12) return `${hour}:${minute.toString().padStart(2, '0')} AM`;
  if (hour === 12) return `12:${minute.toString().padStart(2, '0')} PM`;
  return `${hour - 12}:${minute.toString().padStart(2, '0')} PM`;
}

function toStaffStatus(s: string | undefined): StaffStatus {
  const v = (s ?? '').toLowerCase();
  if (v === 'available') return 'available';
  if (v === 'busy') return 'busy';
  if (v === 'off') return 'off';
  return 'available';
}

export function staffDisplayToView(d: StaffMemberDisplay): StaffMemberView {
  const start = d.employee?.workStartTime ?? d.workStartTime ?? '07:00';
  const end = d.employee?.workEndTime ?? d.workEndTime ?? '15:00';
  const shiftStr =
    start && end
      ? `${formatTimeForDisplay(start)} - ${formatTimeForDisplay(end)}`
      : '—';

  return {
    id: d.id,
    name: d.name,
    status: toStaffStatus(d.employee?.workStatus ?? d.status),
    department: d.employee?.departmentName ?? '—',
    shift: shiftStr,
    avatar: getInitials(d.name),
    tasksToday: d.employee?.tasksToday ?? 0,
    maxCapacity: d.employee?.maxCapacity ?? 8,
  };
}
