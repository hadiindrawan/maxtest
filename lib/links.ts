export const SIGNUP_PATH = "/auth?action=signup";
export const LOGIN_PATH = "/auth?action=login";

/** Joins an app base URL and a path; returns `fallback` when the base is unset or blank. */
export function appLink(base: string | undefined, path: string, fallback: string): string {
  const trimmed = (base ?? "").trim().replace(/\/+$/, "");
  if (!trimmed) return fallback;
  return `${trimmed}${path.startsWith("/") ? path : `/${path}`}`;
}

export function signupUrl(base: string | undefined = process.env.NEXT_PUBLIC_APP_URL): string {
  return appLink(base, SIGNUP_PATH, "/pricing");
}

export function loginUrl(base: string | undefined = process.env.NEXT_PUBLIC_APP_URL): string {
  return appLink(base, LOGIN_PATH, "/");
}
