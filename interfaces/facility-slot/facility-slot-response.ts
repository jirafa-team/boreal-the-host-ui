export interface FacilitySlotResponse {
    id: string
    facilityId: string
    startAt: string
    endAt: string
    currentOccupancy: number
    occupationPercentage: number
    status: string
    capacity: number
}