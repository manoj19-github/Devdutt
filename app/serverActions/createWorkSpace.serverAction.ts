"use server";

import { ChannelType, MemberRole, UserRole } from "@prisma/client";
import { auth } from "../_config/auth.config";
import { dbConfig } from "../_config/db.config";
import { getCurrentLoggedInUserServerAction } from "./auth.serverAction";
import { v4 as UUIDv4 } from "uuid";

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

    if (
      !session ||
      !session.user === null ||
      !loggedInUserDetails ||
      loggedInUserDetails.user === null
    )
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
        channels: {
          create: [
            {
              name: "general",
              userId: loggedInUserDetails.user.id,
              type: ChannelType.TEXT,
            },
          ],
        },
        members: {
          create: [
            {
              userId: loggedInUserDetails.user.id,
              role: MemberRole.ADMIN,
            },
          ],
        },
      },
    });
    return {
      message: "workspace created",
      success: true,
      workspace,
    };
  } catch (error) {
    return {
      message: "workspace not created",
      success: false,
      workspace: null,
    };
  }
};
