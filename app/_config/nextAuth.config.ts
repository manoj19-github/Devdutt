import Github from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";
// import { LoginSchema } from "./app/schema";
import type { NextAuthConfig } from "next-auth";
// import { getUserByEmail } from "./app/serverDetails/getUserDetails";
import Google from "next-auth/providers/google";

export default {
  providers: [
    Github({
      clientId: process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID as string,
      clientSecret: process.env.NEXT_PUBLIC_GITHUB_CLIENT_SECRET as string,
    }),
    Google({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET as string,
    }),
    Credentials({
      // async authorize(credentials) {
      //   console.log("credentials: ", credentials);
      //   // const validatedFields = LoginSchema.safeParse(credentials);
      //   // if (validatedFields.success) {
      //   //     const { email, password } = validatedFields.data;
      //   //     const user = await getUserByEmail(email);
      //   //     console.log("user   config: ", user);
      //   //     if (!user) return null;
      //   //     return user;
      //   // }
      //   return credentials;
      // },
    }),
  ],
} satisfies NextAuthConfig;
