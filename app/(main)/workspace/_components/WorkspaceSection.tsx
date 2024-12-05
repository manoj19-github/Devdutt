"use client";
import ActionTooltip from "@/app/_components/ActionTooltip";
import { useModalStore } from "@/hooks/useModalStore";
import { WorkspaceWithMembersWithProfiles } from "@/types";
import { ChannelType, MemberRole } from "@prisma/client";
import { Plus, Settings } from "lucide-react";
import React, { FC } from "react";

type WorkspaceSectionProps = {
  label: string;
  role?: MemberRole;
  sectionType: "members" | "channels";
  channelType?: ChannelType;
  workspace?: WorkspaceWithMembersWithProfiles;
};
const WorkspaceSection: FC<WorkspaceSectionProps> = ({
  label,
  role,
  channelType,
  sectionType,
  workspace,
}) => {
  const { onOpen } = useModalStore();
  console.log("workspace: section ", workspace);
  return (
    <div className="flex items-center justify-between py-2">
      <p className="text-xs uppercase font-semibold text-zinc-500 dark:text-zinc-400">
        {label}
      </p>
      {role !== MemberRole.GUEST && sectionType === "channels" ? (
        <ActionTooltip label="Create Channel" side="top" align={"center"}>
          <button
            onClick={() => onOpen("createChannel", { workspace })}
            className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-400 dark:hover:text-zinc-300 transition-all"
          >
            <Plus className="size-4" />
          </button>
        </ActionTooltip>
      ) : (
        <></>
      )}
      {role === MemberRole.ADMIN && sectionType === "members" ? (
        <ActionTooltip label="Create Channel" side="top" align={"center"}>
          <button
            onClick={() => onOpen("members", { workspace })}
            className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-400 dark:hover:text-zinc-300 transition-all"
          >
            <Settings className="size-4" />
          </button>
        </ActionTooltip>
      ) : (
        <></>
      )}
    </div>
  );
};

export default WorkspaceSection;
