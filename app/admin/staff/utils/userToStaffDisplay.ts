import type { User } from '@/interfaces/user/User';
import type { StaffMemberDisplay } from '@/interfaces/staff/StaffMemberDisplay';

/**
 * Map API User to StaffMemberDisplay (name from firstName + lastName, etc.).
 */
export function userToStaffDisplay(u: User): StaffMemberDisplay {
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
    departmentId: (u as User & { departmentId?: string }).departmentId,
    workStartTime: (u as User & { workStartTime?: string }).workStartTime,
    workEndTime: (u as User & { workEndTime?: string }).workEndTime,
    phone: u.phone,
    position: (u as User & { position?: string }).position,
  };
}
