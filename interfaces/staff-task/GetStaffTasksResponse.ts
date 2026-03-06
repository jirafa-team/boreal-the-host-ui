import type { StaffTask } from '@/interfaces/staff-task/StaffTask';
import type { Pagination } from '@/interfaces/common/Pagination';

export interface GetStaffTasksResponse {
  tasks?: StaffTask[];
  staffTasks?: StaffTask[];
  pagination?: Pagination;
}
