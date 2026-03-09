import type { Role } from '@/interfaces/role/Role';
import type { Pagination } from '@/interfaces/common/Pagination';

export interface GetRolesResponse {
  objects: Role[];
  pagination: Pagination;
}
