import React, { FC } from "react";
import { getCurrentLoggedInUserServerAction } from "../serverActions/auth.serverAction";
import { redirect } from "next/navigation";
import { getAllOfMyWorkspaces } from "../serverActions/getAllWorkspaces.serverAction";
import NavigationAction from "./NavigationAction";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/ScrollArea";
import NavigationItem from "./NavigationItem";
import { ModeToggle } from "@/lib/ThemeToggler";
import UserProfile from "./UserProfile";

type NavigationSidebarProps = {};
const NavigationSidebar: FC<
  NavigationSidebarProps
> = async (): Promise<JSX.Element> => {
  const currentProfile = await getCurrentLoggedInUserServerAction();
  console.log("currentProfile: ", currentProfile);

  if (!currentProfile) return redirect("/");
  const response = await getAllOfMyWorkspaces(currentProfile.user?.id);

  return (
    <div className="space-y-4 flex flex-col items-center h-full bg-gray-100  text-primary w-full dark:bg-[#1e1f22] py-3">
      <NavigationAction />
      <Separator className="h-[2px] bg-zinc-300 dark:bg-zinc-700   mx-auto " />
      <ScrollArea className="flex w-full min-h-[70vh] max-h-[71vh] overflow-y-auto">
        {response.workspaces?.map((workspace) => {
          return (
            <div className="mb-4" key={workspace.id}>
              <NavigationItem
                id={workspace.id}
                name={workspace.name}
                imageUrl={workspace.avatar}
              />
            </div>
          );
        })}
      </ScrollArea>
      <div className="pb-3 mt-auto flex items-center flex-col gap-y-3">
        <UserProfile />
        <ModeToggle />
      </div>
    </div>
  );
};

export default NavigationSidebar;
