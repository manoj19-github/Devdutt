"use server";
import { dbConfig } from "../_config/db.config";

export const getAllOfMyWorkspaces = async (currentProfileId: any) => {
  try {
    const workspaces = await dbConfig.workspaces.findMany({
      where: {
        members: {
          some: {
            userId: currentProfileId,
          },
        },
      },
    });
    return {
      message: "All workspaces fetched successfully",
      success: true,
      workspaces,
    };
  } catch (error) {
    console.log(error);
    return {
      message: "All workspaces fetched successfully",
      success: true,
      workspaces: null,
    };
  }
};
