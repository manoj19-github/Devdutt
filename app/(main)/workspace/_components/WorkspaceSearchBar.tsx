"use client";
import { ChannelType, MemberRole } from "@prisma/client";
import { Search } from "lucide-react";

import React, { FC, ReactNode } from "react";
type WorkspaceSearchBarProps = {
  data: Array<{
    label: string;
    type: "channel" | "member";
    data:
      | Array<{
          Icon: ReactNode;
          name: string;
          id: string;
        }>
      | undefined;
  }>;
};

const WorkspaceSearchBar: FC<WorkspaceSearchBarProps> = ({
  data,
}): JSX.Element => {
  return (
    <button className="group px-2 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition">
      <Search className="size-4 dark:text-zinc-400 text-zinc-500" />
      <p className="font-semibold text-sm text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition">
        Search
      </p>
      <kbd className="pointer-events-none inline-flex mr-5 size-5 select-none items-center rounded-border gap-1  px-1.5 font-mono text-[10px] font-medium text-muted-foreground ml-auto ">
        <span className="text-xs ">CTRL</span>K
      </kbd>
    </button>
  );
};

export default WorkspaceSearchBar;
