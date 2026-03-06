import type { StaffMemberDisplay } from './StaffMemberDisplay';

export interface GetStaffResponse {
  objects: StaffMemberDisplay[];
  hasMore: boolean;
  totalCount: number;
  currentPage: number;
  pageSize: number;
  totalPages: number;
}
