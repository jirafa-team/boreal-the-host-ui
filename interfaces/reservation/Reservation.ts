export interface Reservation {
  id: string;
  roomId: string;
  clientId: string;
  checkIn: string;
  checkOut: string;
  status?: string;
  [key: string]: unknown;
}
