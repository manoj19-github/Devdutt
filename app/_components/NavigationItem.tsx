"use client";
import Image from "next/image";
import React, { FC } from "react";
import { useParams, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import ActionTooltip from "./ActionTooltip";

type NavigationItemProps = {
  id: string;
  imageUrl: string | null;
  name: string;
};
const NavigationItem: FC<NavigationItemProps> = ({
  id,
  imageUrl,
  name,
}): JSX.Element => {
  const router = useRouter();
  const { workspaceId }: any = useParams();
  const clickHandler = () => {
    router.push(`/workspace/${id}`);
  };
  return (
    <ActionTooltip side="right" align="center" label={name}>
      <button
        className="group relative flex items-center"
        onClick={clickHandler}
      >
        <div
          className={cn(
            "absolute left-0 bg-primary rounded-r-full transition-all w-[4px] ",
            workspaceId !== id && "group-hover:h-[20px]",
            workspaceId === id ? "h-[36px]" : "h-[9px]"
          )}
        />
        <div
          className={cn(
            "relative group flex ml-2 mr-2 h-[43px] w-[43px] rounded-[24px] group-hover:rounded-[16px] transition-all overflow-auto",
            workspaceId === id && "bg-primary/10 text-primary rounded-[16px]"
          )}
        >
          <Image src={imageUrl || "/team.png"} alt={name} fill />
        </div>
      </button>
    </ActionTooltip>
  );
};
export default NavigationItem;
