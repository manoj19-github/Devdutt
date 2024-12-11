import { Hash } from "lucide-react";
import React, { FC } from "react";

type ChatWelcomeGreetProps = {
  type: "channel" | "conversation";
  name: string;
};
const ChatWelcomeGreet: FC<ChatWelcomeGreetProps> = ({
  name,
  type,
}): JSX.Element => {
  return (
    <div className=" px-4 mb-2 ">
      {type === "channel" ? (
        <div className="h-[55px] w-[55px] rounded-full bg-zinc-500 dark:bg-zinc-700 flex items-center justify-center">
          <Hash className="h-12 w-12 text-white" />
        </div>
      ) : (
        <></>
      )}
      <p className="text-xl md:text-2xl font-bold md:ml-4">
        {type === "channel" ? `Welcome to # ` : ``}
        {name}
      </p>
      <p className="text-zinc-600 dark:text-zinc-400 md:ml-4 text-sm ">
        {type === "channel"
          ? `This is the start of the # ${name} channel `
          : `This is the start of your conversation with ${name}`}
      </p>
    </div>
  );
};

export default ChatWelcomeGreet;
