import type { store } from '@/store/store';

export type RootState = ReturnType<typeof store.getState>;
