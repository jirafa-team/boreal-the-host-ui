import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { createApi } from '@reduxjs/toolkit/query/react';
import { ENDPOINTS } from '@/shared/types/api';
import { baseQueryWithOrg } from '@/store/baseQuery';
import type { ReservationFacilityBooking } from '@/interfaces/reservation-facility-booking/ReservationFacilityBooking';
import type { GetReservationFacilityBookingsResponse } from '@/interfaces/reservation-facility-booking/GetReservationFacilityBookingsResponse';

interface State {
  bookings: ReservationFacilityBooking[];
  totalCount: number;
  page: number;
  totalPages: number;
}

const initialState: State = { bookings: [], totalCount: 0, page: 1, totalPages: 1 };

export const reservationFacilityBookingSlice = createSlice({
  name: 'reservationFacilityBooking',
  initialState,
  reducers: {
    setBookings: (s, a: PayloadAction<ReservationFacilityBooking[]>) => { s.bookings = a.payload; s.totalCount = a.payload.length; },
    setPage: (s, a: PayloadAction<number>) => { s.page = a.payload; },
    setTotalPages: (s, a: PayloadAction<number>) => { s.totalPages = a.payload; },
  },
});

export const reservationFacilityBookingApi = createApi({
  reducerPath: 'reservationFacilityBookingApi',
  baseQuery: baseQueryWithOrg,
  tagTypes: ['ReservationFacilityBookings'],
  endpoints: (build) => ({
    getReservationFacilityBookings: build.query<
      { data: GetReservationFacilityBookingsResponse },
      { page?: number; limit?: number; reservationId?: string } | void
    >({
      query: (p) => ({ url: ENDPOINTS.RESERVATION_FACILITY_BOOKING, method: 'GET', params: p ?? {}, credentials: 'include' }),
      providesTags: ['ReservationFacilityBookings'],
    }),
    getReservationFacilityBookingById: build.query<{ data: ReservationFacilityBooking }, string>({
      query: (id) => ({ url: `${ENDPOINTS.RESERVATION_FACILITY_BOOKING}/${id}`, method: 'GET', credentials: 'include' }),
      providesTags: (_, __, id) => [{ type: 'ReservationFacilityBookings', id }],
    }),
    createReservationFacilityBooking: build.mutation<{ data: ReservationFacilityBooking }, Record<string, unknown>>({
      query: (body) => ({ url: ENDPOINTS.RESERVATION_FACILITY_BOOKING, method: 'POST', body, credentials: 'include' }),
      invalidatesTags: ['ReservationFacilityBookings'],
    }),
    updateReservationFacilityBooking: build.mutation<{ data: ReservationFacilityBooking }, { id: string; payload: Record<string, unknown> }>({
      query: ({ id, payload }) => ({ url: `${ENDPOINTS.RESERVATION_FACILITY_BOOKING}/${id}`, method: 'PATCH', body: payload, credentials: 'include' }),
      invalidatesTags: ['ReservationFacilityBookings'],
    }),
    deleteReservationFacilityBooking: build.mutation<{ data: unknown }, string>({
      query: (id) => ({ url: `${ENDPOINTS.RESERVATION_FACILITY_BOOKING}/${id}`, method: 'DELETE', credentials: 'include' }),
      invalidatesTags: ['ReservationFacilityBookings'],
    }),
  }),
});

export const { setBookings, setPage, setTotalPages } = reservationFacilityBookingSlice.actions;
export const {
  useGetReservationFacilityBookingsQuery,
  useGetReservationFacilityBookingByIdQuery,
  useCreateReservationFacilityBookingMutation,
  useUpdateReservationFacilityBookingMutation,
  useDeleteReservationFacilityBookingMutation,
} = reservationFacilityBookingApi;
export default reservationFacilityBookingSlice.reducer;
