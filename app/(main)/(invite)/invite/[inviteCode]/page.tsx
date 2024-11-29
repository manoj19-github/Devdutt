import { getCurrentLoggedInUserServerAction } from "@/app/serverActions/auth.serverAction";
import { findWorkspaceByInviteCode } from "@/app/serverActions/findWorkspaceByInviteCode";
import { redirect } from "next/navigation";
import React, { FC } from "react";

type InviteCodeProps = {
  params: {
    inviteCode: string;
  };
};
const InviteCode: FC<InviteCodeProps> = async ({
  params,
}): Promise<JSX.Element> => {
  const loggedInUserDetails = await getCurrentLoggedInUserServerAction();
  if (!loggedInUserDetails || !loggedInUserDetails.user) return redirect("/");
  if (!params.inviteCode) return redirect("/");
  await findWorkspaceByInviteCode({
    invite_code: params.inviteCode,
    loggedInUserId: loggedInUserDetails.user.id,
  });

  return <div>InviteCode</div>;
};

export default InviteCode;
