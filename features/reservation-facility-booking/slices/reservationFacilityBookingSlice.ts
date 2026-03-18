import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { createApi } from '@reduxjs/toolkit/query/react';
import { ENDPOINTS } from '@/shared/types/api';
import type { ReservationFacilityBooking } from '@/interfaces/reservation-facility-booking/ReservationFacilityBooking';
import type { GetReservationFacilityBookingsResponse } from '@/interfaces/reservation-facility-booking/GetReservationFacilityBookingsResponse';
import { baseQueryWithOrg } from '@/store/baseQuery';

interface State {
  bookings: ReservationFacilityBooking[];
  totalCount: number;
  page: number;
  totalPages: number;
}

const initialState: State = {
  bookings: [],
  totalCount: 0,
  page: 1,
  totalPages: 1,
};

export const reservationFacilityBookingSlice = createSlice({
  name: 'reservationFacilityBooking',
  initialState,
  reducers: {
    setBookings: (state, action: PayloadAction<ReservationFacilityBooking[]>) => {
      state.bookings = action.payload;
      state.totalCount = action.payload.length;
    },

    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },

    setTotalPages: (state, action: PayloadAction<number>) => {
      state.totalPages = action.payload;
    },
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
      query: (params) => ({
        url: ENDPOINTS.RESERVATION_FACILITY_BOOKING,
        method: 'GET',
        params: params ?? {},
        credentials: 'include',
      }),
      providesTags: ['ReservationFacilityBookings'],
    }),

    getReservationFacilityBookingById: build.query<
      { data: ReservationFacilityBooking },
      string
    >({
      query: (id) => ({
        url: `${ENDPOINTS.RESERVATION_FACILITY_BOOKING}/${id}`,
        method: 'GET',
        credentials: 'include',
      }),
      providesTags: (_, __, id) => [{ type: 'ReservationFacilityBookings', id }],
    }),

    getAllBookingsByReservation: build.query<
      {
        data: Array<{
          facilityId: string;
          facility?: { name: string };
          amenityShiftSlot?: {
            startAt: string;
            endAt: string;
          };
        }>;
      },
      string
    >({
      query: (reservationId) => ({
        url: `${ENDPOINTS.RESERVATION_FACILITY_BOOKING}/by-reservation/${reservationId}`,
        method: 'GET',
        credentials: 'include',
      }),
      providesTags: ['ReservationFacilityBookings'],
    }),

    createReservationFacilityBooking: build.mutation<
      { data: ReservationFacilityBooking },
      Record<string, unknown>
    >({
      query: (body) => ({
        url: ENDPOINTS.RESERVATION_FACILITY_BOOKING,
        method: 'POST',
        body,
        credentials: 'include',
      }),
      invalidatesTags: ['ReservationFacilityBookings'],
    }),

    updateReservationFacilityBooking: build.mutation<
      { data: ReservationFacilityBooking },
      { id: string; payload: Record<string, unknown> }
    >({
      query: ({ id, payload }) => ({
        url: `${ENDPOINTS.RESERVATION_FACILITY_BOOKING}/${id}`,
        method: 'PATCH',
        body: payload,
        credentials: 'include',
      }),
      invalidatesTags: ['ReservationFacilityBookings'],
    }),

    deleteReservationFacilityBooking: build.mutation<
      { data: unknown },
      string
    >({
      query: (id) => ({
        url: `${ENDPOINTS.RESERVATION_FACILITY_BOOKING}/${id}`,
        method: 'DELETE',
        credentials: 'include',
      }),
      invalidatesTags: ['ReservationFacilityBookings'],
    }),
  }),
});

export const { setBookings, setPage, setTotalPages } =
  reservationFacilityBookingSlice.actions;

export const {
  useGetReservationFacilityBookingsQuery,
  useGetReservationFacilityBookingByIdQuery,
  useGetAllBookingsByReservationQuery,
  useCreateReservationFacilityBookingMutation,
  useUpdateReservationFacilityBookingMutation,
  useDeleteReservationFacilityBookingMutation,
} = reservationFacilityBookingApi;

export default reservationFacilityBookingSlice.reducer;