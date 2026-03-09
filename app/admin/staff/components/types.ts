/**
 * Staff member shape for the V0-identical view (grid cards + detail + assign task).
 */

export type StaffStatus = "available" | "busy" | "off";

export type StaffDepartment =
  | "Limpieza"
  | "Mantenimiento"
  | "Seguridad"
  | "Recepción"
  | "Servicio";

export type StaffMemberView = {
  id: string;
  name: string;
  status: StaffStatus;
  department: StaffDepartment | string;
  shift: string;
  avatar: string;
  tasksToday: number;
  maxCapacity: number;
};

export type NewStaffForm = {
  name: string;
  email: string;
  department: StaffDepartment | string;
  shift: string;
};

export type NewTaskForm = {
  description: string;
  priority: "normal" | "urgent";
  deliveryTime: string;
};
