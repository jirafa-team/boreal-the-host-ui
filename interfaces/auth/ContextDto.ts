export interface ContextDto {
  organizationName: string;
  organizationAlias: string;
  organizationId: string;
  organizationCurrency: string;
  organizationLogoUrl?: string | null;
  description?: string | undefined;
  roleName: string;
  roleId: string;
  members: number;
  lastAccess: string;
  modules: unknown[];
}
