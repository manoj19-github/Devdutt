import { dbConfig } from "@/app/_config/db.config";

export const getOrCreateConversation = async ({
  memberOneId,
  memberTwoId,
}: {
  memberOneId: string;
  memberTwoId: string;
}) => {
  try {
    let conversation;
    conversation = await findConversation({
      memberOneId,
      memberTwoId,
    });

    if (!conversation) {
      conversation = await createNewConversation({
        memberOneId,
        memberTwoId,
      });
    }

    return conversation;
  } catch (error) {
    console.log(error);
    return null;
  }
};
export const findConversation = async ({
  memberOneId,
  memberTwoId,
}: {
  memberOneId: string;
  memberTwoId: string;
}) => {
  try {
    return await dbConfig.conversation.findFirst({
      where: {
        AND: [
          {
            memberOneId,
          },
          {
            memberTwoId,
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
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const createNewConversation = async ({
  memberOneId,
  memberTwoId,
}: {
  memberOneId: string;
  memberTwoId: string;
}) => {
  try {
    return await dbConfig.conversation.create({
      data: {
        memberOneId,
        memberTwoId,
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
  } catch (error) {
    console.log(error);
    return null;
  }
};
