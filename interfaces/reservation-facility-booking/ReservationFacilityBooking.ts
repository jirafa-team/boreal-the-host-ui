export interface ReservationFacilityBooking {
  id: string;
  reservationId: string;
  facilityId: string;
  amenityShiftSlotId: string;
  numberOfPeople: number;
  [key: string]: unknown;
}
