"use client";
import UserProfile from "@/app/_components/UserProfile";
import { cn } from "@/lib/utils";
import { WorkspaceWithMembersWithProfiles } from "@/types";
import { Member, MemberRole, User, Workspaces } from "@prisma/client";
import { ShieldAlert, ShieldCheck } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import React, { FC } from "react";
type WorkspaceMembersProps = {
  member: Member & { user: User };
  workspace?: WorkspaceWithMembersWithProfiles | null;
};
const roleIconMapper = {
  [MemberRole.GUEST]: null,
  [MemberRole.MODERATOR]: (
    <ShieldCheck className="size-4 ml-2 text-indigo-500" />
  ),
  [MemberRole.ADMIN]: <ShieldAlert className="size-4 ml-2 text-rose-500" />,
};
const WorkspaceMembers: FC<WorkspaceMembersProps> = ({
  member,
  workspace,
}): JSX.Element => {
  const params = useParams();
  const router = useRouter();
  const icon = roleIconMapper[member.role];

  return (
    <button
      className={cn(
        "group px-2 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition-all mb-1",
        params?.memberId === member.id && "bg-zinc-700/20 dark:bg-zinc-700"
      )}
    >
      <div className="w-7 h-7 rounded-full overflow-hidden relative cursor-pointer">
        <Image fill src={member?.user?.image || "/avatar.png"} alt="user" />
      </div>
      <p
        className={cn(
          "line-clamp-1 font-semibold text-sm text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition-all",
          params?.memberId === member.id &&
            "text-primary dark:text-zinc-200 dark:group-hover:text-white"
        )}
      >
        {member?.user?.name}
      </p>
      {icon}
    </button>
  );
};

export default WorkspaceMembers;
