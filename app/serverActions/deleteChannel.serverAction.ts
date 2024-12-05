"use server";
import { ChannelType, MemberRole, UserRole } from "@prisma/client";
import { auth } from "../_config/auth.config";
import { dbConfig } from "../_config/db.config";
import { getCurrentLoggedInUserServerAction } from "./auth.serverAction";
import { CreateChannelFormSchema } from "@/formSchema/createChannel.formSchema";
import { NextResponse } from "next/server";

export const deleteChannelAction = async ({
  channelId,
  workspaceId,
}: {
  channelId: string;
  workspaceId: string;
}) => {
  try {
    if (!channelId || !workspaceId)
      return NextResponse.json({
        message: "Invalid request",
        success: false,
        workspace: null,
      });
    const session = await auth();
    const loggedInUserDetails = await getCurrentLoggedInUserServerAction();
    if (loggedInUserDetails.user === null || !session || !session.user === null)
      return {
        message: "you are not logged in ",
        success: false,
        workspace: null,
      };
    const selectedWorkspace = await dbConfig.workspaces.findUnique({
      where: {
        id: workspaceId,
      },
      include: {
        members: true,
        channels: true,
      },
    });

    if (!selectedWorkspace)
      return {
        message: "Workspace not found",
        success: false,
        workspace: null,
      };
    if (selectedWorkspace.members.length === 0)
      return {
        message: "Workspace is empty",
        success: false,
        workspace: null,
      };
    const isAdminOrModeratorUser = selectedWorkspace.members.some(
      (member) =>
        (member.role === MemberRole.ADMIN ||
          member.role === MemberRole.MODERATOR) &&
        member.userId === loggedInUserDetails?.user?.id
    );

    if (!isAdminOrModeratorUser) {
      return {
        message: "you are not authorized to create a channel",
        success: false,
        workspace: null,
      };
    }
    const selectedChannel = selectedWorkspace.channels.find(
      (channel) => channel.id === channelId
    );
    if (!selectedChannel || selectedChannel.name === "general")
      return {
        message: "ChanelId is invalid",
        success: false,
        workspace: null,
      };
    const updatedWorkspace = await dbConfig.workspaces.update({
      where: {
        id: selectedWorkspace.id,
      },
      data: {
        channels: {
          delete: {
            id: channelId,
          },
        },
      },
    });
    return {
      message: "Channel deleted successfully",
      success: true,
      workspace: updatedWorkspace,
    };
  } catch (error) {
    console.log(error);
    return {
      message: "channel not deleted",
      success: false,
      workspace: null,
    };
  }
};
