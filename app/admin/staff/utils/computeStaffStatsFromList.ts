import type { StaffMemberDisplay } from '@/interfaces/staff/StaffMemberDisplay';
import type { StaffStatsByDepartment } from '@/interfaces/staff/StaffStatsByDepartment';

/**
 * Computes staff stats by department from a list of staff members (for mock mode).
 */
export function computeStaffStatsFromList(
  staffList: StaffMemberDisplay[]
): StaffStatsByDepartment[] {
  const byDept = new Map<
    string,
    { departmentId: string | null; departmentName: string | null; available: number; busy: number }
  >();

  for (const s of staffList) {
    const deptId = s.employee?.departmentId ?? s.departmentId ?? null;
    const deptName = s.employee?.departmentName ?? null;
    const key = deptId ?? deptName ?? '__none__';
    if (!byDept.has(key)) {
      byDept.set(key, {
        departmentId: deptId,
        departmentName: deptName,
        available: 0,
        busy: 0,
      });
    }
    const entry = byDept.get(key)!;
    const status = (s.employee?.workStatus ?? 'available').toLowerCase();
    if (status === 'busy') entry.busy += 1;
    else entry.available += 1; // available or any other
  }

  return Array.from(byDept.values());
}
