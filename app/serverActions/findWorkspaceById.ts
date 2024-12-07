import { auth } from "../_config/auth.config";
import { dbConfig } from "../_config/db.config";
import { getCurrentLoggedInUserServerAction } from "./auth.serverAction";

export const findWorkspaceByIdServerAction = async ({
  workspaceId,
  userId,
}: {
  workspaceId: string;
  userId: string;
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
        message: "User not logged in",
        workspace: null,
        initialChannel: null,
        success: false,
      };
    const selectedWorkspace = await dbConfig.workspaces.findFirst({
      where: {
        id: workspaceId,
        members: {
          some: {
            userId,
          },
        },
      },
      include: {
        channels: {
          where: {
            name: "general",
          },
          orderBy: {
            createdAt: "asc",
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
    const initialChannel = selectedWorkspace?.channels?.[0];
    if (initialChannel?.name !== "general")
      return {
        message: "Workspace found",
        workspace: selectedWorkspace,
        initialChannel: null,
        success: true,
      };
    return {
      message: "Workspace found",
      workspace: selectedWorkspace,
      initialChannel,
      success: true,
    };
  } catch (error) {
    console.log(error);
    return {
      message: "Workspace found",
      workspace: null,
      initialChannel: null,
      success: false,
    };
  }
};
