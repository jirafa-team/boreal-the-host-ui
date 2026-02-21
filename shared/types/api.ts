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
  FACILITY: '/facility',
  ROOM: '/room',
  ROLE: '/role',
  STAFF_TASK: '/staff-task',
  RESERVATION: '/reservation',
  RESERVATION_FACILITY_BOOKING: '/reservation-facility-booking',
  TAXONOMY_DEPARTMENTS: '/taxonomy/departments',
  TAXONOMY_EVENT_CATEGORIES: '/taxonomy/event-categories',
  TAXONOMY_FACILITY_TYPES: '/taxonomy/facility-types',
  TAXONOMY_ROOM_TYPES: '/taxonomy/room-types',
} as const;
