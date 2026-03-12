import { useState } from 'react'
import { useSelector } from 'react-redux'
import type { RootState } from '@/store/store'

import {
    useGetDepartmentsQuery,
    useCreateDepartmentMutation,
    useUpdateDepartmentMutation,
    useDeleteDepartmentMutation
} from '@/features/taxonomy-department/slices/taxonomyDepartmentSlice'

import {
    useGetFacilityTypesQuery,
    useCreateFacilityTypeMutation,
    useUpdateFacilityTypeMutation,
    useDeleteFacilityTypeMutation
} from '@/features/taxonomy-facility-type/slices/taxonomyFacilityTypeSlice'

import {
    useGetRoomTypesQuery,
    useCreateRoomTypeMutation,
    useUpdateRoomTypeMutation,
    useDeleteRoomTypeMutation
} from '@/features/taxonomy-room-type/slices/taxonomyRoomTypeSlice'

import {
    useGetEventCategoriesQuery,
    useCreateEventCategoryMutation,
    useUpdateEventCategoryMutation,
    useDeleteEventCategoryMutation
} from '@/features/taxonomy-event-category/slices/taxonomyEventCategorySlice'

import {
    useGetStaffTypesQuery,
    useCreateStaffTypeMutation,
    useUpdateStaffTypeMutation,
    useDeleteStaffTypeMutation
} from '@/features/taxonomy-staff-type copy/slices/taxonomyStaffTypeSlice'

import { SettingsItem } from '@/app/admin/settings/components/types'

type Taxonomy = {
    id: string
    name: string
    active?: boolean
}

function mapTaxonomyToSettingsItem(item: Taxonomy): SettingsItem {
    const active = item.active !== false

    return {
        id: item.id,
        name: item.name,
        description: '',
        status: active ? 'Activo' : 'Inactivo',
        active
    }
}

const EMPTY_ITEMS: SettingsItem[] = []

export function useSettingsApi() {

    const dataSource = useSelector((state: RootState) => state.dataSource.dataSource)
    const skip = dataSource !== 'api'

    const { data: departmentsData } = useGetDepartmentsQuery(undefined, { skip })
    const { data: facilityTypesData } = useGetFacilityTypesQuery(undefined, { skip })
    const { data: roomTypesData } = useGetRoomTypesQuery(undefined, { skip })
    const { data: eventCategoriesData } = useGetEventCategoriesQuery(undefined, { skip })
    const { data: staffTypesData } = useGetStaffTypesQuery(undefined, { skip })

    const [createDepartment] = useCreateDepartmentMutation()
    const [updateDepartment] = useUpdateDepartmentMutation()
    const [deleteDepartmentApi] = useDeleteDepartmentMutation()

    const [createFacilityType] = useCreateFacilityTypeMutation()
    const [updateFacilityType] = useUpdateFacilityTypeMutation()
    const [deleteFacilityType] = useDeleteFacilityTypeMutation()

    const [createRoomType] = useCreateRoomTypeMutation()
    const [updateRoomType] = useUpdateRoomTypeMutation()
    const [deleteRoomTypeApi] = useDeleteRoomTypeMutation()

    const [createEventCategory] = useCreateEventCategoryMutation()
    const [updateEventCategory] = useUpdateEventCategoryMutation()
    const [deleteEventCategoryApi] = useDeleteEventCategoryMutation()

    const [createStaffType] = useCreateStaffTypeMutation()
    const [updateStaffType] = useUpdateStaffTypeMutation()
    const [deleteStaffTypeApi] = useDeleteStaffTypeMutation()

    const departments = departmentsData?.data
        ? departmentsData.data.map(mapTaxonomyToSettingsItem)
        : EMPTY_ITEMS

    const amenities = facilityTypesData?.data
        ? facilityTypesData.data.map(mapTaxonomyToSettingsItem)
        : EMPTY_ITEMS

    const roomTypes = roomTypesData?.data
        ? roomTypesData.data.map(mapTaxonomyToSettingsItem)
        : EMPTY_ITEMS

    const eventTypes = eventCategoriesData?.data
        ? eventCategoriesData.data.map(mapTaxonomyToSettingsItem)
        : EMPTY_ITEMS

    const staffTypes = staffTypesData?.data
        ? staffTypesData.data.map(mapTaxonomyToSettingsItem)
        : EMPTY_ITEMS

    const filterItems = (
        items: SettingsItem[],
        searchTerm: string,
        searchStatus: string
    ) =>
        items.filter((item) => {
            const matchesSearch = item.name
                .toLowerCase()
                .includes(searchTerm.toLowerCase())

            const matchesStatus =
                searchStatus === 'all' ||
                (searchStatus === 'activo' ? item.active : !item.active)

            return matchesSearch && matchesStatus
        })

    const createDepartmentHandler = async (name: string) => {
        await createDepartment({ name }).unwrap()
    }

    const updateDepartmentHandler = async (id: string, payload: any) => {
        await updateDepartment({ id, payload }).unwrap()
    }

    const deleteDepartmentHandler = async (id: string) => {
        await deleteDepartmentApi(id).unwrap()
    }

    const createAmenityHandler = async (name: string) => {
        await createFacilityType({ name }).unwrap()
    }

    const updateAmenityHandler = async (id: string, payload: any) => {
        await updateFacilityType({ id, payload }).unwrap()
    }

    const deleteAmenityHandler = async (id: string) => {
        await deleteFacilityType(id).unwrap()
    }

    const createRoomTypeHandler = async (name: string) => {
        await createRoomType({ name }).unwrap()
    }

    const updateRoomTypeHandler = async (id: string, payload: any) => {
        await updateRoomType({ id, payload }).unwrap()
    }

    const deleteRoomTypeHandler = async (id: string) => {
        await deleteRoomTypeApi(id).unwrap()
    }

    const createEventTypeHandler = async (name: string) => {
        await createEventCategory({ name }).unwrap()
    }

    const updateEventTypeHandler = async (id: string, payload: any) => {
        await updateEventCategory({ id, payload }).unwrap()
    }

    const deleteEventTypeHandler = async (id: string) => {
        await deleteEventCategoryApi(id).unwrap()
    }

    const createStaffTypeHandler = async (name: string) => {
        await createStaffType({ name }).unwrap()
    }

    const updateStaffTypeHandler = async (id: string, payload: any) => {
        await updateStaffType({ id, payload }).unwrap()
    }

    const deleteStaffTypeHandler = async (id: string) => {
        await deleteStaffTypeApi(id).unwrap()
    }

    return {
        departments,
        amenities,
        roomTypes,
        eventTypes,
        staffTypes,

        filterItems,

        createDepartmentHandler,
        updateDepartmentHandler,
        deleteDepartmentHandler,

        createAmenityHandler,
        updateAmenityHandler,
        deleteAmenityHandler,

        createRoomTypeHandler,
        updateRoomTypeHandler,
        deleteRoomTypeHandler,

        createEventTypeHandler,
        updateEventTypeHandler,
        deleteEventTypeHandler,

        createStaffTypeHandler,
        updateStaffTypeHandler,
        deleteStaffTypeHandler
    }
}