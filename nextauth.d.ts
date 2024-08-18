import { UserRole } from "@prisma/client";
import NextAuth, { type DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";
export type ExtendedUser = DefaultSession["user"] & {
  role: UserRole;
  id: string;
};

declare module "next-auth" {
  interface Session {
    user: ExtendedUser;
  }
  interface User {
    role?: UserRole;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: UserRole;
  }
}
