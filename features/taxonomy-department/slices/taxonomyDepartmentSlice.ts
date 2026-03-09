import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { createApi } from '@reduxjs/toolkit/query/react';
import { ENDPOINTS } from '@/shared/types/api';
import { baseQueryWithOrg } from '@/store/baseQuery';
import type { TaxonomyDepartment } from '@/interfaces/taxonomy-department/TaxonomyDepartment';

const initialState: { items: TaxonomyDepartment[] } = { items: [] };

export const taxonomyDepartmentSlice = createSlice({
  name: 'taxonomyDepartment',
  initialState,
  reducers: { setItems: (s, a: PayloadAction<TaxonomyDepartment[]>) => { s.items = a.payload; } },
});

export const taxonomyDepartmentApi = createApi({
  reducerPath: 'taxonomyDepartmentApi',
  baseQuery: baseQueryWithOrg,
  tagTypes: ['TaxonomyDepartments'],
  endpoints: (build) => ({
    getDepartments: build.query<{ data: TaxonomyDepartment[] }, { activeOnly?: boolean } | void>({
      query: (p) => ({ url: ENDPOINTS.TAXONOMY_DEPARTMENTS, method: 'GET', params: p ?? {}, credentials: 'include' }),
      providesTags: ['TaxonomyDepartments'],
    }),
    getDepartmentById: build.query<{ data: TaxonomyDepartment }, string>({
      query: (id) => ({ url: `${ENDPOINTS.TAXONOMY_DEPARTMENTS}/${id}`, method: 'GET', credentials: 'include' }),
      providesTags: (_, __, id) => [{ type: 'TaxonomyDepartments', id }],
    }),
    createDepartment: build.mutation<{ data: TaxonomyDepartment }, { name: string }>({
      query: (body) => ({ url: ENDPOINTS.TAXONOMY_DEPARTMENTS, method: 'POST', body, credentials: 'include' }),
      invalidatesTags: ['TaxonomyDepartments'],
    }),
    updateDepartment: build.mutation<{ data: TaxonomyDepartment }, { id: string; payload: Partial<TaxonomyDepartment> }>({
      query: ({ id, payload }) => ({ url: `${ENDPOINTS.TAXONOMY_DEPARTMENTS}/${id}`, method: 'PATCH', body: payload, credentials: 'include' }),
      invalidatesTags: ['TaxonomyDepartments'],
    }),
    deleteDepartment: build.mutation<{ data: unknown }, string>({
      query: (id) => ({ url: `${ENDPOINTS.TAXONOMY_DEPARTMENTS}/${id}`, method: 'DELETE', credentials: 'include' }),
      invalidatesTags: ['TaxonomyDepartments'],
    }),
  }),
});

export const { setItems } = taxonomyDepartmentSlice.actions;
export const { useGetDepartmentsQuery, useGetDepartmentByIdQuery, useCreateDepartmentMutation, useUpdateDepartmentMutation, useDeleteDepartmentMutation } = taxonomyDepartmentApi;
export default taxonomyDepartmentSlice.reducer;
