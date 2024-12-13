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
    if (req.method !== "POST") {
      console.log("direct message hit ");
      return res
        .status(405)
        .json({ message: "Method not allowed", error: "", success: false });
    }
    // const session = await auth();
    //@ts-ignore

    const { content, fileUrl, loggedInUserDetails } = req.body;
    console.log("loggedInUserDetails: ", loggedInUserDetails);
    const { conversationId } = req.query;
    if (!conversationId) {
      console.log("conversationId: 25 ");
      return res.status(400).json({
        message: "conversationId is required",
        success: false,
        error: "",
      });
    }
    if (!loggedInUserDetails || loggedInUserDetails.user === null)
      return res
        .status(401)
        .json({ message: "unauthorized", error: "", success: false });

    const conversation = await dbConfig.conversation.findFirst({
      where: {
        id: conversationId as string,
        // OR: [
        //   {
        //     memberOne: {
        //       userId: loggedInUserDetails.user.id,
        //     },
        //   },
        //   {
        //     memberTwo: {
        //       userId: loggedInUserDetails.user.id,
        //     },
        //   },
        // ],
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

    console.log("conversation: ", conversation);
    if (!conversation) {
      console.log("conversation: ", conversation);
      return res.status(400).json({
        message: "conversation not found",
        success: false,
        error: "",
      });
    }
    if (
      conversation.memberOne.userId !== loggedInUserDetails.user.id &&
      conversation.memberTwo.userId !== loggedInUserDetails.user.id
    ) {
      return res.status(400).json({
        message: "you are not a member of this conversation",
        success: false,
        error: "",
      });
    }

    const member =
      conversation.memberOne.userId === loggedInUserDetails.user.id
        ? conversation.memberOne
        : conversation.memberTwo;
    if (!member) {
      console.log("member:  76 ");
      return res.status(400).json({
        message: "member not found",
        success: false,
        error: "",
      });
    }
    const message = await dbConfig.directMessage.create({
      data: {
        content,
        fileUrl,
        conversationId: conversationId as string,
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
    const conversationKey = `chat:${conversation.id}:messages`;
    res?.socket?.server?.io?.emit?.(conversationKey, message);
    return res.status(200).json({
      message,
      success: true,
      error: "",
    });
  } catch (error) {
    console.log("====================================");
    console.log("error ", error);
    console.log("====================================");
    return res.status(400).json({
      success: false,
      error: "",
    });
  }
}
