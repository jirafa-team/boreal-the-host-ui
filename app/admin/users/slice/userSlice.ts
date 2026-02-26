import { createSlice, type PayloadAction, type AnyAction } from '@reduxjs/toolkit';
import { createApi } from '@reduxjs/toolkit/query/react';
import { ENDPOINTS } from '@/shared/types/api';
import { baseQueryWithOrg } from '@/store/baseQuery';
import type { User } from '@/interfaces/user/User';
import type { GetUsersResponse } from '@/interfaces/user/GetUsersResponse';

interface UserState {
  users: User[];
  totalCount: number;
  page: number;
  totalPages: number;
  userSelected: string | null;
}

const initialState: UserState = {
  users: [],
  totalCount: 0,
  page: 1,
  totalPages: 1,
  userSelected: null,
};

export const MOCK_USERS: User[] = [
  { id: '1', name: 'Carlos García', email: 'carlos@hotel.com', role: 'Hotel Administrator', status: 'active', lastLogin: '2024-01-15 10:30' },
  { id: '2', name: 'María López', email: 'maria@hotel.com', role: 'Staff', status: 'active', lastLogin: '2024-01-15 09:15' },
  { id: '3', name: 'Juan Rodríguez', email: 'juan@hotel.com', role: 'Staff', status: 'active', lastLogin: '2024-01-14 18:45' },
  { id: '4', name: 'Ana Martínez', email: 'ana@hotel.com', role: 'Viewer', status: 'active', lastLogin: '2024-01-15 08:00' },
  { id: '5', name: 'Pedro Sánchez', email: 'pedro@hotel.com', role: 'Staff', status: 'inactive', lastLogin: '2024-01-10 15:20' },
];

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUsers: (state, action: PayloadAction<User[]>) => {
      state.users = action.payload;
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
    setSelectedUser: (state, action: PayloadAction<string | null>) => {
      state.userSelected = action.payload;
    },
  },
});

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: baseQueryWithOrg,
  tagTypes: ['Users'],
  endpoints: (build) => ({
    getUsers: build.query<
      { data: GetUsersResponse },
      { page?: number; limit?: number; filter?: string; sort?: string } | void
    >({
      query: (params) => ({
        url: ENDPOINTS.USER,
        method: 'GET',
        params: params || {},
        credentials: 'include',
      }),
      providesTags: ['Users'],
    }),
    getUserById: build.query<{ data: User }, string>({
      query: (id) => ({
        url: `${ENDPOINTS.USER}/${id}`,
        method: 'GET',
        credentials: 'include',
      }),
      providesTags: (_, __, id) => [{ type: 'Users', id }],
    }),
    createUser: build.mutation<{ data: User }, Record<string, unknown>>({
      query: (body) => ({
        url: ENDPOINTS.USER,
        method: 'POST',
        body,
        credentials: 'include',
      }),
      invalidatesTags: ['Users'],
    }),
    updateUser: build.mutation<void, { id: string; payload: Record<string, unknown> }>({
      query: ({ id, payload }) => ({
        url: `${ENDPOINTS.USER}/${id}`,
        method: 'PATCH',
        body: payload,
        credentials: 'include',
      }),
      invalidatesTags: (_, __, arg) => (arg?.id ? [{ type: 'Users', id: arg.id }, 'Users'] : ['Users']),
    }),
    deleteUser: build.mutation<void, string>({
      query: (id) => ({
        url: `${ENDPOINTS.USER}/${id}`,
        method: 'DELETE',
        credentials: 'include',
      }),
      invalidatesTags: ['Users'],
    }),
  }),
});

export const { setUsers, setTotalCount, setPage, setTotalPages, setSelectedUser } = userSlice.actions;

export function loadMockUsers() {
  return (dispatch: (action: AnyAction) => void) => {
    dispatch(setUsers(MOCK_USERS));
    dispatch(setTotalCount(MOCK_USERS.length));
    dispatch(setTotalPages(1));
  };
}

export const {
  useGetUsersQuery,
  useGetUserByIdQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = userApi;

export default userSlice.reducer;
