import { auth } from "@/app/_config/auth.config";
import { getCurrentLoggedInUserServerAction } from "@/app/serverActions/auth.serverAction";
import { getAllOfMyWorkspaceById } from "@/app/serverActions/getWorkspaceById.serverAction";
import { getWorkspaceWithchannels } from "@/app/serverActions/getWorkspaceWithChannels";
import { ChannelType, MemberRole } from "@prisma/client";
import { redirect } from "next/navigation";
import React, { FC } from "react";
import WorkspaceHeader from "./WorkspaceHeader";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import WorkspaceSearchBar from "./WorkspaceSearchBar";
import { Hash, Mic, ShieldAlert, ShieldCheck, Video } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import WorkspaceSection from "./WorkspaceSection";
import WorkspaceChannel from "./WorkspaceChannel";

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
    (channel) => channel.type === ChannelType.VIDEO
  );
  const members = workspaceResponse.workspace.members.filter(
    (member) => member.userId !== respo.user?.id
  );
  const loggedInUserRole = workspaceResponse.workspace.members.find(
    (member) => member.userId === respo.user?.id
  )?.role;
  const IconMapper = {
    [ChannelType.TEXT]: <Hash className="size-4 mr-2" />,
    [ChannelType.VIDEO]: <Video className="size-4 mr-2" />,
    [ChannelType.AUDIO]: <Mic className="size-4 mr-2" />,
  };
  const RoleIconMapper = {
    [MemberRole.GUEST]: null,
    [MemberRole.MODERATOR]: (
      <ShieldCheck className="size-4 mr-2 text-indigo-500" />
    ),
    [MemberRole.ADMIN]: <ShieldAlert className="size-4 mr-2 text-rose-500" />,
  };

  return (
    <div className="flex flex-col h-full text-primary w-full dark:bg-[#2b2d31] bg-[#e2e3e4] ">
      <WorkspaceHeader
        workspace={workspaceResponse.workspace}
        role={loggedInUserRole}
        loggedInUser={respo.user}
      />
      <ScrollArea className="flex-1 px-3">
        <div className="mt-2">
          <WorkspaceSearchBar
            data={[
              {
                label: "Text Channels",
                type: "channel",
                data: textChannels?.map((self) => ({
                  id: self.id,
                  name: self.name,
                  Icon: IconMapper[self.type],
                })),
              },
              {
                label: "Voice Channels",
                type: "channel",
                data: audioChannels?.map((self) => ({
                  id: self.id,
                  name: self.name,
                  Icon: IconMapper[self.type],
                })),
              },
              {
                label: "Video Channels",
                type: "channel",
                data: videoChannels?.map((self) => ({
                  id: self.id,
                  name: self.name,
                  Icon: IconMapper[self.type],
                })),
              },
              {
                label: "Members",
                type: "member",
                data: members?.map((self) => ({
                  id: self.id,
                  name: self.user.name ?? "",
                  Icon: RoleIconMapper[self.role],
                })),
              },
            ]}
          />
        </div>
        <Separator className="bg-zinc-300 dark:bg-zinc-700 rounded-md my-2" />
        {!!workspaceResponse.workspace && !!textChannels?.length ? (
          <div className="mb-2">
            <WorkspaceSection
              label={"Text Channels"}
              role={loggedInUserRole}
              channelType={ChannelType.TEXT}
              sectionType={"channels"}
              workspace={workspaceResponse.workspace}
            />
            {workspaceResponse.workspace &&
              textChannels?.map((channel) => (
                <WorkspaceChannel
                  key={channel.id}
                  channel={channel}
                  workspace={workspaceResponse.workspace}
                  role={loggedInUserRole}
                />
              ))}
          </div>
        ) : (
          <></>
        )}
      </ScrollArea>
    </div>
  );
};

export default WorkspaceSidebar;
