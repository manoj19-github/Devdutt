// import { auth } from "./auth";
import NextAuth from "next-auth";
import authConfig from "./app/_config/nextAuth.config";
import {
  DEFAULT_LOGIN_REDIRECT,
  apiAuthPrefix,
  authRoutes,
  isMagicLinkCheckerMethod,
  publicRoutes,
} from "@/routes";
const { auth } = NextAuth(authConfig);
export default auth((req: any) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const isApiAuthRoute = apiAuthPrefix.some((self) =>
    nextUrl.pathname.startsWith(self)
  );
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);

  const isMagicLinkRoute = isMagicLinkCheckerMethod(nextUrl.pathname);

  if (isApiAuthRoute) return;
  if (isAuthRoute) {
    if (isLoggedIn)
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    return;
  }
  if (!isLoggedIn && !isPublicRoute && !isMagicLinkRoute)
    return Response.redirect(new URL("/auth/login", nextUrl));
  // req.auth
});

// Optionally, don't invoke Middleware on some paths
export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
