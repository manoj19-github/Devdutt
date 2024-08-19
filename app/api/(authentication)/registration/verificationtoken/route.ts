import { NextResponse } from "next/server";
import { dbConfig } from "../../../../_config/db.config";
export async function POST(request: Request) {
  try {
    const { verificationToken } = await request.json();
    if (verificationToken.length < 20)
      return NextResponse.json(
        { message: "verification token is invalid", success: false },
        { status: 400 }
      );
    const isVerificationTokenValid = await dbConfig.verificationToken.findFirst(
      {
        where: {
          token: verificationToken,
          expires: {
            gt: new Date(),
          },
        },
      }
    );
    if (!isVerificationTokenValid)
      return NextResponse.json(
        { message: "verification token is invalid", success: false },
        { status: 400 }
      );
    return NextResponse.json(
      {
        message: "verification token is valid",
        verificationDetails: isVerificationTokenValid,
        success: false,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("error gg", error);

    return NextResponse.json(
      { message: "something went wrong", success: false },
      { status: 500 }
    );
  }
}
