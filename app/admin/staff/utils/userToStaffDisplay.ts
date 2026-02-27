import type { User } from '@/interfaces/user/User';
import type { StaffMemberDisplay } from '@/interfaces/staff/StaffMemberDisplay';

interface UserWithOptionalStaff extends User {
  employee?: {
    workStatus?: string;
    workStartTime?: string;
    workEndTime?: string;
    departmentId?: string;
    departmentName?: string;
  };
  departmentId?: string;
  workStartTime?: string;
  workEndTime?: string;
  position?: string;
}

export function userToStaffDisplay(u: UserWithOptionalStaff): StaffMemberDisplay {
  const name =
    u.name ??
    ([u.firstName, u.lastName].filter(Boolean).join(' ').trim() || u.email);
  return {
    id: u.id!,
    name,
    firstName: u.firstName,
    lastName: u.lastName,
    email: u.email,
    roleName: u.roleName ?? u.role,
    status: u.status ?? 'active',
    departmentId: u.departmentId,
    workStartTime: u.workStartTime,
    workEndTime: u.workEndTime,
    phone: u.phone,
    position: u.position,
    employee: {
      workStatus: u.employee?.workStatus,
      workStartTime: u.employee?.workStartTime,
      workEndTime: u.employee?.workEndTime,
      departmentId: u.employee?.departmentId,
      departmentName: u.employee?.departmentName,
    },
  };
}
