"use client";
import ActionTooltip from "@/app/_components/ActionTooltip";
import { cn } from "@/lib/utils";
import { Channel, ChannelType, MemberRole, Workspaces } from "@prisma/client";
import { Edit, Hash, Mic, Trash, Video, Lock } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { FC } from "react";

type WorkspaceChannelProps = {
  channel: Channel;
  workspace: Workspaces | null;
  role: MemberRole | undefined;
};

const iconMap = {
  [ChannelType.TEXT]: Hash,
  [ChannelType.AUDIO]: Mic,
  [ChannelType.VIDEO]: Video,
};
const WorkspaceChannel: FC<WorkspaceChannelProps> = ({
  channel,
  workspace,
  role,
}): JSX.Element => {
  const params = useParams();
  const router = useRouter();
  const Icon = iconMap[channel.type];
  const handleClick = () => {
    if (!workspace || !role) {
      return;
    }
    router.push(`/workspace/${workspace.id}/channel/${channel.id}`);
  };
  return (
    <button
      className={cn(
        "group px-2 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition-all mb-1",
        params?.channelId === channel.id && "bg-zinc-700/20 dark:bg-zinc-700"
      )}
      onClick={() => {}}
    >
      <Icon className="size-5 flex-shrink text-zinc-500 dark:text-zinc-400 " />
      <p
        className={cn(
          "line-clamp-1 font-semibold text-sm text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition-all",
          params?.channelId === channel.id &&
            "text-primary dark:text-zinc-200 dark:group-hover:text-white"
        )}
      >
        {channel.name}
      </p>
      {channel?.name !== "general" && role !== MemberRole.GUEST && (
        <div className="ml-auto flex items-center gap-x-2">
          <ActionTooltip label="Edit Channel" align={"end"}>
            <Edit className="size-4 hidden group-hover:block text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition-all" />
          </ActionTooltip>
          <ActionTooltip label="Edit Channel" align={"end"}>
            <Trash className="size-4 hidden group-hover:block text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition-all" />
          </ActionTooltip>
        </div>
      )}
      {channel.name === "general" ? (
        <Lock className="size-4 ml-auto text-zinc-500 dark:text-zinc-400" />
      ) : (
        <></>
      )}
    </button>
  );
};

export default WorkspaceChannel;
