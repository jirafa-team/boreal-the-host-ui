export interface User {
  id: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  email: string;
  role?: string;
  roleName?: string;
  status: string;
  lastLogin?: string;
  phone?: string;
  avatar?: string;
  permissions?: Record<string, boolean>;
}
