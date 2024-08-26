"use server";

import { DEFAULT_CREDENTIALS_LOGIN_REDIRECT } from "@/routes";
import { signIn } from "../_config/auth.config";
import { dbConfig } from "../_config/db.config";
import {
  LoginSchema,
  UpdateProfileSchema,
} from "@/validationSchema/auth.schema";
import { AuthError } from "next-auth";
import { revalidatePath } from "next/cache";
import * as zod from "zod";
export async function emailLoginServerAction({
  userEmail,
}: {
  userEmail: string;
}) {
  try {
    const validatedResponse = LoginSchema.safeParse({ email: userEmail });
    if (!validatedResponse.success) {
      const { errors } = validatedResponse.error;
      return { message: errors[0].message, success: false, user: null };
    }
    const { email } = validatedResponse.data;
    const isUserExists = await dbConfig.user.findUnique({
      where: {
        email,
      },
    });
    if (!!isUserExists)
      return {
        message: "User found successfully",
        user: isUserExists,
        success: true,
      };
    const newUser = await dbConfig.user.create({
      data: {
        email: email,
      },
    });
    return {
      message: "User created successfully",
      user: newUser,
      success: true,
    };
  } catch (error) {
    console.log("error: login ", error);
    return { message: "Something went wrong", user: null, success: false };
  }
}

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

export const updateOwnUserDetailsServerAction = async (
  data: zod.infer<typeof UpdateProfileSchema>
) => {
  // console.log("data: ", data);
  try {
    const { email, name, image } = data;
    const user = await dbConfig.user.update({
      where: {
        email,
      },
      data: {
        name,
        image,
      },
    });
    revalidatePath("/");
  } catch (error) {
    console.log("error: ", error);
  }
};