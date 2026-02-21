import { createSlice, type PayloadAction, type AnyAction } from '@reduxjs/toolkit';
import { createApi } from '@reduxjs/toolkit/query/react';
import { ENDPOINTS } from '@/shared/types/api';
import { baseQueryWithOrg } from '@/store/baseQuery';
import type { StaffTask } from '@/interfaces/staff-task/StaffTask';
import type { GetStaffTasksResponse } from '@/interfaces/staff-task/GetStaffTasksResponse';

interface StaffTaskState {
  tasks: StaffTask[];
  totalCount: number;
  page: number;
  totalPages: number;
}

const initialState: StaffTaskState = { tasks: [], totalCount: 0, page: 1, totalPages: 1 };

export const MOCK_STAFF_TASKS: StaffTask[] = [
  { id: '1', description: 'Limpiar Habitación 204', scheduledStartAt: '2025-01-20T09:00:00Z', status: 'pending' },
  { id: '2', description: 'Preparar Sala de Conferencias', scheduledStartAt: '2025-01-20T10:30:00Z', status: 'in-progress' },
  { id: '3', description: 'Reposición de Minibar - Piso 3', scheduledStartAt: '2025-01-20T11:00:00Z', status: 'pending' },
  { id: '4', description: 'Inspección Piscina', scheduledStartAt: '2025-01-20T08:00:00Z', status: 'completed' },
  { id: '5', description: 'Reparar Aire Acondicionado Habitación 305', scheduledStartAt: '2025-01-20T14:00:00Z', status: 'pending' },
  { id: '6', description: 'Atender Solicitud Room Service', scheduledStartAt: '2025-01-20T14:30:00Z', status: 'in-progress' },
];

export const staffTaskSlice = createSlice({
  name: 'staffTask',
  initialState,
  reducers: {
    setTasks: (s, a: PayloadAction<StaffTask[]>) => { s.tasks = a.payload; s.totalCount = a.payload.length; },
    setPage: (s, a: PayloadAction<number>) => { s.page = a.payload; },
    setTotalPages: (s, a: PayloadAction<number>) => { s.totalPages = a.payload; },
  },
});

export const staffTaskApi = createApi({
  reducerPath: 'staffTaskApi',
  baseQuery: baseQueryWithOrg,
  tagTypes: ['StaffTasks'],
  endpoints: (build) => ({
    getStaffTasks: build.query<
      { data: GetStaffTasksResponse },
      { page?: number; limit?: number; scheduledFrom?: string; scheduledTo?: string } | void
    >({
      query: (p) => ({ url: ENDPOINTS.STAFF_TASK, method: 'GET', params: p ?? {}, credentials: 'include' }),
      providesTags: ['StaffTasks'],
    }),
    getStaffTaskById: build.query<{ data: StaffTask }, string>({
      query: (id) => ({ url: `${ENDPOINTS.STAFF_TASK}/${id}`, method: 'GET', credentials: 'include' }),
      providesTags: (_, __, id) => [{ type: 'StaffTasks', id }],
    }),
    createStaffTask: build.mutation<{ data: StaffTask }, Record<string, unknown>>({
      query: (body) => ({ url: ENDPOINTS.STAFF_TASK, method: 'POST', body, credentials: 'include' }),
      invalidatesTags: ['StaffTasks'],
    }),
    updateStaffTask: build.mutation<{ data: StaffTask }, { id: string; payload: Record<string, unknown> }>({
      query: ({ id, payload }) => ({ url: `${ENDPOINTS.STAFF_TASK}/${id}`, method: 'PATCH', body: payload, credentials: 'include' }),
      invalidatesTags: ['StaffTasks'],
    }),
    deleteStaffTask: build.mutation<{ data: unknown }, string>({
      query: (id) => ({ url: `${ENDPOINTS.STAFF_TASK}/${id}`, method: 'DELETE', credentials: 'include' }),
      invalidatesTags: ['StaffTasks'],
    }),
  }),
});

export const { setTasks, setPage, setTotalPages } = staffTaskSlice.actions;
export function loadMockStaffTasks() {
  return (dispatch: (a: AnyAction) => void) => {
    dispatch(setTasks(MOCK_STAFF_TASKS));
    dispatch(setTotalPages(1));
  };
}
export const { useGetStaffTasksQuery, useGetStaffTaskByIdQuery, useCreateStaffTaskMutation, useUpdateStaffTaskMutation, useDeleteStaffTaskMutation } = staffTaskApi;
export default staffTaskSlice.reducer;
