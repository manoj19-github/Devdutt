"use server";
import { ChannelType, MemberRole, UserRole } from "@prisma/client";
import { auth } from "../_config/auth.config";
import { dbConfig } from "../_config/db.config";
import { getCurrentLoggedInUserServerAction } from "./auth.serverAction";
import { CreateChannelFormSchema } from "@/formSchema/createChannel.formSchema";
import { NextResponse } from "next/server";

export const findChannelByIdServerAction = async ({
  userId,
  channelId,
  workspaceId,
}: {
  userId: string;
  channelId: string;
  workspaceId: string;
}) => {
  try {
    const session = await auth();
    const loggedInUserDetails = await getCurrentLoggedInUserServerAction();
    if (
      !loggedInUserDetails ||
      loggedInUserDetails.user === null ||
      !session ||
      session.user === null
    )
      return {
        message: "user not logged in",
        success: false,
        channel: null,
        member: null,
      };

    const channel = await dbConfig.channel.findUnique({
      where: {
        id: channelId,
      },
    });
    const member = await dbConfig.member.findFirst({
      where: {
        userId: userId,
        workspaceId,
      },
    });
    if (!channel || !member) {
      return {
        message: "channel or member not found",
        success: false,
        channel: null,
        member: null,
      };
    }
    return {
      message: "channel and member found",
      success: true,
      channel,
      member,
    };
  } catch (error) {
    return {
      message: "something went wrong",
      success: false,
      channel: null,
      member: null,
    };
  }
};
