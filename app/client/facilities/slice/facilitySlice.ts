import { baseQueryWithOrg } from '@/store/baseQuery';
import { createApi } from '@reduxjs/toolkit/query/react';

export interface Facility {
    id: string;
    name: string;
    capacity: number;
    openTime: string;
    closeTime: string;
    facilityTypeId: string;
    organizationId: string;
}

export interface FacilitySlot {
    time: string;
    available: boolean;
    reserved: number;
    capacity: number;
}

export const facilityApi = createApi({
    reducerPath: 'facilityApi',
    baseQuery: baseQueryWithOrg,
    tagTypes: ['Facilities', 'FacilitySlots'],
    endpoints: (build) => ({
        getFacilities: build.query
            <{
                data: {
                    objects: Facility[]
                    hasMore: boolean
                    totalCount: number
                    currentPage: number
                    pageSize: number
                    totalPages: number
                }
            },
                { page?: number; limit?: number; filter?: string; sort?: string } | void
            >({
                query: (params) => ({
                    url: '/facility',
                    method: 'GET',
                    params: params || {},
                    credentials: 'include',
                }),
                providesTags: ['Facilities'],
            }),
        getFacilityById: build.query<{ data: Facility }, string>({
            query: (id) => ({
                url: `/facility/${id}`,
                method: 'GET',
                credentials: 'include',
            }),
            providesTags: ['Facilities', 'FacilitySlots'],
        }),
        getFacilitySlots: build.query<{ data: FacilitySlot[] }, string>({
            query: (id) => ({
                url: `/facility/${id}/slots`,
                method: 'GET',
                credentials: 'include',
            }),
            providesTags: ['Facilities', 'FacilitySlots'],
        }),
    }),
});

export const {
    useGetFacilitiesQuery,
    useGetFacilityByIdQuery,
    useGetFacilitySlotsQuery,
} = facilityApi;