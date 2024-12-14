import ChatVideoButton from "@/app/_components/ChatVideoButton";
import SocketIndicator from "@/app/_components/SocketIndicator";
import MobileToggle from "@/lib/MobileToggle";
import { Hash, Info, Menu } from "lucide-react";
import Image from "next/image";
import React, { FC } from "react";
import ViewInfoBtn from "./ViewInfoBtn";
import { ChannelType } from "@prisma/client";

type ChatHeaderProps = {
  workspaceId: string;
  name: string;
  imageURL?: string;
  type: "channel" | "conversation";
  channelType?: ChannelType;
};
const ChatHeader: FC<ChatHeaderProps> = ({
  type,
  name,
  workspaceId,
  imageURL,
  channelType,
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
      <div className="ml-auto flex items-center gap-x-3">
        {type === "channel" &&
        !!channelType &&
        channelType === ChannelType.TEXT ? (
          <ViewInfoBtn type={type} />
        ) : type === "conversation" ? (
          <ViewInfoBtn type={type} />
        ) : (
          <></>
        )}

        {type === "conversation" ? <ChatVideoButton /> : <></>}
        <SocketIndicator />
      </div>
    </div>
  );
};

export default ChatHeader;
