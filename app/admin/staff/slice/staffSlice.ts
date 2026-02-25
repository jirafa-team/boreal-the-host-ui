import { createSlice, type PayloadAction, type AnyAction } from '@reduxjs/toolkit';
import type { User } from '@/interfaces/user/User';
import { STAFF_ROLE_NAME } from '@/app/admin/staff/constants';

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

export function loadMockStaff() {
  return (dispatch: (action: AnyAction) => void) => {
    dispatch(setStaff(MOCK_STAFF));
  };
}

export default staffSlice.reducer;
