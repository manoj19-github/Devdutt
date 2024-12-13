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
    const { directMessageId, conversationId } = req.query;
    if (!loggedInUserDetails || loggedInUserDetails.user === null)
      return res.status(401).json({ error: "unauthorized", success: false });
    if (!directMessageId)
      return res
        .status(401)
        .json({ error: "directMessage id is not provided", success: false });
    if (!conversationId)
      return res
        .status(401)
        .json({ error: "conversation id is not provided", success: false });
    const conversation = await dbConfig.conversation.findFirst({
      where: {
        id: conversationId as string,
        OR: [
          {
            memberOne: {
              userId: loggedInUserDetails.user.id,
            },
          },
          {
            memberTwo: {
              userId: loggedInUserDetails.user.id,
            },
          },
        ],
      },
      include: {
        memberOne: {
          include: {
            user: true,
          },
        },
        memberTwo: {
          include: {
            user: true,
          },
        },
      },
    });
    const member =
      conversation?.memberOne.userId === loggedInUserDetails.user.id
        ? conversation?.memberOne
        : conversation?.memberTwo;
    if (!conversation)
      return res.status(401).json({
        status: false,
        error: "conversation not found",
      });

    if (!member)
      return res.status(405).json({
        status: false,
        error: "Internal error ",
      });
    let directMessage = await dbConfig.directMessage.findFirst({
      where: {
        id: directMessageId as string,
        conversationId: conversationId as string,
      },
      include: {
        member: {
          include: {
            user: true,
          },
        },
      },
    });
    if (!directMessage || directMessage.deleted)
      return res.status(401).json({
        status: false,
        error: "message not found ",
      });

    const isMessageOwner = directMessage.memberId === member.id;
    const isAdmin = member.role === MemberRole.ADMIN;
    const isModerator = member.role === MemberRole.MODERATOR;
    const canModify = isMessageOwner || isAdmin || isModerator;
    if (!canModify)
      return res.status(401).json({
        status: false,
        error: "UnAuthorized",
      });
    if (req.method === "DELETE") {
      directMessage = await dbConfig.directMessage.update({
        where: {
          id: directMessageId as string,
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
      directMessage = await dbConfig.directMessage.update({
        where: {
          id: directMessageId as string,
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
    const updateKey = `chat:${directMessage.id}:messages:update`;
    res?.socket?.server?.io?.emit?.(updateKey, directMessage);
    return res.status(200).json({
      message: directMessage,
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
