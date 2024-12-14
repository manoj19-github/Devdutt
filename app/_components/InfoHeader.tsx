"use client";
import { Input } from "@/components/ui/input";
import { Hash, MoveLeft, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { FC } from "react";
import ActionTooltip from "./ActionTooltip";

type InfoHeaderProps = {
  workspaceId: string;
  name: string;
  imageURL?: string;
  type: "channel" | "conversation";
};
const InfoHeader: FC<InfoHeaderProps> = ({
  workspaceId,
  name,
  imageURL,
  type,
}): JSX.Element => {
  const router = useRouter();
  return (
    <header className="header py-2 pl-2 pr-3 h-12 flex  items-center justify-between dark:border-neutral-800 border-b-2">
      <div className=" flex items-center">
        <ActionTooltip align="center" label={"Go back"}>
          <button className="mr-2 ml-1" onClick={() => router.back()}>
            <MoveLeft />
          </button>
        </ActionTooltip>
        {type === "channel" ? (
          <Hash className="size-5 text-zinc-500 mx-1 dark:text-zinc-400" />
        ) : (
          <></>
        )}

        <p className="font-semibold text-md text-black dark:text-white ">
          {name}
        </p>
      </div>
      <div className="w-1/3  flex items-center border border-black px-3 rounded-md  my-2 ">
        <Search className="text-gray-400" />
        <Input
          type="text"
          placeholder="Search"
          className="w-full bg-transparent border-none focus:ring-0 focus:outline-none  outline-none text-sm text-zinc-500 dark:text-zinc-400  border-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
        />
      </div>
      {/* <div className="header-wrapper">
        <div className="header-title">Channel Info</div>
      </div> */}
    </header>
  );
};

export default InfoHeader;
