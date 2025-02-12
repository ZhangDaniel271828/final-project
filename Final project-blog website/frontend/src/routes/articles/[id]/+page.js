import { browser } from "$app/environment";
import { page } from "$app/stores";
import { ARTICLES_URL } from "$lib/js/api-urls.js";

export async function load({ parent, params }) {
  if (!browser) return;
  const { user, isLoggedIn } = await parent();
  const articleId = params.id;
  //get article by id
  try {
    const res = await fetch(`${ARTICLES_URL}/${articleId}`);
    if (!res.ok) {
      throw new Error(`Failed to fetch article: ${res.statusText}`);
    }
    const article = await res.json();
    //return article, isLoggedIn and user
    return {
      article,
      isLoggedIn,
      user
    };
  } catch (error) {
    console.error("Error fetching article:", error);
    return {
      article: null,
      error: error.message
    };
  }
}
