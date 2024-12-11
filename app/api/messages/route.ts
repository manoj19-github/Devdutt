import { auth } from "@/app/_config/auth.config";
import { dbConfig } from "@/app/_config/db.config";
import { getCurrentLoggedInUserServerAction } from "@/app/serverActions/auth.serverAction";
import { Message } from "@prisma/client";
import { NextResponse } from "next/server";

const MESSAGES_PER_PAGE = 10;

export async function GET(request: Request) {
  try {
    const session = await auth();
    const loggedInUserDetails = await getCurrentLoggedInUserServerAction();
    if (
      !loggedInUserDetails ||
      loggedInUserDetails.user === null ||
      loggedInUserDetails.member === null ||
      !session ||
      session.user === null
    )
      return new NextResponse("You are not logged in ", { status: 400 });
    const { searchParams } = new URL(request.url);
    const cursor = searchParams.get("cursor");

    const channelId = searchParams.get("channelId");

    if (!channelId)
      return new NextResponse("Channel Id is required", { status: 400 });
    let messages: Message[] = [];
    if (cursor !== "0" && cursor !== null) {
      messages = await dbConfig.message.findMany({
        take: MESSAGES_PER_PAGE,
        skip: 1,
        cursor: {
          id: cursor,
        },
        where: {
          channelId,
        },
        include: {
          member: {
            include: {
              user: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    } else {
      messages = await dbConfig.message.findMany({
        take: MESSAGES_PER_PAGE,
        where: {
          channelId,
        },
        include: {
          member: {
            include: {
              user: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    }
    let nextCursor = null;
    if (messages.length === MESSAGES_PER_PAGE) {
      nextCursor = messages[messages.length - 1].id;
    }

    return NextResponse.json(
      {
        items: messages,
        nextCursor,
      },
      { status: 200 }
    );
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}
