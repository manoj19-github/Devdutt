"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Typography from "@/lib/Typography";
import { useCreateWorkSpaceValues } from "@/store/useCreateWorkSpaceValues";
import React, { FC, Fragment } from "react";

type CreateWorkspaceStep1Props = {};
const CreateWorkspaceStep1: FC<CreateWorkspaceStep1Props> = (): JSX.Element => {
  const createWorkStepValues = useCreateWorkSpaceValues();
  return (
    <Fragment>
      <Typography className="my-3 text-3xl">
        What is the name of your company or team?
      </Typography>
      <Typography className="my-3 text-neutral-300" component={"p"}>
        This will be the name of your Devdutt workspace - Choose something that
        will recognize.
      </Typography>
      <form className="mt-4">
        <fieldset>
          <Input
            className="bg-neutral-700 text-white border-neutral-600 "
            type="text"
            value={createWorkStepValues.name}
            placeholder="Enter your workspace name (minimum 3 characters)"
            onChange={(event) =>
              createWorkStepValues.updateName(event.target.value)
            }
          />
          <Button
            type="button"
            className="bg-blue-500 hover:bg-blue-600 mt-4"
            onClick={() => createWorkStepValues.setCurrStep(2)}
            disabled={
              !createWorkStepValues.name ||
              createWorkStepValues.name.trim().length < 3
            }
          >
            <Typography component={"p"}>Next</Typography>
          </Button>
        </fieldset>
      </form>
    </Fragment>
  );
};

export default CreateWorkspaceStep1;
