import MobileToggle from "@/lib/MobileToggle";
import { Hash, Menu } from "lucide-react";
import Image from "next/image";
import React, { FC } from "react";

type ChatHeaderProps = {
  workspaceId: string;
  name: string;
  imageURL?: string;
  type: "channel" | "conversation";
};
const ChatHeader: FC<ChatHeaderProps> = ({
  type,
  name,
  workspaceId,
  imageURL,
}): JSX.Element => {
  return (
    <div className="text-md font-semibold px-3 flex items-center h-12 border-neutral-200 dark:border-neutral-800 border-b-2">
      <MobileToggle workspaceId={workspaceId} />
      {type === "channel" ? (
        <Hash className="size-5 text-zinc-500 mx-2 dark:text-zinc-400" />
      ) : (
        <></>
      )}
      {type === "conversation" && !!imageURL ? (
        <div className="relative size-8 object-cover rounded-full overflow-hidden mx-2">
          <Image src={imageURL} alt="profile" fill />
        </div>
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
