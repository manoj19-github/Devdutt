import { dbConfig } from "../_config/db.config";

export const getAllOfMyWorkspaceById = async ({
  workspaceId,
  currentUserId,
}: {
  workspaceId: any;
  currentUserId: any;
}) => {
  try {
    const workspaces = await dbConfig.workspaces.findMany({
      where: {
        id: workspaceId,
        members: {
          some: {
            userId: currentUserId,
          },
        },
      },
    });
    return {
      message: "workspace found",
      data: workspaces,
    };
  } catch (error) {
    console.log(error);
    return {
      message: "workspace not found",
      data: null,
    };
  }
};
