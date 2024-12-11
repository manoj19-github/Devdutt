"use client";
import { User, Member, MemberRole } from "@prisma/client";
import React, { FC } from "react";
import Image from "next/image";
import ActionTooltip from "@/app/_components/ActionTooltip";
import { ShieldAlert, ShieldCheck } from "lucide-react";
type ChatItemProps = {
  id: string;
  content: string | null;
  member: Member & {
    user: User;
  };
  timestamp: string;
  fileUrl: string | null;
  deleted: boolean;
  currentMember: Member;
  isUpdated: boolean;
  socketUrl: string;
  socketQuery: Record<string, string>;
};
const roleIconMapper = {
  [MemberRole.GUEST]: null,
  [MemberRole.ADMIN]: <ShieldAlert className="size-4 ml-2 text-rose-500" />,
  [MemberRole.MODERATOR]: (
    <ShieldCheck className="size-4 ml-2 text-indigo-500" />
  ),
};
const ChatItem: FC<ChatItemProps> = ({
  content,
  currentMember,
  deleted,
  fileUrl,
  id,
  isUpdated,
  member,
  socketQuery,
  socketUrl,
  timestamp,
}): JSX.Element => {
  const isAdmin = currentMember.role === MemberRole.ADMIN;
  const isModerator = currentMember.role === MemberRole.MODERATOR;
  const isGuest = currentMember.role === MemberRole.GUEST;
  const isOwner = currentMember.id === member.id;
  const canDeleteMessage = !deleted && (isAdmin || isModerator || isOwner);
  const canEditMessage = !deleted && isOwner && !fileUrl;
  const isPDF = fileUrl && fileUrl.endsWith(".pdf");
  const isImage =
    fileUrl &&
    !isPDF &&
    ["png", "jpeg", "jpg"].includes(
      fileUrl.split(".")[fileUrl.split(".").length - 1]
    );

  return (
    <div className="relative group flex items-center hover:bg-black/5 p-3 transition-all w-full ">
      <div className="group flex gap-x-2 items-start w-full">
        <div className="cursor-pointer hover:drop-shadow-md transition-all">
          <div className="w-8 h-8 rounded-full overflow-hidden relative cursor-pointer">
            <Image fill src={member.user.image || "/avatar.png"} alt="user" />
          </div>
          <div className="flex flex-col w-full">
            <div className="flex items-center gap-x-2">
              <div className="flex items-center">
                <p className="font-semibold text-sm hover:underline transition-all cursor-pointer ">
                  {member.user.name}
                </p>
                <ActionTooltip label={member.role} align="end">
                  {roleIconMapper[member.role]}
                </ActionTooltip>
              </div>
              <span className="text-xs  text-zinc-500 dark:text-zinc-400">
                {timestamp}
              </span>
            </div>
            {isImage ? (
              <div>
                <a
                  href={fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="relative mt-2  aspect-square rounded-md overflow-hidden border flex items-center bg-secondary h-48 w-48  "
                >
                  <Image
                    src={fileUrl}
                    alt="image"
                    className="object-cover"
                    fill
                  />
                </a>
                <p className="mt-1 w-48">{content}</p>
              </div>
            ) : isPDF ? (
              <a href={fileUrl} target="_blank" rel="noreferrer"></a>
            ) : (
              content
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatItem;
