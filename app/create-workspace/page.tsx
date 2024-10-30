import Typography from "@/lib/Typography";
import React, { FC } from "react";
import StepWrapper from "./_components/StepWrapper";
import StepTitle from "./_components/StepTitle";

type CreateWorkspaceMainProps = {};
const CreateWorkspaceMain: FC<CreateWorkspaceMainProps> = (): JSX.Element => {
  return (
    <div className="w-screen h-screen grid place-content-center bg-neutral-800 text-white">
      <div className="p-3 max-w-[550px] ">
        <StepTitle />
        <StepWrapper />
      </div>
    </div>
  );
};

export default CreateWorkspaceMain;
