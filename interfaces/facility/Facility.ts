export interface Facility {
  id: string;
  name: string;
  type?: string;
  facilityTypeId?: string;
  capacity: number;
  openTime?: string;
  closeTime?: string;
  startTime?: string;
  endTime?: string;
  [key: string]: unknown;
}
