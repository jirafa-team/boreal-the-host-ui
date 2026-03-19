import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { createApi } from '@reduxjs/toolkit/query/react';
import { ENDPOINTS } from '@/shared/types/api';
import { baseQueryWithOrg } from '@/store/baseQuery';
import { roomApi } from '@/app/admin/rooms/slice/roomSlice';
import type { Reservation } from '@/interfaces/reservation/Reservation';
import type { GetReservationsResponse } from '@/interfaces/reservation/GetReservationsResponse';

interface ReservationState {
  reservations: Reservation[];
  totalCount: number;
  page: number;
  totalPages: number;
}

const initialState: ReservationState = { reservations: [], totalCount: 0, page: 1, totalPages: 1 };

export const reservationSlice = createSlice({
  name: 'reservation',
  initialState,
  reducers: {
    setReservations: (s, a: PayloadAction<Reservation[]>) => { s.reservations = a.payload; s.totalCount = a.payload.length; },
    setPage: (s, a: PayloadAction<number>) => { s.page = a.payload; },
    setTotalPages: (s, a: PayloadAction<number>) => { s.totalPages = a.payload; },
  },
});

export interface CheckoutReservationDto {
  id: string;
  code: string;
  clientId: string;
  organizationId: string;
  roomId: string;
  checkIn: string;
  checkOut: string;
  status: string;
  user?: { id: string; firstName: string; lastName: string; email: string; phoneNumber?: string };
  room?: { id: string; number: string; status: string; checkIn?: string | null; checkOut?: string | null; guest?: string | null };
}

export const reservationApi = createApi({
  reducerPath: 'reservationApi',
  baseQuery: baseQueryWithOrg,
  tagTypes: ['Reservations', 'UserReservationContexts', 'TodayCheckouts'],
  endpoints: (build) => ({
    getReservations: build.query<{ data: GetReservationsResponse }, { page?: number; limit?: number } | void>({
      query: (p) => ({
        url: ENDPOINTS.RESERVATION,
        method: 'GET',
        params: p ?? {},
        credentials: 'include',
      }),
      providesTags: ['Reservations'],
    }),
    getReservationsWithDetails: build.query<
      { data: { objects?: unknown[]; [key: string]: unknown } },
      { page?: number; limit?: number; role?: string } | void
    >({
      query: (p) => ({
        url: ENDPOINTS.RESERVATION_WITH_DETAILS,
        method: 'GET',
        params: p ?? {},
        credentials: 'include',
      }),
      providesTags: ['Reservations'],
    }),
    getUserReservationContexts: build.query<
      { reservations: unknown[]; checkInCompletedAt: string | null },
      void
    >({
      query: () => ({
        url: ENDPOINTS.RESERVATION_USER_CONTEXTS,
        method: 'GET',
        credentials: 'include',
      }),
      providesTags: ['UserReservationContexts'],
    }),
    getReservationById: build.query<{ data: Reservation }, string>({
      query: (id) => ({ url: `${ENDPOINTS.RESERVATION}/${id}`, method: 'GET', credentials: 'include' }),
      providesTags: (_, __, id) => [{ type: 'Reservations', id }],
    }),
    createReservation: build.mutation<
      { data: Reservation },
      { roomId: string; clientId: string; checkIn: string; checkOut: string }
    >({
      query: (body) => ({ url: ENDPOINTS.RESERVATION, method: 'POST', body, credentials: 'include' }),
      invalidatesTags: ['Reservations'],
    }),
    updateReservation: build.mutation<{ data: Reservation }, { id: string; payload: Partial<Reservation> }>({
      query: ({ id, payload }) => ({ url: `${ENDPOINTS.RESERVATION}/${id}`, method: 'PATCH', body: payload, credentials: 'include' }),
      invalidatesTags: ['Reservations'],
    }),
    confirmReservation: build.mutation<void, string>({
      query: (id) => ({ url: `${ENDPOINTS.RESERVATION}/${id}/confirm`, method: 'PATCH', credentials: 'include' }),
      invalidatesTags: ['Reservations'],
    }),
    deleteReservation: build.mutation<{ data: unknown }, string>({
      query: (id) => ({ url: `${ENDPOINTS.RESERVATION}/${id}`, method: 'DELETE', credentials: 'include' }),
      invalidatesTags: ['Reservations'],
    }),
    completeCheckIn: build.mutation<
      { data: unknown },
      {
        firstName: string;
        lastName: string;
        email: string;
        phone?: string | null;
        nationality?: string | null;
        documentType?: string | null;
        idNumber?: string | null;
      }
    >({
      query: (body) => ({
        url: ENDPOINTS.CLIENT_COMPLETE_CHECKIN,
        method: 'POST',
        body,
        credentials: 'include',
      }),
      invalidatesTags: ['Reservations', 'UserReservationContexts'],
    }),
    getTodayCheckouts: build.query<{ data: CheckoutReservationDto[] }, void>({
      query: () => ({
        url: ENDPOINTS.RESERVATION_CHECKOUTS_TODAY,
        method: 'GET',
        credentials: 'include',
      }),
      providesTags: ['TodayCheckouts'],
    }),
    completeCheckout: build.mutation<void, string>({
      query: (id) => ({
        url: `${ENDPOINTS.RESERVATION}/${id}/checkout`,
        method: 'PATCH',
        credentials: 'include',
      }),
      invalidatesTags: ['TodayCheckouts', 'Reservations'],
      async onQueryStarted(_, { queryFulfilled, dispatch }) {
        await queryFulfilled;
        dispatch(roomApi.util.invalidateTags(['Rooms']));
      },
    }),
    checkinReservationBulk: build.mutation<void, string[]>({
      query: (reservationIds) => ({
        url: `${ENDPOINTS.RESERVATION}/checkin-bulk`,
        method: 'PATCH',
        body: { reservationIds },
        credentials: 'include',
      }),
      invalidatesTags: ['Reservations', 'UserReservationContexts'],
    }),
  }),
});

export const { setReservations, setPage, setTotalPages } = reservationSlice.actions;
export const {
  useGetReservationsQuery,
  useGetReservationsWithDetailsQuery,
  useGetUserReservationContextsQuery,
  useGetReservationByIdQuery,
  useCreateReservationMutation,
  useUpdateReservationMutation,
  useConfirmReservationMutation,
  useDeleteReservationMutation,
  useCompleteCheckInMutation,
  useGetTodayCheckoutsQuery,
  useCompleteCheckoutMutation,
  useCheckinReservationBulkMutation,
} = reservationApi;
export default reservationSlice.reducer;
