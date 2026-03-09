import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { createApi } from '@reduxjs/toolkit/query/react';
import { ENDPOINTS } from '@/shared/types/api';
import { baseQueryWithOrg } from '@/store/baseQuery';
import type { TaxonomyFacilityType } from '@/interfaces/taxonomy-facility-type/TaxonomyFacilityType';

const initialState: { items: TaxonomyFacilityType[] } = { items: [] };

export const taxonomyFacilityTypeSlice = createSlice({
  name: 'taxonomyFacilityType',
  initialState,
  reducers: { setItems: (s, a: PayloadAction<TaxonomyFacilityType[]>) => { s.items = a.payload; } },
});

export const taxonomyFacilityTypeApi = createApi({
  reducerPath: 'taxonomyFacilityTypeApi',
  baseQuery: baseQueryWithOrg,
  tagTypes: ['TaxonomyFacilityTypes'],
  endpoints: (build) => ({
    getFacilityTypes: build.query<{ data: TaxonomyFacilityType[] }, { activeOnly?: boolean } | void>({
      query: (p) => ({ url: ENDPOINTS.TAXONOMY_FACILITY_TYPES, method: 'GET', params: p ?? {}, credentials: 'include' }),
      providesTags: ['TaxonomyFacilityTypes'],
    }),
    getFacilityTypeById: build.query<{ data: TaxonomyFacilityType }, string>({
      query: (id) => ({ url: `${ENDPOINTS.TAXONOMY_FACILITY_TYPES}/${id}`, method: 'GET', credentials: 'include' }),
      providesTags: (_, __, id) => [{ type: 'TaxonomyFacilityTypes', id }],
    }),
    createFacilityType: build.mutation<{ data: TaxonomyFacilityType }, { name: string }>({
      query: (body) => ({ url: ENDPOINTS.TAXONOMY_FACILITY_TYPES, method: 'POST', body, credentials: 'include' }),
      invalidatesTags: ['TaxonomyFacilityTypes'],
    }),
    updateFacilityType: build.mutation<{ data: TaxonomyFacilityType }, { id: string; payload: Partial<TaxonomyFacilityType> }>({
      query: ({ id, payload }) => ({ url: `${ENDPOINTS.TAXONOMY_FACILITY_TYPES}/${id}`, method: 'PATCH', body: payload, credentials: 'include' }),
      invalidatesTags: ['TaxonomyFacilityTypes'],
    }),
    deleteFacilityType: build.mutation<{ data: unknown }, string>({
      query: (id) => ({ url: `${ENDPOINTS.TAXONOMY_FACILITY_TYPES}/${id}`, method: 'DELETE', credentials: 'include' }),
      invalidatesTags: ['TaxonomyFacilityTypes'],
    }),
  }),
});

export const { setItems } = taxonomyFacilityTypeSlice.actions;
export const { useGetFacilityTypesQuery, useGetFacilityTypeByIdQuery, useCreateFacilityTypeMutation, useUpdateFacilityTypeMutation, useDeleteFacilityTypeMutation } = taxonomyFacilityTypeApi;
export default taxonomyFacilityTypeSlice.reducer;
