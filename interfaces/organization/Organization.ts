export interface Organization {
  id: string;
  name: string;
  alias?: string;
  [key: string]: unknown;
}
