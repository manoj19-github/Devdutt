"use server";

import { ChannelType, MemberRole, UserRole } from "@prisma/client";
import { auth } from "../_config/auth.config";
import { dbConfig } from "../_config/db.config";
import { getCurrentLoggedInUserServerAction } from "./auth.serverAction";
import { CreateChannelFormSchema } from "@/formSchema/createChannel.formSchema";
import { NextResponse } from "next/server";

export const createChannelServerAction = async ({
  workspace_id,
  type,
  name,
}: {
  workspace_id: string;
  type: ChannelType;
  name: string;
}) => {
  try {
    if (!workspace_id)
      return {
        message: "Workspace is not required",
        success: false,
        workspace: null,
      };

    const validatedResponse = CreateChannelFormSchema.safeParse({ name, type });
    if (!validatedResponse.success) {
      const { errors } = validatedResponse.error;
      return {
        message: errors[0].message,
        success: false,
        workspace: null,
      };
      //   return NextResponse.json(
      //     { message: errors[0].message, success: false, user: null },
      //     { status: 400 }
      //   );
    }

    const session = await auth();
    const loggedInUserDetails = await getCurrentLoggedInUserServerAction();

    if (
      !loggedInUserDetails ||
      loggedInUserDetails.user === null ||
      !session ||
      !session.user
    )
      return {
        message: "you are not logged in ",
        success: false,
        workspace: null,
      };

    if (validatedResponse.data.name.toLowerCase() === "general")
      return {
        message: `you cannot create a channel with the name "general"`,
        success: false,
        workspace: null,
      };

    const selectedWorkspace = await dbConfig.workspaces.findUnique({
      where: {
        id: workspace_id,
      },
      include: {
        members: true,
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
    const isAdminOrModerator = selectedWorkspace.members.some(
      (member) =>
        (member.role === MemberRole.ADMIN ||
          member.role === MemberRole.MODERATOR) &&
        member.userId === loggedInUserDetails?.user?.id
    );

    if (!isAdminOrModerator) {
      return {
        message: "you are not authorized to create a channel",
        success: false,
        workspace: null,
      };
    }

    const workspace = await dbConfig.workspaces.update({
      where: {
        id: selectedWorkspace.id,
      },
      data: {
        channels: {
          create: {
            name: validatedResponse.data.name,
            type: validatedResponse.data.type,
            userId: loggedInUserDetails.user.id,
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
      message: "Channel  created successfully",
      success: true,
      workspace,
    };
  } catch (error) {
    console.log("error: ", error);
    return {
      message: "Channel not created",
      success: false,
      workspace: null,
    };
  }
};
