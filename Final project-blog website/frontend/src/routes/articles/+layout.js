import { USER_URL } from "$lib/js/api-urls.js";

// This load function will load data shared across all pages - the login data.
export async function load({ fetch }) {
  const response = await fetch(USER_URL, { credentials: "include" });
  if (response.status === 401) return { isLoggedIn: false };

  const user = await response.json();
  const isLoggedIn = !!user;
  return { user, isLoggedIn };
}
