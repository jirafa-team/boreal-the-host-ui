import type { StaffMemberDisplay } from '@/interfaces/staff/StaffMemberDisplay';
import type { StaffScheduleEntry } from '@/interfaces/staff/StaffSchedule';
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

/**
 * Returns the formatted shift string for today, or null if off/inactive today.
 * Falls back to legacy workStartTime/workEndTime when no schedule exists.
 */
export function getTodayShift(
  schedule: StaffScheduleEntry[] | undefined,
  fallbackStart?: string | null,
  fallbackEnd?: string | null,
): string | null {
  if (schedule && schedule.length > 0) {
    const todayDayOfWeek = (new Date().getDay() + 6) % 7;
    const entry = schedule.find((e) => e.dayOfWeek === todayDayOfWeek);
    if (entry && entry.isActive) {
      return `${formatTimeForDisplay(entry.startTime)} - ${formatTimeForDisplay(entry.endTime)}`;
    }
    return null;
  }
  if (fallbackStart && fallbackEnd) {
    return `${formatTimeForDisplay(fallbackStart)} - ${formatTimeForDisplay(fallbackEnd)}`;
  }
  return null;
}

function toStaffStatus(s: string | undefined): StaffStatus {
  const v = (s ?? '').toLowerCase();
  if (v === 'available') return 'available';
  if (v === 'busy') return 'busy';
  if (v === 'off') return 'off';
  return 'available';
}

export function staffDisplayToView(d: StaffMemberDisplay): StaffMemberView {
  const shiftStr = getTodayShift(
    d.employee?.schedule,
    d.employee?.workStartTime ?? d.workStartTime,
    d.employee?.workEndTime ?? d.workEndTime,
  ) ?? '—';

  return {
    id: d.id,
    name: d.name,
    status: toStaffStatus(d.employee?.workStatus ?? d.status),
    department: d.employee?.departmentName ?? '—',
    shift: shiftStr,
    avatar: getInitials(d.name),
    tasksToday: d.employee?.tasksToday ?? 0,
    maxCapacity: d.employee?.maxCapacity ?? 8,
    totalTasks: d.employee?.totalTasks ?? 0,
    completedTasks: d.employee?.completedTasks ?? 0,
  };
}
