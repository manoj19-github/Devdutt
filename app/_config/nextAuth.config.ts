import Github from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";
// import { LoginSchema } from "./app/schema";
import type { NextAuthConfig } from "next-auth";
// import { getUserByEmail } from "./app/serverDetails/getUserDetails";
import Google from "next-auth/providers/google";
import { LoginSchema } from "@/validationSchema/auth.schema";

import { emailloginService } from "../_services/auth.service";

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
      type: "credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
        },
      },
      async authorize(credentials) {
        console.log("credentials: ", credentials);
        const validatedFields = LoginSchema.safeParse(credentials);
        if (validatedFields.success) {
          const { email } = validatedFields.data;
          const response = await emailloginService(email);
          console.log("user   config: ", response);
          if (!response) return null;
          return response.user;
        }
        return null;
      },
    }),
  ],
} satisfies NextAuthConfig;
