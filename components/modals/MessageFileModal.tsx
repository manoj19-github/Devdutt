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
import { Input } from "../ui/input";
import * as zod from "zod";
import FileUpload from "@/lib/FileUpload";
import {
  CloudUpload,
  FileIcon,
  Loader2,
  MoveLeft,
  MoveRight,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

import { useAPPLoader } from "@/store/useAPPLoader";
import { attachMessageFileFormSchema } from "@/formSchema/attachMessageFile.formSchema";
import {
  sendAttachmentHandler,
  sendMessageHandler,
} from "@/app/_services/chat.service";

type MessageFileModalProps = {};
const MessageFileModal: FC<MessageFileModalProps> = (): JSX.Element => {
  const { type, isOpen, onClose, data } = useModalStore();
  const appLoader = useAPPLoader();

  const router = useRouter();
  const isModalOpen = isOpen && type === "messageFile";
  const formHandler = useForm({
    resolver: zodResolver(attachMessageFileFormSchema),
    defaultValues: {
      imageUrl: "",
    },
  });

  const handleClose = async () => {
    onClose();
    formHandler.reset();
    router.refresh();
  };
  const onSubmitHandler = async (
    values: zod.infer<typeof attachMessageFileFormSchema>
  ) => {
    console.log(values);

    try {
      appLoader.startLoader();
      sendMessageHandler({
        loggedInUserDetails: data.loggedInUserDetails,
        query: data.query,
        apiUrl: data.apiUrl,
        content: values.imageUrl,
        successCallback: () => {
          toast.success("File sent successfully");
          handleClose();
        },
        errorCallback: () => {
          toast.error("Error sending file");
        },
        finallyCallback: () => {
          //   appLoader.stopLoader();
        },
      });
    } catch (error) {
      console.log("error: ", error);
      // Handle the error here
      console.error("Error creating workspace:", error);
      appLoader.stopLoader();
      toast.error("Error sending attachment");
    } finally {
      appLoader.stopLoader();
    }
  };

  useEffect(() => {
    if (!isModalOpen) {
      formHandler.reset();
      router.refresh();
    }
  }, []);

  return (
    <Dialog onOpenChange={handleClose} open={isModalOpen}>
      <DialogContent className="sm:max-w-[525px]">
        <Typography className=" text-3xl">
          Add an attachment to your message
        </Typography>
        <Typography className=" text-neutral-400 text-center" component={"p"}>
          Send a file as a message attachment.
        </Typography>
        <div>
          <Form {...formHandler}>
            <div className="space-y-4">
              <fieldset className="mt-4 flex flex-col space-y-4 gap-y-5 ">
                <div className="w-full flex items-center justify-center">
                  {formHandler.watch("imageUrl") &&
                  (formHandler.watch("imageUrl").endsWith(".png") ||
                    formHandler.watch("imageUrl").endsWith(".jpg") ||
                    formHandler.watch("imageUrl").endsWith(".jpeg")) ? (
                    <div className="w-auto h-auto relative">
                      <button
                        className="bg-rose-500 text-white p-1 rounded-full absolute top-0 z-[999] right-0 shadow-sm "
                        type="button"
                        onClick={() => formHandler.setValue("imageUrl", "")}
                        disabled={appLoader.loading}
                      >
                        <X className="w-3 h-3" />
                      </button>
                      <div className="h-[100px] w-[100px] rounded-full bg-neutral-200 relative overflow-hidden">
                        <Image
                          src={formHandler.watch("imageUrl")}
                          fill
                          alt="logo"
                        />
                      </div>
                    </div>
                  ) : (
                    <></>
                  )}
                  {formHandler.watch("imageUrl") &&
                  formHandler.watch("imageUrl").endsWith(".pdf") ? (
                    <div className="relative flex items-center p-1 mt-2 rounded-md bg-white/10">
                      <FileIcon className="w-16 h-16 fill-indigo-200 stroke-indigo-400" />
                      <a
                        href={formHandler.watch("imageUrl")}
                        download
                        target={"_blank"}
                        rel="noreferrer noopener"
                        className="ml-2 text-sm text-indigo-500 dark:text-indigo-400 hover:underline "
                      >
                        {formHandler.getValues("imageUrl")}
                      </a>
                      <button
                        className="bg-rose-500 text-white p-1 rounded-full absolute -top-2 -right-2 shadow-sm "
                        type="button"
                        onClick={() => formHandler.setValue("imageUrl", "")}
                        disabled={appLoader.loading}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <></>
                  )}
                  {!formHandler.watch("imageUrl") ? (
                    <CloudUpload className="w-16 h-16 text-white/80" />
                  ) : (
                    <></>
                  )}
                </div>
                <div>
                  {!appLoader.loading ? (
                    <div>
                      <FileUpload
                        endpoint="messageFile"
                        noPreview
                        btnText="Upload attachment"
                        value={formHandler.watch("imageUrl")}
                        onChange={(res: any) => {
                          console.log("res", res);
                          formHandler.setValue("imageUrl", res);
                        }}
                        isLoading={false}
                      />
                    </div>
                  ) : (
                    <></>
                  )}
                </div>
              </fieldset>

              <div className={cn("flex items-center justify-end")}>
                <Button
                  type="submit"
                  onClick={formHandler.handleSubmit(onSubmitHandler)}
                  className="gap-x-2 flex"
                >
                  <span>Send</span>
                  {appLoader.loading ? (
                    <Loader2 className="w-4 h-4 text-indigo-500 animate-spin" />
                  ) : (
                    <></>
                  )}
                </Button>
              </div>
            </div>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MessageFileModal;
