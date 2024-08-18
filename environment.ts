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

export const authRoutes = ["/login", "/register", "/error"];

/**
 * The prefix for API authentication routes
 * Routes that start with this prefix are used for API authentication purpose
 * @type {string}
 *  **/
export const apiAuthPrefix = "/api/auth";
/***
 * Ther default redirect path after user logged in
 * @type {string}
 * ***/
export const DEFAULT_LOGIN_REDIRECT = "/";
