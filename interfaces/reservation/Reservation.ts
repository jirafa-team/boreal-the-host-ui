export interface Reservation {
  id: string;
  roomId: string;
  checkIn: string;
  checkOut: string;
  userId?: string;
  status?: string;
  [key: string]: unknown;
}
