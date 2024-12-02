"use client";
import { useModalStore } from "@/hooks/useModalStore";
import React, { FC, Fragment, useEffect, useState } from "react";

import { Button } from "../ui/button";
import {
  DialogHeader,
  DialogFooter,
  DialogContent,
  Dialog,
  DialogDescription,
  DialogTitle,
} from "../ui/dialog";
import Image from "next/image";
import Typography from "@/lib/Typography";
import toast from "react-hot-toast";
import slugify from "slugify";
import { useAPPLoader } from "@/store/useAPPLoader";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Check, Copy, RefreshCw } from "lucide-react";
import useOriginHandler from "@/hooks/useOriginHandler";
import { changeInviteCodeService } from "@/app/_services/workspace.service";
import { useSession } from "next-auth/react";
import { revalidatePath } from "next/cache";

type InviteMemberModalProps = {};
const InviteMemberModal: FC<InviteMemberModalProps> = (): JSX.Element => {
  const { type, isOpen, onClose, data, onOpen } = useModalStore();
  const [copied, setCopied] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const origin = useOriginHandler();
  const appLoader = useAPPLoader();
  const isModalOpen = isOpen && type === "invite";
  const { workspace } = data;
  const inviteURL = `${origin}/invite/${workspace?.invite_code}`;

  const handleClose = () => {
    onClose();
  };
  const onCopy = () => {
    navigator.clipboard.writeText(inviteURL);
    setCopied(true);
    toast.success("Copied to clipboard");
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const onNew = async () => {
    try {
      // appLoader.startLoader();
      setLoading(true);
      const response = await changeInviteCodeService({
        workspaceId: workspace?.id || "",
        loggedInUserId: data.currUser?.id || "",
      });

      if (!!response) onOpen("invite", { ...data, workspace: response });

      console.log("response   change code >>> ", response);
    } catch (error) {
      console.log("error : ", error);
    } finally {
      setLoading(false);
      // appLoader.stopLoader();
    }
  };
  useEffect(() => {
    if (!isModalOpen) setLoading(false);
  }, []);

  return (
    <Dialog onOpenChange={handleClose} open={isModalOpen}>
      <DialogContent className="sm:max-w-[625px] dark:bg-neutral-800  bg-white dark:text-black">
        <Typography className=" text-3xl dark:text-white/85">
          Invite a member
        </Typography>
        <div className="p-2">
          <Label className="uppercase text-xs font-bold dark:text-white  text-zinc-500  ">
            Workspace invite link
          </Label>
          <div className="flex items-center mt-2 gap-x-2">
            <Input
              className="bg-zinc-300/50 dark:bg-zinc-700 border-0 focus-visible:ring-0 font-semibold text-black dark:text-white/95 focus-visible:ring-offset-0 "
              value={inviteURL}
              disabled={appLoader.loading}
              readOnly
            />
            <Button
              size="icon"
              onClick={onCopy}
              disabled={appLoader.loading}
              className=" dark:bg-zinc-700"
            >
              {copied ? (
                <Check className="size-4 dark:text-white" />
              ) : (
                <Copy className="size-4 dark:text-white" />
              )}
            </Button>
          </div>
          <div className="flex items-center justify-end">
            <Button
              variant={"link"}
              disabled={appLoader.loading}
              onClick={onNew}
              size="sm"
              className="text-xs text-zinc-500  dark:text-white/85 mt-4d"
            >
              Generate a new link
              <RefreshCw
                className={`size-4 ml-2 ${loading ? `animate-spin` : ``}`}
              />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InviteMemberModal;
