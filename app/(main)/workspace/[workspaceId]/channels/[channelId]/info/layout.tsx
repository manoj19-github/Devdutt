import React, { FC, ReactNode } from "react";
import InfoSidebar from "./_components/InfoSidebar";
import InfoHeader from "../../../../../../_components/InfoHeader";
import { auth } from "@/app/_config/auth.config";
import { getCurrentLoggedInUserServerAction } from "@/app/serverActions/auth.serverAction";
import { findChannelByIdServerAction } from "@/app/serverActions/findChannelAndMemberByIdServerAction";
import { redirect } from "next/navigation";
import { ChannelType } from "@prisma/client";

type InfoLayoutProps = {
  children: ReactNode;
  params: {
    channelId: string;
    workspaceId: string;
  };
};
const InfoLayout: FC<InfoLayoutProps> = async ({
  children,
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
  // if (channelAndMember.channel.type !== ChannelType.TEXT) redirect("/");
  return (
    <div>
      <InfoHeader
        workspaceId={params.workspaceId}
        name={channelAndMember.channel.name}
        type={"channel"}
      />
      <InfoSidebar
        params={{
          workspaceId: params.workspaceId,
          channelId: channelAndMember.channel.id,
        }}
      />
      <section className="flex h-full flex-1 flex-col">
        <div className="main-content">{children}</div>
      </section>
    </div>
  );
};

export default InfoLayout;
