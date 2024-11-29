"use server";

import { ChannelType, MemberRole, UserRole } from "@prisma/client";
import { auth } from "../_config/auth.config";
import { dbConfig } from "../_config/db.config";
import { getCurrentLoggedInUserServerAction } from "./auth.serverAction";
import { v4 as UUIDv4 } from "uuid";

export const getWorkspaceWithchannels = async ({
  workspaceId,
}: {
  workspaceId: string;
}) => {
  try {
    const session = await auth();
    const loggedInUserDetails = await getCurrentLoggedInUserServerAction();

    if (loggedInUserDetails.user === null || !session || !session.user)
      return {
        message: "you are not logged in ",
        success: false,
        workspace: null,
      };
    const workspace = await dbConfig.workspaces.findUnique({
      where: {
        id: workspaceId,
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
      message: "workspace found successfully ",
      success: true,
      workspace,
    };
  } catch (err) {
    return {
      message: "something went wrong ",
      success: false,
      workspace: null,
    };
  }
};
