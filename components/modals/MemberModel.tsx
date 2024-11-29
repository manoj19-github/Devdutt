"use client";
import { useModalStore } from "@/hooks/useModalStore";
import React, { FC, Fragment, useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "../ui/button";
import {
  DialogHeader,
  DialogFooter,
  DialogContent,
  Dialog,
  DialogDescription,
  DialogTitle,
} from "../ui/dialog";
import { useAPPLoader } from "@/store/useAPPLoader";
import Typography from "@/lib/Typography";
import { ScrollArea } from "../ui/ScrollArea";
import {
  Check,
  Gavel,
  Loader2,
  MoreVertical,
  Shield,
  ShieldAlert,
  ShieldCheck,
  ShieldQuestion,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MemberRole } from "@prisma/client";
import { Tooltip } from "../ui/tooltip";
import {
  kickOutHandler,
  roleChangeHandler,
} from "@/app/_services/user.service";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const roleIconMapper = {
  GUEST: null,
  MODERATOR: <ShieldCheck className="size-6 ml-2 text-indigo-500" />,
  ADMIN: <ShieldAlert className="size-6 ml-2 text-rose-500" />,
};

type MemberModelProps = {};
const MemberModel: FC<MemberModelProps> = (): JSX.Element => {
  const { type, isOpen, onClose, data, onOpen } = useModalStore();
  const [copied, setCopied] = useState<boolean>(false);
  const router = useRouter();
  const appLoader = useAPPLoader();
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const isModalOpen = isOpen && type === "members";
  const { workspace } = data;

  const handleClose = () => {
    if (loadingId) return;
    onClose();
  };
  const onRoleChange = async ({
    memberId,
    role,
  }: {
    memberId: string;
    role: MemberRole;
  }) => {
    try {
      setLoadingId(memberId);
      //   appLoader.startLoader();
      await roleChangeHandler({
        memberId,
        role,
        workspaceId: workspace?.id ?? "",
        successCallback: (successData: any) => {
          setLoadingId(null);
          router.refresh();
          onOpen("members", { workspace: successData?.workspace });
        },
        errorCallback: () => {
          setLoadingId(null);
          toast.error("Something went wrong");
        },
        finallyCallback: () => {
          setLoadingId(null);
          //   appLoader.stopLoader();
        },
      });
    } catch (error) {
      setLoadingId(null);
      toast.error("Something went wrong");
    } finally {
      setLoadingId(null);
      //   appLoader.stopLoader();
    }
  };

  const onKickChange = async (memberId: string) => {
    try {
      setLoadingId(memberId);
      //   appLoader.startLoader();
      await kickOutHandler({
        memberId,
        workspaceId: workspace?.id ?? "",
        successCallback: (successData: any) => {
          router.refresh();
          if (successData?.workspace) {
            onOpen("members", { workspace: successData?.workspace });
          }
        },
        errorCallback: () => {
          toast.error("Something went wrong");
        },
        finallyCallback: () => {
          setLoadingId(null);
          //   appLoader.stopLoader();
        },
      });
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoadingId(null);
      //   appLoader.stopLoader();
    }
  };

  return (
    <Dialog onOpenChange={handleClose} open={isModalOpen}>
      <DialogContent className="sm:max-w-[625px] dark:bg-neutral-800  bg-white dark:text-black">
        <Typography className=" text-3xl dark:text-white/85 text-center">
          Manage members
        </Typography>
        <div className="text-center pt-[1px] dark:text-white  text-zinc-500">
          {workspace?.members?.length} members
        </div>
        <div>
          <ScrollArea className="mt-4 max-h-[420px] pr-2">
            {workspace?.members.map((member) => (
              <div
                key={member.id}
                className="flex items-center py-2 gap-x-2 mb-4 border-b border-zinc-100 dark:border-zinc-700"
              >
                <div className="w-10 h-10 rounded-full overflow-hidden relative cursor-pointer">
                  <Image
                    fill
                    src={member?.user?.image || "/avatar.png"}
                    alt="user"
                  />
                </div>
                <div className="flex flex-col gap-y-1">
                  <div className="text-xs font-semibold flex items-center dark:text-white/85">
                    {member.user?.name}
                    {roleIconMapper[member?.role]}
                  </div>
                  <p className="text-xs text-white/85 text-zinc-500">
                    {member?.user?.email}
                  </p>
                </div>
                {workspace?.userId !== member?.userId &&
                loadingId !== member?.id ? (
                  <div className="ml-auto">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <MoreVertical className="size-5 text-zinc-500 cursor-pointer" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent side="left">
                        <DropdownMenuSub>
                          <DropdownMenuSubTrigger className="flex items-center">
                            <ShieldQuestion className="size-5 mr-2" />
                            <span>Role</span>
                          </DropdownMenuSubTrigger>
                          <DropdownMenuPortal>
                            <DropdownMenuSubContent>
                              <DropdownMenuItem
                                onClick={() =>
                                  onRoleChange({
                                    memberId: member.id,
                                    role: MemberRole.GUEST,
                                  })
                                }
                              >
                                <Shield className="size-5 mr-2" />
                                Guest
                                {member?.role === MemberRole.GUEST ? (
                                  <Check className="size-5 ml-auto text-indigo-500" />
                                ) : (
                                  <></>
                                )}
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  onRoleChange({
                                    memberId: member.id,
                                    role: MemberRole.MODERATOR,
                                  })
                                }
                              >
                                <Shield className="size-5 mr-2" />
                                Moderator
                                {member?.role === MemberRole.MODERATOR ? (
                                  <ShieldCheck className="size-5 ml-auto text-indigo-500" />
                                ) : (
                                  <></>
                                )}
                              </DropdownMenuItem>
                            </DropdownMenuSubContent>
                          </DropdownMenuPortal>
                        </DropdownMenuSub>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => onKickChange(member.id)}
                        >
                          <Gavel className="size-5 mr-2" />
                          Kick
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                ) : (
                  <></>
                )}
                {loadingId === member?.id ? (
                  <Loader2 className="ml-auto animate-spin text-zinc-500 size-5" />
                ) : (
                  <></>
                )}
              </div>
            ))}
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MemberModel;
