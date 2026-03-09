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
