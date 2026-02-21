import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { API_BASE_URL } from '@/shared/types/api';
import { getOrganizationIdFromUrl } from '@/shared/utils/urlHelpers';
import type { RootState } from './store';

const rawBaseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  credentials: 'include',
  prepareHeaders: (headers) => headers,
});

export const baseQueryWithOrg: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const DEBUG_API = process.env.NODE_ENV === 'development';
  let organizationId = getOrganizationIdFromUrl();
  if (!organizationId) {
    const state = api.getState() as RootState;
    organizationId = state.organization?.currentOrganizationId ?? state.auth?.currentOrganization?.id ?? undefined;
  }

  let url: string;
  let modifiedArgs: string | FetchArgs;

  const path = typeof args === 'string' ? args : args.url;
  const needsOrg =
    organizationId &&
    !path.startsWith('/auth') &&
    !path.startsWith('/organization') &&
    !path.startsWith('/global');

  const fullPath = needsOrg ? `/api/${organizationId}${path}` : `/api${path}`;

  if (DEBUG_API) {
    console.log('[baseQuery]', { organizationId, path, fullPath });
  }

  if (typeof args === 'string') {
    modifiedArgs = fullPath;
  } else {
    modifiedArgs = { ...args, url: fullPath };
  }

  return await rawBaseQuery(modifiedArgs, api, extraOptions);
};
