/**
 * Role name for Staff in the API (must match backend ROLES.Staff).
 */
export const STAFF_ROLE_NAME = 'Staff';

/**
 * Map shift key to workStartTime and workEndTime (HH:mm).
 * Used when creating staff so the backend Employee gets the schedule.
 */
export const SHIFT_TO_SCHEDULE: Record<string, { workStartTime: string; workEndTime: string }> = {
  morning: { workStartTime: '07:00', workEndTime: '15:00' },
  afternoon: { workStartTime: '11:00', workEndTime: '19:00' },
  evening: { workStartTime: '15:00', workEndTime: '23:00' },
};

/**
 * Day labels for the schedule editor (0=Monday, 6=Sunday).
 */
export const DAY_LABELS: Record<number, string> = {
  0: 'Lunes',
  1: 'Martes',
  2: 'Miércoles',
  3: 'Jueves',
  4: 'Viernes',
  5: 'Sábado',
  6: 'Domingo',
};

/**
 * Schedule presets for quick assignment.
 */
export const SCHEDULE_PRESETS: Record<string, { startTime: string; endTime: string; label: string }> = {
  morning: { startTime: '07:00', endTime: '15:00', label: 'Mañana' },
  afternoon: { startTime: '11:00', endTime: '19:00', label: 'Tarde' },
  evening: { startTime: '15:00', endTime: '23:00', label: 'Noche' },
};
