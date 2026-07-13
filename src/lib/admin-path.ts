export function getAdminBasePath() {
  return "/admin";
}

export function getAdminLoginPath() {
  return "/admin/login";
}

export function isProtectedAdminPath(pathname: string) {
  return pathname === "/admin" || pathname.startsWith("/admin/");
}

export function isAdminLoginPath(pathname: string) {
  return pathname === "/admin/login";
}
