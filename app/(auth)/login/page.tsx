import React, { FC } from "react";
import "../../globals.css";
import LoginForm from "./_components/LoginForm";
import PageLoader from "@/components/PageLoader";
type LoginMainProps = {};
const LoginMain: FC<LoginMainProps> = (): JSX.Element => {
  return (
    <div className="min-h-screen p-2 grid text-center place-content-center text-center">
      <PageLoader />
      <div className="max-w-[800px]">
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginMain;
