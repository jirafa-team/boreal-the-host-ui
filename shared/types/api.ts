export const API_BASE_URL =
  (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_API_URL) || 'http://localhost:3001';

export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    VALIDATE_USER: '/auth/validate-user',
    ORGANIZATION_ROLES: '/auth/organization-roles',
  },
  ORGANIZATION: '/organization',
  GLOBAL_USER: '/global/user',
  USER: '/user',
  STAFF: '/staff',
  FACILITY: '/facility',
  ROOM: '/room',
  CLIENT: '/client',
  CLIENT_COMPLETE_CHECKIN: '/client/complete-checkin',
  ROLE: '/role',
  STAFF_TASK: '/staff-task',
  RESERVATION: '/reservation',
  RESERVATION_WITH_DETAILS: '/reservation/with-details',
  RESERVATION_USER_CONTEXTS: '/reservation/user-contexts',
  RESERVATION_CHECKOUTS_TODAY: '/reservation/checkouts-today',
  RESERVATION_FACILITY_BOOKING: '/reservation-facility-booking',
  TAXONOMY_DEPARTMENTS: '/taxonomy/departments',
  TAXONOMY_EVENT_CATEGORIES: '/taxonomy/event-categories',
  TAXONOMY_FACILITY_TYPES: '/taxonomy/facility-types',
  TAXONOMY_ROOM_TYPES: '/taxonomy/room-types',
} as const;
