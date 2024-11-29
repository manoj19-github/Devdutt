export const changeInviteCodeService = async ({
  workspaceId,
  loggedInUserId,
}: {
  workspaceId: string;
  loggedInUserId: string;
}) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_CURRENT_ORIGIN}/api/workspace/${workspaceId}/changeInviteCode`,
      {
        method: "PATCH",
        next: { revalidate: 0 },
        body: JSON.stringify({ loggedInUserId }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return await response.json();
  } catch (error) {
    console.log(error);
    return null;
  }
};
