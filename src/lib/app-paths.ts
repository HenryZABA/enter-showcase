export const SUBPATH_ROUTE = "/prompts";
export const ASSET_NAMESPACE = "/_prompts";

export function isWithinPath(pathname: string, prefix: string): boolean {
  return pathname === prefix || pathname.startsWith(`${prefix}/`);
}

export function getEntryPrefix(pathname: string): "" | typeof SUBPATH_ROUTE {
  return isWithinPath(pathname, SUBPATH_ROUTE) ? SUBPATH_ROUTE : "";
}

export function withEntryPrefix(path: string, pathname: string): string {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const prefix = getEntryPrefix(pathname);
  if (!prefix || isWithinPath(normalizedPath, prefix)) return normalizedPath;
  return normalizedPath === "/" ? prefix : `${prefix}${normalizedPath}`;
}

export function assetPath(path: string): string {
  return `${ASSET_NAMESPACE}/${path.replace(/^\/+/, "")}`;
}
