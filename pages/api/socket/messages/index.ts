import { auth } from "@/app/_config/auth.config";
import { dbConfig } from "@/app/_config/db.config";
import { getCurrentLoggedInUserServerAction } from "@/app/serverActions/auth.serverAction";
import { NextApiResponseServerIo } from "@/types";
import { NextApiRequest } from "next";
import { getToken } from "next-auth/jwt";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIo
) {
  try {
    if (req.method !== "POST")
      return res
        .status(405)
        .json({ message: "Method not allowed", error: "", success: false });
    // const session = await auth();
    //@ts-ignore

    const { content, fileUrl, loggedInUserDetails } = req.body;
    console.log("loggedInUserDetails: ", loggedInUserDetails);
    const { workspaceId, channelId } = req.query;
    if (!loggedInUserDetails || loggedInUserDetails.user === null)
      return res
        .status(401)
        .json({ message: "unauthorized", error: "", success: false });
    const workspace = await dbConfig.workspaces.findFirst({
      where: {
        id: workspaceId as string,
        members: {
          some: {
            userId: loggedInUserDetails.user.id,
          },
        },
      },
      include: {
        members: true,
      },
    });
    if (!workspace)
      return res.status(200).json({
        message: "workspace not found",
        success: false,
        error: "",
      });

    const channel = await dbConfig.channel.findFirst({
      where: {
        id: channelId as string,
        workspaceId: workspaceId as string,
      },
    });
    if (!channel)
      return res.status(400).json({
        message: "channel not found",
        success: false,
        error: "",
      });
    const member = workspace.members.find(
      (self) => self.userId === loggedInUserDetails?.user?.id
    );
    if (!member)
      return res.status(400).json({
        message: "member not found",
        success: false,
        error: "",
      });
    const message = await dbConfig.message.create({
      data: {
        content,
        fileUrl,
        channelId: channel.id,
        memberId: member.id,
      },
      include: {
        member: {
          include: {
            user: true,
          },
        },
      },
    });
    const channelKey = `chat:${channel.id}:messages`;
    res?.socket?.server?.io?.emit?.(channelKey, message);
    return res.status(200).json({
      message,
      success: true,
      error: "",
    });
  } catch (error) {
    console.log("====================================");
    console.log("error ", error);
    console.log("====================================");
  }
}
