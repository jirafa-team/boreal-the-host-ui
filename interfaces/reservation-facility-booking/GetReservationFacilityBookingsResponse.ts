import type { ReservationFacilityBooking } from '@/interfaces/reservation-facility-booking/ReservationFacilityBooking';
import type { Pagination } from '@/interfaces/common/Pagination';

export interface GetReservationFacilityBookingsResponse {
  bookings?: ReservationFacilityBooking[];
  reservationFacilityBookings?: ReservationFacilityBooking[];
  pagination?: Pagination;
}
