import type { User } from '@/interfaces/user/User';
import type { UserPagination } from '@/interfaces/user/UserPagination';

export interface GetUsersResponse {
  users?: User[];
  objects?: User[];
  pagination?: UserPagination;
}
