"use server";

import { auth } from "../_config/auth.config";
import { dbConfig } from "../_config/db.config";
import { getCurrentLoggedInUserServerAction } from "./auth.serverAction";

export const createWorkSpaceAction = async ({
  image_url,
  name,
  slug,
  invite_code,
}: {
  image_url: string;
  name: string;
  slug: string;
  invite_code: string;
}) => {
  try {
    const session = await auth();
    const loggedInUserDetails = await getCurrentLoggedInUserServerAction();
    console.log("loggedInUserDetails: ", loggedInUserDetails);
    console.log("session: ", session);
    if (loggedInUserDetails.user === null)
      return {
        message: "you are not logged in ",
        success: false,
        workspace: null,
      };
    const workspace = await dbConfig.workspaces.create({
      data: {
        avatar: image_url,
        name,
        slug_code: slug,
        invite_code,
        userId: loggedInUserDetails.user.id,
      },
    });
    await dbConfig.user.update({
      where: { id: loggedInUserDetails.user.id },
      data: {
        workspaces: {
          connect: {
            id: workspace.id,
          },
        },
      },
    });
    return {
      message: "workspace created",
      success: true,
      workspace,
    };
  } catch (error) {
    console.log(error);
    return {
      message: "workspace not created",
      success: false,
      workspace: null,
    };
  }
};
