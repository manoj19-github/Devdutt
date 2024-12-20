import { auth } from "@/app/_config/auth.config";
import { getCurrentLoggedInUserServerAction } from "@/app/serverActions/auth.serverAction";
import { findFirstMemberByIdServerAction } from "@/app/serverActions/findFirstMemberById";
import { findWorkspaceByIdServerAction } from "@/app/serverActions/findWorkspaceById";
import { redirect } from "next/navigation";
import React, { FC } from "react";

type WorkspaceIdPageProps = {
  params: {
    workspaceId: string;
  };
};
const WorkspaceIdPage: FC<WorkspaceIdPageProps> = async ({
  params,
}): Promise<JSX.Element> => {
  const session = await auth();
  const loggedInUserDetails = await getCurrentLoggedInUserServerAction();
  if (
    !loggedInUserDetails ||
    loggedInUserDetails.user === null ||
    !session ||
    session.user === null
  )
    redirect("/auth/login");
  const selectedWorkspace = await findWorkspaceByIdServerAction({
    workspaceId: params.workspaceId,
    userId: loggedInUserDetails.user.id,
  });
  console.log("selectedWorkspace: ", selectedWorkspace);

  if (
    selectedWorkspace.initialChannel === null ||
    selectedWorkspace.initialChannel?.name !== "general"
  )
    return <></>;
  return redirect(
    `/workspace/${params.workspaceId}/channels/${selectedWorkspace.initialChannel.id}`
  );
};

export default WorkspaceIdPage;
