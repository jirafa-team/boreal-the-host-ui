import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { createApi } from '@reduxjs/toolkit/query/react';
import { ENDPOINTS } from '@/shared/types/api';
import { baseQueryWithOrg } from '@/store/baseQuery';
import type { TaxonomyRoomType } from '@/interfaces/taxonomy-room-type/TaxonomyRoomType';

const initialState: { items: TaxonomyRoomType[] } = { items: [] };

export const taxonomyRoomTypeSlice = createSlice({
  name: 'taxonomyRoomType',
  initialState,
  reducers: { setItems: (s, a: PayloadAction<TaxonomyRoomType[]>) => { s.items = a.payload; } },
});

export const taxonomyRoomTypeApi = createApi({
  reducerPath: 'taxonomyRoomTypeApi',
  baseQuery: baseQueryWithOrg,
  tagTypes: ['TaxonomyRoomTypes'],
  endpoints: (build) => ({
    getRoomTypes: build.query<{ data: TaxonomyRoomType[] }, { activeOnly?: boolean } | void>({
      query: (p) => ({ url: ENDPOINTS.TAXONOMY_ROOM_TYPES, method: 'GET', params: p ?? {}, credentials: 'include' }),
      providesTags: ['TaxonomyRoomTypes'],
    }),
    getRoomTypeById: build.query<{ data: TaxonomyRoomType }, string>({
      query: (id) => ({ url: `${ENDPOINTS.TAXONOMY_ROOM_TYPES}/${id}`, method: 'GET', credentials: 'include' }),
      providesTags: (_, __, id) => [{ type: 'TaxonomyRoomTypes', id }],
    }),
    createRoomType: build.mutation<{ data: TaxonomyRoomType }, { name: string }>({
      query: (body) => ({ url: ENDPOINTS.TAXONOMY_ROOM_TYPES, method: 'POST', body, credentials: 'include' }),
      invalidatesTags: ['TaxonomyRoomTypes'],
    }),
    updateRoomType: build.mutation<{ data: TaxonomyRoomType }, { id: string; payload: Partial<TaxonomyRoomType> }>({
      query: ({ id, payload }) => ({ url: `${ENDPOINTS.TAXONOMY_ROOM_TYPES}/${id}`, method: 'PATCH', body: payload, credentials: 'include' }),
      invalidatesTags: ['TaxonomyRoomTypes'],
    }),
    deleteRoomType: build.mutation<{ data: unknown }, string>({
      query: (id) => ({ url: `${ENDPOINTS.TAXONOMY_ROOM_TYPES}/${id}`, method: 'DELETE', credentials: 'include' }),
      invalidatesTags: ['TaxonomyRoomTypes'],
    }),
  }),
});

export const { setItems } = taxonomyRoomTypeSlice.actions;
export const { useGetRoomTypesQuery, useGetRoomTypeByIdQuery, useCreateRoomTypeMutation, useUpdateRoomTypeMutation, useDeleteRoomTypeMutation } = taxonomyRoomTypeApi;
export default taxonomyRoomTypeSlice.reducer;
