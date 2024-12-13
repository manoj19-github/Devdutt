"use client";
import React, { FC } from "react";
import qs from "query-string";
import { Video, VideoOff } from "lucide-react";
import {
  useRouter,
  useParams,
  useSearchParams,
  usePathname,
} from "next/navigation";
import ActionTooltip from "./ActionTooltip";
type ChatVideoButtonProps = {};
const ChatVideoButton: FC<ChatVideoButtonProps> = (): JSX.Element => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const isVideo = searchParams?.get("video") === "true";
  const Icon = isVideo ? VideoOff : Video;
  const tooltipLabel = isVideo ? "Stop Video Call" : "Start Video Call";
  const clickHandler = () => {
    const url = qs.stringifyUrl(
      {
        url: pathname || "",
        query: {
          video: isVideo ? undefined : true,
        },
      },
      { skipNull: true }
    );
    router.push(url);
  };
  return (
    <ActionTooltip side="bottom" label={tooltipLabel} align={"end"}>
      <button
        onClick={clickHandler}
        className="hover:opacity-75 transition-all mr-4"
      >
        <Icon className="w-6 h-6 text-zinc-500 dark:text-zinc-400" />
      </button>
    </ActionTooltip>
  );
};

export default ChatVideoButton;
