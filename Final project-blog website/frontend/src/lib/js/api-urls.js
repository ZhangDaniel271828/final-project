import { PUBLIC_API_BASE_URL } from "$env/static/public";

export const BASE_URL = PUBLIC_API_BASE_URL;

//Users-related URL
  // Used for check and getting info about the currently authenticated user
export const USER_URL = `${BASE_URL}/users/me`;
  // Used for logging in
export const AUTH_LOGIN = `${BASE_URL}/auth/login`;
  // Used for logging out
export const AUTH_UOT = `${BASE_URL}/auth/logout`;
  // Updating info about the currently authenticated user
export const USER_UPDATE = `${BASE_URL}/users/update`;
  // Delete current account
export const USER_DELETE = `${BASE_URL}/auth/delete`;
  // Updating info about the currently authenticated user
export const USER_REGISTER = `${BASE_URL}/auth/register`;
  // Check if username exists
export const CHECK_USERNAME = `${BASE_URL}/auth/check-username`;

//Comments-related URL
export const COMMENTS_URL = `${BASE_URL}/comments`;

//Article-related URL
export const ARTICLES_URL = `${BASE_URL}/articles`;
export const ARTICLE_UPDATE = `${BASE_URL}/articles/update`;

//likes-related URL
export const LIKES_URL = `${BASE_URL}/likes`;

//Avatar-related URL
export const AVATARUPLOAD_URL = `${BASE_URL}/avatar/upload`;