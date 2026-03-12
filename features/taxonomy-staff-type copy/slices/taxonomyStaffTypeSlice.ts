import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { createApi } from '@reduxjs/toolkit/query/react';
import { ENDPOINTS } from '@/shared/types/api';
import { baseQueryWithOrg } from '@/store/baseQuery';
import { TaxonomyStaffType } from '@/interfaces/taxonomy-staff-type/TaxonomyStaffType';

const initialState: { items: TaxonomyStaffType[] } = { items: [] };

export const taxonomyStaffTypeSlice = createSlice({
  name: 'taxonomyStaffType',
  initialState,
  reducers: { setItems: (s, a: PayloadAction<TaxonomyStaffType[]>) => { s.items = a.payload; } },
});

export const taxonomyStaffTypeApi = createApi({
  reducerPath: 'taxonomyStaffTypeApi',
  baseQuery: baseQueryWithOrg,
  tagTypes: ['TaxonomyStaffTypes'],
  endpoints: (build) => ({
    getStaffTypes: build.query<{ data: TaxonomyStaffType[] }, { activeOnly?: boolean } | void>({
      query: (p) => ({ url: ENDPOINTS.TAXONOMY_ROOM_TYPES, method: 'GET', params: p ?? {}, credentials: 'include' }),
      providesTags: ['TaxonomyStaffTypes'],
    }),
    getStaffTypeById: build.query<{ data: TaxonomyStaffType }, string>({
      query: (id) => ({ url: `${ENDPOINTS.TAXONOMY_ROOM_TYPES}/${id}`, method: 'GET', credentials: 'include' }),
      providesTags: (_, __, id) => [{ type: 'TaxonomyStaffTypes', id }],
    }),
    createStaffType: build.mutation<{ data: TaxonomyStaffType }, { name: string }>({
      query: (body) => ({ url: ENDPOINTS.TAXONOMY_ROOM_TYPES, method: 'POST', body, credentials: 'include' }),
      invalidatesTags: ['TaxonomyStaffTypes'],
    }),
    updateStaffType: build.mutation<{ data: TaxonomyStaffType }, { id: string; payload: Partial<TaxonomyStaffType> }>({
      query: ({ id, payload }) => ({ url: `${ENDPOINTS.TAXONOMY_ROOM_TYPES}/${id}`, method: 'PATCH', body: payload, credentials: 'include' }),
      invalidatesTags: ['TaxonomyStaffTypes'],
    }),
    deleteStaffType: build.mutation<{ data: unknown }, string>({
      query: (id) => ({ url: `${ENDPOINTS.TAXONOMY_ROOM_TYPES}/${id}`, method: 'DELETE', credentials: 'include' }),
      invalidatesTags: ['TaxonomyStaffTypes'],
    }),
  }),
});

export const { setItems } = taxonomyStaffTypeSlice.actions;
export const { useGetStaffTypesQuery, useGetStaffTypeByIdQuery, useCreateStaffTypeMutation, useUpdateStaffTypeMutation, useDeleteStaffTypeMutation } = taxonomyStaffTypeApi;
export default taxonomyStaffTypeSlice.reducer;
