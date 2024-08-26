"use client";
import { checkVerificationToken } from "@/app/_services/auth.service";
import Typography from "@/lib/Typography";
import { useAPPLoader } from "@/store/useAPPLoader";
import { log } from "console";
import { signIn, useSession } from "next-auth/react";
import { redirect, useParams } from "next/navigation";
import React, { FC, useEffect, useState } from "react";
type UserInfoProps = {};
const UserInfo: FC<UserInfoProps> = ({}): JSX.Element => {
  const params: any = useParams();
  console.log("params: ", params);
  let response: any;
  const session = useSession();
  console.log("session: ", session?.data);
  const { startLoader, stopLoader } = useAPPLoader();
  const [responseData, setResponseData] = useState<any>(null);
  useEffect(() => {
    console.log("use effect alled ");

    if (params && params.id) {
      console.log("params2: ", params);
      checkVerificationToken(params.id).then((res) => {
        console.log("res: ", res);
        setResponseData(res);
      });
    }
  }, [params]);
  console.log("response >>>>>>>>>>> ", responseData);
  useEffect(() => {
    (async () => {
      if (
        responseData &&
        responseData?.verificationDetails &&
        responseData.verificationDetails.email &&
        !session?.data
      ) {
        console.log("hit signin");

        await signIn("credentials", {
          email: responseData.verificationDetails.email,
          redirectTo: "/",
        });
      }
    })();
  }, [responseData]);

  useEffect(() => {
    if (session && !!session?.data) {
      redirect("/");
    }
  }, [session]);

  return (
    <div className="w-screen h-screen  fixed top-0 left-0 bottom-0 right-0 z-[999]">
      <div className="absolute p-2 top-[45%] left-[45%] ">
        <div className="w-[90px] h-[90px] rounded-full border-4 border-black dark:border-white border-t-transparent animate-spin"></div>
        <div className="w-[69px] h-[69px] rounded-full  border-4 border-black dark:border-white border-b-transparent absolute top-[18%] left-[18%] animate-t-spin " />
        <div className="w-[50px] h-[50px] rounded-full  border-4 border-white border-b-transparent absolute top-[27%] left-[28%] animate-spin " />
      </div>
      <div className="absolute top-[60%] flex justify-center items-center w-full">
        <Typography
          component={"h1"}
          className="text-4xl dark:text-white text-black"
        >
          Loading Please Wait ....
        </Typography>
      </div>
    </div>
  );
};

export default UserInfo;
