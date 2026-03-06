const MYHOST_SEGMENT = 'myHost';

export function getOrganizationIdFromUrl(): string | undefined {
  if (typeof window === 'undefined') return undefined;
  const pathParts = window.location.pathname.split('/').filter(Boolean);
  if (pathParts[0] !== MYHOST_SEGMENT || !pathParts[1]) return undefined;
  return pathParts[1];
}
