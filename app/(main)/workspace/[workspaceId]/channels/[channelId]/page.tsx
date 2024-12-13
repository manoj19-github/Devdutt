import { auth } from "@/app/_config/auth.config";
import { getCurrentLoggedInUserServerAction } from "@/app/serverActions/auth.serverAction";
import { findChannelByIdServerAction } from "@/app/serverActions/findChannelAndMemberByIdServerAction";
import { findWorkspaceByIdServerAction } from "@/app/serverActions/findWorkspaceById";
import { redirect } from "next/navigation";
import React, { FC } from "react";
import ChatHeader from "../_components/ChatHeader";
import ChatInput from "../_components/ChatInput";
import ChatMessages from "../_components/ChatMessages";
import { ChannelType } from "@prisma/client";
import MediaRoom from "@/app/_components/MediaRoom";

type ChannelIdMainProps = {
  params: {
    workspaceId: string;
    channelId: string;
  };
};

const ChannelIdMain: FC<ChannelIdMainProps> = async ({
  params,
}): Promise<JSX.Element> => {
  const session = await auth();
  const loggedInUserDetails = await getCurrentLoggedInUserServerAction();
  if (
    !loggedInUserDetails ||
    loggedInUserDetails.user === null ||
    !session ||
    session.user === null
  )
    redirect("/auth/login");
  const channelAndMember = await findChannelByIdServerAction({
    channelId: params.channelId,
    workspaceId: params.workspaceId,
    userId: loggedInUserDetails.user.id,
  });
  if (
    !channelAndMember ||
    !channelAndMember.channel ||
    !channelAndMember.member
  )
    redirect("/");

  return (
    <div className="bg-white dark:bg-transparent flex flex-col h-full ">
      <ChatHeader
        workspaceId={params.workspaceId}
        name={channelAndMember.channel.name}
        type={"channel"}
      />
      {channelAndMember.channel.type === ChannelType.TEXT ? (
        <>
          <ChatMessages
            name={channelAndMember.channel.name}
            member={channelAndMember.member}
            chatId={channelAndMember.channel.id}
            apiUrl={"/api/messages"}
            socketUrl={"/api/socket/messages"}
            socketQuery={{
              channelId: channelAndMember.channel.id,
              workspaceId: channelAndMember.channel.workspaceId,
            }}
            paramKey={"channelId"}
            paramValue={channelAndMember.channel.id}
            type={"channel"}
            loggedInUserDetails={loggedInUserDetails}
          />
          <ChatInput
            apiUrl={"/api/socket/messages"}
            query={{
              channelId: params.channelId,
              workspaceId: params.workspaceId,
            }}
            name={channelAndMember.channel.name}
            type={"channel"}
            loggedInUserDetails={loggedInUserDetails}
          />
        </>
      ) : channelAndMember.channel.type === ChannelType.AUDIO ? (
        <div className="h-[92vh]">
          <MediaRoom
            chatId={channelAndMember.channel.id}
            video={false}
            audio={true}
            loggedInUser={loggedInUserDetails}
          />
        </div>
      ) : channelAndMember.channel.type === ChannelType.VIDEO ? (
        <div className="h-[92vh]">
          <MediaRoom
            chatId={channelAndMember.channel.id}
            video={true}
            audio={true}
            loggedInUser={loggedInUserDetails}
          />
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default ChannelIdMain;
