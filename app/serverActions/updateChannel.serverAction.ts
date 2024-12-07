"use server";
import { ChannelType, MemberRole, UserRole } from "@prisma/client";
import { auth } from "../_config/auth.config";
import { dbConfig } from "../_config/db.config";
import { getCurrentLoggedInUserServerAction } from "./auth.serverAction";
import { CreateChannelFormSchema } from "@/formSchema/createChannel.formSchema";
import { NextResponse } from "next/server";

export const updateChannelServerAction = async ({
  channelId,
  workspaceId,
  name,
  channelType,
}: {
  channelId: string;
  workspaceId: string;
  name: string;
  channelType: ChannelType;
}) => {
  try {
    if (!!name && name.toLowerCase() === "general")
      return {
        message: "You can't delete general channel",
        success: false,
        workspace: null,
      };
    if (!channelId || !workspaceId)
      return {
        message: "Invalid request",
        success: false,
        workspace: null,
      };
    const session = await auth();
    const loggedInUserDetails = await getCurrentLoggedInUserServerAction();
    if (loggedInUserDetails.user === null || !session || session.user === null)
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
          update: {
            where: {
              id: channelId,
            },
            data: {
              name,
              type: channelType,
            },
          },
        },
      },
      include: {
        channels: {
          orderBy: {
            createdAt: "desc",
          },
        },
        members: {
          include: {
            user: true,
          },
          orderBy: {
            role: "asc",
          },
        },
      },
    });
    return {
      message: "Channel updated successfully",
      success: true,
      workspace: updatedWorkspace,
    };
  } catch (error) {
    console.log(error);
    return {
      message: "channel not updated",
      success: false,
      workspace: null,
    };
  }
};
