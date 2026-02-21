import { createSlice, type PayloadAction, type AnyAction } from '@reduxjs/toolkit';
import { createApi } from '@reduxjs/toolkit/query/react';
import { ENDPOINTS } from '@/shared/types/api';
import { baseQueryWithOrg } from '@/store/baseQuery';
import type { Organization } from '@/interfaces/organization/Organization';
import type { GetOrganizationsResponse } from '@/interfaces/organization/GetOrganizationsResponse';

interface OrganizationState {
  currentOrganizationId: string | null;
  organizations: Organization[];
  totalCount: number;
  page: number;
  totalPages: number;
}

const initialState: OrganizationState = {
  currentOrganizationId: null,
  organizations: [],
  totalCount: 0,
  page: 1,
  totalPages: 1,
};

export const MOCK_ORGANIZATIONS: Organization[] = [
  { id: '1', name: 'Hotel Central', alias: 'HC' },
  { id: '2', name: 'Resort Playa', alias: 'RP' },
  { id: '3', name: 'Boutique Hotel', alias: 'BH' },
  { id: '4', name: 'Hotel Executive', alias: 'HE' },
];

export const organizationSlice = createSlice({
  name: 'organization',
  initialState,
  reducers: {
    setCurrentOrganization: (state, action: PayloadAction<string | null>) => {
      state.currentOrganizationId = action.payload;
    },
    setOrganizations: (state, action: PayloadAction<Organization[]>) => {
      state.organizations = action.payload;
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
  },
});

export const organizationApi = createApi({
  reducerPath: 'organizationApi',
  baseQuery: baseQueryWithOrg,
  tagTypes: ['Organizations'],
  endpoints: (build) => ({
    getOrganizations: build.query<
      { data: GetOrganizationsResponse },
      { page?: number; limit?: number; filter?: string; sort?: string } | void
    >({
      query: (params) => ({
        url: ENDPOINTS.ORGANIZATION,
        method: 'GET',
        params: params || {},
        credentials: 'include',
      }),
      providesTags: ['Organizations'],
    }),
    getOrganizationById: build.query<{ data: Organization }, string>({
      query: (id) => ({
        url: `${ENDPOINTS.ORGANIZATION}/${id}`,
        method: 'GET',
        credentials: 'include',
      }),
      providesTags: (_, __, id) => [{ type: 'Organizations', id }],
    }),
    createOrganization: build.mutation<{ data: Organization }, Record<string, unknown>>({
      query: (body) => ({
        url: ENDPOINTS.ORGANIZATION,
        method: 'POST',
        body,
        credentials: 'include',
      }),
      invalidatesTags: ['Organizations'],
    }),
    updateOrganization: build.mutation<{ data: Organization }, { id: string; payload: Record<string, unknown> }>({
      query: ({ id, payload }) => ({
        url: `${ENDPOINTS.ORGANIZATION}/${id}`,
        method: 'PATCH',
        body: payload,
        credentials: 'include',
      }),
      invalidatesTags: (_, __, arg) => (arg?.id ? [{ type: 'Organizations', id: arg.id }, 'Organizations'] : ['Organizations']),
    }),
    deleteOrganization: build.mutation<{ data: unknown }, string>({
      query: (id) => ({
        url: `${ENDPOINTS.ORGANIZATION}/${id}`,
        method: 'DELETE',
        credentials: 'include',
      }),
      invalidatesTags: ['Organizations'],
    }),
  }),
});

export const { setCurrentOrganization, setOrganizations, setTotalCount, setPage, setTotalPages } = organizationSlice.actions;

export function loadMockOrganizations() {
  return (dispatch: (action: AnyAction) => void) => {
    dispatch(setOrganizations(MOCK_ORGANIZATIONS));
    dispatch(setTotalCount(MOCK_ORGANIZATIONS.length));
    dispatch(setTotalPages(1));
  };
}

export const {
  useGetOrganizationsQuery,
  useGetOrganizationByIdQuery,
  useCreateOrganizationMutation,
  useUpdateOrganizationMutation,
  useDeleteOrganizationMutation,
} = organizationApi;

export default organizationSlice.reducer;
