import type { Organization } from '@/interfaces/organization/Organization';
import type { OrganizationPagination } from '@/interfaces/organization/OrganizationPagination';

export interface GetOrganizationsResponse {
  organizations: Organization[];
  pagination: OrganizationPagination;
}
