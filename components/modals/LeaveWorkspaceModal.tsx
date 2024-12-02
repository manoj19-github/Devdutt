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
import { Check, Copy, Loader2, RefreshCw } from "lucide-react";
import useOriginHandler from "@/hooks/useOriginHandler";
import { changeInviteCodeService } from "@/app/_services/workspace.service";
import { useSession } from "next-auth/react";
import { revalidatePath } from "next/cache";
import { leaveWorkspaceServerAction } from "@/app/serverActions/leaveWorkspace.serverAction";
import { useRouter } from "next/navigation";

type LeaveWorkspaceModalProps = {};
const LeaveWorkspaceModal: FC<LeaveWorkspaceModalProps> = (): JSX.Element => {
  const { type, isOpen, onClose, data, onOpen } = useModalStore();
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const isModalOpen = isOpen && type === "leaveWorkspace";
  const { workspace } = data;
  const handleClose = () => {
    onClose();
  };

  const handleSubmit = async () => {
    try {
      if (!workspace)
        return toast.error("workspace not found , refresh your page");
      setLoading(true);
      const response = await leaveWorkspaceServerAction({
        workspaceId: workspace.id,
      });
      if (!response.success) return toast.error(response.message);
      if (response.workspace) {
        onOpen("leaveWorkspace", { workspace: response.workspace });
      }

      router.replace("/");
      router.refresh();

      onClose();
    } catch (error) {
      console.log("error occured >>>>> ", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog onOpenChange={handleClose} open={isModalOpen}>
      <DialogContent className="sm:max-w-[625px] dark:bg-neutral-800  bg-white dark:text-black">
        <Typography className=" text-3xl dark:text-white/85 text-center">
          Leave Workspace
        </Typography>
        <div className="p-4">
          <Typography className="text-lg dark:text-white/75 text-center">
            Are you sure you want to leave
            <span className="font-semibold  text-indigo-500 ml-2  mr-1">
              {workspace?.name}
            </span>
            ?
          </Typography>
        </div>
        <DialogFooter className=" px-3">
          <div className="flex items-center justify-end  w-full">
            <Button
              disabled={loading}
              className="bg-transparent hover:bg-black text-white mx-2 hover:border-transparent  border dark:border-white  hover:border-transparent hover:bg-indigo-500 "
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              className="bg-indigo-500 text-white border border-transparent hover:border-indigo-300 hover:bg-transparent"
              disabled={loading}
            >
              <span className="mr-2">Confirm</span>
              {loading ? <Loader2 className="animate-spin" /> : <></>}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LeaveWorkspaceModal;
