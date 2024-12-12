import { dbConfig } from "@/app/_config/db.config";
import { NextApiResponseServerIo } from "@/types";
import { MemberRole } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIo
) {
  try {
    if (req.method !== "DELETE" && req.method !== "PATCH")
      return res.status(405).json({
        status: false,
        error: "Invalid api method",
      });

    const { messageContent, loggedInUserDetails } = req.body;
    const { messageId, workspaceId, channelId } = req.query;
    if (!loggedInUserDetails || loggedInUserDetails.user === null)
      return res.status(401).json({ error: "unauthorized", success: false });
    if (!channelId)
      return res
        .status(401)
        .json({ error: "channel id is not provided", success: false });
    if (!workspaceId)
      return res
        .status(401)
        .json({ error: "workspace id is not provided", success: false });
    if (!messageId)
      return res
        .status(401)
        .json({ error: "message id is not provided", success: false });

    const workspace = await dbConfig.workspaces.findFirst({
      where: {
        id: workspaceId as string,
        members: {
          some: {
            userId: loggedInUserDetails.user?.id as string,
          },
        },
      },
      include: {
        members: true,
      },
    });
    if (!workspace)
      return res
        .status(401)
        .json({ error: "workspace not found", success: false });
    const selectedChannel = await dbConfig.channel.findFirst({
      where: {
        id: channelId as string,
        workspaceId: workspaceId as string,
      },
    });
    if (!selectedChannel)
      return res
        .status(401)
        .json({ error: "channel not found", success: false });
    const member = workspace.members?.find(
      (self) => self.userId === loggedInUserDetails.user?.id
    );
    if (!member)
      return res.status(405).json({
        status: false,
        error: "Internal error ",
      });
    let message = await dbConfig.message.findFirst({
      where: {
        id: messageId as string,
        channelId: channelId as string,
      },
      include: {
        member: {
          include: {
            user: true,
          },
        },
      },
    });
    if (!message || message.deleted)
      return res.status(401).json({
        status: false,
        error: "message not found ",
      });

    const isMessageOwner = message.memberId === member.id;
    const isAdmin = member.role === MemberRole.ADMIN;
    const isModerator = member.role === MemberRole.MODERATOR;
    const canModify = isMessageOwner || isAdmin || isModerator;
    if (!canModify)
      return res.status(401).json({
        status: false,
        error: "UnAuthorized",
      });
    if (req.method === "DELETE") {
      message = await dbConfig.message.update({
        where: {
          id: messageId as string,
        },
        data: {
          fileUrl: null,
          deleted: true,
        },
        include: {
          member: {
            include: {
              user: true,
            },
          },
        },
      });
    } else if (req.method === "PATCH") {
      if (!isMessageOwner)
        return res.status(401).json({
          status: false,
          error: "Unauthorized",
        });
      message = await dbConfig.message.update({
        where: {
          id: messageId as string,
        },
        data: {
          content: messageContent,
        },
        include: {
          member: {
            include: {
              user: true,
            },
          },
        },
      });
    }
    const updateKey = `chat:${channelId}:messages:update`;
    res?.socket?.server?.io?.emit?.(updateKey, message);
    return res.status(200).json({
      message,
      success: true,
      error: "",
    });
  } catch (error) {
    console.log("error occured >>>>>>>>>> ", error);
    return res.status(405).json({
      status: false,
      error: "Internal error ",
    });
  }
}
