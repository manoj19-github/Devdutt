"use client";
import { CreateServerformSchema } from "@/formSchema/createServer.formSchema";
import { useModalStore } from "@/hooks/useModalStore";
import { zodResolver } from "@hookform/resolvers/zod";

import { Label } from "@radix-ui/react-label";
import { useRouter } from "next/navigation";
import { Input } from "postcss";
import React, { FC } from "react";
import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import {
  DialogHeader,
  DialogFooter,
  DialogContent,
  Dialog,
  DialogDescription,
  DialogTitle,
} from "../ui/dialog";

type CreateServerModalProps = {};
const CreateServerModal: FC<CreateServerModalProps> = (): JSX.Element => {
  const { type, isOpen, onClose } = useModalStore();
  const router = useRouter();
  const isModalOpen = isOpen && type === "createServer";
  const formHandler = useForm({
    resolver: zodResolver(CreateServerformSchema),
    defaultValues: {
      name: "",
      imageUrl: "",
    },
  });

  const handleClose = () => {
    onClose();
    formHandler.reset();
  };

  return (
    <Dialog>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="">create server</div>
        <DialogFooter>
          <Button type="submit">Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateServerModal;
