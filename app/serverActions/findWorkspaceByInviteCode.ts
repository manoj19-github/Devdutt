import { redirect } from "next/navigation";
import { dbConfig } from "../_config/db.config";

export const findWorkspaceByInviteCode = async ({
  invite_code,
  loggedInUserId,
}: {
  invite_code: string;
  loggedInUserId: string;
}) => {
  // ***************  Find workspace by invite code  ****************   //
  const workspaceByInviteCode = await dbConfig.workspaces.findFirst({
    where: {
      invite_code,
    },
  });

  // *************************  if workspace  not found    ***********************
  if (!workspaceByInviteCode)
    return {
      message: "Workspace not found",
      data: null,
    };

  //    *************************  Find User is exists in the workspace   ***********************
  const memberOfWorkspace = await dbConfig.member.findFirst({
    where: {
      userId: loggedInUserId,
      workspaceId: workspaceByInviteCode.id,
    },
  });

  // *********************   If User is already exists in workspace  ****************
  if (memberOfWorkspace)
    return redirect(`/workspace/${workspaceByInviteCode.id}`);

  // *********************   If User is not exists in workspace  ****************
  const attachedToWorkspace = await dbConfig.workspaces.update({
    where: {
      id: workspaceByInviteCode.id,
    },
    data: {
      members: {
        create: {
          userId: loggedInUserId,
        },
      },
    },
  });

  if (attachedToWorkspace) {
    return redirect(`/workspace/${attachedToWorkspace.id}`);
  }
};
