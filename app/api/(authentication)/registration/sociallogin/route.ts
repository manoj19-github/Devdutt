import { NextResponse } from "next/server";
import { dbConfig } from "../../../../_config/db.config";

export async function GET(request: Request) {
  return NextResponse.json(
    {
      message: "Login Successfull",
      success: true,
    },
    {
      status: 200,
    }
  );
}

export async function POST(request: Request) {
  try {
    const { user, account, profile } = await request.json();
    console.log("API:", { user, account, profile });
    if (!user || !account || !profile)
      return NextResponse.json(
        { message: "invalid user input ", success: false },
        { status: 400 }
      );

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
        return NextResponse.json(
          {
            message: "Login Successfull",
            account: isAccountExists,
            user: isUserExists,
            success: true,
          },
          { status: 200 }
        );
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
        return NextResponse.json(
          {
            message: "Login Successfull",
            success: true,
            account: newAccount,
            user: isUserExists,
          },
          { status: 200 }
        );
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
      return NextResponse.json(
        {
          message: "Login Successfull",
          success: true,
          account: newAccount,
          user: newUser,
        },
        { status: 200 }
      );
    }
    return NextResponse.json(
      {
        message: "Login Successfull",
        success: true,
        account: account,
        user: user,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("error: ", error);
    return NextResponse.json(
      { message: "Internal Error ", success: false },
      { status: 500 }
    );
  }
}
