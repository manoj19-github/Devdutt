"use client";
import { v4 as uuid } from "uuid";
import { CreateServerformSchema } from "@/formSchema/createServer.formSchema";
import { useModalStore } from "@/hooks/useModalStore";
import { zodResolver } from "@hookform/resolvers/zod";

import { Label } from "@radix-ui/react-label";
import { useRouter } from "next/navigation";

import React, { FC, Fragment, useEffect, useState } from "react";
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
import Image from "next/image";
import Typography from "@/lib/Typography";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "../ui/form";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from "../ui/Select";
import { Input } from "../ui/input";
import * as zod from "zod";
import FileUpload from "@/lib/FileUpload";
import { MoveLeft, MoveRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { createWorkSpaceAction } from "@/app/serverActions/createWorkSpace.serverAction";
import toast from "react-hot-toast";
import slugify from "slugify";
import { useAPPLoader } from "@/store/useAPPLoader";
import { CreateChannelFormSchema } from "@/formSchema/createChannel.formSchema";
import { ChannelType } from "@prisma/client";
import { createChannelServerAction } from "@/app/serverActions/createChannel.serverAction";
import { updateChannelServerAction } from "@/app/serverActions/updateChannel.serverAction";

type EditChannelModalProps = {};
const EditChannelModal: FC<EditChannelModalProps> = (): JSX.Element => {
  const { type, isOpen, onClose, data, onOpen } = useModalStore();
  console.log("data:  56", data);
  const appLoader = useAPPLoader();

  const router = useRouter();
  const isModalOpen = isOpen && type === "editChannel";
  const formHandler = useForm({
    resolver: zodResolver(CreateChannelFormSchema),
    defaultValues: {
      name: "",
      type: ChannelType.TEXT,
    },
  });

  console.log("channel type >>>>>>>>>>>>> ", formHandler.watch("type"));

  const handleClose = () => {
    onClose();
    formHandler.reset();
  };
  const onSubmitHandler = async (
    values: zod.infer<typeof CreateChannelFormSchema>
  ) => {
    console.log(values);

    try {
      appLoader.startLoader();
      const response = await updateChannelServerAction({
        name: values.name,
        channelType: values.type as ChannelType,
        workspaceId: data.workspace?.id ?? "",
        channelId: data.channel?.id ?? "",
      });
      console.log("response: create channel ", response);
      router.refresh();
      if (response && response?.success && response?.workspace)
        onOpen("createChannel", {
          workspace: response.workspace,
        });
      onClose();
      response?.success
        ? toast.success(response.message)
        : toast.error(response?.message);
    } catch (error) {
      console.log(error);
    } finally {
      appLoader.stopLoader();
    }

    // try {
    //   const slug = slugify(values.name);
    //   const invite_code = uuid();
    //   appLoader.startLoader();
    //   const response = await createWorkSpaceAction({
    //     name: values.name,
    //     slug,
    //     invite_code,
    //   });
    //   console.log("response >>>>>>>>>>>>>>>>> ", response);
    //   handleClose();

    //   if (response?.success && response?.workspace) {
    //     toast.success("Workspace created successfully");
    //     router.replace(`/workspace/${response.workspace.id}`);
    //   } else {
    //     toast.error(`${response?.message || "Error creating workspace"}`);
    //   }
    // } catch (error) {
    //   console.log("error: ", error);
    //   // Handle the error here
    //   console.error("Error creating workspace:", error);
    //   appLoader.stopLoader();
    //   toast.error("Error creating workspace");
    // } finally {
    //   appLoader.stopLoader();
    // }
  };
  useEffect(() => {
    if (data?.channel && isModalOpen) {
      formHandler.setValue("name", data.channel.name);
      formHandler.setValue("type", data.channel.type as any);
    }
  }, [data, isModalOpen]);
  return (
    <Dialog onOpenChange={handleClose} open={isModalOpen}>
      <DialogContent className="sm:max-w-[525px]">
        <Typography className=" text-3xl">Edit Channel</Typography>

        <div>
          <Form {...formHandler}>
            <div className="space-y-4">
              <FormField
                control={formHandler.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Channel name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter channel name" {...field} />
                    </FormControl>
                    <FormDescription>
                      Channel name cannot be &apos;general&apos;
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={formHandler.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Channel type</FormLabel>
                    <Select
                      defaultValue={data?.channel?.type || ChannelType.TEXT}
                      disabled={appLoader.loading}
                      onValueChange={(value) => {
                        field.onChange(value);
                      }}
                    >
                      <FormControl>
                        <SelectTrigger className=" border border-white/20 focus:ring-0 text-white/55 ring-offset-0 focus:ring-offset-0 capitalize outline-none  ">
                          <SelectValue placeholder="Select Channel Type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.values(ChannelType).map((type) => (
                          <SelectItem
                            value={type}
                            key={type}
                            className="capitalize"
                          >
                            {type?.toLowerCase()}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className={cn("flex items-center justify-end")}>
                <Button
                  type="submit"
                  className="bg-transparent dark:text-white border border-white/20 hover:bg-transparent"
                  onClick={formHandler.handleSubmit(onSubmitHandler)}
                >
                  Submit
                </Button>
              </div>
            </div>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditChannelModal;
