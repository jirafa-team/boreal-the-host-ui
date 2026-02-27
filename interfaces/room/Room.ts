import type { RoomStatus } from '@/interfaces/room/RoomStatus';

export interface Room {
  id: string;
  number: string;
  type: string;
  roomTypeId?: string;
  floor: number;
  status: RoomStatus;
  guest?: string;
  checkIn?: string;
  checkOut?: string;
  [key: string]: unknown;
}
