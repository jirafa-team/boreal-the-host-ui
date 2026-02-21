import type { Room } from '@/interfaces/room/Room';
import type { RoomPagination } from '@/interfaces/room/RoomPagination';

export interface GetRoomsResponse {
  rooms?: Room[];
  objects?: Room[];
  pagination?: RoomPagination;
}
