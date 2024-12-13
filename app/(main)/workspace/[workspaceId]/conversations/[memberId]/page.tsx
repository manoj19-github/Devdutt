import { auth } from "@/app/_config/auth.config";
import { getCurrentLoggedInUserServerAction } from "@/app/serverActions/auth.serverAction";
import { findFirstMemberByIdServerAction } from "@/app/serverActions/findFirstMemberById";
import { getOrCreateConversation } from "@/lib/conversation";
import { redirect } from "next/navigation";
import React, { FC } from "react";
import ChatHeader from "../../channels/_components/ChatHeader";
import ChatMessages from "../../channels/_components/ChatMessages";
import ChatInput from "../../channels/_components/ChatInput";
import MediaRoom from "@/app/_components/MediaRoom";

type MemberIdMainProps = {
  params: {
    memberId: string;
    workspaceId: string;
  };
  searchParams: {
    video?: boolean;
  };
};
const MemberIdMain: FC<MemberIdMainProps> = async ({
  params,
  searchParams,
}): Promise<JSX.Element> => {
  const session = await auth();
  const loggedInUserDetails = await getCurrentLoggedInUserServerAction();
  if (
    !loggedInUserDetails ||
    loggedInUserDetails.user === null ||
    loggedInUserDetails.member === null ||
    !session ||
    session.user === null
  )
    return redirect("/auth/login");
  const memberResponse = await findFirstMemberByIdServerAction({
    userId: loggedInUserDetails.user.id,
    workspaceId: params.workspaceId,
  });
  if (!memberResponse || memberResponse.firstMember === null)
    return redirect("/");
  const conversation = await getOrCreateConversation({
    memberOneId: loggedInUserDetails.member.id,
    memberTwoId: params.memberId,
  });
  if (!conversation) return redirect(`/workspace/${params.workspaceId}`);
  const { memberOne, memberTwo } = conversation;
  const otherMember =
    memberOne.user.id === loggedInUserDetails.user.id ? memberTwo : memberOne;

  return (
    <div className="bg-white dark:bg-transparent flex flex-col h-full">
      <ChatHeader
        workspaceId={params.workspaceId}
        name={otherMember.user.name ?? ""}
        type={"conversation"}
        imageURL={otherMember.user.image ?? ""}
      />
      {!searchParams.video ? (
        <>
          <ChatMessages
            name={otherMember.user.name ?? ""}
            loggedInUserDetails={loggedInUserDetails}
            apiUrl={"/api/direct-messages"}
            chatId={conversation.id}
            socketUrl={"/api/socket/direct-messages"}
            socketQuery={{
              conversationId: conversation.id,
            }}
            paramKey={"conversationId"}
            paramValue={conversation.id}
            type={"conversation"}
          />
          <ChatInput
            apiUrl={"/api/socket/direct-messages"}
            name={otherMember.user.name ?? ""}
            query={{
              conversationId: conversation.id,
            }}
            type={"conversation"}
            loggedInUserDetails={loggedInUserDetails}
          />
        </>
      ) : (
        <div className="h-[92vh]">
          <MediaRoom
            chatId={conversation.id}
            video={true}
            audio={true}
            loggedInUser={loggedInUserDetails}
          />
        </div>
      )}
    </div>
  );
};

export default MemberIdMain;
