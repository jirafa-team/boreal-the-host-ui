const BASE_PATH = '/myHost';

export const ROUTES = {
  BASE_PATH,

  HOME: (organizationId: string) => `${BASE_PATH}/${organizationId}/home`,
  DASHBOARD: (organizationId: string) => `${BASE_PATH}/${organizationId}/dashboard`,
  ROOMS: (organizationId: string) => `${BASE_PATH}/${organizationId}/rooms`,
  FACILITIES: (organizationId: string) => `${BASE_PATH}/${organizationId}/facilities`,
  STAFF: (organizationId: string) => `${BASE_PATH}/${organizationId}/staff`,
  CLIENTS: (organizationId: string) => `${BASE_PATH}/${organizationId}/clients`,
  CLIENT_DETAIL: (organizationId: string, clientId: string) =>
    `${BASE_PATH}/${organizationId}/clients/${clientId}`,
  USERS: (organizationId: string) => `${BASE_PATH}/${organizationId}/users`,
  SETTINGS: (organizationId: string) => `${BASE_PATH}/${organizationId}/settings`,
  EVENTS: (organizationId: string) => `${BASE_PATH}/${organizationId}/events`,
  EVENT_DETAIL: (organizationId: string, eventId: string | number) =>
    `${BASE_PATH}/${organizationId}/events/${eventId}`,
  NOTIFICATIONS: (organizationId: string) => `${BASE_PATH}/${organizationId}/notifications`,
  NOTIFICATIONS_LOG: (organizationId: string) => `${BASE_PATH}/${organizationId}/notifications/log`,
  AGENTICO: (organizationId: string) => `${BASE_PATH}/${organizationId}/agentico`,
  RECOMMENDATIONS: (organizationId: string) => `${BASE_PATH}/${organizationId}/recommendations`,
} as const;
