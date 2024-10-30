"use server";

import { auth } from "../_config/auth.config";
import { dbConfig } from "../_config/db.config";

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
    if (!session || !session.user)
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
        userId: session.user.id,
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
