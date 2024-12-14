"use client";
import ActionTooltip from "@/app/_components/ActionTooltip";
import { Info } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import React, { FC } from "react";
type ViewInfoBtnProps = {
  type: "channel" | "conversation";
};
const ViewInfoBtn: FC<ViewInfoBtnProps> = ({ type }): JSX.Element => {
  const pathName = usePathname();
  const route = useRouter();
  const clickHandler = () => {
    route.push(`${pathName}/info`);
  };
  return (
    <ActionTooltip
      align="center"
      label={
        type === "conversation" ? "View Conversation Info" : "View Channel Info"
      }
    >
      <Info
        onClick={clickHandler}
        className="w-5 mt-1 h-5  dark:text-zinc-400 cursor-pointer text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
      />
    </ActionTooltip>
  );
};

export default ViewInfoBtn;
