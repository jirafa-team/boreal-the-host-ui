export interface StaffStatsByDepartment {
  departmentId: string | null;
  departmentName: string | null;
  available: number;
  busy: number;
}
