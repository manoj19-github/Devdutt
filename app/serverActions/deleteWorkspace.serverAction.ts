"use server";

import { MemberRole } from "@prisma/client";
import { auth } from "../_config/auth.config";
import { dbConfig } from "../_config/db.config";
import { getCurrentLoggedInUserServerAction } from "./auth.serverAction";

export const deleteWorkspaceServerAction = async ({
  workspaceId,
}: {
  workspaceId: string;
}) => {
  try {
    if (!workspaceId) {
      return {
        success: false,
        message: "Workspace ID is required",
        workspace: null,
      };
    }
    const session = await auth();
    const loggedInUserDetails = await getCurrentLoggedInUserServerAction();
    if (
      !session ||
      !loggedInUserDetails ||
      !session.user ||
      !loggedInUserDetails.user
    ) {
      return {
        success: false,
        message: "User not authenticated",
        workspace: null,
      };
    }
    const selectedWorkspace = await dbConfig.workspaces.findUnique({
      where: {
        id: workspaceId,
      },
      include: {
        members: true,
      },
    });
    if (!selectedWorkspace) {
      return {
        success: false,
        message: "Workspace not found",
        workspace: null,
      };
    }
    const isAdmin =
      selectedWorkspace.members.find(
        (member) => member.userId === loggedInUserDetails?.user?.id
      )?.role === MemberRole.ADMIN;
    if (!isAdmin) {
      return {
        success: false,
        message: "Admin cannot delete workspace",
        workspace: null,
      };
    }

    const workspace = await dbConfig.workspaces.delete({
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
      success: true,
      message: "Delete workspace successfully",
      workspace: workspace,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "Something went wrong",
      workspace: null,
    };
  }
};
