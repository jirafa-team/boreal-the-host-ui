export interface CurrentOrganization {
  id: string;
  name: string;
  alias: string;
  localCurrency?: string | null;
  logoUrl?: string | null;
  modules?: unknown[];
}
