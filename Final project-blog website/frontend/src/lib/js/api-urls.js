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


//Comments-related URL
export const COMMENTS_URL = `${BASE_URL}/comments`;