import MobileToggle from "@/lib/MobileToggle";
import { Hash, Menu } from "lucide-react";
import React, { FC } from "react";

type ChatHeaderProps = {
  workspaceId: string;
  name: string;
  type: "channel" | "conversation";
};
const ChatHeader: FC<ChatHeaderProps> = ({
  type,
  name,
  workspaceId,
}): JSX.Element => {
  return (
    <div className="text-md font-semibold px-3 flex items-center h-12 border-neutral-200 dark:border-neutral-800 border-b-2">
      <MobileToggle workspaceId={workspaceId} />
      {type === "channel" ? (
        <Hash className="size-5 text-zinc-500 mx-2 dark:text-zinc-400" />
      ) : (
        <></>
      )}
      <p className="font-semibold text-md text-black dark:text-white ">
        {name}
      </p>
    </div>
  );
};

export default ChatHeader;
