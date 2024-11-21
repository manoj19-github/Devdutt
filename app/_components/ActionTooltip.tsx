"use client";

import React, { FC, ReactNode } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
type ActionTooltipProps = {
  label: string;
  children: ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  align: "start" | "center" | "end";
};
const ActionTooltip: FC<ActionTooltipProps> = ({
  label,
  children,
  align,
  side = "top",
}): JSX.Element => {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={100}>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent side={side} align={align}>
          <p className="font-semibold text-sm capitalize">
            {label.toLowerCase()}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default ActionTooltip;
