import { createSlice, type PayloadAction, type AnyAction } from '@reduxjs/toolkit';
import { createApi } from '@reduxjs/toolkit/query/react';
import type { User } from '@/interfaces/user/User';
import type { UserWithOptionalStaff } from '@/app/admin/staff/utils/userToStaffDisplay';
import { STAFF_ROLE_NAME } from '@/app/admin/staff/constants';
import { ENDPOINTS } from '@/shared/types/api';
import { baseQueryWithOrg } from '@/store/baseQuery';
import type { GetStaffResponse } from '@/interfaces/staff/GetStaffResponse';
import type { StaffStatsByDepartment } from '@/interfaces/staff/StaffStatsByDepartment';
import type { StaffScheduleEntry, StaffWeeklySchedule } from '@/interfaces/staff/StaffSchedule';

interface StaffState {
  staff: UserWithOptionalStaff[];
}

const MOCK_STAFF: UserWithOptionalStaff[] = [
  {
    id: '1',
    firstName: 'María',
    lastName: 'González',
    email: 'maria@hotel.com',
    roleName: STAFF_ROLE_NAME,
    status: 'active',
    employee: {
      workStatus: 'busy',
      departmentName: 'Limpieza',
      workStartTime: '07:00',
      workEndTime: '15:00',
      tasksToday: 5,
      maxCapacity: 8,
    },
  },
  {
    id: '2',
    firstName: 'Roberto',
    lastName: 'Fernández',
    email: 'roberto@hotel.com',
    roleName: STAFF_ROLE_NAME,
    status: 'active',
    employee: {
      workStatus: 'available',
      departmentName: 'Mantenimiento',
      workStartTime: '07:00',
      workEndTime: '15:00',
      tasksToday: 3,
      maxCapacity: 8,
    },
  },
  {
    id: '3',
    firstName: 'Carmen',
    lastName: 'Silva',
    email: 'carmen@hotel.com',
    roleName: STAFF_ROLE_NAME,
    status: 'active',
    employee: {
      workStatus: 'busy',
      departmentName: 'Limpieza',
      workStartTime: '11:00',
      workEndTime: '19:00',
      tasksToday: 6,
      maxCapacity: 8,
    },
  },
];

const initialState: StaffState = {
  staff: [],
};

export const staffSlice = createSlice({
  name: 'staff',
  initialState,
  reducers: {
    setStaff: (state, action: PayloadAction<UserWithOptionalStaff[]>) => {
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
    getStaffSchedule: build.query<{ data: StaffWeeklySchedule }, string>({
      query: (id) => ({
        url: `${ENDPOINTS.STAFF}/${id}/schedule`,
        method: 'GET',
        credentials: 'include',
      }),
      providesTags: ['Staff'],
    }),
    upsertStaffSchedule: build.mutation<
      void,
      { id: string; schedule: StaffScheduleEntry[] }
    >({
      query: ({ id, schedule }) => ({
        url: `${ENDPOINTS.STAFF}/${id}/schedule`,
        method: 'PUT',
        body: { schedule },
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
  useGetStaffScheduleQuery,
  useUpsertStaffScheduleMutation,
} = staffApi;

export function loadMockStaff() {
  return (dispatch: (action: AnyAction) => void) => {
    dispatch(setStaff(MOCK_STAFF));
  };
}

export default staffSlice.reducer;
