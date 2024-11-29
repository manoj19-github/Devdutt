"use server";

import { ChannelType, MemberRole, UserRole } from "@prisma/client";
import { auth } from "../_config/auth.config";
import { dbConfig } from "../_config/db.config";
import { getCurrentLoggedInUserServerAction } from "./auth.serverAction";

export const editWorkSpaceAction = async ({
  image_url,
  name,
  workspaceId,
}: {
  image_url: string;
  name: string;
  workspaceId: string;
}) => {
  try {
    const session = await auth();
    const loggedInUserDetails = await getCurrentLoggedInUserServerAction();
    if (
      !session ||
      !session.user ||
      !loggedInUserDetails ||
      loggedInUserDetails.user === null
    )
      return {
        message: "you are not logged in ",
        success: false,
        workspace: null,
      };
    const isWorkspaceFound = await dbConfig.workspaces.findUnique({
      where: {
        id: workspaceId,
      },
      include: {
        members: true,
      },
    });
    if (isWorkspaceFound === null)
      return {
        message: "workspace not found",
        success: false,
        workspace: null,
      };
    const isAdminUser =
      isWorkspaceFound.members.find(
        (member) => member.userId === loggedInUserDetails.user?.id
      )?.role === MemberRole.ADMIN;
    if (!isAdminUser)
      return {
        message: "you are not admin",
        success: false,
        workspace: null,
      };
    const updatedWorkspace = await dbConfig.workspaces.update({
      where: {
        id: workspaceId,
      },
      data: {
        avatar: image_url,
        name,
      },
    });
    return {
      message: "workspace updated",
      success: true,
      workspace: updatedWorkspace,
    };
  } catch (error) {
    return {
      message: "workspace not created",
      success: false,
      workspace: null,
    };
  }
};
