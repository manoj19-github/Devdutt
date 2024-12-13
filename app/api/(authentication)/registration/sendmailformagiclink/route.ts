import { NextResponse } from "next/server";
import { SendMailOptions } from "nodemailer";
import { dbConfig } from "../../../../_config/db.config";
import { LoginSchema } from "../../../../../validationSchema/auth.schema";
import crypto from "crypto";
import { UTILS } from "../../../../_services/utils.service";
export async function POST(request: Request) {
  try {
    const incomingPayload = await request.json();
    const validatedResponse = LoginSchema.safeParse(incomingPayload);
    if (!validatedResponse.success) {
      const { errors } = validatedResponse.error;
      return NextResponse.json(
        { message: errors[0].message, success: false },
        { status: 400 }
      );
    }
    const { email } = validatedResponse.data;
    const expiresIn = new Date(new Date().setHours(new Date().getHours() + 1));
    const magicToken = crypto.randomBytes(20).toString("hex");
    const magicLink = `${process.env.NEXT_PUBLIC_CURRENT_ORIGIN}/magiclink/${magicToken}`;
    const mailOptions: SendMailOptions = {
      from: process.env.EMAIL_USERNAME!,
      to: email,
      subject: `Welcome To Devdutt`,
      html: `
    
                  <h1 style="text-align:center">Devdutt</h1>
                  <p style="text-align:center"> <small>A Family of Techies</small></p>
                  <p></p>
                  <p></p>
                  <p></p>
                  <p style="text-align:justify">Welcome to Devdutt</p>
                  <p style="text-align:justify">To Login in Devdutt click below the link (This link will expire in 1 hour)</p>
                  <p style="text-align:justify"><a href="${magicLink}">${magicLink}</a> </p>
          `,
    };

    const isEmailSent = await UTILS.sendMailMethod(mailOptions);
    if (!isEmailSent)
      return NextResponse.json(
        {
          message: "Something went wrong, verification mail was not sent",
          success: false,
        },
        { status: 500 }
      );
    const isEmailExists = await dbConfig.verificationToken.findFirst({
      where: {
        email,
      },
    });
    if (isEmailExists)
      await dbConfig.verificationToken.update({
        where: {
          id: isEmailExists.id,
        },
        data: {
          token: magicToken,
          expires: expiresIn,
        },
      });
    else
      await dbConfig.verificationToken.create({
        data: {
          token: magicToken,
          expires: expiresIn,
          email,
        },
      });

    return NextResponse.json(
      { message: "Please check your mail for magic link", success: true },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Something went wrong", success: false },
      { status: 500 }
    );
  }
}
