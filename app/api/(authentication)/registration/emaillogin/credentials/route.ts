import { NextResponse } from "next/server";
import { dbConfig } from "../../../../../_config/db.config";
import { LoginSchema } from "@/validationSchema/auth.schema";
import { signIn } from "@/app/_config/auth.config";
import { redirect } from "next/navigation";

export async function POST(request: Request) {
  try {
    const incomingPayload = await request.json();
    console.log("incomingPayload: ", incomingPayload);
    const validatedResponse = LoginSchema.safeParse(incomingPayload);
    if (!validatedResponse.success) {
      const { errors } = validatedResponse.error;
      console.log("errors: credentails ", errors);
      return redirect("/");
    }
    const { email } = validatedResponse.data;
    console.log("credentails route opened called ", email);

    await signIn("credentials", {
      email,
    });
  } catch (error) {
    console.log("error: ", error);
    return redirect("/");
  }
}
