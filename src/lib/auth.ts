import { cookies } from "next/headers";
import { createSessionToken, verifySessionToken } from "@/lib/session";

const SESSION_COOKIE = "admin_session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7;

export function getAdminCredentials() {
  return {
    username: process.env.ADMIN_USERNAME ?? "peinan",
    password: process.env.ADMIN_PASSWORD ?? "63777607",
  };
}

export function verifyCredentials(username: string, password: string) {
  const creds = getAdminCredentials();
  return username === creds.username && password === creds.password;
}

export async function setSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, await createSessionToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export async function isAuthenticated() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  return Boolean(token && (await verifySessionToken(token)));
}

export { SESSION_COOKIE, SESSION_MAX_AGE };
