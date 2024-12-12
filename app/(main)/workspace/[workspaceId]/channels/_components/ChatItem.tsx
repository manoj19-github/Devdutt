"use client";
import * as zod from "zod";
import { User, Member, MemberRole } from "@prisma/client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { FC, useEffect, useState } from "react";
import Image from "next/image";
import ActionTooltip from "@/app/_components/ActionTooltip";
import { Edit, FileIcon, ShieldAlert, ShieldCheck, Trash } from "lucide-react";
import { cn } from "@/lib/utils";
import { messageFormSchema } from "@/formSchema/messages.formSchema";
import {
  Form,
  FormItem,
  FormControl,
  FormField,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { updateMessageService } from "@/app/_services/chat.service";
import { useRouter,useParams } from "next/navigation";
import toast from "react-hot-toast";
import { useModalStore } from "@/hooks/useModalStore";
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
  loggedInUserDetails: any;
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
  loggedInUserDetails,
}): JSX.Element => {
  const FormHandler = useForm<zod.infer<typeof messageFormSchema>>({
    defaultValues: {
      content: content ?? "",
    },
    resolver: zodResolver(messageFormSchema),
  });
  const router = useRouter();
  const params = useParams();
  const { onOpen } = useModalStore();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
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

  const handleUpdate = (values: zod.infer<typeof messageFormSchema>) => {
    setIsLoading(true);
    updateMessageService({
      successCallback: () => {
        setIsEditing(false);
        router.refresh();
        FormHandler.reset();
      },
      id,
      socketQuery,
      socketUrl,
      loggedInUserDetails,
      messageContent: values.content,
      errorCallback: () => {
        toast.error("something went wrong");
      },
      finallyCallback: () => {
        setIsLoading(false);
      },
    });
  };

  const onMemberClick=()=>{
    if(member.id===currentMember.id) return;
    router.push(`/workspace/${params?.workspaceId??""}/conversations/${member?.id}`)

  }
  useEffect(() => {
    FormHandler.reset({
      content: content ?? "",
    });
  }, [content]);
  useEffect(() => {
    const handleKeydown = (event: any) => {
      if (event.key === "Escape" || event.keyCode === 27) {
        setIsEditing(false);
      }
    };
    document.addEventListener("keydown", handleKeydown);
    return () => document.removeEventListener("keydown", handleKeydown);
  }, []);
  return (
    <div className="relative group flex items-center hover:bg-black/5 p-3 transition-all w-full ">
      <div className="group flex gap-x-2 items-start w-full">
        <div className="cursor-pointer hover:drop-shadow-md transition-all">
          <div className="w-8 h-8 rounded-full overflow-hidden relative cursor-pointer" >
            <Image fill src={member.user.image || "/avatar.png"} alt="user" />
          </div>
          <div className="flex flex-col w-full">
            <div className="flex items-center gap-x-2">
              <div className="flex items-center">
                <p onClick={onMemberClick} className="font-semibold text-sm hover:underline transition-all cursor-pointer ">
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
                  rel="noreferrer noopener"
                  className="relative mt-2  aspect-square rounded-md overflow-hidden border flex items-center bg-secondary h-48 w-48  "
                >
                  <Image
                    src={fileUrl}
                    alt="image"
                    className="object-cover"
                    fill
                  />
                </a>
                <p className="mt-1 w-48">
                  {
                    !deleted?`${content}`:`This message has been deleted`
                  }
                  </p>
              </div>
            ) : isPDF ? (
              <a
                href={fileUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="ml-2 text-sm  hover:underline "
              >
                <div className="relative flex flex-col items-center p-1 mt-2 rounded-md bg-white/10">
                  <FileIcon className="w-16 h-16 fill-indigo-200 stroke-indigo-400" />
                  <p className="w-48 mt-1 text-center">{content}</p>
                </div>
              </a>
            ) : (
              <></>
            )}
            {!isPDF && !isImage && !isEditing ? (
              <p
                className={cn(
                  "text-sm text-zinc-600 dark:text-zinc-300",
                  deleted &&
                    "italic text-zinc-500 dark:text-zinc-400 text-xs mt-1"
                )}
              >
             {
                    !deleted?`${content}`:`This message has been deleted`
                  }
                {isUpdated && !deleted ? (
                  <span className="text-[10px] mx-2 text-zinc-500 dark:text-zinc-400">
                    (edited)
                  </span>
                ) : (
                  <></>
                )}
              </p>
            ) : (
              <></>
            )}
            {!isImage && !isPDF && isEditing ? (
              <Form {...FormHandler}>
                <form
                  className="flex items-center w-full gap-x-2 pt-2"
                  onSubmit={FormHandler.handleSubmit(handleUpdate)}
                >
                  <FormField
                    control={FormHandler.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <div className="relative w-full">
                            <Input
                              disabled={isLoading}
                              placeholder="Edited message"
                              className="p-1 bg-zinc-600 w-72 border-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200 "
                              {...field}
                            />
                          </div>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <Button
                    className=""
                    size="sm"
                    variant={"outline"}
                    disabled={isLoading}
                  >
                    Save
                  </Button>
                </form>
                <span className="text-[11px] mt-1 text-zinc-300">
                  Press escape to cancel, enter to save
                </span>
              </Form>
            ) : (
              <></>
            )}
          </div>
        </div>
        {canDeleteMessage ? (
          <div className="hidden group-hover:flex items-center gap-x-2 absolute p-1 -top-2 right-4 bg-white dark:bg-zinc-800 border rounded-sm">
            {canEditMessage ? (
              <ActionTooltip label="Edit" align="end">
                <Edit
                  onClick={() => setIsEditing(true)}
                  className="size-5 cursor-pointer ml-auto text-zinc-500 dark:text-300 hover:text-zinc-600 dark:hover:text-zinc-300 transition-all  "
                />
              </ActionTooltip>
            ) : (
              <></>
            )}
            <ActionTooltip label="Delete" align="end">
              <Trash
                onClick={() =>
                  onOpen("deleteMessage", {
                    apiUrl: `${socketUrl}/${id}`,
                    query: socketQuery,
                    loggedInUserDetails,
                  })
                }
                className="size-5 cursor-pointer ml-auto text-zinc-500 dark:text-300 hover:text-zinc-600 dark:hover:text-zinc-300 transition-all  "
              />
            </ActionTooltip>
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default ChatItem;
