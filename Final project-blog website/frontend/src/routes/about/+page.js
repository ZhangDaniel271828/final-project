import { goto } from "$app/navigation";
import { browser } from "$app/environment";

// get user data from parent load function
export async function load({ parent }) {
  if (!browser) return;
  const { isLoggedIn } = await parent();
  if (!isLoggedIn) goto("/login", { replaceState: true });
}
