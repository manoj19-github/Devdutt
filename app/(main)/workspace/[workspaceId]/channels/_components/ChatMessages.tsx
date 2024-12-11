"use client";
import { Member, Message, User } from "@prisma/client";
import React, { FC, Fragment } from "react";
import ChatWelcomeGreet from "../../../_components/ChatWelcomeGreet";
import useChatQuery from "@/hooks/useChatQuery";
import { Loader2, ServerCrash } from "lucide-react";
import ChatItem from "./ChatItem";
import { format } from "date-fns";
type ChatMessagesProps = {
  name: string;
  member?: Member;
  chatId: string;
  apiUrl: string;
  socketUrl: string;
  loggedInUserDetails: any;
  socketQuery: Record<string, string>;
  paramKey: "channelId" | "conversationId";
  paramValue: string;
  type: "channel" | "conversation";
};

const DATE_FORMAT = "d MMM yyyy hh:mm aaa";
type MessageWithMemberWithUser = Message & {
  member: Member & {
    user: User;
  };
};
const ChatMessages: FC<ChatMessagesProps> = ({
  apiUrl,
  socketUrl,
  socketQuery,
  chatId,
  member,
  name,
  paramKey,
  paramValue,
  type,
  loggedInUserDetails,
}): JSX.Element => {
  const queryKey = `chat:${chatId}`;
  const {
    data,

    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useChatQuery({
    paramKey,
    paramValue,
    apiUrl,
    queryKey,

    socketQuery,
  });
  console.log("data: 52  ", data);
  if (status === "pending") {
    return (
      <div className="flex flex-col flex-1 justify-center items-center min-h-[75vh]">
        <Loader2 className="animate-spin h-6 w-6 text-zinc-500 my-4" />
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Loading messages ...
        </p>
      </div>
    );
  }
  if (status === "error") {
    return (
      <div className="flex flex-col flex-1 justify-center items-center min-h-[75vh]">
        <ServerCrash className=" h-6 w-6 text-zinc-500 my-4" />
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Something went wrong
        </p>
      </div>
    );
  }
  return (
    <div className="flex-1 flex flex-col max-h-[82vh] overflow-y-auto ">
      <div className="flex-1 mt-5 " />
      <ChatWelcomeGreet type={type} name={name} />
      <div className="flex flex-col-reverse  flex-end mt-2 h-full  ">
        {data?.pages?.map((page, index) => (
          <Fragment key={index}>
            {page.items?.map((message: MessageWithMemberWithUser) => (
              <ChatItem
                id={message.id}
                key={message.id}
                content={message.content}
                member={message.member}
                timestamp={format(new Date(message.createdAt), DATE_FORMAT)}
                fileUrl={message.fileUrl}
                deleted={message.deleted}
                currentMember={loggedInUserDetails.member}
                isUpdated={message.updatedAt !== message.createdAt}
                socketUrl={socketUrl}
                socketQuery={socketQuery}
              />
            ))}
          </Fragment>
        ))}
      </div>
    </div>
  );
};

export default ChatMessages;
