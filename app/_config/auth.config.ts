import NextAuth, { type DefaultSession } from "next-auth";
import Github from "next-auth/providers/github";
import authConfig from "./nextAuth.config";

import { dbConfig } from "./db.config";
import { socialSignEntryAction } from "../serverActions/auth";
import { UserRole } from "@prisma/client";
// import {
//   getUserByEmail,
//   getUserById,
// } from "./app/serverDetails/getUserDetails";
// import { UserRole } from "@prisma/client";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  events: {
    async linkAccount({ user }) {
      //   await dbConfig.user.update({
      //     where: {
      //       id: user.id,
      //     },
      //     data: { emailVerified: new Date() },
      //   });
    },
  },
  callbacks: {
    /***
     * if user is not email verified then they can't  login
     *  ****/
    // async signIn({ user }) {
    //   if (!user || !user.id) return false;
    //   const existingUser = await getUserById(user.id);
    //   if (!existingUser || !existingUser.emailVerified) return false;
    //   return true;
    // },
    async signIn({ user, account, profile }) {
      console.log("SIGN IN DATA : ", { user, account, profile });
      try {
        // const res = await socialSignEntryAction({ user, account, profile });
        // console.log("res: ", res);
        // if (!res) return false;
        console.log(
          "hit api ",
          `${process.env.NEXT_PUBLIC_CURRENT_ORIGIN}/api/sociallogin`
        );
        console.log(
          "JSON.stringify({ user, account, profile }), ",
          JSON.stringify({ user, account, profile })
        );

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_CURRENT_ORIGIN}/api/sociallogin`,
          {
            method: "POST",
            body: JSON.stringify({ user, account, profile }),
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        // const data = await response.json();
        // console.log("data: ", data);
        // if (data) return true;
        return true;
      } catch (error) {
        console.log("error in sign in : ", error);

        return false;
      }
    },
    async session({ token, session }) {
      // console.log("session dataset token : ", token);
      // console.log("session dataset session : ", session);
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      if (token.role && session.user) {
        session.user.role = token.role as UserRole;
      }
      return session;
    },
    async jwt({ token, user }) {
      // console.log("token in jwt : ", token);
      if (!token || !token.email) return token;

      // const existingUser = await getUserByEmail(token.email);
      // if (!existingUser) return token;
      // token.role = existingUser.role;

      return token;
    },
  },
  // adapter: PrismaAdapter(dbConfig) as any,
  session: { strategy: "jwt" },
  ...authConfig,
});
