import type { User as ApiUser } from "@/interfaces/user/User"

export type UserPermissions = {
  canManageRooms: boolean
  canManageClients: boolean
  canManageEvents: boolean
  canManageFacilities: boolean
  canViewReports: boolean
  canManageUsers: boolean
}

export interface User {
  id: string
  name: string
  email: string
  role: "Hotel Administrator" | "Staff" | "Viewer"
  roleName?: string
  roleId?: string
  status: "active" | "inactive" | "pending"
  lastLogin: string
  phone?: string
  avatar?: string
  permissions: UserPermissions
}

export type NewUserForm = Partial<
  Pick<User, "name" | "email" | "role" | "status" | "phone" | "permissions">
> & {
  name?: string
  firstName?: string
  lastName?: string
  email?: string
  role?: User["role"]
  roleId?: string
  status?: User["status"]
  phone?: string
  permissions?: UserPermissions
}

const defaultPermissions: UserPermissions = {
  canManageRooms: false,
  canManageClients: false,
  canManageEvents: false,
  canManageFacilities: false,
  canViewReports: false,
  canManageUsers: false,
}

export function mapApiUserToUi(u: ApiUser): User {
  return {
    id: u.id,
    name: u.name ?? ([u.firstName, u.lastName].filter(Boolean).join(" ") || u.email),
    email: u.email,
    role: (u.role ?? u.roleName ?? "staff") as User["role"],
    roleName: u.roleName ?? u.role ?? "",
    status: (u.status ?? "active") as User["status"],
    lastLogin: u.lastLogin ?? "",
    phone: u.phone,
    permissions: (u.permissions as UserPermissions) ?? defaultPermissions,
  }
}
