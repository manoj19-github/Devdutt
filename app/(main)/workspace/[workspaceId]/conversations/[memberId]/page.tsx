import { auth } from "@/app/_config/auth.config";
import { getCurrentLoggedInUserServerAction } from "@/app/serverActions/auth.serverAction";
import { findFirstMemberByIdServerAction } from "@/app/serverActions/findFirstMemberById";
import { getOrCreateConversation } from "@/lib/conversation";
import { redirect } from "next/navigation";
import React, { FC } from "react";
import ChatHeader from "../../channels/_components/ChatHeader";
import ChatMessages from "../../channels/_components/ChatMessages";
import ChatInput from "../../channels/_components/ChatInput";

type MemberIdMainProps = {
  params: {
    memberId: string;
    workspaceId: string;
  };
};
const MemberIdMain: FC<MemberIdMainProps> = async ({
  params,
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
    </div>
  );
};

export default MemberIdMain;
