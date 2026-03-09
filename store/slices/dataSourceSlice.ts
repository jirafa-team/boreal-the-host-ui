import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { DataSource } from '@/interfaces/datasource/DataSource';

interface DataSourceState {
  dataSource: DataSource;
}

const DATA_SOURCE_KEY = 'boreal-dataSource';

function getInitialDataSource(): DataSource {
  if (typeof window === 'undefined') return 'api';
  try {
    const stored = localStorage.getItem(DATA_SOURCE_KEY);
    if (stored === 'mock' || stored === 'api') return stored;
  } catch {
    // ignore
  }
  return 'api';
}

const initialState: DataSourceState = {
  dataSource: getInitialDataSource(),
};

export const dataSourceSlice = createSlice({
  name: 'dataSource',
  initialState,
  reducers: {
    setDataSource: (state, action: PayloadAction<DataSource>) => {
      state.dataSource = action.payload;
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem(DATA_SOURCE_KEY, action.payload);
        } catch {
          // ignore
        }
      }
    },
  },
});

export const { setDataSource } = dataSourceSlice.actions;
export default dataSourceSlice.reducer;
