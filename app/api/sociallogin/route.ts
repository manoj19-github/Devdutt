import { NextResponse } from "next/server";
import { dbConfig } from "../../_config/db.config";
import { log } from "console";
export async function GET(request: Request) {
  return NextResponse.json({
    message: "Login Successfull",
    status: true,
  });
}

export async function POST(request: Request) {
  try {
    const { user, account, profile } = await request.json();
    console.log("API:", { user, account, profile });
    if (!user || !account || !profile)
      new NextResponse("Invalid type", { status: 400 });

    // Check if user already exists or not
    const isUserExists = await dbConfig.user.findFirst({
      where: {
        email: user.email,
      },
    });

    if (isUserExists && account) {
      const isAccountExists = await dbConfig.account.findFirst({
        where: {
          provider: account.provider,
          providerAccountId: account.providerAccountId,
          userId: isUserExists.id,
        },
      });
      if (!!isAccountExists) {
        console.log("is account exists   >>>>>>>>> ", {
          message: "Login Successfull",
          account: isAccountExists,
          user: isUserExists,
          status: true,
        });

        return NextResponse.json({
          message: "Login Successfull",
          account: isAccountExists,
          user: isUserExists,
          status: true,
        });
      } else {
        const newAccount = await dbConfig.account.create({
          data: {
            provider: account.provider,
            providerAccountId: account.providerAccountId,
            userId: isUserExists.id,
            access_token: account.access_token,
            expires_at: account.expires_at,
            refresh_token: account?.refresh_token || "",
            scope: account.scope,
            token_type: account.token_type,
            id_token: account.id_token,
            type: account.type,
          },
        });
        return NextResponse.json({
          message: "Login Successfull",
          status: true,
          account: newAccount,
          user: isUserExists,
        });
      }
    } else if (account) {
      const newUser = await dbConfig.user.create({
        data: {
          email: user.email,
          name: user.name,
          image: user.image,
          emailVerified: new Date(),
        },
      });
      const newAccount = await dbConfig.account.create({
        data: {
          provider: account.provider,
          providerAccountId: account.providerAccountId,
          userId: newUser.id,
          access_token: account.access_token,
          expires_at: account.expires_at,
          refresh_token: account?.refresh_token || "",
          scope: account.scope,
          token_type: account.token_type,
          id_token: account.id_token,
          type: account.type,
        },
      });
      return NextResponse.json({
        message: "Login Successfull",
        status: true,
        account: newAccount,
        user: newUser,
      });
    }
    return NextResponse.json({
      message: "Login Successfull",
      status: true,
      account: account,
      user: user,
    });
  } catch (error) {
    console.log("error: ", error);
    return new NextResponse("Internal Error ", { status: 500 });
  }
}
