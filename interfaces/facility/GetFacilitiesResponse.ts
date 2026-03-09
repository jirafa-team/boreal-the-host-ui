import type { Facility } from '@/interfaces/facility/Facility';
import type { FacilityPagination } from '@/interfaces/facility/FacilityPagination';

export interface GetFacilitiesResponse {
  facilities?: Facility[];
  objects?: Facility[];
  pagination?: FacilityPagination;
}
