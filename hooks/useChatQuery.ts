import qs from "query-string";
import { useParams } from "next/navigation";
import { useSocket } from "@/providers/SocketProvider";
import { useInfiniteQuery } from "@tanstack/react-query";

type ChatQueryProps = {
  queryKey: string;
  apiUrl?: string;
  paramKey: "channelId" | "conversationId";
  paramValue: string;
  socketQuery: Record<string, string>;
};
const useChatQuery = ({
  queryKey,
  apiUrl,
  paramKey,
  socketQuery,
  paramValue,
}: ChatQueryProps) => {
  console.log("socketQuery: 20 >>>>>>>>>>>>>>>>>>>>> ", socketQuery);
  const { isConnected } = useSocket();
  const params = useParams();
  const fetchMessages = async ({ pageParam = undefined }) => {
    try {
      const url = qs.stringifyUrl(
        {
          url: `${process.env.NEXT_PUBLIC_CURRENT_ORIGIN}/${apiUrl}`,
          query: {
            cursor: pageParam,
            [paramKey]: paramValue,
            ...socketQuery,
          },
        },
        { skipNull: true }
      );
      const response = await fetch(url);
      const data = await response.json();
      return data;
    } catch (error) {
      console.log(error);
    }
  };
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: [queryKey],
    queryFn: fetchMessages,
    initialPageParam: 0,
    getNextPageParam: (lastPage: any) => lastPage?.nextCursor,
    refetchInterval: isConnected ? false : 1000,
  });
  return {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  };
};

export default useChatQuery;
