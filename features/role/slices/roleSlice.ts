import { createSlice, type PayloadAction, type AnyAction } from '@reduxjs/toolkit';
import { createApi } from '@reduxjs/toolkit/query/react';
import { ENDPOINTS } from '@/shared/types/api';
import { baseQueryWithOrg } from '@/store/baseQuery';
import type { Role } from '@/interfaces/role/Role';
import type { GetRolesResponse } from '@/interfaces/role/GetRolesResponse';

interface RoleState {
  roles: Role[];
  totalCount: number;
  page: number;
  totalPages: number;
}

const initialState: RoleState = { roles: [], totalCount: 0, page: 1, totalPages: 1 };

export const MOCK_ROLES: Role[] = [
  { id: '1', name: 'admin', description: 'Administrator' },
  { id: '2', name: 'staff', description: 'Staff member' },
  { id: '3', name: 'viewer', description: 'View only' },
];

export const roleSlice = createSlice({
  name: 'role',
  initialState,
  reducers: {
    setRoles: (s, a: PayloadAction<Role[]>) => { s.roles = a.payload; s.totalCount = a.payload.length; },
    setPage: (s, a: PayloadAction<number>) => { s.page = a.payload; },
    setTotalPages: (s, a: PayloadAction<number>) => { s.totalPages = a.payload; },
  },
});

export const roleApi = createApi({
  reducerPath: 'roleApi',
  baseQuery: baseQueryWithOrg,
  tagTypes: ['Roles'],
  endpoints: (build) => ({
    getRoles: build.query<{ data: GetRolesResponse }, { page?: number; limit?: number; filter?: string } | void>({
      query: (p) => ({ url: ENDPOINTS.ROLE, method: 'GET', params: p ?? {}, credentials: 'include' }),
      providesTags: ['Roles'],
    }),
    getRoleById: build.query<{ data: Role }, string>({
      query: (id) => ({ url: `${ENDPOINTS.ROLE}/${id}`, method: 'GET', credentials: 'include' }),
      providesTags: (_, __, id) => [{ type: 'Roles', id }],
    }),
    createRole: build.mutation<{ data: Role }, { name: string; description: string }>({
      query: (body) => ({ url: ENDPOINTS.ROLE, method: 'POST', body, credentials: 'include' }),
      invalidatesTags: ['Roles'],
    }),
    updateRole: build.mutation<{ data: Role }, { id: string; payload: Partial<Role> }>({
      query: ({ id, payload }) => ({ url: `${ENDPOINTS.ROLE}/${id}`, method: 'PATCH', body: payload, credentials: 'include' }),
      invalidatesTags: ['Roles'],
    }),
    deleteRole: build.mutation<void, string>({
      query: (id) => ({ url: `${ENDPOINTS.ROLE}/${id}`, method: 'DELETE', credentials: 'include' }),
      invalidatesTags: ['Roles'],
    }),
  }),
});

export const { setRoles, setPage, setTotalPages } = roleSlice.actions;
export function loadMockRoles() {
  return (dispatch: (a: AnyAction) => void) => {
    dispatch(setRoles(MOCK_ROLES));
    dispatch(setTotalPages(1));
  };
}
export const { useGetRolesQuery, useGetRoleByIdQuery, useCreateRoleMutation, useUpdateRoleMutation, useDeleteRoleMutation } = roleApi;
export default roleSlice.reducer;
