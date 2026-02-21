import { createSlice, type PayloadAction, type AnyAction } from '@reduxjs/toolkit';
import { createApi } from '@reduxjs/toolkit/query/react';
import { ENDPOINTS } from '@/shared/types/api';
import { baseQueryWithOrg } from '@/store/baseQuery';
import type { Room } from '@/interfaces/room/Room';
import type { GetRoomsResponse } from '@/interfaces/room/GetRoomsResponse';
import type { RoomStatus } from '@/interfaces/room/RoomStatus';

interface RoomState {
  rooms: Room[];
  totalCount: number;
  page: number;
  totalPages: number;
  roomSelected: string | null;
}

const initialState: RoomState = {
  rooms: [],
  totalCount: 0,
  page: 1,
  totalPages: 1,
  roomSelected: null,
};

export const MOCK_ROOMS: Room[] = [
  { id: '1', number: '101', type: 'Individual', floor: 1, status: 'available' },
  { id: '2', number: '102', type: 'Doble', floor: 1, status: 'occupied', guest: 'Juan Pérez', checkIn: '2025-01-10', checkOut: '2025-01-15' },
  { id: '3', number: '103', type: 'Suite', floor: 1, status: 'maintenance' },
  { id: '4', number: '104', type: 'Doble', floor: 1, status: 'reserved', guest: 'María García', checkIn: '2025-01-12', checkOut: '2025-01-14' },
  { id: '5', number: '201', type: 'Deluxe', floor: 2, status: 'available' },
  { id: '6', number: '202', type: 'Suite', floor: 2, status: 'occupied', guest: 'Carlos López', checkIn: '2025-01-09', checkOut: '2025-01-16' },
  { id: '7', number: '203', type: 'Individual', floor: 2, status: 'available' },
  { id: '8', number: '204', type: 'Presidencial', floor: 2, status: 'occupied', guest: 'Ana Martínez', checkIn: '2025-01-11', checkOut: '2025-01-13' },
  { id: '9', number: '301', type: 'Doble', floor: 3, status: 'available' },
  { id: '10', number: '302', type: 'Suite', floor: 3, status: 'reserved', guest: 'Luis Rodríguez', checkIn: '2025-01-13', checkOut: '2025-01-18' },
];

export const roomSlice = createSlice({
  name: 'room',
  initialState,
  reducers: {
    setRooms: (state, action: PayloadAction<Room[]>) => {
      state.rooms = action.payload;
    },
    setTotalCount: (state, action: PayloadAction<number>) => {
      state.totalCount = action.payload;
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
    setTotalPages: (state, action: PayloadAction<number>) => {
      state.totalPages = action.payload;
    },
    setSelectedRoom: (state, action: PayloadAction<string | null>) => {
      state.roomSelected = action.payload;
    },
  },
});

export const roomApi = createApi({
  reducerPath: 'roomApi',
  baseQuery: baseQueryWithOrg,
  tagTypes: ['Rooms'],
  endpoints: (build) => ({
    getRooms: build.query<
      { data: GetRoomsResponse },
      { page?: number; limit?: number; filter?: string; sort?: string } | void
    >({
      query: (params) => ({
        url: ENDPOINTS.ROOM,
        method: 'GET',
        params: params || {},
        credentials: 'include',
      }),
      providesTags: ['Rooms'],
    }),
    getRoomById: build.query<{ data: Room }, string>({
      query: (id) => ({
        url: `${ENDPOINTS.ROOM}/${id}`,
        method: 'GET',
        credentials: 'include',
      }),
      providesTags: (_, __, id) => [{ type: 'Rooms', id }],
    }),
    getRoomStats: build.query<{ data: { total: number; available: number; occupied: number; maintenance: number; reserved: number } }, void>({
      query: () => ({
        url: `${ENDPOINTS.ROOM}/stats`,
        method: 'GET',
        credentials: 'include',
      }),
      providesTags: ['Rooms'],
    }),
    createRoom: build.mutation<{ data: Room }, { number: string; roomTypeId: string; floor: number; [key: string]: unknown }>({
      query: (body) => ({
        url: ENDPOINTS.ROOM,
        method: 'POST',
        body,
        credentials: 'include',
      }),
      invalidatesTags: ['Rooms'],
    }),
    updateRoom: build.mutation<{ data: Room }, { id: string; payload: Partial<Room> }>({
      query: ({ id, payload }) => ({
        url: `${ENDPOINTS.ROOM}/${id}`,
        method: 'PATCH',
        body: payload,
        credentials: 'include',
      }),
      invalidatesTags: (_, __, arg) => (arg?.id ? [{ type: 'Rooms', id: arg.id }, 'Rooms'] : ['Rooms']),
    }),
    deleteRoom: build.mutation<{ data: unknown }, string>({
      query: (id) => ({
        url: `${ENDPOINTS.ROOM}/${id}`,
        method: 'DELETE',
        credentials: 'include',
      }),
      invalidatesTags: ['Rooms'],
    }),
  }),
});

export const { setRooms, setTotalCount, setPage, setTotalPages, setSelectedRoom } = roomSlice.actions;

export function loadMockRooms() {
  return (dispatch: (action: AnyAction) => void) => {
    dispatch(setRooms(MOCK_ROOMS));
    dispatch(setTotalCount(MOCK_ROOMS.length));
    dispatch(setTotalPages(1));
  };
}

export const {
  useGetRoomsQuery,
  useGetRoomByIdQuery,
  useGetRoomStatsQuery,
  useCreateRoomMutation,
  useUpdateRoomMutation,
  useDeleteRoomMutation,
} = roomApi;

export default roomSlice.reducer;
