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

type InviteMemberModalProps = {};
const InviteMemberModal: FC<InviteMemberModalProps> = (): JSX.Element => {
  const { type, isOpen, onClose } = useModalStore();
  const appLoader = useAPPLoader();
  const isModalOpen = isOpen && type === "invite";

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog onOpenChange={handleClose} open={isModalOpen}>
      <DialogContent className="sm:max-w-[525px] bg-white dark:text-black">
        <Typography className=" text-3xl dark:text-black">
          Invite a member
        </Typography>
        <div className="p-2">
          <Label className="uppercase text-xs font-bold  text-zinc-500 dark:text-secondary/700 ">
            Workspace invite link
          </Label>
          <div className="flex items-center mt-2 gap-x-2">
            <Input
              className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0 "
              value="invite link"
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InviteMemberModal;
