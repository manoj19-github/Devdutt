"use client";
import { useModalStore } from "@/hooks/useModalStore";
import React, { FC, Fragment, useEffect, useState } from "react";

import { Button } from "../ui/button";
import {
  DialogHeader,
  DialogFooter,
  DialogContent,
  Dialog,
} from "../ui/dialog";
import Typography from "@/lib/Typography";
import toast from "react-hot-toast";
import { Check, Copy, Loader2, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { deleteMessageService } from "@/app/_services/chat.service";

type DeleteMessageModalProps = {};
const DeleteMessageModal: FC<DeleteMessageModalProps> = (): JSX.Element => {
  const { type, isOpen, onClose, data, onOpen } = useModalStore();
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const isModalOpen = isOpen && type === "deleteMessage";
  const { apiUrl,query,loggedInUserDetails } = data;
  const handleClose = () => {
    onClose();
  };

  const handleSubmit = async () => {
    try {
    //   if (!workspace || !channel)
    //     return toast.error("workspace not found , refresh your page");
      setLoading(true);
      const response = await deleteMessageService({
        socketUrl:apiUrl??"",
        socketQuery:query??{},
        loggedInUserDetails,
        errorCallback:()=>{
            toast.error("Something went wrong")
        },
        successCallback:()=>{
            router.refresh();
            handleClose();
        },
        finallyCallback:()=>{
            setLoading(false);
        }
      })

      
      

      onClose();
    } catch (error) {
      toast.error("something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog onOpenChange={handleClose} open={isModalOpen}>
      <DialogContent className="sm:max-w-[625px] dark:bg-neutral-800  bg-white dark:text-black">
        <Typography className=" text-3xl dark:text-white/85 text-center">
          Delete Message
        </Typography>
        <div className="p-4">
          <Typography className="text-lg dark:text-white/75 text-center">
            Are you sure you want to do this <br />
            
            The message will be permanently deleted ?
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

export default DeleteMessageModal;
