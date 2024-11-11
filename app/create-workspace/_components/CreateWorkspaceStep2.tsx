"use client";
import { Button } from "@/components/ui/button";
import Typography from "@/lib/Typography";
import { useCreateWorkSpaceValues } from "@/store/useCreateWorkSpaceValues";
import { ChevronLeft } from "lucide-react";
import React, { FC, FormEventHandler, Fragment } from "react";
import Image from "next/image";
import FileUpload from "@/lib/FileUpload";
import { useAPPLoader } from "@/store/useAPPLoader";
import slugify from "slugify";
import { v4 as uuid } from "uuid";
import { useRouter } from "next/navigation";
import { createWorkSpaceAction } from "@/app/serverActions/createWorkSpace.serverAction";
import toast from "react-hot-toast";
type CreateWorkspaceStep2Props = {};
const CreateWorkspaceStep2: FC<CreateWorkspaceStep2Props> = (): JSX.Element => {
  const createWorkStepValues = useCreateWorkSpaceValues();
  const router = useRouter();
  const appLoader = useAPPLoader();
  const handleSubmit = async (event: any) => {
    try {
      event.preventDefault();
      event.stopPropagation();

      const slug = slugify(createWorkStepValues.name);
      const invite_code = uuid();
      appLoader.startLoader();
      const response = await createWorkSpaceAction({
        name: createWorkStepValues.name,
        slug,
        invite_code,
        image_url: createWorkStepValues.imageUrl,
      });
      console.log("response: ", response);
      if (response?.success && response?.workspace) {
        toast.success("Workspace created successfully");
        router.replace(`/workspace/${response.workspace.id}`);
      } else {
        toast.error(`${response?.message || "Error creating workspace"}`);
      }
    } catch (error) {
      // Handle the error here
      console.error("Error creating workspace:", error);
      appLoader.stopLoader();
      toast.error("Error creating workspace");
    } finally {
      appLoader.stopLoader();
    }
  };
  return (
    <div className="">
      <div className="flex items-center cursor-pointer group ">
        <ChevronLeft className="w-4 h-4" />
        <Typography
          component="p"
          className="group-hover:underline group-hover:underline-offset-2"
        >
          Back
        </Typography>
      </div>
      <form className="ml-2" onSubmit={handleSubmit}>
        <Typography className="my-3 text-3xl">Add workspace avatar</Typography>
        <Typography className="mt-1 text-neutral-300">
          This image can be change later in your workspace settings.
        </Typography>
        <fieldset className="mt-4 flex flex-col space-y-4 gap-y-5 ">
          <div className="w-full flex items-center justify-center">
            <div className="h-[100px] w-[100px] rounded-full bg-neutral-200 relative overflow-hidden">
              <Image
                src={createWorkStepValues.imageUrl || "/groupImagedark.png"}
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
                value={createWorkStepValues.imageUrl}
                onChange={(res: any) => {
                  console.log("res", res);
                  createWorkStepValues.updateImageUrl(res);
                }}
                isLoading={false}
              />
            </div>
          </div>
        </fieldset>
        <Button
          type="submit"
          size="sm"
          className="bg-gray-500 hover:bg-gray-600 mt-4 w-full"
          disabled={
            !createWorkStepValues.name ||
            createWorkStepValues.name.trim().length < 3
          }
        >
          <Typography component={"p"}>
            {createWorkStepValues.imageUrl ? `Submit` : `Skip for now`}
          </Typography>
        </Button>
      </form>
    </div>
  );
};

export default CreateWorkspaceStep2;
