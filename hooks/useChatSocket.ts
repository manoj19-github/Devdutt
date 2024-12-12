import { useSocket } from "@/providers/SocketProvider";
import { Member, Message, User } from "@prisma/client";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

type UseChatSocketProps = {
  addKey: string;
  updateKey: string;
  queryKey: string;
};

type MessageWithMemberWithUser = Message & {
  member: Member & {
    user: User;
  };
};

export const useChatSocket = ({
  addKey,
  updateKey,
  queryKey,
}: UseChatSocketProps) => {
  const { socket } = useSocket();
  const queryClient = useQueryClient();
  useEffect(() => {
    if (!socket) return;
    socket.on(updateKey, (message: MessageWithMemberWithUser) => {
      queryClient.setQueryData([queryKey], (oldData: any) => {
        if (!oldData || !oldData.pages || oldData.pages.length === 0)
          return oldData;
        const newData = oldData.pages.map((self: any) => ({
          ...self,
          items: self.items.map((page: MessageWithMemberWithUser) => {
            if (page.id === message.id) return message;
            return page;
          }),
        }));
        return { ...oldData, pages: newData };
      });
    });
    socket.on(addKey, (message: MessageWithMemberWithUser) => {
      queryClient.setQueryData([queryKey], (oldData: any) => {
        if (!oldData || !oldData.pages || oldData.pages.length === 0)
          return {
            pages: [
              {
                items: [message],
              },
            ],
          };
       const newData=[...oldData.pages]
       newData[0] = {
        ...newData[0],
        items:[
            message,
            ...newData[0].items
        ]
       }
        return { ...oldData, pages: newData };
      });
    });
    return()=>{
        socket.off(addKey);
        socket.off(updateKey);
    }
  }, [queryClient,socket,addKey,updateKey,]);
};
