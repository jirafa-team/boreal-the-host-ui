import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_BASE_URL, ENDPOINTS } from '@/shared/types/api';
import type { ContextDto } from '@/interfaces/auth/ContextDto';
import type { CurrentOrganization } from '@/interfaces/auth/CurrentOrganization';
import type { AuthUser } from '@/interfaces/auth/AuthUser';
import type { AuthState } from '@/interfaces/auth/AuthState';

const initialState: AuthState = {
  user: null,
  isLoggedIn: false,
  role: null,
  currentOrganization: undefined,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    updateUser: (state, action: PayloadAction<Partial<AuthState>>) => {
      return { ...state, ...action.payload };
    },
    setCurrentOrganization: (state, action: PayloadAction<CurrentOrganization | null | undefined>) => {
      state.currentOrganization = action.payload ?? undefined;
    },
    clearUser: () => initialState,
  },
});

const authBaseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  credentials: 'include',
  prepareHeaders: (headers) => headers,
});

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: authBaseQuery,
  tagTypes: ['UserContexts'],
  endpoints: (build) => ({
    getUserContexts: build.query<ContextDto[], void>({
      query: () => ({
        url: `/api${ENDPOINTS.AUTH.ORGANIZATION_ROLES}`,
        method: 'GET',
      }),
      providesTags: ['UserContexts'],
    }),
    logout: build.mutation<unknown, void>({
      query: () => ({
        url: `/api${ENDPOINTS.AUTH.LOGOUT}`,
        method: 'POST',
        credentials: 'include',
      }),
      invalidatesTags: ['UserContexts'],
    }),
  }),
});

export const { updateUser, setCurrentOrganization, clearUser } = authSlice.actions;
export const { useGetUserContextsQuery, useLogoutMutation } = authApi;
export default authSlice.reducer;
