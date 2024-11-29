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
import { MoveLeft, MoveRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { createWorkSpaceAction } from "@/app/serverActions/createWorkSpace.serverAction";
import toast from "react-hot-toast";
import slugify from "slugify";
import { useAPPLoader } from "@/store/useAPPLoader";
import { editWorkSpaceAction } from "@/app/serverActions/editServer.serverAction";

type EditWorkspaceModalProps = {};
const EditWorkspaceModal: FC<EditWorkspaceModalProps> = (): JSX.Element => {
  const { type, isOpen, onClose, data } = useModalStore();
  const appLoader = useAPPLoader();

  const [stepCounter, setStepCounter] = useState<number>(1);
  const router = useRouter();
  const isModalOpen = isOpen && type === "editWorkspace";
  const formHandler = useForm({
    resolver: zodResolver(CreateServerformSchema),
    defaultValues: {
      name: "",
      imageUrl: "",
    },
  });

  const handleClose = async () => {
    onClose();
    formHandler.reset();
    setStepCounter(1);
  };
  const onSubmitHandler = async (
    values: zod.infer<typeof CreateServerformSchema>
  ) => {
    console.log(values);

    try {
      appLoader.startLoader();
      const response = await editWorkSpaceAction({
        name: values.name,
        image_url: values.imageUrl ?? "",
        workspaceId: data?.workspace?.id || "",
      });
      console.log("response >>>>>>>>>>>>>>>>> ", response);
      handleClose();

      if (response?.success && response?.workspace) {
        toast.success("Workspace updated successfully");
        router.replace(`/workspace/${response.workspace.id}`);
        router.refresh();
      } else {
        toast.error(`${response?.message || "Error creating workspace"}`);
      }
    } catch (error) {
      console.log("error: ", error);
      // Handle the error here
      console.error("Error creating workspace:", error);
      appLoader.stopLoader();
      toast.error("Error creating workspace");
    } finally {
      appLoader.stopLoader();
    }
  };

  useEffect(() => {
    if (!isModalOpen) setStepCounter(1);
  }, [stepCounter]);
  useEffect(() => {
    if (data?.workspace) {
      formHandler.setValue("name", data.workspace.name);
      formHandler.setValue("imageUrl", data.workspace?.avatar || "");
    }
  }, [data.workspace]);

  return (
    <Dialog onOpenChange={handleClose} open={isModalOpen}>
      <DialogContent className="sm:max-w-[525px]">
        <Typography className=" text-3xl">
          What is the name of your company or team?
        </Typography>
        <Typography className=" text-neutral-400" component={"p"}>
          This will be the name of your Devdutt workspace - Choose something
          that will recognize.
        </Typography>
        <div>
          <Form {...formHandler}>
            <div className="space-y-4">
              {stepCounter === 1 ? (
                <FormField
                  control={formHandler.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Workspace name</FormLabel>
                      <FormControl>
                        <Input placeholder="shadcn" {...field} />
                      </FormControl>
                      <FormDescription>
                        This is your public display name.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ) : (
                <fieldset className="mt-4 flex flex-col space-y-4 gap-y-5 ">
                  <div className="w-full flex items-center justify-center">
                    <div className="h-[100px] w-[100px] rounded-full bg-neutral-200 relative overflow-hidden">
                      <Image
                        src={
                          formHandler.watch("imageUrl") || "/groupImagedark.png"
                        }
                        fill
                        alt="logo"
                      />
                    </div>
                  </div>
                  <div>
                    <div>
                      <FileUpload
                        endpoint="serverImage"
                        noPreview
                        btnText="Change avatar"
                        value={formHandler.watch("imageUrl")}
                        onChange={(res: any) => {
                          console.log("res", res);
                          formHandler.setValue("imageUrl", res);
                        }}
                        isLoading={false}
                      />
                    </div>
                  </div>
                </fieldset>
              )}
              <div
                className={cn(
                  "flex items-center justify-between",
                  stepCounter === 1 && "justify-end"
                )}
              >
                {stepCounter === 2 ? (
                  <Button
                    variant={"outline"}
                    type="button"
                    onClick={() => setStepCounter(1)}
                  >
                    <MoveLeft className="size-5" />
                    <span className="ml-2">Prev</span>
                  </Button>
                ) : (
                  <></>
                )}
                {stepCounter === 2 ? (
                  <Button
                    type="submit"
                    disabled={appLoader.loading}
                    onClick={formHandler.handleSubmit(onSubmitHandler)}
                  >
                    Submit
                  </Button>
                ) : (
                  <Button
                    variant={"outline"}
                    onClick={() => setStepCounter(2)}
                    disabled={!formHandler.watch("name")}
                    className={cn(
                      "cursor-pointer opacity-100",
                      !formHandler.watch("name") &&
                        "cursor-not-allowed opacity-50"
                    )}
                    type="button"
                  >
                    <span className="mr-2">Next</span>
                    <MoveRight className="size-5" />
                  </Button>
                )}
              </div>
            </div>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditWorkspaceModal;
