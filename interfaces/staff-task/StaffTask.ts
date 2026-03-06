export interface StaffTask {
  id: string;
  userId?: string;
  description: string;
  scheduledStartAt: string;
  scheduledEndAt?: string;
  status?: string;
  [key: string]: unknown;
}
