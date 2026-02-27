import { createSlice, type PayloadAction, type AnyAction } from '@reduxjs/toolkit';
import { createApi } from '@reduxjs/toolkit/query/react';
import type { User } from '@/interfaces/user/User';
import { STAFF_ROLE_NAME } from '@/app/admin/staff/constants';
import { ENDPOINTS } from '@/shared/types/api';
import { baseQueryWithOrg } from '@/store/baseQuery';
import type { GetStaffResponse } from '@/interfaces/staff/GetStaffResponse';
import type { StaffStatsByDepartment } from '@/interfaces/staff/StaffStatsByDepartment';

interface StaffState {
  staff: User[];
}

const MOCK_STAFF: User[] = [
  { id: '1', firstName: 'María', lastName: 'González', email: 'maria@hotel.com', roleName: STAFF_ROLE_NAME, status: 'active' },
  { id: '2', firstName: 'Roberto', lastName: 'Fernández', email: 'roberto@hotel.com', roleName: STAFF_ROLE_NAME, status: 'active' },
  { id: '3', firstName: 'Carmen', lastName: 'Silva', email: 'carmen@hotel.com', roleName: STAFF_ROLE_NAME, status: 'active' },
  { id: '4', firstName: 'Diego', lastName: 'Ramírez', email: 'diego@hotel.com', roleName: STAFF_ROLE_NAME, status: 'active' },
  { id: '5', firstName: 'Laura', lastName: 'Pérez', email: 'laura@hotel.com', roleName: STAFF_ROLE_NAME, status: 'active' },
];

const initialState: StaffState = {
  staff: [],
};

export const staffSlice = createSlice({
  name: 'staff',
  initialState,
  reducers: {
    setStaff: (state, action: PayloadAction<User[]>) => {
      state.staff = action.payload;
    },
  },
});

export const { setStaff } = staffSlice.actions;

export const staffApi = createApi({
  reducerPath: 'staffApi',
  baseQuery: baseQueryWithOrg,
  tagTypes: ['Staff'],
  endpoints: (build) => ({
    getStaff: build.query<
      { data: GetStaffResponse },
      { page?: number; limit?: number; sort?: string } | void
    >({
      query: (params) => ({
        url: ENDPOINTS.STAFF,
        method: 'GET',
        params: params || {},
        credentials: 'include',
      }),
      providesTags: ['Staff'],
    }),
    getStaffStats: build.query<{ data: StaffStatsByDepartment[] }, void>({
      query: () => ({
        url: `${ENDPOINTS.STAFF}/stats`,
        method: 'GET',
        credentials: 'include',
      }),
      providesTags: ['Staff'],
    }),
    deleteStaff: build.mutation<void, string>({
      query: (id) => ({
        url: `${ENDPOINTS.STAFF}/${id}`,
        method: 'DELETE',
        credentials: 'include',
      }),
      invalidatesTags: ['Staff'],
    }),
    updateStaff: build.mutation<
      void,
      { id: string; payload: UpdateStaffPayload }
    >({
      query: ({ id, payload }) => ({
        url: `${ENDPOINTS.STAFF}/${id}`,
        method: 'PATCH',
        body: payload,
        credentials: 'include',
      }),
      invalidatesTags: ['Staff'],
    }),
  }),
});

export interface UpdateStaffPayload {
  firstName?: string;
  lastName?: string;
  email?: string;
  position?: string;
  status?: string;
  departmentId?: string | null;
  workStartTime?: string | null;
  workEndTime?: string | null;
}

export const {
  useGetStaffQuery,
  useGetStaffStatsQuery,
  useDeleteStaffMutation,
  useUpdateStaffMutation,
} = staffApi;

export function loadMockStaff() {
  return (dispatch: (action: AnyAction) => void) => {
    dispatch(setStaff(MOCK_STAFF));
  };
}

export default staffSlice.reducer;
