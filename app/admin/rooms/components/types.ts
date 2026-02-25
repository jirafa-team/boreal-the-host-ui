import type { Room as ApiRoom } from "@/interfaces/room/Room";
import type { RoomStatus } from "@/interfaces/room/RoomStatus";

export type { RoomStatus };

export type Room = ApiRoom;

export type ViewMode = "day" | "week" | "month";
export type LayoutMode = "grid" | "kanban";

export type NewRoomForm = {
  number: string;
  roomTypeId: string;
  floor: number;
};

export type RoomStats = {
  total: number;
  available: number;
  occupied: number;
  maintenance: number;
  reserved: number;
};

export type DateColumn = {
  label: string;
  date: Date;
};
