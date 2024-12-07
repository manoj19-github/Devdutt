import { auth } from "@/app/_config/auth.config";
import { getCurrentLoggedInUserServerAction } from "@/app/serverActions/auth.serverAction";
import { findFirstMemberByIdServerAction } from "@/app/serverActions/findFirstMemberById";
import { getOrCreateConversation } from "@/lib/conversation";
import { redirect } from "next/navigation";
import React, { FC } from "react";
import ChatHeader from "../../channels/_components/ChatHeader";

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
    <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
      <ChatHeader
        workspaceId={params.workspaceId}
        name={otherMember.user.name ?? ""}
        type={"conversation"}
        imageURL={otherMember.user.image ?? ""}
      />
    </div>
  );
};

export default MemberIdMain;
