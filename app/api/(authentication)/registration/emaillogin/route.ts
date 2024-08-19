import { NextResponse } from "next/server";
import { dbConfig } from "../../../../_config/db.config";
import { LoginSchema } from "@/validationSchema/auth.schema";

export async function POST(request: Request) {
  try {
    const incomingPayload = await request.json();
    const validatedResponse = LoginSchema.safeParse(incomingPayload);
    if (!validatedResponse.success) {
      const { errors } = validatedResponse.error;
      return NextResponse.json(
        { message: errors[0].message, success: false, user: null },
        { status: 400 }
      );
    }
    const { email } = validatedResponse.data;
    const isUserExists = await dbConfig.user.findUnique({
      where: {
        email,
      },
    });
    if (!!isUserExists)
      return NextResponse.json(
        {
          message: "User found successfully",
          user: isUserExists,
          success: true,
        },
        { status: 200 }
      );
    const newUser = await dbConfig.user.create({
      data: {
        email: email,
      },
    });
    return NextResponse.json(
      { message: "User created successfully", user: newUser, success: true },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Something went wrong", user: null, success: false },
      { status: 500 }
    );
  }
}
