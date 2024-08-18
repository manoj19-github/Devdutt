/***
 * An array of routes that are accessible to the public
 * these routes do not require authentication
 * @type {string[]}
 *
 * ***/

export const publicRoutes: string[] = ["/"];

/****
 * An array of routes thatr are used for authentication
 *@type {string[]}
 *
 * ****/

export const authRoutes = ["/auth/login", "/auth/register", "/auth/error"];

/**
 * The prefix for API authentication routes
 * Routes that start with this prefix are used for API authentication purpose
 * @type {string}
 *  **/
export const apiAuthPrefix = "/api";
/***
 * Ther default redirect path after user logged in
 * @type {string}
 * ***/
export const DEFAULT_LOGIN_REDIRECT = "/";
