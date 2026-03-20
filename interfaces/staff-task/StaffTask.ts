export interface StaffTask {
  id: string;
  userId?: string;
  description: string;
  scheduledStartAt: string;
  scheduledEndAt?: string;
  estimatedDurationMinutes?: number;
  status?: string;
  [key: string]: unknown;
}
