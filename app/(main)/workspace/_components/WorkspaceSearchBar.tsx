"use client";
import {
  CommandDialog,
  CommandInput,
  CommandItem,
  CommandList,
  CommandEmpty,
  CommandGroup,
} from "@/components/ui/Command";
import { ChannelType, MemberRole } from "@prisma/client";

import { Search } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import React, { FC, Fragment, ReactNode, useEffect, useState } from "react";
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
  const [open, setOpen] = useState<boolean>(false);
  const router = useRouter();
  const params = useParams();
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey && e.key === "k") || (e.metaKey && e.key === "k")) {
        e.preventDefault(); // Prevent the default behavior of the key press
        setOpen((prev) => !prev);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);
  const clickHandler = ({
    id,
    type,
  }: {
    id: string;
    type: "channel" | "member";
  }) => {
    setOpen(false);
    if (type === "channel")
      return router.push(`/workspace/${params?.workspaceId}/channels/${id}`);

    router.push(`/workspace/${params?.workspaceId}/conversations/${id}`);
  };
  return (
    <Fragment>
      <button
        onClick={() => setOpen(true)}
        className="group px-2 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition"
      >
        <Search className="size-4 dark:text-zinc-400 text-zinc-500" />
        <p className="font-semibold text-sm text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition">
          Search
        </p>
        <kbd className="pointer-events-none inline-flex mr-5 size-5 select-none items-center rounded-border gap-1  px-1.5 font-mono text-[10px] font-medium text-muted-foreground ml-auto ">
          <span className="text-xs ">CTRL</span>K
        </kbd>
      </button>
      <CommandDialog open={open} onOpenChange={() => setOpen(false)}>
        <CommandInput placeholder="Search all channel" />
        <CommandList>
          <CommandEmpty className="p-3 text-center">
            No Results Found
          </CommandEmpty>
          {data.map(({ label, type, data }, index) => {
            if (!data?.length) return null;

            return (
              <CommandGroup key={index} heading={label}>
                {data.map(({ Icon, name, id }) => {
                  return (
                    <CommandItem
                      className="cursor-pointer"
                      key={id}
                      onSelect={() => clickHandler({ id, type })}
                    >
                      {Icon}
                      <span>{name}</span>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            );
          })}
        </CommandList>
      </CommandDialog>
    </Fragment>
  );
};

export default WorkspaceSearchBar;
