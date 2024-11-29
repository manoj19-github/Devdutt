"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useModalStore } from "@/hooks/useModalStore";
import { UserWithWorkspaces, WorkspaceWithMembersWithProfiles } from "@/types";
import { MemberRole, Workspaces } from "@prisma/client";

import {
  ChevronDown,
  ChevronRight,
  LogOut,
  PlusCircle,
  Settings,
  Trash,
  UserPlus,
  Users,
} from "lucide-react";
import React, { FC, Fragment } from "react";

type WorkspaceHeaderProps = {
  workspace: WorkspaceWithMembersWithProfiles;
  role?: MemberRole;
  loggedInUser?: UserWithWorkspaces;
};
const WorkspaceHeader: FC<WorkspaceHeaderProps> = ({
  workspace,
  role,
  loggedInUser,
}): JSX.Element => {
  const { onClose, onOpen, isOpen, data } = useModalStore();
  const IsAdmin = role === MemberRole.ADMIN;
  const IsModerator = role === MemberRole.MODERATOR || IsAdmin;
  console.log("loggedInUser >>>>>>>>>> ", loggedInUser);
  console.log("modal details <<<<<<<<<<<<<<< ", data);

  return (
    <Fragment>
      <DropdownMenu>
        <DropdownMenuTrigger className="focus:outline-none" asChild>
          <button className="w-full text-md font-semibold px-3 flex items-center h-12 border-neutral-200 dark:border-neutral-800 border-b-2 dark:hover:bg-zinc-700/50 transition-all hover:bg-zinc-700/10 ">
            {workspace.name}
            <ChevronDown className="size-5 ml-auto" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 text-xs font-medium text-black dark:text-neutral-400 space-y-[2px] ">
          {IsModerator ? (
            <DropdownMenuItem
              onClick={() =>
                onOpen("invite", { workspace, currUser: loggedInUser })
              }
              className="text-indigo-600 dark:text-indigo-400 px-3 py-2 text-sm cursor-pointer "
            >
              Invite People
              <UserPlus className="size-4 ml-auto" />
            </DropdownMenuItem>
          ) : (
            <></>
          )}
          {IsAdmin ? (
            <DropdownMenuItem
              onClick={() => onOpen("editWorkspace", { workspace })}
              className=" px-3 py-2 text-sm cursor-pointer "
            >
              Workspace Settings
              <Settings className="size-4 ml-auto" />
            </DropdownMenuItem>
          ) : (
            <></>
          )}
          {IsAdmin ? (
            <DropdownMenuItem
              onClick={() =>
                onOpen("members", { workspace, currUser: loggedInUser })
              }
              className=" px-3 py-2 text-sm cursor-pointer "
            >
              Manage Members
              <Users className="size-4 ml-auto" />
            </DropdownMenuItem>
          ) : (
            <></>
          )}
          {IsModerator ? (
            <DropdownMenuItem className=" px-3 py-2 text-sm cursor-pointer ">
              Create Channel
              <PlusCircle className="size-4 ml-auto" />
            </DropdownMenuItem>
          ) : (
            <></>
          )}
          {IsModerator ? <DropdownMenuSeparator /> : <></>}
          {IsAdmin ? (
            <DropdownMenuItem className=" px-3 py-2 text-rose-500 text-sm cursor-pointer ">
              Delete Workspace
              <Trash className="size-4 ml-auto" />
            </DropdownMenuItem>
          ) : (
            <></>
          )}
          {!IsAdmin ? (
            <DropdownMenuItem className=" px-3 py-2 text-rose-500 text-sm cursor-pointer ">
              Leave Workspace
              <LogOut className="size-4 ml-auto" />
            </DropdownMenuItem>
          ) : (
            <></>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </Fragment>
  );
};

export default WorkspaceHeader;
