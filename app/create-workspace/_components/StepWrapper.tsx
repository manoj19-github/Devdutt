"use client";
import { useCreateWorkSpaceValues } from "@/store/useCreateWorkSpaceValues";
import React, { FC } from "react";
import CreateWorkspaceStep1 from "./CreateWorkspaceStep1";
import CreateWorkspaceStep2 from "./CreateWorkspaceStep2";

type StepWrapperProps = {};
const StepWrapper: FC<StepWrapperProps> = (): JSX.Element => {
  const createWorkStepValues = useCreateWorkSpaceValues();
  switch (createWorkStepValues.currStep) {
    case 1:
      return <CreateWorkspaceStep1 />;
    case 2:
      return <CreateWorkspaceStep2 />;
    //     break;
    //   case 3:
    //     // return <CreateWorkspaceStep3 />
    //     break;
    //   case 4:
    //     // return <CreateWorkspaceStep4 />
    //     break;
    //   case 5:
    //     // return <CreateWorkspaceStep5 />
    //     break;
    default:
      return <></>;
  }
};

export default StepWrapper;
