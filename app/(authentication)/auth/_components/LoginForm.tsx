"use client";
import { Button } from "@/components/ui/button";
import Typography from "@/lib/Typography";
import React, { FC, Fragment } from "react";
import { FcGoogle } from "react-icons/fc";
import { RxGithubLogo } from "react-icons/rx";
import Image from "next/image";
import FormSection from "./FormSection";
import { VscAccount } from "react-icons/vsc";
import { useAPPLoader } from "@/store/useAPPLoader";
import { Provider } from "@supabase/supabase-js";
import toast from "react-hot-toast";
import { signIn } from "next-auth/react";
import { DEFAULT_LOGIN_REDIRECT } from "@/environment";
import { SocialSignAction } from "@/app/serverActions/auth.serverAction";

type LoginFormProps = {};
const LoginForm: FC<LoginFormProps> = (): JSX.Element => {
  const { startLoader, stopLoader } = useAPPLoader();
  const socialAuth = async (provider: string) => {
    startLoader();
    SocialSignAction(provider);
    stopLoader();
  };
  const credentialsLogin = async (email: string) => {
    startLoader();
    await signIn("credentials", {
      email,
      redirectTo: "/",
    });
    stopLoader();
  };
  return (
    <Fragment>
      <div className="flex justify-center items-center gap-4 mb-4 ">
        <div className="relative w-[100px] h-[100px] ">
          <Image
            src={"/light_logo.png"}
            className="hidden dark:block"
            alt="logo"
            objectFit="cover"
            fill
          />
          <Image
            src={"/dark_logo.png"}
            className="block dark:hidden"
            alt="logo"
            objectFit="cover"
            fill
          />
        </div>
        <Typography component={"h3"} className="lg:!font-[800] lg:text-3xl">
          DevDutt
        </Typography>
      </div>
      <div>
        <Typography component={"h2"} className="lg:text-4xl lg:font-[700]">
          Sign in to your DevDutt
        </Typography>
        <Typography component={"p"} className="mt-2 opacity-80">
          We suggest using the email address that you use at work
        </Typography>
        <div className="flex flex-col space-y-4 mt-4">
          <Button
            variant={"outline"}
            className="py-5 border-2 flex space-x-4"
            onClick={() => socialAuth("google")}
          >
            <FcGoogle size={25} />
            <Typography className="text-xl" component={"p"}>
              Sign in with Google
            </Typography>
          </Button>
          <Button
            variant={"outline"}
            className="py-5 border-2 flex space-x-4"
            onClick={() => socialAuth("github")}
          >
            <RxGithubLogo size={25} />
            <Typography className="text-xl" component={"p"}>
              Sign in with Github
            </Typography>
          </Button>
          <Button variant={"outline"} className="py-5 border-2 flex space-x-4">
            <VscAccount size={25} />
            <Typography
              className="text-xl"
              component={"p"}
              onClick={() => credentialsLogin("santramanoj1997@gmail.com")}
            >
              Sign in with Test1 User
            </Typography>
          </Button>
          <Button
            variant={"outline"}
            className="py-5 border-2 flex space-x-4"
            onClick={() => credentialsLogin("santramanoj201@gmail.com")}
          >
            <VscAccount size={25} />
            <Typography className="text-xl" component={"p"}>
              Sign in with Test2 User
            </Typography>
          </Button>
        </div>
        <div className="lg:mt-4 mt-2">
          <div className="flex items-center my-2 lg:my-5">
            <div className="mr-[15px] flex-1 border-t bg-neutral-300" />
            <Typography component={"p"}>OR</Typography>
            <div className="ml-[15px] flex-1 border-t bg-neutral-300" />
          </div>
          {/* Login Form Start */}
          <FormSection />
          {/* Login Form End */}
        </div>
      </div>
    </Fragment>
  );
};

export default LoginForm;
