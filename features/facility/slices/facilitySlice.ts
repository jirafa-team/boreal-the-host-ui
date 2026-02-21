import { createSlice, type PayloadAction, type AnyAction } from '@reduxjs/toolkit';
import { createApi } from '@reduxjs/toolkit/query/react';
import { ENDPOINTS } from '@/shared/types/api';
import { baseQueryWithOrg } from '@/store/baseQuery';
import type { Facility } from '@/interfaces/facility/Facility';
import type { GetFacilitiesResponse } from '@/interfaces/facility/GetFacilitiesResponse';

interface FacilityState {
  facilities: Facility[];
  totalCount: number;
  page: number;
  totalPages: number;
  facilitySelected: string | null;
}

const initialState: FacilityState = {
  facilities: [],
  totalCount: 0,
  page: 1,
  totalPages: 1,
  facilitySelected: null,
};

export const MOCK_FACILITIES: Facility[] = [
  { id: '1', name: 'Gimnasio', type: 'fitness', capacity: 15, startTime: '06:00', endTime: '22:00' },
  { id: '2', name: 'Piscina', type: 'recreation', capacity: 30, startTime: '08:00', endTime: '20:00' },
  { id: '3', name: 'Spa', type: 'wellness', capacity: 8, startTime: '09:00', endTime: '21:00' },
  { id: '4', name: 'Sala de Conferencias A', type: 'business', capacity: 50, startTime: '07:00', endTime: '23:00' },
  { id: '5', name: 'Sala de Conferencias B', type: 'business', capacity: 25, startTime: '07:00', endTime: '23:00' },
  { id: '6', name: 'Cafetería', type: 'dining', capacity: 40, startTime: '06:30', endTime: '23:00' },
  { id: '7', name: 'Restaurante Premium', type: 'dining', capacity: 60, startTime: '12:00', endTime: '23:30' },
];

export const facilitySlice = createSlice({
  name: 'facility',
  initialState,
  reducers: {
    setFacilities: (state, action: PayloadAction<Facility[]>) => {
      state.facilities = action.payload;
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
    setSelectedFacility: (state, action: PayloadAction<string | null>) => {
      state.facilitySelected = action.payload;
    },
  },
});

export const facilityApi = createApi({
  reducerPath: 'facilityApi',
  baseQuery: baseQueryWithOrg,
  tagTypes: ['Facilities'],
  endpoints: (build) => ({
    getFacilities: build.query<
      { data: GetFacilitiesResponse },
      { page?: number; limit?: number; filter?: string; sort?: string } | void
    >({
      query: (params) => ({
        url: ENDPOINTS.FACILITY,
        method: 'GET',
        params: params || {},
        credentials: 'include',
      }),
      providesTags: ['Facilities'],
    }),
    getFacilityById: build.query<{ data: Facility }, string>({
      query: (id) => ({
        url: `${ENDPOINTS.FACILITY}/${id}`,
        method: 'GET',
        credentials: 'include',
      }),
      providesTags: (_, __, id) => [{ type: 'Facilities', id }],
    }),
    createFacility: build.mutation<
      { data: Facility },
      { name: string; facilityTypeId: string; capacity: number; openTime: string; closeTime: string; [key: string]: unknown }
    >({
      query: (body) => ({
        url: ENDPOINTS.FACILITY,
        method: 'POST',
        body,
        credentials: 'include',
      }),
      invalidatesTags: ['Facilities'],
    }),
    updateFacility: build.mutation<{ data: Facility }, { id: string; payload: Partial<Facility> }>({
      query: ({ id, payload }) => ({
        url: `${ENDPOINTS.FACILITY}/${id}`,
        method: 'PATCH',
        body: payload,
        credentials: 'include',
      }),
      invalidatesTags: (_, __, arg) => (arg?.id ? [{ type: 'Facilities', id: arg.id }, 'Facilities'] : ['Facilities']),
    }),
    deleteFacility: build.mutation<{ data: unknown }, string>({
      query: (id) => ({
        url: `${ENDPOINTS.FACILITY}/${id}`,
        method: 'DELETE',
        credentials: 'include',
      }),
      invalidatesTags: ['Facilities'],
    }),
  }),
});

export const { setFacilities, setTotalCount, setPage, setTotalPages, setSelectedFacility } = facilitySlice.actions;

export function loadMockFacilities() {
  return (dispatch: (action: AnyAction) => void) => {
    dispatch(setFacilities(MOCK_FACILITIES));
    dispatch(setTotalCount(MOCK_FACILITIES.length));
    dispatch(setTotalPages(1));
  };
}

export const {
  useGetFacilitiesQuery,
  useGetFacilityByIdQuery,
  useCreateFacilityMutation,
  useUpdateFacilityMutation,
  useDeleteFacilityMutation,
} = facilityApi;

export default facilitySlice.reducer;
