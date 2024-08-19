"use client";
import { checkVerificationToken } from "@/app/_services/auth.service";
import { log } from "console";
import { signIn, useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import React, { FC, useEffect, useState } from "react";
type UserInfoProps = {};
const UserInfo: FC<UserInfoProps> = ({}): JSX.Element => {
  const params: any = useParams();
  console.log("params: ", params);
  let response: any;
  const session = useSession();
  console.log("session: ", session?.data);
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

  // async function getLocationOrigin() {
  //   signIn("credentials", {
  //     email: "santramanoj1997@gmail.com",
  //     callbackUrl: DEFAULT_CREDENTIALS_LOGIN_REDIRECT,
  //   });
  //   // await signIn("credentials", {
  //   //   email: "santramanoj1997@gmail.com",
  //   //   redirectTo: "/",
  //   // });
  // }
  // await getLocationOrigin();

  // const signInByCredentials = async (email: string) => {
  //   "use client";
  //   await signIn("credentials", {
  //     email: email,
  //   });
  // };
  // if (
  //   response &&
  //   response.verificationDetails &&
  //   response.verificationDetails.email
  // ) {
  //   await signInByCredentials(response.verificationDetails.email);
  // }

  return <div> userinfo </div>;
};

export default UserInfo;
