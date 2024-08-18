import { NextResponse } from "next/server";
import { dbConfig } from "../../../_config/db.config";

export async function POST(request: Request) {
  try {
    const { user } = await request.json();
    await dbConfig.user.update({
      where: {
        email: user.email,
      },
      data: { emailVerified: new Date() },
    });
    return NextResponse.json(
      { success: true, message: "Email verified successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.log("error ", error);
    return NextResponse.json(
      { message: error.message, success: false },
      { status: 500 }
    );
  }
}
