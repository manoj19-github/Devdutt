import { auth } from "@/app/_config/auth.config";
import { getCurrentLoggedInUserServerAction } from "@/app/serverActions/auth.serverAction";
import { findChannelByIdServerAction } from "@/app/serverActions/findChannelAndMemberByIdServerAction";
import { findWorkspaceByIdServerAction } from "@/app/serverActions/findWorkspaceById";
import { redirect } from "next/navigation";
import React, { FC } from "react";
import ChatHeader from "../_components/ChatHeader";

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
    <div className="bg-white dark:bg-[#313338] flex flex-col h-full ">
      <ChatHeader
        workspaceId={params.workspaceId}
        name={channelAndMember.channel.name}
        type={"channel"}
      />
    </div>
  );
};

export default ChannelIdMain;
