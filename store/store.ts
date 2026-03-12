import { configureStore } from '@reduxjs/toolkit';
import dataSourceReducer from './slices/dataSourceSlice';
import authReducer, { authApi } from '@/features/auth/slices/authSlice';
import organizationReducer, { organizationApi } from '@/features/organization/slices/organizationSlice';
import facilityReducer, { facilityApi } from '@/app/admin/facilities/slice/facilitySlice';
import userReducer, { userApi } from '@/app/admin/users/slice/userSlice';
import roomReducer, { roomApi } from '@/app/admin/rooms/slice/roomSlice';
import clientReducer, { clientApi } from '@/app/admin/clients/slice/clientSlice';
import staffReducer, { staffApi } from '@/app/admin/staff/slice/staffSlice';
import roleReducer, { roleApi } from '@/features/role/slices/roleSlice';
import staffTaskReducer, { staffTaskApi } from '@/features/staff-task/slices/staffTaskSlice';
import reservationReducer, { reservationApi } from '@/features/reservation/slices/reservationSlice';
import reservationFacilityBookingReducer, { reservationFacilityBookingApi } from '@/features/reservation-facility-booking/slices/reservationFacilityBookingSlice';
import taxonomyDepartmentReducer, { taxonomyDepartmentApi } from '@/features/taxonomy-department/slices/taxonomyDepartmentSlice';
import taxonomyEventCategoryReducer, { taxonomyEventCategoryApi } from '@/features/taxonomy-event-category/slices/taxonomyEventCategorySlice';
import taxonomyFacilityTypeReducer, { taxonomyFacilityTypeApi } from '@/features/taxonomy-facility-type/slices/taxonomyFacilityTypeSlice';
import taxonomyRoomTypeReducer, { taxonomyRoomTypeApi } from '@/features/taxonomy-room-type/slices/taxonomyRoomTypeSlice';
import { taxonomyStaffTypeApi } from '@/features/taxonomy-staff-type copy/slices/taxonomyStaffTypeSlice';

export const store = configureStore({
  reducer: {
    dataSource: dataSourceReducer,
    auth: authReducer,
    organization: organizationReducer,
    facility: facilityReducer,
    user: userReducer,
    room: roomReducer,
    client: clientReducer,
    staff: staffReducer,
    role: roleReducer,
    staffTask: staffTaskReducer,
    reservation: reservationReducer,
    reservationFacilityBooking: reservationFacilityBookingReducer,
    taxonomyDepartment: taxonomyDepartmentReducer,
    taxonomyEventCategory: taxonomyEventCategoryReducer,
    taxonomyFacilityType: taxonomyFacilityTypeReducer,
    taxonomyRoomType: taxonomyRoomTypeReducer,
    [authApi.reducerPath]: authApi.reducer,
    [organizationApi.reducerPath]: organizationApi.reducer,
    [facilityApi.reducerPath]: facilityApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [staffApi.reducerPath]: staffApi.reducer,
    [roomApi.reducerPath]: roomApi.reducer,
    [clientApi.reducerPath]: clientApi.reducer,
    [roleApi.reducerPath]: roleApi.reducer,
    [staffTaskApi.reducerPath]: staffTaskApi.reducer,
    [reservationApi.reducerPath]: reservationApi.reducer,
    [reservationFacilityBookingApi.reducerPath]: reservationFacilityBookingApi.reducer,
    [taxonomyDepartmentApi.reducerPath]: taxonomyDepartmentApi.reducer,
    [taxonomyEventCategoryApi.reducerPath]: taxonomyEventCategoryApi.reducer,
    [taxonomyFacilityTypeApi.reducerPath]: taxonomyFacilityTypeApi.reducer,
    [taxonomyRoomTypeApi.reducerPath]: taxonomyRoomTypeApi.reducer,
    [taxonomyStaffTypeApi.reducerPath]: taxonomyStaffTypeApi.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      organizationApi.middleware,
      facilityApi.middleware,
      userApi.middleware,
      staffApi.middleware,
      roomApi.middleware,
      clientApi.middleware,
      roleApi.middleware,
      staffTaskApi.middleware,
      reservationApi.middleware,
      reservationFacilityBookingApi.middleware,
      taxonomyDepartmentApi.middleware,
      taxonomyEventCategoryApi.middleware,
      taxonomyFacilityTypeApi.middleware,
      taxonomyRoomTypeApi.middleware,
      taxonomyStaffTypeApi.middleware,
    ),
});

export type { RootState } from '@/interfaces/store/RootState';
export type { AppDispatch } from '@/interfaces/store/AppDispatch';
