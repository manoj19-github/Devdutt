"use client";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import {
  RegisterSchema,
  UpdateProfileSchema,
} from "@/validationSchema/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn, signOut, useSession } from "next-auth/react";
import React, { FC, useEffect, useState, useRef } from "react";
import { AlertTriangle } from "lucide-react";
import { useForm } from "react-hook-form";
import FileUpload from "../../lib/FileUpload";
import { useAPPLoader } from "@/store/useAPPLoader";
import toast from "react-hot-toast";
import * as zod from "zod";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { updateOwnUserDetailsServerAction } from "../serverActions/auth.serverAction";

type UserInfoSetupProps = {};
const UserInfoSetup: FC<UserInfoSetupProps> = (): JSX.Element => {
  const session = useSession();
  const [apiLoading, setApiLoading] = useState<boolean>(false);
  const { message, loading, startLoader, stopLoader } = useAPPLoader();

  const FormHandler = useForm({
    resolver: zodResolver(UpdateProfileSchema),
    defaultValues: {
      name: "",
      image: "",
      email: "",
    },
  });
  console.log("image >>>>>>>>>> ffffffffffff", FormHandler.watch("image"));

  const isLoading = FormHandler.formState.isSubmitting;
  useEffect(() => {
    if (!!session && session.data && session.data.user.email)
      FormHandler.setValue("email", session.data.user.email);
    if (!!session && session.data && session.data.user.name)
      FormHandler.setValue("name", session.data.user.name);
    if (!!session && session.data && session.data.user.image)
      FormHandler.setValue("image", session.data.user.image);
  }, [session]);
  const onSubmit = async (values: zod.infer<typeof UpdateProfileSchema>) => {
    try {
      startLoader();
      await updateOwnUserDetailsServerAction(values);

      await signIn("credentials", {
        email: values.email,
        redirectTo: "/",
      });
      stopLoader();
    } catch (error) {
      console.log("error >>> ", error);
    }
  };
  const fileInputRef = useRef<any>();

  const fileCursorClearance = () => {
    if (fileInputRef && fileInputRef.current) {
      fileInputRef.current.value = null;
    }
  };
  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <div className="lg:py-20 py-10 lg:w-[50vw] w-[70%] h-auto  ">
        <Form {...FormHandler}>
          <form
            onSubmit={FormHandler.handleSubmit(onSubmit)}
            className="!py-5 !mt-5 space-y-8"
          >
            <div className="px-6 !py-8 !space-y-8  my-5">
              <div className="lg:w-[100px] lg:h-[100px] h-[65px] w-[65px] rounded-full overflow-hidden mx-auto relative">
                <Image
                  src={FormHandler.watch("image") || "/bglightavatar.png"}
                  fill
                  alt="avatar"
                  className="dark:hidden"
                />
                <Image
                  src={FormHandler.watch("image") || "/bgdarkavatar.png"}
                  fill
                  alt="avatar"
                  className="hidden dark:block"
                />
              </div>
              {/* <div className="flex items-center space-x-4 !text-gray-800 ml-3 justify-center">
                <AlertTriangle className="w-4 h-4 mr-3 !text-gray-800" />{" "}
                <span className="!text-gray-800 text-sm ml-3 px-2">
                  {" "}
                  Please provide png or jpg type server profile image{" "}
                </span>
              </div> */}
              <div className=" items-center justify-center  text-center  ">
                <FormField
                  control={FormHandler.control}
                  name="image"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <FileUpload
                          endpoint="serverImage"
                          noPreview
                          value={field.value}
                          onChange={(res) => {
                            console.log("res", res);
                            field.onChange(res);
                          }}
                          isLoading={apiLoading || isLoading}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex items-center justify-center ">
                <FormField
                  control={FormHandler.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className=" lg:w-[340px] ">
                      <FormLabel className="text-left">Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="JohnDoe@gmail.com"
                          {...field}
                          className="w-full"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex items-center justify-center ">
                <div className="lg:w-[340px]">
                  <Button type="submit" className="w-full">
                    Submit
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default UserInfoSetup;
