import type { Reservation } from '@/interfaces/reservation/Reservation';
import type { Pagination } from '@/interfaces/common/Pagination';

export interface GetReservationsResponse {
  reservations?: Reservation[];
  pagination?: Pagination;
}
