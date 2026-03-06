export interface CreateStaffPayload {
  firstName: string;
  lastName: string;
  email: string;
  workStartTime?: string;
  workEndTime?: string;
  departmentId?: string;
}
