export interface StaffScheduleEntry {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isActive: boolean;
}

export interface StaffWeeklySchedule {
  employeeId: string;
  schedule: StaffScheduleEntry[];
}
