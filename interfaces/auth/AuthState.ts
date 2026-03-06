import type { AuthUser } from '@/interfaces/auth/AuthUser';
import type { CurrentOrganization } from '@/interfaces/auth/CurrentOrganization';

export interface AuthState {
  user: AuthUser | null;
  isLoggedIn: boolean;
  role: string | null;
  currentOrganization: CurrentOrganization | undefined;
}
