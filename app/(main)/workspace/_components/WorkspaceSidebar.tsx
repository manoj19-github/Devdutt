import { auth } from "@/app/_config/auth.config";
import { getCurrentLoggedInUserServerAction } from "@/app/serverActions/auth.serverAction";
import { getAllOfMyWorkspaceById } from "@/app/serverActions/getWorkspaceById.serverAction";
import { getWorkspaceWithchannels } from "@/app/serverActions/getWorkspaceWithChannels";
import { ChannelType } from "@prisma/client";
import { redirect } from "next/navigation";
import React, { FC } from "react";
import WorkspaceHeader from "./WorkspaceHeader";

type WorkspaceSidebarProps = {
  workspaceId: string;
};

const WorkspaceSidebar: FC<WorkspaceSidebarProps> = async ({
  workspaceId,
}): Promise<JSX.Element> => {
  const session = await auth();
  const respo = await getCurrentLoggedInUserServerAction();
  if (!session || !session.user) return redirect("/auth/login");
  if (!respo || !respo.user) return redirect("/auth/login");
  const currentWorkspace = await getAllOfMyWorkspaceById({
    workspaceId,
    currentUserId: respo.user.id,
  });
  if (!currentWorkspace.data) return redirect("/");
  const workspaceResponse = await getWorkspaceWithchannels({ workspaceId });
  if (workspaceResponse.workspace === null || !workspaceResponse.workspace)
    redirect("/create-workspace"); // redirect to create workspace
  const textChannels = workspaceResponse.workspace.channels.filter(
    (channel) => channel.type === ChannelType.TEXT
  );
  const audioChannels = workspaceResponse.workspace.channels.filter(
    (channel) => channel.type === ChannelType.AUDIO
  );
  const videoChannels = workspaceResponse.workspace.channels.filter(
    (channel) => channel.type === ChannelType.VIDEOa
  );
  const members = workspaceResponse.workspace.members.filter(
    (member) => member.userId !== respo.user?.id
  );
  const loggedInUserRole = workspaceResponse.workspace.members.find(
    (member) => member.userId === respo.user?.id
  )?.role;

  return (
    <div className="flex flex-col h-full text-primary w-full dark:bg-[#2b2d31] bg-[#e2e3e4] ">
      <WorkspaceHeader
        workspace={workspaceResponse.workspace}
        role={loggedInUserRole}
        loggedInUser={respo.user}
      />
    </div>
  );
};

export default WorkspaceSidebar;
