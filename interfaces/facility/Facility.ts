export interface Facility {
  id: string;
  name: string;
  type?: string;
  facilityType?: {
    id: string;
    name: string;
    description?: string;
    active: boolean;
  };
  capacity: number;
  openTime?: string;
  closeTime?: string;
  startTime?: string;
  endTime?: string;
  [key: string]: unknown;
}
