import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { createApi } from '@reduxjs/toolkit/query/react';
import { ENDPOINTS } from '@/shared/types/api';
import { baseQueryWithOrg } from '@/store/baseQuery';
import type { TaxonomyEventCategory } from '@/interfaces/taxonomy-event-category/TaxonomyEventCategory';

const initialState: { items: TaxonomyEventCategory[] } = { items: [] };

export const taxonomyEventCategorySlice = createSlice({
  name: 'taxonomyEventCategory',
  initialState,
  reducers: { setItems: (s, a: PayloadAction<TaxonomyEventCategory[]>) => { s.items = a.payload; } },
});

export const taxonomyEventCategoryApi = createApi({
  reducerPath: 'taxonomyEventCategoryApi',
  baseQuery: baseQueryWithOrg,
  tagTypes: ['TaxonomyEventCategories'],
  endpoints: (build) => ({
    getEventCategories: build.query<{ data: TaxonomyEventCategory[] }, { activeOnly?: boolean } | void>({
      query: (p) => ({ url: ENDPOINTS.TAXONOMY_EVENT_CATEGORIES, method: 'GET', params: p ?? {}, credentials: 'include' }),
      providesTags: ['TaxonomyEventCategories'],
    }),
    getEventCategoryById: build.query<{ data: TaxonomyEventCategory }, string>({
      query: (id) => ({ url: `${ENDPOINTS.TAXONOMY_EVENT_CATEGORIES}/${id}`, method: 'GET', credentials: 'include' }),
      providesTags: (_, __, id) => [{ type: 'TaxonomyEventCategories', id }],
    }),
    createEventCategory: build.mutation<{ data: TaxonomyEventCategory }, { name: string }>({
      query: (body) => ({ url: ENDPOINTS.TAXONOMY_EVENT_CATEGORIES, method: 'POST', body, credentials: 'include' }),
      invalidatesTags: ['TaxonomyEventCategories'],
    }),
    updateEventCategory: build.mutation<{ data: TaxonomyEventCategory }, { id: string; payload: Partial<TaxonomyEventCategory> }>({
      query: ({ id, payload }) => ({ url: `${ENDPOINTS.TAXONOMY_EVENT_CATEGORIES}/${id}`, method: 'PATCH', body: payload, credentials: 'include' }),
      invalidatesTags: ['TaxonomyEventCategories'],
    }),
    deleteEventCategory: build.mutation<{ data: unknown }, string>({
      query: (id) => ({ url: `${ENDPOINTS.TAXONOMY_EVENT_CATEGORIES}/${id}`, method: 'DELETE', credentials: 'include' }),
      invalidatesTags: ['TaxonomyEventCategories'],
    }),
  }),
});

export const { setItems } = taxonomyEventCategorySlice.actions;
export const { useGetEventCategoriesQuery, useGetEventCategoryByIdQuery, useCreateEventCategoryMutation, useUpdateEventCategoryMutation, useDeleteEventCategoryMutation } = taxonomyEventCategoryApi;
export default taxonomyEventCategorySlice.reducer;
