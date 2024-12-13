"use client";
import React, { FC, useEffect, useState } from "react";
import { LiveKitRoom, VideoConference } from "@livekit/components-react";
import "@livekit/components-styles";
import { log } from "node:console";
import { getMediaToken } from "../_services/chat.service";
import { Loader2 } from "lucide-react";

type MediaRoomProps = {
  chatId: string;
  video: boolean;
  audio: boolean;
  loggedInUser: any;
};
const MediaRoom: FC<MediaRoomProps> = ({
  chatId,
  loggedInUser,
  video,
  audio,
}): JSX.Element => {
  console.log("loggedInUser>>>>>21media ", loggedInUser);
  const [mediaToken, setMediaToken] = useState<string>("");
  useEffect(() => {
    if (!loggedInUser || !loggedInUser?.user || loggedInUser?.user === null)
      return;
    const name = `${loggedInUser.user.name}`;
    console.log("name: ", name);
    (async () => {
      try {
        await getMediaToken({
          name,
          chatId,
          successCallback: (data) => {
            console.log("data:  30  ", data);
            setMediaToken(data.token);
          },
        });
      } catch (error) {
        console.log("error ", error);
      }
    })();
  }, [chatId, loggedInUser]);
  if (mediaToken === "") {
    return (
      <div className="flex flex-col h-full min-h-[85vh] justify-center items-center">
        <Loader2 className="h-7 w-7 animate-spin my-3 " />
        <p className="text-xs text-zinc-500 dark:text-zinc-400">Loading...</p>
      </div>
    );
  }
  return (
    <LiveKitRoom
      token={mediaToken}
      connect={true}
      audio={audio}
      video={video}
      data-lk-theme="default"
      serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL!}
    >
      <VideoConference />
    </LiveKitRoom>
  );
};

export default MediaRoom;
