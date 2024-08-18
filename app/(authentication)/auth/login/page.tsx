import React, { FC } from "react";
import LoginForm from "../_components/LoginForm";
type LoginPageProps = {};
const LoginPage: FC<LoginPageProps> = (): JSX.Element => {
  return (
    <div className="lg:max-w-[755px] flex justify-center items-center mx-auto h-screen flex-col">
      <LoginForm />
    </div>
  );
};

export default LoginPage;
