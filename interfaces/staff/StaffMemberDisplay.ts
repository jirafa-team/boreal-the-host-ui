export interface StaffMemberDisplay {
  id: string;
  name: string;
  firstName?: string;
  lastName?: string;
  email: string;
  roleName?: string;
  status: string;
  departmentId?: string | null;
  workStartTime?: string | null;
  workEndTime?: string | null;
  phone?: string;
  position?: string;
}
