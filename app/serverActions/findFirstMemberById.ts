import { auth } from "../_config/auth.config";
import { dbConfig } from "../_config/db.config";
import { getCurrentLoggedInUserServerAction } from "./auth.serverAction";

export const findFirstMemberByIdServerAction = async ({
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
        firstMember: null,
        success: false,
      };

    const member = await dbConfig.member.findFirst({
      where: {
        workspaceId: workspaceId,
        userId: userId,
      },
      include: {
        user: true,
      },
    });

    return {
      message: "member found",
      firstMember: member,
      success: true,
    };
  } catch (error) {
    console.log(error);
    return {
      message: "member not found",
      firstMember: null,
      success: false,
    };
  }
};
