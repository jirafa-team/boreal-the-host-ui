import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { createApi } from '@reduxjs/toolkit/query/react';
import { ENDPOINTS } from '@/shared/types/api';
import { baseQueryWithOrg } from '@/store/baseQuery';
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

export const reservationApi = createApi({
  reducerPath: 'reservationApi',
  baseQuery: baseQueryWithOrg,
  tagTypes: ['Reservations'],
  endpoints: (build) => ({
    getReservations: build.query<{ data: GetReservationsResponse }, { page?: number; limit?: number } | void>({
      query: (p) => ({ url: ENDPOINTS.RESERVATION, method: 'GET', params: p ?? {}, credentials: 'include' }),
      providesTags: ['Reservations'],
    }),
    getReservationById: build.query<{ data: Reservation }, string>({
      query: (id) => ({ url: `${ENDPOINTS.RESERVATION}/${id}`, method: 'GET', credentials: 'include' }),
      providesTags: (_, __, id) => [{ type: 'Reservations', id }],
    }),
    createReservation: build.mutation<{ data: Reservation }, { roomId: string; checkIn: string; checkOut: string }>({
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
  }),
});

export const { setReservations, setPage, setTotalPages } = reservationSlice.actions;
export const { useGetReservationsQuery, useGetReservationByIdQuery, useCreateReservationMutation, useUpdateReservationMutation, useConfirmReservationMutation, useDeleteReservationMutation } = reservationApi;
export default reservationSlice.reducer;
