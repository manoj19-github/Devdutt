import { MemberRole, UserRole } from "@prisma/client";
import { v4 as uuid } from "uuid";
import { auth } from "../_config/auth.config";
import { dbConfig } from "../_config/db.config";
import { getCurrentLoggedInUserServerAction } from "./auth.serverAction";

export const changeInviteCodeServerAction = async ({
  workspaceId,
  currentUserId,
}: {
  workspaceId: any;
  currentUserId: any;
}) => {
  try {
    const session = await auth();
    const loggedInUserDetails = await getCurrentLoggedInUserServerAction();
    if (loggedInUserDetails.user === null || !session || !session.user === null)
      return {
        message: "you are not logged in ",
        success: false,
        workspace: null,
      };
    const workspaces = await dbConfig.workspaces.findFirst({
      where: {
        id: workspaceId,
        members: {
          some: {
            userId: currentUserId,
          },
        },
      },
      include: {
        members: {
          include: {
            user: true,
          },
        },
      },
    });
    const memberExists = workspaces?.members.find(
      (self) => self.id === currentUserId
    );
    const invite_code = uuid();
    if (
      memberExists?.role === MemberRole.ADMIN ||
      memberExists?.role === MemberRole.MODERATOR
    ) {
      return {
        message: "Sorry you are not allowed",
        success: true,
        workspace: workspaces,
      };
    }
    await dbConfig.workspaces.update({
      where: {
        id: workspaceId,
      },
      data: {
        invite_code,
      },
    });
  } catch (error) {
    console.log("error ><>> ", error);
  }
};
