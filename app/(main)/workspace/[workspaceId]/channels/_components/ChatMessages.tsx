"use client";
import { Member, Message, User } from "@prisma/client";
import React, { FC, Fragment,useRef,ElementRef } from "react";
import ChatWelcomeGreet from "../../../_components/ChatWelcomeGreet";
import useChatQuery from "@/hooks/useChatQuery";
import { Loader2, ServerCrash } from "lucide-react";
import ChatItem from "./ChatItem";
import { format } from "date-fns";
import { useChatSocket } from "@/hooks/useChatSocket";
import { useChatScroll } from "@/hooks/useChatScroll";
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
  const addKey=`chat:${chatId}:messages`
  const updateKey=`chat:${chatId}:messages:update`;
  const ChatRef = useRef<ElementRef<"div">>(null)
  const BottomRef = useRef<ElementRef<"div">>(null);

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

  useChatSocket({
    queryKey,
    addKey,
    updateKey
  })

  useChatScroll({
    ChatRef,
    BottomRef,
    loadMore:fetchNextPage,
    shouldLoadMore:!isFetchingNextPage && !!hasNextPage,
    count:data?.pages?.[0]?.items?.length ?? 0 
  })
  
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
    <div ref={ChatRef} className="flex-1 flex flex-col max-h-[82vh] overflow-y-auto ">
      <div className="flex-1 mt-5 " />
      {
        !hasNextPage ? (
          <ChatWelcomeGreet type={type} name={name} />

        ):(
          <></>
        )
      }
      {
        hasNextPage ? (
          <div className="flex justify-center">
            {
              isFetchingNextPage ? (
                <Loader2 className="h-6 w-6 text-zinc-500 animate-spin my-4"/>
              ):(
                <button onClick={()=>fetchNextPage()} className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 text-xs my-4 dark:hover:text-zinc-300 transition-all">Load previous message</button>
              )
            }
          </div>
        ):(
          <></>
        )
      }
      
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
                loggedInUserDetails={loggedInUserDetails}
              />
            ))}
          </Fragment>
        ))}
      </div>
      <div ref={BottomRef} />
    </div>
  );
};

export default ChatMessages;
