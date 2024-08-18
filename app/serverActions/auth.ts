"use server";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { signIn } from "../_config/auth.config";
import { Account, AuthError, Profile, User } from "next-auth";
import { revalidatePath } from "next/cache";
import { dbConfig } from "../_config/db.config";

export const SocialSignAction = async (provider: string) => {
  try {
    console.log("hit social login ");

    await signIn(provider);
  } catch (error) {
    console.log("error in social login", error);

    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { message: "Invalid credentials", status: false };
        default:
          return { message: "Something went wrong", status: false };
      }
    }
    throw error;
  }
};

// export const socialSignEntryAction = ({
//   user,
//   account,
//   profile,
// }: {
//   user: any;
//   account: Account | null;
//   profile: Profile | undefined;
// }): Promise<any> => {
//   return new Promise(async (resolve, reject) => {
//     try {
//       if (!user || !account || !profile) reject({ message: "Invalid inputs!" });

//       // Check if user already exists or not
//       const isUserExists = await dbConfig.user.findFirst({
//         where: {
//           email: user.email,
//         },
//       });

//       if (isUserExists && account) {
//         const isAccountExists = await dbConfig.account.findFirst({
//           where: {
//             provider: account.provider,
//             providerAccountId: account.providerAccountId,
//             userId: isUserExists.id,
//           },
//         });
//         if (!isAccountExists) {
//           return resolve({
//             message: "Login Successfull",
//             account: isAccountExists,
//             user: isUserExists,
//             status: true,
//           });
//         } else {
//           const newAccount = await dbConfig.account.create({
//             data: {
//               provider: account.provider,
//               providerAccountId: account.providerAccountId,
//               userId: isUserExists.id,
//               access_token: account.access_token,
//               expires_at: account.expires_at,
//               refresh_token: account?.refresh_token || "",
//               scope: account.scope,
//               token_type: account.token_type,
//               id_token: account.id_token,
//               type: account.type,
//             },
//           });
//           return resolve({
//             message: "Login Successfull",
//             status: true,
//             account: newAccount,
//             user: isUserExists,
//           });
//         }
//       } else if (account) {
//         const newUser = await dbConfig.user.create({
//           data: {
//             email: user.email,
//             name: user.name,
//             image: user.image,
//             emailVerified: new Date(),
//           },
//         });
//         const newAccount = await dbConfig.account.create({
//           data: {
//             provider: account.provider,
//             providerAccountId: account.providerAccountId,
//             userId: newUser.id,
//             access_token: account.access_token,
//             expires_at: account.expires_at,
//             refresh_token: account?.refresh_token || "",
//             scope: account.scope,
//             token_type: account.token_type,
//             id_token: account.id_token,
//             type: account.type,
//           },
//         });
//         return resolve({
//           message: "Login Successfull",
//           status: true,
//           account: newAccount,
//           user: newUser,
//         });
//       }
//       return resolve({
//         message: "Login Successfull",
//         status: true,
//         account: account,
//         user: user,
//       });
//     } catch (error) {
//       reject(error);
//     }
//   });
// };
