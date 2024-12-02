"use server";

import { MemberRole } from "@prisma/client";
import { auth } from "../_config/auth.config";
import { dbConfig } from "../_config/db.config";
import { getCurrentLoggedInUserServerAction } from "./auth.serverAction";

export const leaveWorkspaceServerAction = async ({
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
    const isMember = selectedWorkspace.members.find(
      (member) => member.userId === loggedInUserDetails?.user?.id
    );
    if (!isMember) {
      return {
        success: false,
        message: "User is not a member of this workspace",
        workspace: null,
      };
    }
    const isAdmin = isMember.role === MemberRole.ADMIN;
    if (isAdmin) {
      return {
        success: false,
        message: "Admin cannot leave workspace",
        workspace: null,
      };
    }

    const workspace = await dbConfig.workspaces.update({
      where: {
        id: selectedWorkspace.id,
      },
      data: {
        members: {
          deleteMany: {
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
      success: true,
      message: "Left workspace successfully",
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
