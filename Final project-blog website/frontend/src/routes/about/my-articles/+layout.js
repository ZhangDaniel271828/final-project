import { USER_URL } from "$lib/js/api-urls.js";

//Loads shared login data by checking /api/users/me and storing the user if authenticated. */

export async function load({ fetch }) {
  const response = await fetch(USER_URL, { credentials: "include" });
  if (response.status === 401) return { isLoggedIn: false };
  const user = await response.json();
  const isLoggedIn = !!user;
  return { user, isLoggedIn };
}
