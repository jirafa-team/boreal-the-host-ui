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
  employee: {
    workStatus?: string;
    workStartTime?: string;
    workEndTime?: string;
    departmentId?: string;
    departmentName?: string;
    currentRoom?: number | null;
    tasksToday?: number;
    maxCapacity?: number;
  };
}
