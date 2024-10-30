/***
 * An array of routes that are accessible to the public
 * these routes do not require authentication
 * @type {string[]}
 *
 * ***/

export const publicRoutes: string[] = [];

/****
 * An array of routes thatr are used for authentication
 *@type {string[]}
 *
 * ****/

export const authRoutes = ["/auth/login", "/auth/register", "/auth/error"];

/**
 * The prefix for API authentication routes
 * Routes that start with this prefix are used for API authentication purpose
 * @type {string[]}
 *  **/
export const apiAuthPrefix = ["/api/auth","/api/registration"];
/***
 * The default redirect path after user logged in
 * @type {string}
 * ***/
export const DEFAULT_LOGIN_REDIRECT = "/";

/***
 * The default redirect path after user credentails login
 * @type {string}
 * ***/
export const DEFAULT_CREDENTIALS_LOGIN_REDIRECT = "/userinfo";


export function isMagicLinkCheckerMethod( 
  pathname:string): boolean {
  const magicLinkPath = pathname.startsWith("/") ? pathname.slice(1) :   pathname;

  return (
    magicLinkPath.startsWith("magiclink") &&
    magicLinkPath.split("/").length === 2 &&
    magicLinkPath.split("/")[1].length >= 20
  );
}