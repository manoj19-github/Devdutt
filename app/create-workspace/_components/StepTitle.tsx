"use client";
import Typography from "@/lib/Typography";
import { useCreateWorkSpaceValues } from "@/store/useCreateWorkSpaceValues";
import React, { FC } from "react";
type StepTitleProps = {};
const StepTitle: FC<StepTitleProps> = (): JSX.Element => {
  const createWorkStepValues = useCreateWorkSpaceValues();
  return (
    <Typography className="mb-4 text-neutral-400" component={"p"}>
      Step {createWorkStepValues.currStep} of 2
    </Typography>
  );
};

export default StepTitle;
