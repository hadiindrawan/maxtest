// Registration is closed while the dashboard is sunset: every sign in / sign up CTA lands on the notice page.
export const LOGIN_PAGE = "/login";

export function signupUrl(): string {
  return LOGIN_PAGE;
}

export function loginUrl(): string {
  return LOGIN_PAGE;
}
